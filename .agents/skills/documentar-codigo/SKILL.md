---
name: documentar-codigo
description: Documenta en español cada función y método (TSDoc obligatorio) en componentes Svelte 5, rutas y utilidades TypeScript, siguiendo docs/reglas-documentacion.md. Usar al documentar koffisoft_web sin cambiar comportamiento.
---

# Documentar código del sitio web

## Objetivo

Cada **declaración** de función o método en `src/` debe tener un bloque `/** ... */` en **español** inmediatamente encima. Aplica a:

- `function` / `async function` y flechas exportadas en `.ts`.
- `load`, `actions` y handlers en `+page.server.ts`, `+server.ts`, `hooks.server.ts`.
- Funciones en el `<script>` de `.svelte` (runes, handlers, derivaciones con lógica no trivial).

No documentar invocaciones, archivos solo de tipos, ni componentes UI generados sin funciones en script.

## Proceso

1. Leer `docs/reglas-documentacion.md` y el contexto del archivo.
2. Ejecutar `node scripts/audit-docs.mjs` para ver pendientes.
3. Añadir TSDoc: propósito, flujo de datos (servidor ↔ cliente) y decisiones no evidentes.
4. Documentar `$effect` o estado compartido solo cuando el ciclo o el motivo no sea claro por los tipos.
5. **No** refactorizar, renombrar, cambiar imports ni inventar funcionalidad.
6. Verificar: `pnpm lint`, `pnpm typecheck`, `pnpm test`; `pnpm test:e2e` si aplica a la ruta tocada.
7. Regenerar checklist: `node scripts/generate-checklist.mjs`.

## Formato TSDoc mínimo

```ts
/**
 * Qué resuelve en la ruta o utilidad y qué datos consume o devuelve.
 */
export const load: PageServerLoad = async ({ fetch }) => { ... }
```

## Entrega

Por archivo: ruta, resumen, secciones documentadas, confirmación de que no cambió la lógica y verificaciones.

## Auditoría

| Comando | Salida |
| --- | --- |
| `node scripts/audit-docs.mjs` | Resumen + `scripts/audit-docs-result.json` |
| `node scripts/generate-checklist.mjs` | `docs/checklist-documentacion.md` |
