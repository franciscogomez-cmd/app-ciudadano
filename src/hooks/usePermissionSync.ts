import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { OneSignal } from 'react-native-onesignal';

import { useNotifications } from '@/context/NotificationContext';
import {
  getOrCreateDeviceId,
  getStoredAccessToken,
  getStoredNotifActivas,
  getUserByDevice,
  updatePreferences,
  updateUserLocation,
} from '@/services/users/UserService';

export type PermissionSyncState = {
  /** true = el usuario negó permanentemente la ubicación, hay que mandarlo a Configuración */
  locationBlocked: boolean;
  /** true = el usuario negó permanentemente las notificaciones */
  notifBlocked: boolean;
  /** Abre Configuración del sistema para que el usuario habilite permisos */
  openSettings: () => void;
  /** Vuelve a intentar pedir los permisos (útil cuando el usuario regresa de Settings) */
  retrySync: () => void;
};

export function usePermissionSync(): PermissionSyncState {
  const { isRegistered, isLoading } = useNotifications();
  const [locationBlocked, setLocationBlocked] = useState(false);
  const [notifBlocked, setNotifBlocked] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (isLoading || !isRegistered) return;
    void sync(setLocationBlocked, setNotifBlocked);
  }, [isLoading, isRegistered, retryKey]);

  return {
    locationBlocked,
    notifBlocked,
    openSettings: () => void Linking.openSettings(),
    retrySync: () => setRetryKey((k) => k + 1),
  };
}

async function sync(
  setLocationBlocked: (v: boolean) => void,
  setNotifBlocked: (v: boolean) => void,
) {
  const [deviceId, accessToken] = await Promise.all([
    getOrCreateDeviceId(),
    getStoredAccessToken(),
  ]);

  const device = await getUserByDevice(deviceId);
  if (!device) return;

  await Promise.all([
    syncLocation(device.id, device.latitud, setLocationBlocked),
    syncNotifications(device.id, accessToken, device.notifActivas, setNotifBlocked),
  ]);
}

async function syncLocation(
  userId: number,
  latitudBackend: string | null,
  setBlocked: (v: boolean) => void,
) {
  // Si el backend ya tiene coordenadas, todo está bien
  if (latitudBackend !== null) return;

  // Verificar estado actual sin mostrar diálogo
  const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();

  if (status === 'granted') {
    // Ya tiene permiso pero el backend no tiene coords → enviar ubicación
    await sendLocation(userId);
    return;
  }

  if (!canAskAgain) {
    // Denegado permanentemente → avisar a la UI para mostrar banner
    setBlocked(true);
    return;
  }

  // Puede pedir → mostrar diálogo del sistema
  const { status: newStatus } = await Location.requestForegroundPermissionsAsync();

  if (newStatus === 'granted') {
    setBlocked(false);
    await sendLocation(userId);
  } else {
    // Negó en el diálogo → la próxima vez canAskAgain será false
    setBlocked(true);
  }
}

async function sendLocation(userId: number) {
  try {
    const pos = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    await updateUserLocation(userId, pos.coords.latitude, pos.coords.longitude);
  } catch {
    // no crítico — el backend puede rechazar coords fuera del área de cobertura
  }
}

async function syncNotifications(
  userId: number,
  accessToken: string | null,
  notifActivasBackend: boolean,
  setBlocked: (v: boolean) => void,
) {
  const [osPermission, storedNotifActivas] = await Promise.all([
    OneSignal.Notifications.getPermissionAsync(),
    getStoredNotifActivas(),
  ]);

  if (osPermission) {
    // OS tiene permiso → si el backend o el storage dicen false, sincronizar
    if (!notifActivasBackend || !storedNotifActivas) {
      OneSignal.User.pushSubscription.optIn();
      await updatePreferences(userId, { notifActivas: true }, accessToken);
    }
    setBlocked(false);
    return;
  }

  // OS no tiene permiso → intentar solicitar
  const granted = await OneSignal.Notifications.requestPermission(true);

  if (granted) {
    setBlocked(false);
    OneSignal.User.pushSubscription.optIn();
    await updatePreferences(userId, { notifActivas: true }, accessToken);
  } else {
    // Denegado (diálogo o permanente) → avisar a la UI
    setBlocked(true);
  }
}
