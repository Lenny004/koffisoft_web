import type { PageServerLoad } from './$types';

import { createApiClient } from '$lib/server/api/client';

/** Obtiene el detalle por slug y mantiene la página navegable si el servicio falla. */
export const load: PageServerLoad = async ({ fetch, params, url }) => {
  try {
    const item = await createApiClient(undefined, fetch).getPublicMenuItem(params.slug, {
      category: url.searchParams.get('category')?.trim() || undefined,
      allergen: url.searchParams.get('allergen')?.trim().toUpperCase() || undefined,
    });
    return { item, errorMessage: null };
  } catch {
    return {
      item: null,
      errorMessage: 'No pudimos cargar este ítem. Puede estar temporalmente no disponible.',
    };
  }
};
