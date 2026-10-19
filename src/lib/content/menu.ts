import type { PublicMenuCategory, PublicMenuItem, PublicMenuResponse } from '$lib/api/types';

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

/** Fotos provisionales de Unsplash para que la rejilla se vea variada hasta tener imágenes propias. */
export const editorialImages = [
  '/menu/editorial/01.jpg',
  '/menu/editorial/02.jpg',
  '/menu/editorial/03.jpg',
  '/menu/editorial/04.jpg',
  '/menu/editorial/05.jpg',
  '/menu/editorial/06.jpg',
  '/menu/editorial/07.jpg',
  '/menu/editorial/08.jpg',
] as const;

/** Elige una imagen editorial estable a partir del slug cuando el ítem no trae foto. */
export function editorialImageForSlug(slug: string): string {
  const total = [...slug].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return editorialImages[total % editorialImages.length];
}

/** Normaliza nombres de categoría a slug ASCII para emparejar claves de imágenes. */
function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/(^-|-$)/gu, '');
}

/** Resuelve la imagen de cabecera de categoría por slug o nombre normalizado. */
export function getCategoryImage(category: Pick<PublicMenuCategory, 'slug' | 'nameEs'>): string {
  return (
    categoryImages[category.slug] ??
    categoryImages[normalize(category.nameEs)] ??
    defaultCategoryImage
  );
}

/** Prefiere la URL de la API y cae en una imagen editorial determinista por slug. */
export function getMenuItemImage(item: Pick<PublicMenuItem, 'slug' | 'imageUrl'>): string {
  return item.imageUrl ?? editorialImageForSlug(item.slug);
}

/** Extrae alérgenos únicos de la carta para el filtro buscable del catálogo. */
export function listMenuAllergens(menu: PublicMenuResponse): { code: string; nameEs: string }[] {
  const allergens = new Map<string, string>();

  for (const category of menu.categories) {
    for (const item of category.items) {
      for (const variant of item.variants) {
        for (const allergen of variant.allergens) {
          if (!allergens.has(allergen.code)) allergens.set(allergen.code, allergen.nameEs);
        }
      }
    }
  }

  return [...allergens.entries()]
    .map(([code, nameEs]) => ({ code, nameEs }))
    .sort((left, right) => left.nameEs.localeCompare(right.nameEs, 'es'));
}
