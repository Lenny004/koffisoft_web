export type SeoResourceType = 'menu_item' | 'event' | 'announcement' | 'page';

export interface SeoMetadata {
  id: string | null;
  resourceType: SeoResourceType;
  resourceKey: string;
  metaTitle: string;
  metaDescription: string;
  ogImageUrl: string | null;
  canonicalUrl: string;
  noindex: boolean;
  locationId: string | null;
  updatedAt: string | null;
}

const PAGE_DEFAULTS: Record<string, { title: string; description: string; path: string }> = {
  home: {
    title: 'Koffi-Soft | Cafe, cocina y montana',
    description: 'Descubre cafe, cocina y experiencias con vista en la Ruta Panoramica.',
    path: '/',
  },
  menu: {
    title: 'Carta | Koffi-Soft',
    description: 'Consulta la carta publica de Koffi-Soft y sus opciones disponibles.',
    path: '/carta',
  },
  promotions: {
    title: 'Promociones | Koffi-Soft',
    description: 'Conoce las novedades y promociones de Koffi-Soft.',
    path: '/promociones',
  },
  reservations: {
    title: 'Reservas | Koffi-Soft',
    description: 'Elige fecha, hora y personas para solicitar tu reserva.',
    path: '/reservas',
  },
  events: {
    title: 'Eventos | Koffi-Soft',
    description: 'Conoce los espacios para eventos y solicita una cotizacion.',
    path: '/eventos',
  },
  announcements: {
    title: 'Avisos importantes | Koffi-Soft',
    description: 'Consulta los avisos importantes publicados por Koffi-Soft.',
    path: '/avisos',
  },
  about: {
    title: 'Nosotros | Koffi-Soft',
    description: 'Conoce la mision, vision y equipo de Koffi-Soft.',
    path: '/nosotros',
  },
  location: {
    title: 'Ubicacion | Koffi-Soft',
    description: 'Consulta la ubicacion y el horario antes de visitarnos.',
    path: '/ubicacion',
  },
  contact: {
    title: 'Contacto | Koffi-Soft',
    description: 'Escribenos para resolver tus dudas sobre reservas y eventos.',
    path: '/contacto',
  },
  hiking: {
    title: 'Senderismo | Koffi-Soft',
    description: 'Descubre la experiencia de montana en la Ruta Panoramica.',
    path: '/senderismo',
  },
  allergens: {
    title: 'Alergenos | Koffi-Soft',
    description: 'Consulta la informacion de alergenos de la carta publicada.',
    path: '/alergenos',
  },
  legal: {
    title: 'Terminos y condiciones | Koffi-Soft',
    description: 'Consulta los terminos de uso del sitio de Koffi-Soft.',
    path: '/legal',
  },
  privacy: {
    title: 'Privacidad | Koffi-Soft',
    description: 'Consulta la politica de privacidad de Koffi-Soft.',
    path: '/privacidad',
  },
  cookies: {
    title: 'Cookies | Koffi-Soft',
    description: 'Consulta el uso de cookies en el sitio de Koffi-Soft.',
    path: '/cookies',
  },
  conditions: {
    title: 'Condiciones | Koffi-Soft',
    description: 'Consulta las condiciones de servicio de Koffi-Soft.',
    path: '/condiciones',
  },
};

const PATH_TO_PAGE: Record<string, string> = {
  '/': 'home',
  '/carta': 'menu',
  '/promociones': 'promotions',
  '/reservas': 'reservations',
  '/eventos': 'events',
  '/avisos': 'announcements',
  '/nosotros': 'about',
  '/ubicacion': 'location',
  '/contacto': 'contact',
  '/senderismo': 'hiking',
  '/alergenos': 'allergens',
  '/legal': 'legal',
  '/privacidad': 'privacy',
  '/cookies': 'cookies',
  '/condiciones': 'conditions',
};

export function pageKeyForPath(pathname: string): string | null {
  if (/^\/carta\/[^/]+$/u.test(pathname)) return null;
  return PATH_TO_PAGE[pathname] ?? 'home';
}

export function defaultSeo(pageKey: string, siteUrl: string): SeoMetadata {
  const page = PAGE_DEFAULTS[pageKey] ?? PAGE_DEFAULTS.home;
  const canonicalUrl = new URL(page.path, `${siteUrl.replace(/\/$/u, '')}/`).toString();
  return {
    id: null,
    resourceType: 'page',
    resourceKey: pageKey,
    metaTitle: page.title,
    metaDescription: page.description,
    ogImageUrl: new URL('/brand/logo-primary.png', `${siteUrl.replace(/\/$/u, '')}/`).toString(),
    canonicalUrl,
    noindex: false,
    locationId: null,
    updatedAt: null,
  };
}
