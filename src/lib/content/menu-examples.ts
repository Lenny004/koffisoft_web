import type { PublicMenuCategory, PublicMenuItem, PublicMenuResponse } from '$lib/api/types';

function exampleItem(
  slug: string,
  nameEs: string,
  amount: string,
  imageUrl: string,
  allergen?: { code: string; nameEs: string },
): PublicMenuItem {
  return {
    id: `example-${slug}`,
    slug,
    imageUrl,
    itemType: 'simple',
    nameEs,
    nameEn: nameEs,
    descriptionEs: null,
    descriptionEn: null,
    variants: [
      {
        id: `example-${slug}-default`,
        nameEs: 'Única',
        nameEn: 'Single',
        isDefault: true,
        available: true,
        price: {
          id: `example-${slug}-price`,
          amount,
          currency: 'USD',
          includesTax: false,
        },
        allergens: allergen
          ? [
              {
                id: `example-${slug}-allergen`,
                code: allergen.code,
                nameEs: allergen.nameEs,
                nameEn: allergen.nameEs,
                presenceType: 'contains',
              },
            ]
          : [],
        modifierGroups: [],
      },
    ],
  };
}

function exampleCategory(
  slug: string,
  nameEs: string,
  descriptionEs: string,
  items: PublicMenuItem[],
): PublicMenuCategory {
  return {
    id: `example-${slug}`,
    slug,
    nameEs,
    nameEn: nameEs,
    descriptionEs,
    descriptionEn: descriptionEs,
    items,
  };
}

/** Carta provisional para revisar el catálogo cuando la sede todavía no publica opciones. */
export const exampleMenu: PublicMenuResponse = {
  locationId: 'example',
  channel: 'web',
  generatedAt: '2026-01-01T00:00:00.000Z',
  categories: [
    exampleCategory(
      'desayunos',
      'Desayunos',
      'Huevos, tostadas y panes para empezar la mañana con calma.',
      [
        exampleItem('huevos-de-la-casa', 'Huevos de la casa', '8.50', '/menu/editorial/04.jpg'),
        exampleItem(
          'tostada-de-aguacate',
          'Tostada de aguacate',
          '7.00',
          '/menu/editorial/05.jpg',
          {
            code: 'GLUTEN',
            nameEs: 'Gluten',
          },
        ),
      ],
    ),
    exampleCategory('cocina', 'Cocina', 'Platos para compartir cuando la mesa ya está servida.', [
      exampleItem('bowl-de-mercado', 'Bowl de mercado', '12.00', '/menu/editorial/06.jpg'),
      exampleItem('plato-del-dia', 'Plato del día', '14.50', '/menu/editorial/02.jpg'),
    ]),
    exampleCategory(
      'bebidas-calientes',
      'Bebidas calientes',
      'Café de la casa y chai para alargar la pausa.',
      [
        exampleItem('latte-de-montana', 'Latte de montaña', '3.75', '/menu/editorial/01.jpg'),
        exampleItem('chai-de-la-casa', 'Chai de la casa', '4.25', '/menu/editorial/08.jpg'),
      ],
    ),
    exampleCategory(
      'bebidas-frias',
      'Bebidas frías',
      'Preparaciones frías para el calor de la ruta.',
      [exampleItem('frio-de-cacao', 'Frío de cacao', '4.50', '/menu/editorial/03.jpg')],
    ),
    exampleCategory('postres', 'Postres', 'Un cierre dulce, pequeño y para compartir.', [
      exampleItem('postre-del-dia', 'Postre del día', '6.00', '/menu/editorial/07.jpg'),
    ]),
  ],
};

export function filterExampleMenu(
  menu: PublicMenuResponse,
  filters: { category?: string; allergen?: string },
): PublicMenuResponse {
  const allergen = filters.allergen?.trim().toUpperCase() ?? '';
  const categories = menu.categories
    .filter((category) => !filters.category || category.slug === filters.category)
    .map((category) => ({
      ...category,
      items: allergen
        ? category.items.filter((item) =>
            item.variants.some((variant) =>
              variant.allergens.some((entry) => entry.code === allergen),
            ),
          )
        : category.items,
    }));

  return { ...menu, categories };
}
