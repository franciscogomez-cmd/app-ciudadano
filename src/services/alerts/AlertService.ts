import { apiRequest } from '@/services/core/ApiClient';

export type AlertCategory = {
  id: number;
  nombre: string;
  colorHex: string;
  icono: string | null;
};

export type Alert = {
  id: number;
  categoriaId: number | null;
  titulo: string | null;
  descripcion: string | null;
  nivelSeveridad: 'emergencia' | 'preventiva' | 'informativa';
  estatus: string | null;
  fechaInicio: string | null;
  fechaFin: string | null;
  nivelCobertura: string | null;
  zonaId: number | null;
  centroLatitud: string | null;
  centroLongitud: string | null;
  radioKm: string | null;
  poligonoZona: null;
  acciones: string[] | null;
  imagenUrl: string | null;
  mapaVisible: boolean | null;
  totalEnviadas: number | null;
  creadoEn: string | null;
  actualizadoEn: string | null;
  categoria: AlertCategory | null;
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
    const raw = await apiRequest<{ data: Alert | null; message?: string } | Alert>(
      `/usuarios/${userId}/alertas/ultimo`,
    );
    if (raw && typeof raw === 'object' && 'data' in raw) {
      return (raw as { data: Alert | null }).data;
    }
    return raw as Alert;
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

export type AlertActualizacion = {
  id: number;
  alertaId: number;
  mensaje: string | null;
  estatusAnterior: string | null;
  estatusNuevo: string | null;
  creadoEn: string | null;
};

export async function fetchAlertActualizaciones(
  alertaId: number,
): Promise<AlertActualizacion[]> {
  try {
    const raw = await apiRequest<{ data: AlertActualizacion[] } | AlertActualizacion[]>(
      `/alertas/${alertaId}/actualizaciones`,
    );
    if (raw && typeof raw === 'object' && 'data' in raw && !Array.isArray(raw)) {
      return (raw as { data: AlertActualizacion[] }).data ?? [];
    }
    return (raw as AlertActualizacion[]) ?? [];
  } catch {
    return [];
  }
}

export async function markNotificationAsRead(
  userId: number,
  notifId: number,
): Promise<void> {
  await apiRequest(`/usuarios/${userId}/notificaciones/${notifId}/marcar-leida`, {
    method: 'PATCH',
  });
}
