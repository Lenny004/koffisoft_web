import type { PageServerLoad } from './$types';

import { createApiClient } from '$lib/server/api/client';

/** Conserva los filtros de URL y transforma un fallo externo en un estado renderizable. */
export const load: PageServerLoad = async ({ fetch, url }) => {
  const filters = {
    category: url.searchParams.get('category')?.trim() || '',
    allergen: url.searchParams.get('allergen')?.trim().toUpperCase() || '',
  };

  try {
    const menu = await createApiClient(undefined, fetch).getPublicMenu(filters);
    return { menu, filters, errorMessage: null };
  } catch {
    return {
      menu: null,
      filters,
      errorMessage: 'No pudimos cargar la carta. Intenta de nuevo en unos minutos.',
    };
  }
};
