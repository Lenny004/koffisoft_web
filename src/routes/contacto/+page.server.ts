import { env } from '$env/dynamic/private';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

import { ApiClientError, createApiClient } from '$lib/server/api/client';
import { validateContactForm } from '$lib/server/validation';

/** Valida y entrega el mensaje al endpoint público de contacto. */
export const actions: Actions = {
  default: async ({ request, fetch }) => {
    const formData = await request.formData();
    const validation = validateContactForm(formData);

    if (!validation.value) {
      return fail(400, {
        kind: 'error' as const,
        message: 'Revisa los campos marcados antes de enviar el mensaje.',
        errors: validation.errors,
      });
    }

    try {
      await createApiClient(
        { baseUrl: env.API_BASE_URL ?? '', locationId: env.LOCATION_ID ?? '' },
        fetch,
      ).createContactMessage({
        ...validation.value,
        languageCode: 'es',
        website: String(formData.get('website') ?? ''),
      });

      return {
        kind: 'success' as const,
        message: 'Recibimos tu mensaje. Te responderemos pronto.',
        errors: {},
      };
    } catch (error) {
      const message =
        error instanceof ApiClientError
          ? error.message
          : 'No fue posible enviar el mensaje. Intenta de nuevo más tarde.';
      const status =
        error instanceof ApiClientError && error.status && error.status >= 400
          ? Math.min(error.status, 599)
          : 502;

      return fail(status, {
        kind: 'error' as const,
        message,
        errors: { _form: message },
      });
    }
  },
};
