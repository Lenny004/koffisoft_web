import type { PageServerLoad } from './$types';

import { getFeaturedMenuItems } from '$lib/api/mappers';
import { exampleMenu } from '$lib/content/menu-examples';
import { createApiClient } from '$lib/server/api/client';

/** Consulta la carta para mostrar destacados reales; un fallo de API deja la portada utilizable. */
export const load: PageServerLoad = async ({ fetch }) => {
  try {
    const client = createApiClient(undefined, fetch);
    const [menu, announcements] = await Promise.all([
      client.getPublicMenu(),
      client.getImportantAnnouncements().catch(() => []),
    ]);
    return {
      categories: menu.categories,
      featuredItems: getFeaturedMenuItems(menu, 8),
      announcements,
      preview: false,
      errorMessage: null,
    };
  } catch {
    return {
      categories: exampleMenu.categories,
      featuredItems: getFeaturedMenuItems(exampleMenu, 8),
      announcements: [],
      preview: true,
      errorMessage: null,
    };
  }
};
