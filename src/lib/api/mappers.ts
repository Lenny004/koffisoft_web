import type {
  PublicMenuItem,
  PublicMenuResponse,
  PublicMenuVariant,
  PublicSiteContent,
} from './types';
import type { SiteContent } from '$lib/content/site';

export interface FeaturedMenuItem {
  categoryName: string;
  item: PublicMenuItem;
}

/** Aplana las categorías sin generar contenido; solo selecciona datos recibidos de la API. */
export function getFeaturedMenuItems(
  menu: PublicMenuResponse | null,
  limit = 3,
): FeaturedMenuItem[] {
  if (!menu || limit <= 0) return [];

  return menu.categories
    .flatMap((category) =>
      category.items.map((item) => ({
        categoryName: category.nameEs,
        item,
      })),
    )
    .slice(0, limit);
}

/** Elige la variante predeterminada y, si no existe, la primera variante publicada. */
export function getDisplayVariant(item: PublicMenuItem): PublicMenuVariant | null {
  return item.variants.find((variant) => variant.isDefault) ?? item.variants[0] ?? null;
}

/** Formatea el precio de una variante con locale es-SV o un fallback legible si falla Intl. */
export function formatMenuPrice(variant: PublicMenuVariant | null): string {
  if (!variant) return 'Precio no disponible';

  const amount = Number(variant.price.amount);
  if (!Number.isFinite(amount)) return 'Precio no disponible';

  try {
    return new Intl.NumberFormat('es-SV', {
      style: 'currency',
      currency: variant.price.currency,
    }).format(amount);
  } catch {
    return `${variant.price.currency} ${variant.price.amount}`;
  }
}

/** Muestra el menor precio y antepone «Desde» solo cuando las variantes difieren. */
export function formatMenuPriceLabel(item: PublicMenuItem): string {
  const priced = item.variants.flatMap((variant) => {
    const amount = Number(variant.price.amount);
    return Number.isFinite(amount) ? [{ amount, variant }] : [];
  });
  if (priced.length === 0) return 'Precio no disponible';

  const lowest = priced.reduce((current, candidate) =>
    candidate.amount < current.amount ? candidate : current,
  );
  const formatted = formatMenuPrice(lowest.variant);
  const hasRange = priced.some((entry) => entry.amount !== lowest.amount);
  return hasRange ? `Desde ${formatted}` : formatted;
}

/** Resume horarios activos de la sede agrupados por día de la semana. */
function formatHours(content: PublicSiteContent): string {
  const active = content.hours.filter((hour) => hour.active);
  if (!active.length) return 'Horario por confirmar.';
  const byDay = new Map<number, string[]>();
  for (const hour of active) {
    const label = `${hour.opensAt}–${hour.closesAt}`;
    byDay.set(hour.dayOfWeek, [...(byDay.get(hour.dayOfWeek) ?? []), label]);
  }
  return [...byDay.entries()]
    .map(
      ([day, labels]) =>
        `${['', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][day]} ${labels.join(', ')}`,
    )
    .join(' · ');
}

/** Adapta el DTO público de la API al modelo estático usado por layout y páginas de contenido. */
export function mapSiteContent(content: PublicSiteContent): SiteContent {
  const profile = content.profile;
  const location = content.location;
  return {
    name: location.name || 'Koffi-Soft',
    contact: {
      address: [location.addressLine, location.municipality, location.department]
        .filter(Boolean)
        .join(', '),
      phone: location.phone || 'Por confirmar',
      email: location.email || 'Por confirmar',
      hours: formatHours(content),
    },
    hero: {
      eyebrow: profile?.heroEyebrow || 'Carta de la casa',
      title: profile?.heroTitle || 'Descubre los favoritos del café y la cocina de montaña',
      description: profile?.heroDescription || 'Platos, bebidas y postres para elegir con calma.',
      imageUrl: profile?.heroImageUrl || null,
    },
    about: {
      title: profile?.aboutTitle || 'Nosotros',
      description:
        profile?.aboutDescription ||
        'Koffi-Soft nace como un punto de encuentro para disfrutar la montaña con los cinco sentidos.',
      mission:
        profile?.aboutMission ||
        'Crear pausas memorables alrededor del café, la cocina y el paisaje de montaña.',
      vision: profile?.aboutVision || 'Ser un punto de encuentro reconocido en la Ruta Panorámica.',
      team: profile?.aboutTeam?.length ? profile.aboutTeam : [],
    },
    social: {
      facebook: profile?.socialFacebookUrl || null,
      instagram: profile?.socialInstagramUrl || null,
      tikTok: profile?.socialTikTokUrl || null,
    },
    promotions: [],
    hikingStages: [],
  };
}
