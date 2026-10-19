import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { ApiClientError, createApiClient } from '$lib/server/api/client';

/** Carga borradores por token con noindex y errores HTTP acordes a caducidad o caída de API. */
export const load: PageServerLoad = async ({ fetch, params, setHeaders }) => {
  setHeaders({
    'cache-control': 'no-store',
    'x-robots-tag': 'noindex, nofollow, noarchive',
  });
  try {
    const preview = await createApiClient(undefined, fetch).getPreview(params.token);
    return { preview };
  } catch (cause) {
    if (cause instanceof ApiClientError && cause.status === 404)
      throw error(404, 'La vista previa no existe o ya expiró.');
    throw error(502, 'La vista previa no está disponible en este momento.');
  }
};
