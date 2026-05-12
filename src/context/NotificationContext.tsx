import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Linking } from 'react-native';
import { OneSignal, type PushSubscriptionChangedState } from 'react-native-onesignal';

import {
  clearStoredUser,
  fetchUserProfile,
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
  const knownSubscriptionIdRef = useRef<string | null>(null);
  const isRegisteringRef = useRef(false);
  // true mientras estamos esperando el subscriptionChange tras un optOut por tokenInvalido.
  // Permite forzar el PATCH aunque el subscriptionId no haya cambiado.
  const tokenInvalidoRef = useRef(false);

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
      console.log('[Notifications] subscriptionChange ->', {
        id: state.current.id,
        optedIn: state.current.optedIn,
        userIdRef: userIdRef.current,
        knownSubscriptionId: knownSubscriptionIdRef.current,
      });

      if (state.current.id && !state.current.optedIn) {
        console.log('[Notifications] SDK reportó optedOut — forzando optIn()...');
        OneSignal.User.pushSubscription.optIn();
      }

      if (state.current.id && !userIdRef.current) {
        // Usuario sin registro previo — registrar
        void doRegisterWithSubscription();
      } else if (
        state.current.id &&
        userIdRef.current &&
        state.current.optedIn &&
        (state.current.id !== knownSubscriptionIdRef.current || tokenInvalidoRef.current)
      ) {
        // Usuario registrado: subscriptionId cambió, O el backend tenía el token como inválido
        // y necesitamos forzar el PATCH aunque el ID sea el mismo.
        // Guard optedIn=true evita un PATCH prematuro en el evento intermedio de optOut.
        const motivo = tokenInvalidoRef.current ? 'token inválido confirmado' : 'nuevo subscriptionId';
        console.log(`[Notifications] Actualizando token en backend (${motivo})...`);
        tokenInvalidoRef.current = false;
        knownSubscriptionIdRef.current = state.current.id;
        void updateTokenPush(userIdRef.current, state.current.id, accessTokenRef.current)
          .then(() => console.log('[Notifications] Token actualizado en backend'))
          .catch(() => console.log('[Notifications] Error actualizando token (no crítico)'));
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

      let resolvedUserId = userId;
      let userWasDeleted = false;
      let tokenInvalido = false;
      if (userId) {
        console.log('[Notifications] Validando userId', userId, 'contra backend...');
        const profile = await fetchUserProfile(userId);
        if (profile) {
          console.log('[Notifications] Usuario', userId, 'confirmado en backend');
          tokenInvalido = profile.tokenPushValido === false;
          if (tokenInvalido) {
            console.log('[Notifications] Backend reportó tokenPushValido=false — se forzará re-suscripción');
          }
        } else {
          console.log('[Notifications] Usuario', userId, 'NO existe en backend (eliminado) — limpiando storage');
          await clearStoredUser();
          resolvedUserId = null;
          userWasDeleted = true;
        }
      } else {
        console.log('[Notifications] Sin userId en storage — usuario nuevo o nunca registrado');
      }

      console.log('[Notifications] resolvedUserId ->', resolvedUserId, '| userWasDeleted ->', userWasDeleted);

      userIdRef.current = resolvedUserId;
      accessTokenRef.current = resolvedUserId ? accessToken : null;

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
      if (!hasPermission && (resolvedUserId || userWasDeleted)) {
        console.log('[Notifications] Permiso no detectado pero dispositivo tenía cuenta — solicitando confirmación...');
        actualPermission = await OneSignal.Notifications.requestPermission(true);
        console.log('[Notifications] actualPermission tras solicitud ->', actualPermission);
      } else if (hasPermission) {
        console.log('[Notifications] Permiso ya otorgado por OS');
      } else {
        console.log('[Notifications] Sin permiso y sin cuenta previa — esperando acción del usuario');
      }

      console.log('[Notifications] Estado final -> resolvedUserId:', resolvedUserId, '| actualPermission:', actualPermission, '| userWasDeleted:', userWasDeleted);

      setIsPermissionGranted(actualPermission);
      setIsRegistered(resolvedUserId !== null);
      setNotifActivas(resolvedUserId !== null && storedNotifActivas && actualPermission);

      if (subscriptionId) {
        knownSubscriptionIdRef.current = subscriptionId;
      }

      if (actualPermission) {
        const optedIn = await OneSignal.User.pushSubscription.getOptedInAsync();
        console.log('[Notifications] optedIn (local) ->', optedIn);
        if (tokenInvalido) {
          // Backend confirmó que el token no existe en OneSignal.
          // Marcamos el flag para que handleSubscriptionChange fuerce el PATCH aunque el ID no cambie.
          // Llamamos solo optOut(); el handler detectará optedIn=false y llamará optIn(),
          // evitando la carrera que ocurría al llamar ambos en el mismo tick.
          console.log('[Notifications] Forzando optOut() por token inválido — optIn() diferido al evento subscriptionChange...');
          tokenInvalidoRef.current = true;
          OneSignal.User.pushSubscription.optOut();
        } else {
          OneSignal.User.pushSubscription.optIn();
          console.log('[Notifications] optIn() enviado a OneSignal');
        }
        const token = await OneSignal.User.pushSubscription.getTokenAsync();
        console.log('[Notifications] FCM token ->', token ? `${token.slice(0, 20)}...` : 'NULL');
      }

      if (!resolvedUserId && subscriptionId) {
        console.log('[Notifications] subscriptionId disponible sin registro — registrando...');
        await doRegisterWithSubscription();
      } else if (!resolvedUserId && actualPermission) {
        console.log('[Notifications] Permiso otorgado sin subscriptionId aún — esperando SDK...');
        await doRegisterWithSubscription();
      } else if (resolvedUserId && subscriptionId) {
        console.log('[Notifications] Ya registrado, verificando si el token cambió...');
        if (storedTokenPush && subscriptionId !== storedTokenPush) {
          try {
            await updateTokenPush(resolvedUserId, subscriptionId, accessToken);
            console.log('[Notifications] Token actualizado en backend');
          } catch {
            console.log('[Notifications] Error actualizando token (no crítico)');
          }
        }
      } else if (resolvedUserId && !subscriptionId && actualPermission) {
        console.log('[Notifications] Usuario registrado sin subscriptionId — OneSignal unsubscribed. Esperando nuevo ID tras optIn()...');
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
      // Forzar opt-in en servidores de OneSignal — la suscripción puede quedar
      // en estado inactivo si fue creada tras eliminar la anterior del dashboard.
      OneSignal.User.pushSubscription.optIn();
      console.log('[Notifications] optIn() forzado tras registro exitoso');
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

      let permissionOk = isPermissionGranted;
      if (!permissionOk) {
        // Intentar obtener permiso antes de mandar al usuario a Settings.
        // En Android <13 requestPermission() devuelve true sin diálogo.
        // En Android 13+ / iOS muestra el diálogo si canAskAgain=true.
        const granted = await OneSignal.Notifications.requestPermission(true);
        setIsPermissionGranted(granted);
        permissionOk = granted;

        if (!granted) {
          // Ya no puede mostrar diálogo → única opción es Settings
          openSystemSettings();
          return;
        }
        OneSignal.User.pushSubscription.optIn();
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
