import type { PublicMenuItem, PublicMenuResponse, PublicMenuVariant } from './types';

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
