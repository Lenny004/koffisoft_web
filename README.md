# koffisoft_web

Sitio público de Koffi-Soft, la cafetería. Este repositorio contiene únicamente la experiencia web pública: inicio, catálogo, productos, promociones, reservaciones, contacto, ubicación y páginas institucionales. La base implementada corresponde a la Fase 0 del plan; todavía no incluye funcionalidades de negocio.

## Relación con los otros repositorios

- `koffisoft_api` es dueño de PostgreSQL, Prisma, la autenticación, los trabajos en segundo plano y los contratos HTTP.
- `koffisoft_admin` es el panel privado y consume los contratos publicados por la API.
- En la fase de contratos, ambos frontends consumirán una versión exacta del paquete privado `@koffisoft/contracts`; en Fase 0 aún no se agrega ese paquete.
- `koffisoft_web` consume esos mismos contratos cuando se incorporen las rutas públicas; nunca contiene PHP, credenciales ni acceso directo a PostgreSQL.
- El legacy en `D:\Lenny\Projects\Koffi-Soft` es solo referencia de migración y no forma parte del árbol de este repositorio.

## Stack fijado

- Node.js `24.13.0` y pnpm `11.1.3`.
- SvelteKit `2.70.3`, Svelte `5.57.1`, TypeScript `5.9.3` y Vite `7.3.6`.
- Tailwind CSS `4.3.3` con `@tailwindcss/vite` `4.3.3`.
- shadcn-svelte `1.7.0` sobre Bits UI `2.19.5`, `tailwind-variants` `3.3.1`, `cn` `0.4.0` y `tw-animate-css` `1.4.0`.
- Adaptador Node `@sveltejs/adapter-node` `5.5.7`.
- ESLint `10.12.0`, `eslint-plugin-svelte` `3.23.0`, TypeScript ESLint `8.71.0`, Prettier `3.9.9` y `prettier-plugin-svelte` `4.1.1`.
- Vitest `5.0.3` y Playwright `1.63.0`.

Las versiones anteriores son dependencias directas y están fijadas sin rangos en `package.json`; `pnpm-lock.yaml` fija el árbol completo.

## Requisitos e instalación

1. Instalar Node.js `24.13.0` y pnpm `11.1.3`.
2. Copiar `.env.example` a `.env` y ajustar solo los valores locales.
3. Instalar dependencias:

   ```bash
   pnpm install
   ```

4. Para el navegador de Playwright, ejecutar una vez:

   ```bash
   pnpm exec playwright install chromium
   ```

## Variables de entorno

`.env.example` no contiene secretos. Las variables actuales son:

- `PUBLIC_API_BASE_URL`: URL base de la API cuando se conecte el sitio.
- `ORIGIN`: origen local usado por el adaptador y los formularios de SvelteKit.

No agregar tokens, contraseñas, cookies, claves privadas ni credenciales SMTP al repositorio.

## Scripts

- `pnpm dev`: servidor de desarrollo.
- `pnpm build`: build de producción para `adapter-node`.
- `pnpm preview`: sirve el build localmente.
- `pnpm start`: arranca `build` después de compilar.
- `pnpm lint`: ejecuta ESLint y comprueba el formato de Prettier.
- `pnpm format`: aplica Prettier.
- `pnpm typecheck`: ejecuta `svelte-check` en modo estricto.
- `pnpm test`: ejecuta pruebas unitarias con Vitest.
- `pnpm test:e2e`: ejecuta la prueba mínima de Playwright.

## Estructura

```text
src/
  lib/
    components/ui/       # componentes base compatibles con shadcn-svelte
    utils.ts             # utilidades compartidas de UI
  routes/                # rutas, layouts y load functions de SvelteKit
  app.css               # tema Tailwind 4 y variables de shadcn-svelte
tests/                   # pruebas E2E de Playwright
docs/                    # reglas de documentación del repositorio
.agents/skills/          # recetas para agentes de código
.github/workflows/       # CI
```

Las funciones `load` y las acciones de formulario deben vivir junto a su ruta (`+page.ts`, `+page.server.ts` o `+layout.server.ts`) y consumir la API mediante contratos, no mediante acceso a base de datos.

## Commits y ramas

Usar commits convencionales con gitmoji, por ejemplo `✨ feat(web): agrega portada pública`, `🐛 fix(web): corrige navegación de catálogo`, `📝 docs: actualiza instalación` o `🔧 config: ajusta CI`. Mantener cada commit grande y coherente con una intención revisable; no mezclar una funcionalidad con cambios no relacionados.

La rama `main` debe recibir cambios revisados mediante pull request. El dueño crea y publica las ramas de trabajo. Los agentes no crean ramas, no hacen commits y no hacen push sin aprobación explícita de Lenny004.
