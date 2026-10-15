import type { PageServerLoad } from './$types';

import { createApiClient } from '$lib/server/api/client';

/** Obtiene el detalle por slug y mantiene la página navegable si el servicio falla. */
export const load: PageServerLoad = async ({ fetch, params, url }) => {
  try {
    const client = createApiClient(undefined, fetch);
    const item = await client.getPublicMenuItem(params.slug, {
      category: url.searchParams.get('category')?.trim() || undefined,
      allergen: url.searchParams.get('allergen')?.trim().toUpperCase() || undefined,
    });
    let seo = null;
    try {
      seo = await client.getSeo('menu_item', params.slug);
    } catch {
      seo = {
        id: null,
        resourceType: 'menu_item' as const,
        resourceKey: params.slug,
        metaTitle: `${item.item.nameEs} | Koffi-Soft`,
        metaDescription:
          item.item.descriptionEs ?? 'Detalle de un ítem de la carta pública de Koffi-Soft.',
        ogImageUrl: new URL('/brand/logo-primary.png', url.origin).toString(),
        canonicalUrl: new URL(`/carta/${encodeURIComponent(params.slug)}`, url.origin).toString(),
        noindex: false,
        locationId: null,
        updatedAt: null,
      };
    }
    return { item, seo, errorMessage: null };
  } catch {
    return {
      item: null,
      seo: null,
      errorMessage: 'No pudimos cargar este ítem. Puede estar temporalmente no disponible.',
    };
  }
};
