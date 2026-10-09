import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import { createApiClient } from '$lib/server/api/client';
import { validateEventForm } from '$lib/server/validation';

/** Carga solo el catálogo público: la API omite precios y líneas internas por contrato. */
export const load: PageServerLoad = async ({ fetch }) => {
  try {
    const catalog = await createApiClient(undefined, fetch).getEventCatalog();
    return { catalog, errorMessage: null };
  } catch {
    return {
      catalog: null,
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
