# Sistema de diseño público

## Dirección visual

La nueva identidad toma del sitio legacy la composición de cafetería —navegación clara, títulos con líneas, tarjetas con fotografía, detalle de producto y footer editorial—, pero no reutiliza su HTML, CSS, Poppins, paleta burdeos/durazno ni iconos rasterizados.

La referencia visual es una cafetería de montaña en la Ruta Panorámica: cálida, natural y legible. Los assets fotográficos actuales son provisionales y se sirven desde `static/`.

## Tipografía

- **Fraunces Variable:** títulos, marca y llamados editoriales. Sus remates y contraste aportan una personalidad de café artesanal sin repetir Poppins.
- **Manrope Variable:** texto, navegación, formularios y datos. Su construcción abierta conserva legibilidad en pantallas pequeñas.

Ambas familias se self-hostean con `@fontsource-variable/*`. La base continúa en `16px`; el código usa `rem`, `clamp()` y pesos variables.

## Color

Los primitivos viven en `src/app.css` y los componentes consumen tokens semánticos. La combinación principal de texto `#241811` sobre crema `#fffaf1` alcanza contraste AA; el verde `#1f5139` sobre blanco se usa para acciones y superficies de marca. Los estados de peligro y éxito también tienen pares de alto contraste.

| Token semántico                         | Uso                                             |
| --------------------------------------- | ----------------------------------------------- |
| `--background` / `--foreground`         | Fondo y texto principal                         |
| `--surface-raised`                      | Tarjetas, formularios y contenido elevado       |
| `--surface-warm`                        | Filtros, llamadas editoriales y bloques cálidos |
| `--surface-brand`                       | Header móvil, footer y llamadas principales     |
| `--primary`                             | Acciones, enlaces, estado activo y foco         |
| `--accent`                              | Avisos editoriales y superficies secundarias    |
| `--status-success` / `--status-warning` | Estados informativos                            |

El modo oscuro redefine solo tokens semánticos mediante `[data-theme="dark"]` y `.dark`. El toggle del header actualiza `data-theme`, tiene etiqueta accesible y guarda únicamente la preferencia visual en `localStorage`; no se guardan sesiones ni tokens.

## Iconografía

Las acciones y elementos informativos usan `@lucide/svelte`. Las redes del footer usan símbolos Lucide neutrales (`MessageCircle`, `Camera` y `Music2`) hasta confirmar las URLs oficiales. Los iconos decorativos llevan `aria-hidden="true"`; los controles solo con icono tienen `aria-label`.

## Componentes públicos

- `site-header`: logo, navegación activa, menú móvil offcanvas de un solo DOM y toggle de tema.
- `site-footer`: identidad, redes, columnas de enlaces y legal.
- `section-heading`: título entre líneas decorativas.
- `category-card`: imagen, nombre, descripción y enlace de categoría.
- `menu-item-card`: imagen editorial, nombre, precio de API y disponibilidad.
- `product-detail`: detalle de dos columnas con variantes, alérgenos y modificadores de API.
- `allergen-selector`: botones con selección múltiple y `aria-pressed`.
- `pagination`: navegación anterior/siguiente con estado textual.

Los componentes propios siguen BEM dentro de sus estilos Svelte. Los componentes generados de shadcn-svelte permanecen bajo `src/lib/components/ui/` y conservan sus nombres de variables.

## Responsive y accesibilidad

- Mobile-first con puntos de cambio en `40rem`, `48rem` y `64rem`.
- Foco visible global y controles de al menos `2.75rem` en el shell.
- Landmarks, encabezados jerárquicos, `alt` descriptivo y títulos de iframe.
- `prefers-reduced-motion` elimina las transiciones prolongadas.
- No se usa `transition: all`, `!important`, inline styles ni iconos PNG de interfaz.

## Assets

Las imágenes provisionales se organizan por intención:

```text
static/
├── brand/                 # logos y banner institucional provisional
├── menu/categories/       # fotografías por categoría
├── reservations/          # planos de reserva disponibles para futuras iteraciones
└── experiences/           # etapas editoriales de senderismo
```

Las imágenes de productos permanecen preparadas para una futura URL opcional `imageUrl` del contrato público. Si no existe, el frontend usa una fotografía de categoría como fallback sin inventar datos comerciales.

## Decisiones de contenido

`src/lib/content/site.ts` marca con `editorialPlaceholder = true` las páginas que todavía no tienen endpoint o información aprobada: promociones, contacto, nosotros, senderismo, ubicación y textos legales. No se publican precios ficticios ni se modifican contratos de `koffisoft_api`.
