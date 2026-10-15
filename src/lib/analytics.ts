import { pageKeyForPath } from './seo';

export type PublicAnalyticsResourceType = 'page' | 'menu_item' | 'event' | 'announcement';

export interface PublicAnalyticsPayload {
  path: string;
  locationId?: string;
  resourceType: PublicAnalyticsResourceType;
  resourceKey?: string;
  referer?: string;
  isPreview: false;
}

export function analyticsResource(pathname: string): {
  resourceType: PublicAnalyticsResourceType;
  resourceKey: string;
} {
  const menuItem = pathname.match(/^\/carta\/([^/]+)$/u);
  if (menuItem) return { resourceType: 'menu_item', resourceKey: menuItem[1] };

  const event = pathname.match(/^\/eventos\/([^/]+)$/u);
  if (event) return { resourceType: 'event', resourceKey: event[1] };

  const announcement = pathname.match(/^\/avisos\/([^/]+)$/u);
  if (announcement) return { resourceType: 'announcement', resourceKey: announcement[1] };

  return { resourceType: 'page', resourceKey: pageKeyForPath(pathname) ?? pathname };
}

export function createAnalyticsPayload(
  pathname: string,
  locationId: string,
  referer: string,
): PublicAnalyticsPayload | null {
  if (/^\/preview(?:\/|$)/u.test(pathname)) return null;

  const resource = analyticsResource(pathname);
  return {
    path: pathname,
    ...(locationId ? { locationId } : {}),
    ...resource,
    ...(referer ? { referer } : {}),
    isPreview: false,
  };
}
