import type { PageServerLoad } from './$types';

import { createApiClient } from '$lib/server/api/client';

/** Carga los avisos vigentes. Si la API falla, la página sigue mostrando el estado vacío o de error. */
export const load: PageServerLoad = async ({ fetch }) => {
  try {
    const announcements = await createApiClient(undefined, fetch).getImportantAnnouncements();
    return { announcements, errorMessage: null };
  } catch {
    return {
      announcements: [],
      errorMessage:
        'Los avisos no están disponibles en este momento. Puedes volver más tarde o escribirnos desde contacto.',
    };
  }
};
