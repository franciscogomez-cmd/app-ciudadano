import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

import { ApiError, apiRequest } from '@/services/core/ApiClient';

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
  tutorialCompletado: '@alertamientos/tutorialCompletado',
  ubicacionGuardada: '@alertamientos/ubicacionGuardada',
} as const;

function generateUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export type UserProfile = {
  id: number;
  latitud: string | null;
  longitud: string | null;
  precisionMetros: string | null;
  ubicacionActualizadaEn: string | null;
  notifActivas: boolean;
  severidadMinima: SeveridadMinima;
};

export type DeviceProfile = {
  id: number;
  imei: string | null;
  deviceId: string;
  tokenPush: string | null;
  plataforma: string;
  versionApp: string | null;
  modeloDispositivo: string | null;
  sistemaOperativo: string | null;
  latitud: string | null;
  longitud: string | null;
  precisionMetros: string | null;
  ubicacionActualizadaEn: string | null;
  codigoPostal: string | null;
  notifActivas: boolean;
  gpsActivo: boolean;
  notifMeteorologicas: boolean;
  notifUltimaHora: boolean;
  notifVialidad: boolean;
  notifServicios: boolean;
  silencioInicio: string | null;
  silencioFin: string | null;
  severidadMinima: SeveridadMinima;
  creadoEn: string;
  actualizadoEn: string;
  eliminadoEn: string | null;
  zonasSuscritas: unknown[];
};

export async function fetchUserProfile(userId: number): Promise<UserProfile | null> {
  try {
    return await apiRequest<UserProfile>(`/usuarios/${userId}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

export async function getUserByDevice(deviceId: string): Promise<DeviceProfile | null> {
  try {
    return await apiRequest<DeviceProfile>(`/usuarios/by-device/${deviceId}`);
  } catch {
    return null;
  }
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

export async function clearStoredUser(): Promise<void> {
  await AsyncStorage.multiRemove([KEYS.userId, KEYS.accessToken, KEYS.tokenPush, KEYS.notifActivas]);
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
  const versionApp = Constants.expoConfig?.version ?? undefined;
  const modeloDispositivo = Device.modelName ?? undefined;
  const sistemaOperativo = Device.osVersion
    ? `${Platform.OS === 'android' ? 'Android' : 'iOS'} ${Device.osVersion}`
    : undefined;

  const requestBody = {
    deviceId,
    plataforma,
    tokenPush,
    notifActivas: true,
    severidadMinima: 'informativa' satisfies SeveridadMinima,
    versionApp,
    modeloDispositivo,
    sistemaOperativo,
  };
  console.log('[UserService] POST /usuarios ->', process.env.EXPO_PUBLIC_API_BASE_URL + '/usuarios');
  console.log('[UserService] POST /usuarios body ->', JSON.stringify(requestBody));

  let user: RegisteredUser;
  try {
    user = await apiRequest<RegisteredUser>('/usuarios', {
      method: 'POST',
      body: requestBody,
    });
  } catch (e) {
    if (!(e instanceof ApiError && e.status === 409)) throw e;
    // Conflict: deviceId or tokenPush already registered — recover existing user
    const existing = await getUserByDevice(deviceId);
    if (!existing) throw new Error('Registration conflict but no existing device found');
    user = { id: existing.id };
  }

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
  const versionApp = Constants.expoConfig?.version ?? undefined;
  const modeloDispositivo = Device.modelName ?? undefined;
  const sistemaOperativo = Device.osVersion
    ? `${Platform.OS === 'android' ? 'Android' : 'iOS'} ${Device.osVersion}`
    : undefined;

  await apiRequest(`/usuarios/${userId}`, {
    method: 'PATCH',
    body: { tokenPush, versionApp, modeloDispositivo, sistemaOperativo },
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
  });
  await AsyncStorage.setItem(KEYS.tokenPush, tokenPush);
}

export async function getStoredUbicacionGuardada(): Promise<boolean> {
  const v = await AsyncStorage.getItem(KEYS.ubicacionGuardada);
  return v === 'true';
}

export async function updateUserLocation(
  userId: number,
  latitud: number,
  longitud: number,
): Promise<void> {
  await apiRequest(`/usuarios/${userId}/ubicacion`, {
    method: 'PATCH',
    body: { latitud, longitud },
  });
  await AsyncStorage.setItem(KEYS.ubicacionGuardada, 'true');
}

export async function getStoredTutorialCompletado(): Promise<boolean> {
  const v = await AsyncStorage.getItem(KEYS.tutorialCompletado);
  return v === 'true';
}

export async function setStoredTutorialCompletado(): Promise<void> {
  await AsyncStorage.setItem(KEYS.tutorialCompletado, 'true');
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
