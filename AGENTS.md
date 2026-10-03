# Reglas para agentes de código

Estas reglas aplican a Codex, Cursor, Claude y cualquier otro agente que modifique `koffisoft_web`.

## Alcance y arquitectura

- Este repositorio es el sitio público de Koffi-Soft y usa SvelteKit 2, Svelte 5, TypeScript estricto, Tailwind CSS 4 y shadcn-svelte sobre Bits UI.
- El código vive en `src/`; los componentes visuales compartidos se ubican en `src/lib/components/ui/` y las rutas en `src/routes/`.
- Las rutas pueden usar `load` functions, form actions y `hooks.server.ts`, pero no deben abrir conexiones a PostgreSQL ni duplicar la API.
- La API fuente es `koffisoft_api`; los contratos HTTP versionados son la frontera entre repositorios.
- Cuando la fase de contratos esté aprobada, el frontend usará una versión exacta de `@koffisoft/contracts`; Fase 0 no inventa contratos.
- No inventar funcionalidades de negocio, endpoints, permisos ni datos del legacy durante la Fase 0.

## Documentación

Leer [docs/reglas-documentacion.md](docs/reglas-documentacion.md) antes de documentar código. Los comentarios deben estar en español y explicar propósito, flujo de datos y decisiones no evidentes. Las skills de `.agents/skills/` contienen recetas concretas para este stack.

## Límites y seguridad

- No modificar `D:\Lenny\Projects\Koffi-Soft` ni copiar código PHP, credenciales, hashes, tokens o dumps del legacy.
- No guardar secretos en código, fixtures, logs, `README.md`, `.env.example` ni archivos versionados.
- No almacenar sesiones o tokens de autenticación en `localStorage`; la política aprobada usa cookies HttpOnly gestionadas por la API.
- No agregar dependencias o endpoints sin justificar su necesidad en el cambio.

## Verificación obligatoria

Antes de terminar cualquier cambio, deben pasar:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Si se modifica una ruta o interacción, ejecutar además `pnpm test:e2e` después de instalar Chromium con Playwright.

## Commits y control del repositorio

Usar gitmoji con Conventional Commits: `✨ feat`, `🐛 fix`, `♻️ refactor`, `📝 docs`, `🔧 config`, `✅ tests`, `🔒️ seguridad` y `🗃️ base de datos`. Preferir commits grandes, coherentes y fáciles de revisar.

El agente **NUNCA crea ramas, hace commits ni hace push** sin aprobación explícita del dueño. Debe dejar los cambios sin commitear para revisión.
