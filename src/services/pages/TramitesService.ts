import { apiRequest } from '@/services/core/ApiClient';

const TRAMITES_INDEXADA_ENDPOINT = '/tramites/plantillas-de-tramites-indexada/';

type TramiteDepartamentoDto = {
  descripcion: string;
};

type TramiteDto = {
  id: number;
  nombre: string;
  descripcion: string;
  homoclave: string | null;
  peticiones?: number;
  volumen_de_consultas?: number;
  es_tramite_gratuito: boolean;
  requiere_cita?: boolean;
  departamentos: TramiteDepartamentoDto[];
};

type TramitesPortalResponseDto = {
  count: number;
  next: string | null;
  previous: string | null;
  results: TramiteDto[];
};

export type TramiteModel = {
  id: number;
  name: string;
  description: string;
  code: string;
  requests: number;
  isFree: boolean;
  requiresAppointment: boolean;
  department: string;
};

export type TramitesModel = {
  total: number;
  next: string | null;
  previous: string | null;
  items: TramiteModel[];
};

type GetTramitesOptions = {
  page?: number;
  pageSize?: number;
  entidad?: string;
  signal?: AbortSignal;
};

const mapTramite = (tramite: TramiteDto): TramiteModel => ({
  id: tramite.id,
  name: tramite.nombre,
  description: tramite.descripcion,
  code: tramite.homoclave ?? 'Sin homoclave',
  requests: tramite.peticiones ?? tramite.volumen_de_consultas ?? 0,
  isFree: tramite.es_tramite_gratuito,
  requiresAppointment: Boolean(tramite.requiere_cita),
  department: tramite.departamentos[0]?.descripcion ?? 'Sin departamento',
});

export async function getTramites(
  options: GetTramitesOptions = {}
): Promise<TramitesModel> {
  const query: Record<string, string | number | undefined> = {
    page: options.page,
    page_size: options.pageSize,
    entidad: options.entidad,
  };

  const response = await apiRequest<TramitesPortalResponseDto>(TRAMITES_INDEXADA_ENDPOINT, {
    query,
    signal: options.signal,
  });

  return {
    total: response.count,
    next: response.next,
    previous: response.previous,
    items: response.results.map(mapTramite),
  };
}
