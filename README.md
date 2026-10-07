<!-- readme-standard:v1 -->
<!-- Esta línea permite que los agentes de IA reconozcan y actualicen este README. No la borres. -->

<!-- section:header -->

# koffisoft_web

> Sitio público de Koffi-Soft para presentar la base digital de su cafetería.

[![Licencia: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![CI](https://github.com/Lenny004/koffisoft_web/actions/workflows/ci.yml/badge.svg)](https://github.com/Lenny004/koffisoft_web/actions/workflows/ci.yml)

<!-- section:toc -->

## 📑 Contenido

- [Aspectos destacados](#-aspectos-destacados)
- [Descripción](#-descripción)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Configuración](#-configuración)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Desarrollo](#-desarrollo)
- [Pruebas](#-pruebas)
- [Hoja de ruta y estado](#-hoja-de-ruta-y-estado)
- [Soporte y contribuciones](#-soporte-y-contribuciones)
- [Autores y agradecimientos](#-autores-y-agradecimientos)
- [Licencia](#-licencia)

<!-- section:highlights -->

## 🌟 Aspectos destacados

- **Base pública en SvelteKit**: Fase 0 implementada como un esqueleto funcional con una página inicial placeholder.
- **UI preparada para crecer**: usa Tailwind CSS 4 y componentes shadcn-svelte sobre Bits UI.
- **Verificación automatizada**: el CI ejecuta lint, typecheck, pruebas unitarias, build y pruebas E2E.
- **Frontera clara con la API**: las rutas públicas futuras consumirán contratos HTTP versionados sin conexiones directas a PostgreSQL.

<!-- section:overview -->

## ℹ️ Descripción

`koffisoft_web` es el sitio público de Koffi-Soft, una cafetería de la Ruta Panorámica de El Salvador. Actualmente se encuentra en Fase 0: contiene un esqueleto funcional y una página inicial placeholder; todavía no implementa funcionalidades de negocio como el catálogo, productos, promociones, reservaciones, contacto, ubicación ni páginas institucionales.

Forma parte del sistema junto con `koffisoft_api`, responsable de PostgreSQL, Prisma, autenticación, trabajos en segundo plano y contratos HTTP, y `koffisoft_admin`, el panel privado que consume esos contratos. Cuando se apruebe la fase de contratos, este sitio y el panel usarán una versión exacta del paquete privado `@koffisoft/contracts`; en Fase 0 ese paquete aún no se agrega. El legacy queda fuera de este árbol y solo sirve como referencia de migración. Este sitio no contiene PHP, credenciales ni acceso directo a PostgreSQL.

**Stack:** SvelteKit 2.70.3, Svelte 5.57.1, TypeScript 5.9.3, Vite 7.3.6, Tailwind CSS 4.3.3 con `@tailwindcss/vite` 4.3.3, shadcn-svelte 1.7.0 sobre Bits UI 2.19.5, `tailwind-variants` 3.3.1, `cn` 0.4.0, `tw-animate-css` 1.4.0, `@sveltejs/adapter-node` 5.5.7, ESLint 10.12.0, `eslint-plugin-svelte` 3.23.0, TypeScript ESLint 8.71.0, Prettier 3.9.9, `prettier-plugin-svelte` 4.1.1, Vitest 5.0.3 y Playwright 1.63.0.

<!-- section:requirements -->

## 📋 Requisitos

- Node.js `24.13.0`, fijado en `.nvmrc` y en `engines` de `package.json`.
- pnpm `11.1.3`, fijado en `packageManager` y `engines` de `package.json`.
- Chromium instalado con Playwright para ejecutar las pruebas E2E.

Las versiones directas anteriores están fijadas sin rangos en `package.json`; `pnpm-lock.yaml` fija el árbol completo de dependencias.

<!-- section:installation -->

## ⬇️ Instalación

```bash
git clone https://github.com/Lenny004/koffisoft_web.git
cd koffisoft_web
corepack enable
corepack prepare pnpm@11.1.3 --activate
pnpm install
cp .env.example .env
```

Para preparar el navegador requerido únicamente por las pruebas E2E:

```bash
pnpm exec playwright install chromium
```

<!-- section:usage -->

## 🚀 Uso

```bash
pnpm dev
```

Abre la dirección que muestre Vite. La página inicial presenta la base digital de Koffi-Soft, el estado `Fase 0 · Esqueleto funcional` y el aviso de que el menú llegará próximamente.

<!-- section:configuration -->

## ⚙️ Configuración

La tabla reproduce exactamente las dos entradas de `.env.example`. Sus valores son locales de ejemplo y no contienen secretos.

| Variable              | Descripción                                                        | Ejemplo                 | Requerida   |
| --------------------- | ------------------------------------------------------------------ | ----------------------- | ----------- |
| `PUBLIC_API_BASE_URL` | URL base de la API pública prevista para las rutas del sitio       | `http://localhost:3000` | No (Fase 0) |
| `ORIGIN`              | Origen local usado por el adaptador y los formularios de SvelteKit | `http://localhost:5173` | No (Fase 0) |

No agregues tokens, contraseñas, cookies, claves privadas ni credenciales SMTP al repositorio.

<!-- section:structure -->

## 🗂️ Estructura del proyecto

```text
.
├── .agents/
│   └── skills/                 # Recetas para agentes, incluida readme-standard
├── .github/
│   └── workflows/              # Automatización de CI
├── docs/
│   └── reglas-documentacion.md # Reglas para documentar código
├── src/
│   ├── lib/                    # Utilidades y componentes UI compartidos
│   ├── routes/                 # Ruta y layout del sitio público
│   ├── app.css                 # Tema Tailwind 4 y variables de shadcn-svelte
│   ├── app.d.ts                # Declaraciones de tipos de la aplicación
│   └── app.html                # Documento HTML base
├── tests/
│   └── home.spec.ts            # Prueba E2E de la página inicial
├── .env.example                # Variables de entorno de ejemplo
├── .nvmrc                      # Versión de Node.js
├── AGENTS.md                   # Reglas para agentes de código
├── components.json             # Configuración de shadcn-svelte
├── LICENSE                     # Licencia MIT
├── package.json                # Scripts y dependencias directas
├── pnpm-lock.yaml              # Árbol bloqueado de dependencias
├── playwright.config.ts        # Configuración de Playwright
├── pnpm-workspace.yaml         # Configuración del workspace de pnpm
├── svelte.config.js            # Configuración de SvelteKit
├── tsconfig.json               # Configuración de TypeScript
├── vite.config.ts              # Configuración de Vite
└── vitest.config.ts            # Configuración de Vitest
```

Las pruebas unitarias viven junto al código en `src/**/*.test.ts`; las pruebas E2E se agrupan en `tests/`. Los componentes UI compartidos se ubican en `src/lib/components/ui/`.

<!-- section:development -->

## 🛠️ Desarrollo

Los scripts disponibles en `package.json` son:

```bash
pnpm dev
pnpm build
pnpm preview
pnpm start
pnpm check
pnpm typecheck
pnpm lint
pnpm format
```

- `pnpm dev`: inicia el servidor de desarrollo.
- `pnpm build`: genera el build de producción para `adapter-node`.
- `pnpm preview`: sirve el build localmente.
- `pnpm start`: inicia el build ya generado; ejecuta `pnpm build` antes.
- `pnpm check`: sincroniza SvelteKit y ejecuta `svelte-check` en modo estricto.
- `pnpm typecheck`: ejecuta el script `check`.
- `pnpm lint`: ejecuta ESLint sin advertencias y comprueba el formato con Prettier.
- `pnpm format`: aplica Prettier.

Las funciones `load` y las acciones de formulario deben vivir junto a su ruta (`+page.ts`, `+page.server.ts` o `+layout.server.ts`) y consumir la API mediante contratos, sin acceso directo a PostgreSQL. Las reglas de documentación están en [docs/reglas-documentacion.md](docs/reglas-documentacion.md).

<!-- section:testing -->

## ✅ Pruebas

```bash
pnpm test
pnpm test:unit
pnpm test:e2e
pnpm test:e2e:ui
```

- `pnpm test` y `pnpm test:unit`: ejecutan las pruebas unitarias de `src/**/*.test.ts` con Vitest.
- `pnpm test:e2e`: ejecuta las pruebas de `tests/` con Playwright y Chromium.
- `pnpm test:e2e:ui`: abre la interfaz de Playwright para las pruebas E2E.

El workflow de [CI](.github/workflows/ci.yml) ejecuta lint, typecheck, pruebas unitarias, build y pruebas E2E.

<!-- section:roadmap -->

## 🗺️ Hoja de ruta y estado

El estado actual es Fase 0, un esqueleto funcional del sitio público.

- [ ] Implementar el alcance público planificado: catálogo, productos, promociones, reservaciones, contacto, ubicación y páginas institucionales.
- [ ] Incorporar contratos HTTP versionados y conectar las rutas públicas cuando se apruebe la fase de contratos.

<!-- section:contributing -->

## 💡 Soporte y contribuciones

Reporta errores o propone cambios mediante issues y pull requests en el [repositorio de GitHub](https://github.com/Lenny004/koffisoft_web).

Usa Conventional Commits con gitmoji, por ejemplo `✨ feat(web): agrega portada pública`, `🐛 fix(web): corrige navegación de catálogo`, `📝 docs: actualiza instalación` o `🔧 config: ajusta CI`. Mantén cada commit grande y coherente con una intención revisable; no mezcles una funcionalidad con cambios no relacionados.

La rama `main` recibe cambios revisados mediante pull request. El dueño crea y publica las ramas de trabajo. Los agentes no crean ramas, no hacen commits ni hacen push sin aprobación explícita de Lenny004.

<!-- section:authors -->

## ✍️ Autores y agradecimientos

- [Lenny004 (LENNYX 004)](https://github.com/Lenny004) — desarrollador

<!-- section:license -->

## 📄 Licencia

MIT. Ver [LICENSE](LICENSE).
