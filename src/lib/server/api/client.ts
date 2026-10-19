import { env } from '$env/dynamic/private';

import type {
  CreateContactMessageRequest,
  CreateEventRequest as ApiCreateEventRequest,
  CreateReservationRequest,
  PublicAvailabilityResponse,
  PublicContactMessageResponse,
  PublicEventCatalogResponse,
  PublicPublishedEvent,
  PublicEventRequestResponse,
  PublicImportantAnnouncement,
  PublicMenuDetailResponse,
  PublicMenuQuery,
  PublicMenuResponse,
  PublicReservationResponse,
  PublicPreviewResponse,
  PublicSeoMetadata,
  PublicSiteContent,
  ReservationAvailabilityRequest,
} from '$lib/api/types';
import type { SeoResourceType } from '$lib/seo';

const DEFAULT_TIMEOUT_MS = 8_000;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu;

export interface ApiClientConfig {
  baseUrl: string;
  locationId: string;
  timeoutMs?: number;
}

export class ApiClientError extends Error {
  readonly status: number | null;
  readonly details: unknown;

  constructor(message: string, status: number | null = null, details?: unknown) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.details = details;
  }
}

export class ApiConfigurationError extends ApiClientError {
  constructor(message: string) {
    super(message);
    this.name = 'ApiConfigurationError';
  }
}

export interface PublicApiClient {
  /** Carta pública de la sede con filtros opcionales de categoría y alérgeno. */
  getPublicMenu(query?: PublicMenuQuery): Promise<PublicMenuResponse>;
  /** Detalle de un ítem por slug dentro del contexto de sede y filtros de listado. */
  getPublicMenuItem(slug: string, query?: PublicMenuQuery): Promise<PublicMenuDetailResponse>;
  /** Consulta cupos para fecha, hora, grupo y espacio antes de confirmar reserva. */
  getAvailability(request: ReservationAvailabilityRequest): Promise<PublicAvailabilityResponse>;
  /** Crea una solicitud de reserva con los datos validados del formulario público. */
  createReservation(request: CreateReservationRequest): Promise<PublicReservationResponse>;
  /** Catálogo de tipos y espacios disponibles para cotizar eventos. */
  getEventCatalog(): Promise<PublicEventCatalogResponse>;
  /** Eventos publicados visibles en la vitrina pública. */
  getPublishedEvents(): Promise<PublicPublishedEvent[]>;
  /** Envía una solicitud de cotización de evento a la API. */
  createEventRequest(request: ApiCreateEventRequest): Promise<PublicEventRequestResponse>;
  /** Registra un mensaje del formulario de contacto. */
  createContactMessage(request: CreateContactMessageRequest): Promise<PublicContactMessageResponse>;
  /** Avisos marcados como importantes para la sede configurada. */
  getImportantAnnouncements(): Promise<PublicImportantAnnouncement[]>;
  /** Perfil, ubicación y horarios editoriales de la sede. */
  getSiteContent(): Promise<PublicSiteContent>;
  /** Metadatos SEO por tipo de recurso y clave (página, ítem, evento, aviso). */
  getSeo(resourceType: SeoResourceType, resourceKey: string): Promise<PublicSeoMetadata>;
  /** Contenido de vista previa por token sin exigir LOCATION_ID. */
  getPreview(token: string): Promise<PublicPreviewResponse>;
}

type ApiFetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

/** Lee base URL y sede desde variables de entorno privadas de SvelteKit. */
function getDefaultConfig(): ApiClientConfig {
  return {
    baseUrl: env.API_BASE_URL ?? '',
    locationId: env.LOCATION_ID ?? '',
  };
}

