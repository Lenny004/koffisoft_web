import type { LayoutServerLoad } from './$types';

import { mapSiteContent } from '$lib/api/mappers';
import { siteContent } from '$lib/content/site';
import { createApiClient } from '$lib/server/api/client';

export const load: LayoutServerLoad = async ({ fetch }) => {
  try {
    const remote = await createApiClient(undefined, fetch).getSiteContent();
    return {
      siteContent: {
        ...siteContent,
        ...mapSiteContent(remote),
        promotions: siteContent.promotions,
        hikingStages: siteContent.hikingStages,
      },
      siteContentSource: 'api' as const,
    };
  } catch {
    return { siteContent, siteContentSource: 'fallback' as const };
  }
};
