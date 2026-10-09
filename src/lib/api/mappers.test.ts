import { describe, expect, it } from 'vitest';

import { formatMenuPrice, getDisplayVariant, getFeaturedMenuItems } from './mappers';
import type { PublicMenuItem, PublicMenuResponse } from './types';

const item: PublicMenuItem = {
  id: 'item-1',
  slug: 'latte',
  itemType: 'drink',
  nameEs: 'Latte',
  nameEn: 'Latte',
  descriptionEs: 'Café con leche.',
  descriptionEn: 'Coffee with milk.',
  variants: [
    {
      id: 'variant-1',
      nameEs: 'Regular',
      nameEn: 'Regular',
      isDefault: true,
      available: true,
      price: { id: 'price-1', amount: '4.50', currency: 'USD', includesTax: true },
      allergens: [],
      modifierGroups: [],
    },
  ],
};

const menu: PublicMenuResponse = {
  locationId: 'location-1',
  channel: 'web',
  generatedAt: '2026-10-08T12:00:00.000Z',
  categories: [
    {
      id: 'category-1',
      slug: 'coffee',
      nameEs: 'Café',
      nameEn: 'Coffee',
      descriptionEs: null,
      descriptionEn: null,
      items: [item],
    },
  ],
};

describe('mapeos de carta pública', () => {
  it('aplana los primeros ítems publicados sin inventar contenido', () => {
    expect(getFeaturedMenuItems(menu)).toEqual([
      { categoryName: 'Café', categorySlug: 'coffee', item },
    ]);
    expect(getFeaturedMenuItems(null)).toEqual([]);
  });

  it('elige la variante default y formatea su moneda', () => {
    const variant = getDisplayVariant(item);
    expect(variant?.id).toBe('variant-1');
    expect(formatMenuPrice(variant)).toContain('4.50');
  });
});
