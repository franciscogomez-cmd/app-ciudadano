import { apiRequest } from '@/services/core/ApiClient';

export type AlertCategory = {
  id: number;
  nombre: string;
  colorHex: string;
  icono: string | null;
};

export type Alert = {
  id: number;
  categoriaId: number;
  titulo: string;
  descripcion: string;
  nivelSeveridad: 'emergencia' | 'preventiva' | 'informativa';
  estatus: string;
  fechaInicio: string;
  fechaFin: string | null;
  nivelCobertura: string;
  zonaId: number | null;
  centroLatitud: string | null;
  centroLongitud: string | null;
  radioKm: string | null;
  poligonoZona: null;
  acciones: string[];
  imagenUrl: string | null;
  mapaVisible: boolean;
  totalEnviadas: number;
  creadoEn: string;
  actualizadoEn: string;
  categoria: AlertCategory;
};

export type AlertsResponse = {
  data: Alert[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type Notificacion = {
  id: number;
  alertaId: number | null;
  actualizacionId: number | null;
  estatusEnvio: 'enviada' | 'fallida' | 'pendiente';
  intentoNumero: number;
  mensajeError: string | null;
  enviadaEn: string | null;
  leidaEn: string | null;
  creadoEn: string;
  alertaTitulo: string;
  alertaDescripcion: string;
  alertaNivelSeveridad: 'emergencia' | 'preventiva' | 'informativa';
  alertaEstatus: string;
  alertaImagenUrl: string | null;
  alertaFechaInicio: string;
  alertaFechaFin: string | null;
  alertaCentroLatitud: string | null;
  alertaCentroLongitud: string | null;
  alertaRadioKm: string | null;
  categoriaNombre: string;
  categoriaIcono: string | null;
};

export type NotificacionesResponse = {
  data: Notificacion[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export async function fetchUserAlerts(
  userId: number,
  page = 1,
  limit = 20,
): Promise<AlertsResponse> {
  return apiRequest<AlertsResponse>(`/usuarios/${userId}/alertas`, {
    query: { page, limit },
  });
}

export async function fetchLastAlert(userId: number): Promise<Alert | null> {
  try {
    return await apiRequest<Alert>(`/usuarios/${userId}/alertas/ultimo`);
  } catch {
    return null;
  }
}

export async function fetchUserNotifications(
  userId: number,
  page = 1,
  limit = 20,
): Promise<NotificacionesResponse> {
  return apiRequest<NotificacionesResponse>(`/usuarios/${userId}/notificaciones`, {
    query: { page, limit },
  });
}

export async function markNotificationAsRead(
  userId: number,
  notifId: number,
): Promise<void> {
  await apiRequest(`/usuarios/${userId}/notificaciones/${notifId}/marcar-leida`, {
    method: 'PATCH',
  });
}