/** Resuelve rutas relativas contra la base y añade query params omitiendo valores vacíos. */
function buildApiUrl(
  baseUrl: string,
  path: string,
  query: Record<string, string | undefined>,
): string {
  let url: URL;

  try {
    url = new URL(path, baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`);
  } catch {
    throw new ApiConfigurationError('La URL de la API no está configurada correctamente.');
  }

  for (const [key, value] of Object.entries(query)) {
    if (value) url.searchParams.set(key, value);
  }

  return url.toString();
}

/** Extrae mensaje legible del cuerpo JSON de error de Nest u otros formatos conocidos. */
function readErrorMessage(status: number, body: unknown): string {
  if (typeof body === 'object' && body !== null && 'message' in body) {
    const message = (body as { message?: unknown }).message;
    if (typeof message === 'string') return message;
    if (Array.isArray(message) && message.every((item) => typeof item === 'string')) {
      return message.join(' ');
    }
  }

  return `La API respondió con el estado ${status}.`;
}

/**
 * Crea el cliente server-only que centraliza URL, sede, timeout y manejo de errores HTTP.
 * Las rutas le pasan el `fetch` de SvelteKit para conservar el contexto de la solicitud.
 */
export function createApiClient(
  suppliedConfig?: Partial<ApiClientConfig>,
  fetcher: ApiFetch = fetch,
): PublicApiClient {
  const config = { ...getDefaultConfig(), ...suppliedConfig };

  /** Petición JSON con validación de config, timeout, cabeceras y errores tipados. */
  async function request<T>(
    path: string,
    init: RequestInit = {},
    options: { requireLocation?: boolean } = {},
  ): Promise<T> {
    if (!config.baseUrl) {
      throw new ApiConfigurationError('Falta configurar API_BASE_URL para consultar la API.');
    }

    if (options.requireLocation !== false && !config.locationId) {
      throw new ApiConfigurationError(
        'Falta configurar LOCATION_ID para consultar la sede pública.',
      );
    }

    if (options.requireLocation !== false && !uuidPattern.test(config.locationId)) {
      throw new ApiConfigurationError('LOCATION_ID debe ser un UUID válido de la sede pública.');
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.timeoutMs ?? DEFAULT_TIMEOUT_MS);

    try {
      const response = await fetcher(path, {
        ...init,
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          ...(init.body ? { 'Content-Type': 'application/json' } : {}),
          ...init.headers,
        },
      });
      const contentType = response.headers.get('content-type') ?? '';
      const body = contentType.includes('application/json')
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        throw new ApiClientError(readErrorMessage(response.status, body), response.status, body);
      }

      return body as T;
    } catch (error) {
      if (error instanceof ApiClientError) throw error;
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiClientError('La API tardó demasiado en responder.', null, error);
      }
      throw new ApiClientError('No fue posible comunicarse con la API.', null, error);
    } finally {
      clearTimeout(timeout);
    }
  }

  const locationQuery = (query: Record<string, string | undefined> = {}): string =>
    buildApiUrl(config.baseUrl, 'menu', { locationId: config.locationId, ...query });

  return {
    /** Implementación de carta pública con query de sede y filtros. */
    getPublicMenu(query = {}) {
      return request<PublicMenuResponse>(
        locationQuery({ category: query.category, allergen: query.allergen }),
      );
    },
    /** Detalle de ítem codificando el slug en la ruta de menú. */
    getPublicMenuItem(slug, query = {}) {
      return request<PublicMenuDetailResponse>(
        buildApiUrl(config.baseUrl, `menu/items/${encodeURIComponent(slug)}`, {
          locationId: config.locationId,
          category: query.category,
          allergen: query.allergen,
        }),
      );
    },
    /** Disponibilidad vía GET con parámetros de fecha, hora y capacidad. */
    getAvailability(requestData) {
      return request<PublicAvailabilityResponse>(
        buildApiUrl(config.baseUrl, 'reservations/availability', {
          locationId: config.locationId,
          date: requestData.date,
          time: requestData.time,
          partySize: String(requestData.partySize),
          durationMinutes: requestData.durationMinutes
            ? String(requestData.durationMinutes)
            : undefined,
          spaceId: requestData.spaceId,
        }),
      );
    },
    /** POST de reserva inyectando locationId en el cuerpo junto al DTO. */
    createReservation(requestData) {
      return request<PublicReservationResponse>(buildApiUrl(config.baseUrl, 'reservations', {}), {
        method: 'POST',
        body: JSON.stringify({ locationId: config.locationId, ...requestData }),
      });
    },
    /** Catálogo de eventos scoped a la sede actual. */
    getEventCatalog() {
      return request<PublicEventCatalogResponse>(
        buildApiUrl(config.baseUrl, 'events/catalog', { locationId: config.locationId }),
      );
    },
    /** Listado de eventos publicados para la sede. */
    getPublishedEvents() {
      return request<PublicPublishedEvent[]>(
        buildApiUrl(config.baseUrl, 'events/public', { locationId: config.locationId }),
      );
    },
    /** POST de solicitud de evento con locationId en el payload. */
    createEventRequest(requestData: ApiCreateEventRequest) {
      return request<PublicEventRequestResponse>(buildApiUrl(config.baseUrl, 'events', {}), {
        method: 'POST',
        body: JSON.stringify({ locationId: config.locationId, ...requestData }),
      });
    },
    /** POST del formulario de contacto hacia el endpoint público. */
    createContactMessage(requestData) {
      return request<PublicContactMessageResponse>(buildApiUrl(config.baseUrl, 'contact', {}), {
        method: 'POST',
        body: JSON.stringify({ locationId: config.locationId, ...requestData }),
      });
    },
    /** Avisos importantes de la sede para portada y listados. */
    getImportantAnnouncements() {
      return request<PublicImportantAnnouncement[]>(
        buildApiUrl(config.baseUrl, 'announcements', { locationId: config.locationId }),
      );
    },
    /** Contenido editorial y datos de contacto de la ubicación. */
    getSiteContent() {
      return request<PublicSiteContent>(
        buildApiUrl(config.baseUrl, 'site', { locationId: config.locationId }),
      );
    },
    /** SEO remoto por recurso; usado desde layout y páginas de detalle. */
    getSeo(resourceType: SeoResourceType, resourceKey: string) {
      return request<PublicSeoMetadata>(
        buildApiUrl(config.baseUrl, 'seo', {
          locationId: config.locationId,
          resourceType,
          resourceKey,
        }),
      );
    },
    /** Vista previa de publicación; no valida UUID de sede en la config. */
    getPreview(token: string) {
      return request<PublicPreviewResponse>(
        buildApiUrl(config.baseUrl, `publication/preview/${encodeURIComponent(token)}`, {}),
        {},
        { requireLocation: false },
      );
    },
  };
}
