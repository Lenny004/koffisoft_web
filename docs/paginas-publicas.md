# Páginas públicas

Este documento describe las rutas públicas de `koffisoft_web`, su fuente de datos y los límites con `koffisoft_api`.

## Configuración

Las rutas server-only leen estas variables desde `$env/dynamic/private`:

- `API_BASE_URL`: URL base de `koffisoft_api`.
- `LOCATION_ID`: UUID de la sede pública; es obligatorio para carta, reservas y eventos.
- `ORIGIN`: origen local de SvelteKit para formularios y `adapter-node`.

## Rutas conectadas a la API

| Ruta            | Datos                                                                  | Interacción                                               |
| --------------- | ---------------------------------------------------------------------- | --------------------------------------------------------- |
| `/`             | Categorías y destacados de `GET /menu`; avisos de `GET /announcements` | Navegación a carta, reservas, eventos y avisos            |
| `/avisos`       | Avisos vigentes de `GET /announcements`                                | Lectura del aviso completo, con enlaces del texto         |
| `/carta`        | Carta agrupada de `GET /menu`                                          | Filtros `category` y `allergen` por query params          |
| `/carta/[slug]` | Detalle de `GET /menu/items/{slug}`                                    | Variantes, precio, alérgenos y modificadores publicados   |
| `/reservas`     | `GET /reservations/availability` bajo demanda                          | Actions `availability` y `default` para solicitar reserva |
| `/eventos`      | `GET /events/catalog`                                                  | Action `default` para solicitar cotización                |

Los precios, disponibilidad, capacidades y códigos no se generan en el frontend. El cliente server-only vive en `src/lib/server/api/client.ts`.

Las CTA editoriales solo se renderizan si la API entrega una ruta relativa
segura o una URL `http(s)`. El sitio vuelve a rechazar esquemas ejecutables o
destinos protocol-relative antes de crear el enlace.

## Rutas editoriales o provisionales

Estas páginas no inventan contratos. El contenido institucional está en `src/lib/content/site.ts` y los módulos legales en `src/lib/content/legal.ts`. Ambos quedan marcados por `editorialPlaceholder` hasta que exista información aprobada:

| Ruta           | Alcance                                                                                              |
| -------------- | ---------------------------------------------------------------------------------------------------- |
| `/promociones` | Tarjetas preparadas para un futuro catálogo de promociones; sin precios ni vigencias ficticias       |
| `/alergenos`   | Selector visual local con selección múltiple; no simula resultados de menú                           |
| `/contacto`    | Form action con validación server-side; confirma la entrada, pero no envía a un endpoint inexistente |
| `/nosotros`    | Misión, visión y equipo editorial provisional                                                        |
| `/senderismo`  | Recorrido por etapas con fotografías provisionales                                                   |
| `/ubicacion`   | Mapa de referencia y horario provisional                                                             |
| `/legal`       | Aviso legal y condiciones de uso, en cláusulas numeradas provisionales                               |
| `/privacidad`  | Política de privacidad provisional                                                                   |
| `/cookies`     | Política de cookies y almacenamiento local provisional                                               |
| `/condiciones` | Condiciones provisionales de solicitudes de reserva y eventos                                        |

## Formularios

`/reservas`, `/eventos` y `/contacto` usan `use:enhance`, pero mantienen `POST` y actions server-side como fallback sin JavaScript. La validación se centraliza en `src/lib/server/validation.ts`.

Las fechas de eventos se convierten desde `datetime-local` al offset `-06:00` de la sede. Las solicitudes no guardan tokens en `localStorage`; la única preferencia local del shell es el tema visual.

## Estados de interfaz

Una API no configurada, caída o con respuesta HTTP fallida no rompe el shell. Las rutas muestran estados de error o vacío y conservan la navegación y los llamados a la acción.
