import type { PageServerLoad } from './$types';

import { createApiClient } from '$lib/server/api/client';

/** Conserva los filtros de URL y transforma un fallo externo en un estado renderizable. */
export const load: PageServerLoad = async ({ fetch, url }) => {
  const filters = {
    category: url.searchParams.get('category')?.trim() || '',
    allergen: url.searchParams.get('allergen')?.trim().toUpperCase() || '',
  };

  try {
    const client = createApiClient(undefined, fetch);
    const menu = await client.getPublicMenu(filters);
    const catalog =
      filters.category || filters.allergen ? await client.getPublicMenu().catch(() => menu) : menu;

    return {
      menu,
      navigation: catalog.categories.map((category) => ({
        id: category.id,
        slug: category.slug,
        imageUrl: category.imageUrl,
        nameEs: category.nameEs,
        nameEn: category.nameEn,
        descriptionEs: category.descriptionEs,
        descriptionEn: category.descriptionEn,
      })),
      filters,
      errorMessage: null,
    };
  } catch {
    return {
      menu: null,
      navigation: [],
      filters,
      errorMessage: 'No pudimos cargar la carta. Intenta de nuevo en unos minutos.',
    };
  }
};
