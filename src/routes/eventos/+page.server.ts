import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import { createApiClient } from '$lib/server/api/client';
import type { PublicPublishedEvent } from '$lib/api/types';
import { validateEventForm } from '$lib/server/validation';

/** Carga solo el catálogo público: la API omite precios y líneas internas por contrato. */
export const load: PageServerLoad = async ({ fetch }) => {
  try {
    const client = createApiClient(undefined, fetch);
    const catalog = await client.getEventCatalog();
    let publishedEvents: PublicPublishedEvent[] = [];
    try {
      publishedEvents = await client.getPublishedEvents();
    } catch {
      // El catalogo de cotizacion sigue siendo util si no hay eventos editoriales.
    }
    return { catalog, publishedEvents, errorMessage: null };
  } catch {
    return {
      catalog: null,
      publishedEvents: [],
      errorMessage: 'No pudimos cargar los espacios y paquetes. Intenta de nuevo más tarde.',
    };
  }
};

export const actions: Actions = {
  default: async ({ fetch, request }) => {
    const validation = validateEventForm(await request.formData());
    if (!validation.value) {
      return fail(400, {
        kind: 'error' as const,
        message: 'Revisa los campos marcados antes de enviar tu solicitud.',
        errors: validation.errors,
      });
    }

    try {
      const event = await createApiClient(undefined, fetch).createEventRequest(validation.value);
      return {
        kind: 'success' as const,
        message: 'Recibimos tu solicitud de cotización. Nuestro equipo te contactará pronto.',
        eventCode: event.eventCode,
        errors: {},
      };
    } catch {
      return fail(502, {
        kind: 'error' as const,
        message: 'No pudimos enviar la solicitud de cotización. Intenta de nuevo más tarde.',
        errors: {},
      });
    }
  },
};
