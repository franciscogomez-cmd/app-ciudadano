import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

import { apiRequest } from '@/services/core/ApiClient';

export type SeveridadMinima = 'informativa' | 'preventiva' | 'emergencia';

type RegisteredUser = {
  id: number;
  accessToken?: string;
};

const KEYS = {
  userId: '@alertamientos/userId',
  deviceId: '@alertamientos/deviceId',
  accessToken: '@alertamientos/accessToken',
  tokenPush: '@alertamientos/tokenPush',
  notifActivas: '@alertamientos/notifActivas',
} as const;

function generateUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function getOrCreateDeviceId(): Promise<string> {
  let id = await AsyncStorage.getItem(KEYS.deviceId);
  if (!id) {
    id = generateUuid();
    await AsyncStorage.setItem(KEYS.deviceId, id);
  }
  return id;
}

export async function getStoredUserId(): Promise<number | null> {
  const v = await AsyncStorage.getItem(KEYS.userId);
  return v ? Number(v) : null;
}

export async function getStoredAccessToken(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.accessToken);
}

export async function getStoredTokenPush(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.tokenPush);
}

export async function getStoredNotifActivas(): Promise<boolean> {
  const v = await AsyncStorage.getItem(KEYS.notifActivas);
  return v === null ? false : v === 'true';
}

export async function registerUser(
  tokenPush: string,
): Promise<{ userId: number; accessToken: string | null }> {
  const deviceId = await getOrCreateDeviceId();
  const plataforma = Platform.OS === 'android' ? 'android' : 'ios';

  const user = await apiRequest<RegisteredUser>('/usuarios', {
    method: 'POST',
    body: {
      deviceId,
      plataforma,
      tokenPush,
      notifActivas: true,
      severidadMinima: 'informativa' satisfies SeveridadMinima,
    },
  });

  await Promise.all([
    AsyncStorage.setItem(KEYS.userId, String(user.id)),
    AsyncStorage.setItem(KEYS.tokenPush, tokenPush),
    AsyncStorage.setItem(KEYS.notifActivas, 'true'),
    ...(user.accessToken
      ? [AsyncStorage.setItem(KEYS.accessToken, user.accessToken)]
      : []),
  ]);

  return { userId: user.id, accessToken: user.accessToken ?? null };
}

export async function updateTokenPush(
  userId: number,
  tokenPush: string,
  accessToken: string | null,
): Promise<void> {
  await apiRequest(`/usuarios/${userId}`, {
    method: 'PATCH',
    body: { tokenPush },
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
  });
  await AsyncStorage.setItem(KEYS.tokenPush, tokenPush);
}

export async function updateUserLocation(
  userId: number,
  latitud: number,
  longitud: number,
  precisionMetros: number,
): Promise<void> {
  await apiRequest(`/usuarios/${userId}/ubicacion`, {
    method: 'PATCH',
    body: { latitud, longitud, precisionMetros },
  });
}

export async function updatePreferences(
  userId: number,
  prefs: { notifActivas: boolean; severidadMinima?: SeveridadMinima },
  accessToken: string | null,
): Promise<void> {
  try {
    await apiRequest(`/usuarios/${userId}/preferencias`, {
      method: 'PATCH',
      body: prefs,
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    });
  } catch {
    // Persist locally even if backend rejects (may require auth)
  }
  await AsyncStorage.setItem(KEYS.notifActivas, String(prefs.notifActivas));
}
