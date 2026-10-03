---
name: crear-ruta-sveltekit
description: Crea una ruta pública de SvelteKit 2 con load function, form actions opcionales y componente Svelte 5 tipado. Usar cuando se agregue una página o flujo del sitio público.
---

# Crear una ruta SvelteKit

1. Confirmar que la ruta está en el alcance del sitio público y que el contrato necesario pertenece a `koffisoft_api`.
2. Crear la carpeta bajo `src/routes/` con `+page.svelte`; añadir `+page.ts` para `load` universal o `+page.server.ts` para datos y acciones solo servidor.
3. Tipar las funciones con los tipos generados por SvelteKit (`PageLoad`, `PageServerLoad` y `Actions` desde `./$types`) y validar entradas antes de llamar a la API.
4. En el componente usar Svelte 5: `let { data } = $props()` y runes solo cuando el estado sea reactivo; mantener props, snippets y estados de error explícitos.
5. Consumir `PUBLIC_API_BASE_URL` o un cliente de contratos; no acceder a PostgreSQL ni copiar DTOs internos.
6. Agregar estados de carga, error y vacío que estén respaldados por el contrato real. No inventar reglas de negocio.
7. Ejecutar `pnpm lint`, `pnpm typecheck`, `pnpm test` y `pnpm build`; añadir o actualizar una prueba en `tests/` si la ruta tiene interacción visible.
