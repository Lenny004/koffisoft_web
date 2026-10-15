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
  getPublicMenu(query?: PublicMenuQuery): Promise<PublicMenuResponse>;
  getPublicMenuItem(slug: string, query?: PublicMenuQuery): Promise<PublicMenuDetailResponse>;
  getAvailability(request: ReservationAvailabilityRequest): Promise<PublicAvailabilityResponse>;
  createReservation(request: CreateReservationRequest): Promise<PublicReservationResponse>;
  getEventCatalog(): Promise<PublicEventCatalogResponse>;
  getPublishedEvents(): Promise<PublicPublishedEvent[]>;
  createEventRequest(request: ApiCreateEventRequest): Promise<PublicEventRequestResponse>;
  createContactMessage(request: CreateContactMessageRequest): Promise<PublicContactMessageResponse>;
  getImportantAnnouncements(): Promise<PublicImportantAnnouncement[]>;
  getSiteContent(): Promise<PublicSiteContent>;
  getSeo(resourceType: SeoResourceType, resourceKey: string): Promise<PublicSeoMetadata>;
  getPreview(token: string): Promise<PublicPreviewResponse>;
}

type ApiFetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

function getDefaultConfig(): ApiClientConfig {
  return {
    baseUrl: env.API_BASE_URL ?? '',
    locationId: env.LOCATION_ID ?? '',
  };
}

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
    getPublicMenu(query = {}) {
      return request<PublicMenuResponse>(
        locationQuery({ category: query.category, allergen: query.allergen }),
      );
    },
    getPublicMenuItem(slug, query = {}) {
      return request<PublicMenuDetailResponse>(
        buildApiUrl(config.baseUrl, `menu/items/${encodeURIComponent(slug)}`, {
          locationId: config.locationId,
          category: query.category,
          allergen: query.allergen,
        }),
      );
    },
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
    createReservation(requestData) {
      return request<PublicReservationResponse>(buildApiUrl(config.baseUrl, 'reservations', {}), {
        method: 'POST',
        body: JSON.stringify({ locationId: config.locationId, ...requestData }),
      });
    },
    getEventCatalog() {
      return request<PublicEventCatalogResponse>(
        buildApiUrl(config.baseUrl, 'events/catalog', { locationId: config.locationId }),
      );
    },
    getPublishedEvents() {
      return request<PublicPublishedEvent[]>(
        buildApiUrl(config.baseUrl, 'events/public', { locationId: config.locationId }),
      );
    },
    createEventRequest(requestData: ApiCreateEventRequest) {
      return request<PublicEventRequestResponse>(buildApiUrl(config.baseUrl, 'events', {}), {
        method: 'POST',
        body: JSON.stringify({ locationId: config.locationId, ...requestData }),
      });
    },
    createContactMessage(requestData) {
      return request<PublicContactMessageResponse>(buildApiUrl(config.baseUrl, 'contact', {}), {
        method: 'POST',
        body: JSON.stringify({ locationId: config.locationId, ...requestData }),
      });
    },
    getImportantAnnouncements() {
      return request<PublicImportantAnnouncement[]>(
        buildApiUrl(config.baseUrl, 'announcements', { locationId: config.locationId }),
      );
    },
    getSiteContent() {
      return request<PublicSiteContent>(
        buildApiUrl(config.baseUrl, 'site', { locationId: config.locationId }),
      );
    },
    getSeo(resourceType: SeoResourceType, resourceKey: string) {
      return request<PublicSeoMetadata>(
        buildApiUrl(config.baseUrl, 'seo', {
          locationId: config.locationId,
          resourceType,
          resourceKey,
        }),
      );
    },
    getPreview(token: string) {
      return request<PublicPreviewResponse>(
        buildApiUrl(config.baseUrl, `publication/preview/${encodeURIComponent(token)}`, {}),
        {},
        { requireLocation: false },
      );
    },
  };
}
