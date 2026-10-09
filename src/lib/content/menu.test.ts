import { describe, expect, it } from 'vitest';

import { getCategoryImage, getMenuItemImage } from './menu';

describe('mapeo de imágenes editoriales', () => {
  it('selecciona una imagen de categoría por slug o nombre', () => {
    expect(getCategoryImage({ slug: 'desayunos', nameEs: 'Desayunos' })).toBe(
      '/menu/categories/breakfast.jpg',
    );
    expect(getCategoryImage({ slug: 'unknown', nameEs: 'Bebidas frías' })).toBe(
      '/menu/categories/cold-drinks.jpg',
    );
  });

  it('prioriza la URL opcional del ítem y usa fallback de categoría', () => {
    expect(
      getMenuItemImage(
        { slug: 'latte', imageUrl: undefined },
        { slug: 'postres', nameEs: 'Postres' },
      ),
    ).toBe('/menu/categories/desserts.jpg');
    expect(getMenuItemImage({ slug: 'latte', imageUrl: '/media/latte.jpg' })).toBe(
      '/media/latte.jpg',
    );
  });
});
