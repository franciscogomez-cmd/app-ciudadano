import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Linking } from 'react-native';
import { OneSignal, type PushSubscriptionChangedState } from 'react-native-onesignal';

import {
  getStoredAccessToken,
  getStoredNotifActivas,
  getStoredTokenPush,
  getStoredUserId,
  registerUser,
  updatePreferences,
  updateTokenPush,
} from '@/services/users/UserService';

type NotificationContextValue = {
  isPermissionGranted: boolean;
  notifActivas: boolean;
  isRegistered: boolean;
  isLoading: boolean;
  toggleNotifications: (enabled: boolean) => Promise<void>;
  openSystemSettings: () => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [notifActivas, setNotifActivas] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const userIdRef = useRef<number | null>(null);
  const accessTokenRef = useRef<string | null>(null);
  const isRegisteringRef = useRef(false);

  useEffect(() => {
    void initialize();

    // Captura cuando el usuario acepta/niega desde el diálogo del sistema
    const handlePermissionChange = (granted: boolean) => {
      setIsPermissionGranted(granted);
      if (granted) {
        OneSignal.User.pushSubscription.optIn();
        if (!userIdRef.current) void doRegisterWithSubscription();
      }
    };

    const handleSubscriptionChange = (state: PushSubscriptionChangedState) => {
      if (state.current.id && !state.current.optedIn) {
        OneSignal.User.pushSubscription.optIn();
      }
      if (state.current.id && !userIdRef.current) {
        void doRegisterWithSubscription();
      }
    };

    OneSignal.Notifications.addEventListener('permissionChange', handlePermissionChange);
    OneSignal.User.pushSubscription.addEventListener('change', handleSubscriptionChange);
    return () => {
      OneSignal.Notifications.removeEventListener('permissionChange', handlePermissionChange);
      OneSignal.User.pushSubscription.removeEventListener('change', handleSubscriptionChange);
    };
  }, []);

  async function initialize() {
    console.log('[Notifications] initialize() START');
    try {
      const [userId, storedTokenPush, storedNotifActivas, accessToken] = await Promise.all([
        getStoredUserId(),
        getStoredTokenPush(),
        getStoredNotifActivas(),
        getStoredAccessToken(),
      ]);

      console.log('[Notifications] AsyncStorage ->', { userId, storedTokenPush, storedNotifActivas, hasAccessToken: !!accessToken });

      userIdRef.current = userId;
      accessTokenRef.current = accessToken;

      // Consultamos ambos en paralelo — subscriptionId es la fuente de verdad:
      // si OneSignal ya tiene ID, el usuario tiene permiso y está suscrito.
      const [hasPermission, subscriptionId] = await Promise.all([
        OneSignal.Notifications.getPermissionAsync(),
        OneSignal.User.pushSubscription.getIdAsync(),
      ]);

      console.log('[Notifications] hasPermission ->', hasPermission);
      console.log('[Notifications] subscriptionId ->', subscriptionId);

      // Si el usuario ya está registrado pero Android no confirma el permiso,
      // llamamos requestPermission para obtenerlo o confirmarlo.
      // En Android, si ya fue concedido retorna true sin mostrar diálogo.
      let actualPermission = hasPermission;
      if (!hasPermission && userId) {
        console.log('[Notifications] Solicitando confirmación de permiso Android...');
        actualPermission = await OneSignal.Notifications.requestPermission(true);
        console.log('[Notifications] actualPermission ->', actualPermission);
      }

      setIsPermissionGranted(actualPermission);
      setIsRegistered(userId !== null);
      setNotifActivas(userId !== null && storedNotifActivas && actualPermission);

      if (actualPermission) {
        const optedIn = await OneSignal.User.pushSubscription.getOptedInAsync();
        console.log('[Notifications] optedIn ->', optedIn);
        if (!optedIn) {
          console.log('[Notifications] Forzando optIn()...');
          OneSignal.User.pushSubscription.optIn();
        }
        const token = await OneSignal.User.pushSubscription.getTokenAsync();
        console.log('[Notifications] FCM token ->', token ? `${token.slice(0, 20)}...` : 'NULL');
      }

      if (!userId && subscriptionId) {
        console.log('[Notifications] subscriptionId disponible sin registro — registrando...');
        await doRegisterWithSubscription();
      } else if (!userId && actualPermission) {
        console.log('[Notifications] Permiso otorgado sin subscriptionId aún — esperando SDK...');
        await doRegisterWithSubscription();
      } else if (userId && subscriptionId) {
        console.log('[Notifications] Ya registrado, verificando si el token cambió...');
        if (storedTokenPush && subscriptionId !== storedTokenPush) {
          try {
            await updateTokenPush(userId, subscriptionId, accessToken);
            console.log('[Notifications] Token actualizado en backend');
          } catch {
            console.log('[Notifications] Error actualizando token (no crítico)');
          }
        }
      } else {
        console.log('[Notifications] Sin permiso y sin registro — esperando acción del usuario');
      }
    } finally {
      console.log('[Notifications] initialize() END');
      setIsLoading(false);
    }
  }

  // Registra usando el subscriptionId de OneSignal. Si aún no está disponible,
  // espera el evento 'change' de la suscripción (máx 10 s).
  async function doRegisterWithSubscription(): Promise<void> {
    if (isRegisteringRef.current || userIdRef.current) {
      console.log('[Notifications] doRegisterWithSubscription() bloqueado - ya registrando o ya tiene userId');
      return;
    }
    isRegisteringRef.current = true;
    console.log('[Notifications] doRegisterWithSubscription() START');

    try {
      const subscriptionId = await getSubscriptionId();
      console.log('[Notifications] subscriptionId obtenido ->', subscriptionId);
      if (!subscriptionId) {
        console.log('[Notifications] subscriptionId nulo — abortando registro');
        return;
      }

      console.log('[Notifications] Llamando POST /usuarios...');
      const { userId, accessToken } = await registerUser(subscriptionId);
      console.log('[Notifications] Usuario registrado con id ->', userId);
      userIdRef.current = userId;
      accessTokenRef.current = accessToken;
      setIsRegistered(true);
      setNotifActivas(true);
    } catch (error) {
      console.log('[Notifications] Error en registro ->', error);
    } finally {
      isRegisteringRef.current = false;
      console.log('[Notifications] doRegisterWithSubscription() END');
    }
  }

  async function getSubscriptionId(): Promise<string | null> {
    const id = await OneSignal.User.pushSubscription.getIdAsync();
    if (id) return Promise.resolve(id);

    // El SDK puede tardar unos instantes en asignar el subscriptionId
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        OneSignal.User.pushSubscription.removeEventListener('change', handler);
        resolve(null);
      }, 10_000);

      const handler = (state: PushSubscriptionChangedState) => {
        if (state.current.id) {
          clearTimeout(timeout);
          OneSignal.User.pushSubscription.removeEventListener('change', handler);
          resolve(state.current.id);
        }
      };

      OneSignal.User.pushSubscription.addEventListener('change', handler);
    });
  }

  async function requestPermissionAndRegister(): Promise<void> {
    setIsLoading(true);
    try {
      const granted = await OneSignal.Notifications.requestPermission(true);
      setIsPermissionGranted(granted);
      if (granted) {
        OneSignal.User.pushSubscription.optIn();
        await doRegisterWithSubscription();
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function toggleNotifications(enabled: boolean): Promise<void> {
    if (enabled) {
      if (!isRegistered) {
        await requestPermissionAndRegister();
        return;
      }
      if (!isPermissionGranted) {
        openSystemSettings();
        return;
      }
      setNotifActivas(true);
      await updatePreferences(userIdRef.current!, { notifActivas: true }, accessTokenRef.current);
    } else {
      setNotifActivas(false);
      if (userIdRef.current) {
        await updatePreferences(userIdRef.current, { notifActivas: false }, accessTokenRef.current);
      }
    }
  }

  function openSystemSettings() {
    void Linking.openSettings();
  }

  return (
    <NotificationContext.Provider
      value={{
        isPermissionGranted,
        notifActivas,
        isRegistered,
        isLoading,
        toggleNotifications,
        openSystemSettings,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider');
  return ctx;
}
