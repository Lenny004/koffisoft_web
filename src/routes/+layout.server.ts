import type { LayoutServerLoad } from './$types';
import { env } from '$env/dynamic/private';

import { mapSiteContent } from '$lib/api/mappers';
import { siteContent } from '$lib/content/site';
import { createApiClient } from '$lib/server/api/client';
import { defaultSeo, pageKeyForPath } from '$lib/seo';

/** Hidrata layout con contenido de sede, SEO por ruta y respaldo local si la API falla. */
export const load: LayoutServerLoad = async ({ fetch, url }) => {
  const pageKey = pageKeyForPath(url.pathname);
  const fallbackSeo = pageKey ? defaultSeo(pageKey, url.origin) : null;
  let currentSiteContent = siteContent;
  let siteContentSource: 'api' | 'fallback' = 'fallback';
  let locationId = env.LOCATION_ID ?? '';

  try {
    const remote = await createApiClient(undefined, fetch).getSiteContent();
    currentSiteContent = {
      ...siteContent,
      ...mapSiteContent(remote),
      promotions: siteContent.promotions,
      hikingStages: siteContent.hikingStages,
    };
    locationId = remote.locationId || locationId;
    siteContentSource = 'api';
  } catch {
    // El contenido local mantiene la navegacion disponible durante una caida de API.
  }

  let seo = fallbackSeo;
  if (pageKey) {
    try {
      seo = await createApiClient(undefined, fetch).getSeo('page', pageKey);
    } catch {
      // El default local evita dejar la pagina sin head cuando la API no responde.
    }
  }

  return {
    siteContent: currentSiteContent,
    siteContentSource,
    seo,
    siteUrl: url.origin,
    locationId,
  };
};
