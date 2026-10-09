import type { PageServerLoad } from './$types';

import { getFeaturedMenuItems } from '$lib/api/mappers';
import { createApiClient } from '$lib/server/api/client';

/** Consulta la carta para mostrar destacados reales; un fallo de API deja la portada utilizable. */
export const load: PageServerLoad = async ({ fetch }) => {
  try {
    const menu = await createApiClient(undefined, fetch).getPublicMenu();
    return { featuredItems: getFeaturedMenuItems(menu), menuAvailable: true, errorMessage: null };
  } catch {
    return {
      featuredItems: [],
      menuAvailable: false,
      errorMessage:
        'La carta no está disponible en este momento. Puedes visitarnos o reservar y te ayudaremos por contacto directo.',
    };
  }
};
