import { describe, expect, it } from 'vitest';

import { exampleMenu } from './menu-examples';
import {
  editorialImageForSlug,
  getCategoryImage,
  getMenuItemImage,
  listMenuAllergens,
} from './menu';

describe('mapeo de imágenes editoriales', () => {
  it('selecciona una imagen de categoría por slug o nombre', () => {
    expect(getCategoryImage({ slug: 'desayunos', nameEs: 'Desayunos' })).toBe(
      '/menu/categories/breakfast.jpg',
    );
    expect(getCategoryImage({ slug: 'unknown', nameEs: 'Bebidas frías' })).toBe(
      '/menu/categories/cold-drinks.jpg',
    );
  });

  it('prioriza la URL del ítem y, si falta, elige una foto editorial estable', () => {
    expect(getMenuItemImage({ slug: 'latte', imageUrl: undefined })).toBe(
      editorialImageForSlug('latte'),
    );
    expect(getMenuItemImage({ slug: 'latte' })).toBe(editorialImageForSlug('latte'));
    expect(getMenuItemImage({ slug: 'latte', imageUrl: '/media/latte.jpg' })).toBe(
      '/media/latte.jpg',
    );
  });

  it('lista alérgenos únicos de la carta ordenados por nombre', () => {
    expect(listMenuAllergens(exampleMenu).map((allergen) => allergen.code)).toEqual([
      'GLUTEN',
      'EGG',
      'MILK',
    ]);
  });
});
