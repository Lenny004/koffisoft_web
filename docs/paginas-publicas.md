# Páginas públicas

Este documento describe el primer bloque público de `koffisoft_web` y su frontera con `koffisoft_api`.

## Configuración

Las rutas server-only leen estas variables desde `$env/dynamic/private`:

- `API_BASE_URL`: URL base de `koffisoft_api`.
- `LOCATION_ID`: UUID de la sede pública. Es obligatorio porque la API calcula precios y disponibilidad por sede.
- `ORIGIN`: origen local de SvelteKit para formularios y `adapter-node`.

`LOCATION_ID` debe reemplazarse por el UUID real de una sede activa en el entorno desplegado. El placeholder de `.env.example` no es un dato de producción.

## Rutas

| Ruta            | Datos                                                     | Interacción                                                |
| --------------- | --------------------------------------------------------- | ---------------------------------------------------------- |
| `/`             | Destacados derivados de `GET /menu`                       | Enlaces a carta, reservas y eventos                        |
| `/carta`        | Carta agrupada desde `GET /menu`                          | Filtros `category` y `allergen` por query params           |
| `/carta/[slug]` | Detalle desde `GET /menu/items/{slug}`                    | Navegación a la carta                                      |
| `/reservas`     | Consulta bajo demanda de `GET /reservations/availability` | Acciones `availability` y `default` para solicitar reserva |
| `/eventos`      | Catálogo desde `GET /events/catalog`                      | Acción `default` para solicitar cotización                 |

## Frontera de datos

El cliente de API vive en `src/lib/server/api/client.ts`, importa la configuración privada y nunca se importa desde componentes de navegador. Las funciones `load` y las form actions son responsables de llamar a ese cliente.

Las respuestas se tipan en `src/lib/api/types.ts` a partir de los DTOs públicos revisados en `koffisoft_api`. Los errores de red, timeout, configuración y estados HTTP se convierten en mensajes amigables; no se generan ítems de menú, precios, espacios ni paquetes ficticios.

La API no publica precios de paquetes de eventos, por lo que `/eventos` muestra capacidades y descripciones públicas y deja la cotización para el formulario. Las solicitudes públicas se crean con `source = web` y los estados iniciales los decide la API.

## Formularios

Las páginas `/reservas` y `/eventos` usan `use:enhance`, pero cada formulario conserva el método `POST` y sus acciones server-side como fallback. La validación de campos obligatorios, rangos, correo, fechas y tipos de evento ocurre antes de llamar a la API.

Las fechas de eventos se convierten desde `datetime-local` al offset `-06:00` de `America/El_Salvador`, tal como exige el contrato público. La consulta de reservas conserva `date` y `time` locales separados.

## Estados de interfaz

Una API no configurada, caída, lenta o con respuesta HTTP fallida no rompe la página. Las rutas muestran un estado vacío o un aviso de error y mantienen disponibles la navegación y los llamados a la acción.
