import type { PublicMenuCategory, PublicMenuItem } from '$lib/api/types';

/** Imágenes editoriales provisionales; los precios y disponibilidad siguen viniendo de la API. */
export const categoryImages: Record<string, string> = {
  desayuno: '/menu/categories/breakfast.jpg',
  desayunos: '/menu/categories/breakfast.jpg',
  'almuerzo-cena': '/menu/categories/lunch-dinner.png',
  almuerzo: '/menu/categories/lunch-dinner.png',
  cenas: '/menu/categories/lunch-dinner.png',
  entrada: '/menu/categories/starters.png',
  entradas: '/menu/categories/starters.png',
  'bebidas-caliente': '/menu/categories/hot-drinks.png',
  'bebidas-calientes': '/menu/categories/hot-drinks.png',
  'bebida-fria': '/menu/categories/cold-drinks.jpg',
  'bebidas-frias': '/menu/categories/cold-drinks.jpg',
  postres: '/menu/categories/desserts.jpg',
  postre: '/menu/categories/desserts.jpg',
};

const defaultCategoryImage = '/menu/categories/breakfast.jpg';

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/(^-|-$)/gu, '');
}

export function getCategoryImage(category: Pick<PublicMenuCategory, 'slug' | 'nameEs'>): string {
  return (
    categoryImages[category.slug] ??
    categoryImages[normalize(category.nameEs)] ??
    defaultCategoryImage
  );
}

export function getMenuItemImage(
  item: Pick<PublicMenuItem, 'slug' | 'imageUrl'>,
  category?: Pick<PublicMenuCategory, 'slug' | 'nameEs'>,
): string {
  return item.imageUrl ?? (category ? getCategoryImage(category) : defaultCategoryImage);
}
