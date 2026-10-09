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

Al crear o modificar CSS o estilos, aplica la skill `css-bem-estandar`.

Leer [docs/reglas-documentacion.md](docs/reglas-documentacion.md) antes de documentar código. Los comentarios deben estar en español y explicar propósito, flujo de datos y decisiones no evidentes. Las skills de `.agents/skills/` contienen recetas concretas para este stack.

Cuando cambies dependencias, scripts, variables de entorno, estructura de carpetas o funcionalidades, aplica el estándar `readme-standard` (`.agents/skills/readme-standard/SKILL.md`) en modo Actualizar sobre `README.md`. Edita solo las secciones afectadas; no reescribas el archivo.

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

## Regla permanente de componentes y formularios

- Usar siempre los componentes base de `src/lib/components/ui/`: `Button`, `Dialog`, `Card`, `Table`, `Badge`, `Alert` y `FormField`. No crear variantes ad hoc de botones, modales, tarjetas, tablas o estados.
- Cada campo debe tener placeholder de ejemplo en español, tipo/inputmode/autocomplete correcto, límites de `src/lib/validation/limits.ts` alineados con la API, validación visible junto al campo y `maxlength`, `min`, `max`, `step` o `pattern` cuando aplique.
- Los campos obligatorios deben usar `FormField` con `required`, mostrar `*` en la etiqueta y presentar la leyenda `* Campo obligatorio` en cada formulario.
- Los modales deben usar la estructura base: header con título y cierre, body con scroll, footer alineado a la derecha con cancelar en `outline` y confirmar en `primary` o `destructive`; no usar colores o radios hardcodeados.

Usar gitmoji con Conventional Commits: `✨ feat`, `🐛 fix`, `♻️ refactor`, `📝 docs`, `🔧 config`, `✅ tests`, `🔒️ seguridad` y `🗃️ base de datos`. Preferir commits grandes, coherentes y fáciles de revisar.

El agente **NUNCA crea ramas, hace commits ni hace push** sin aprobación explícita del dueño. Debe dejar los cambios sin commitear para revisión.
