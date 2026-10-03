---
name: documentar-codigo
description: Documenta componentes Svelte 5, rutas y archivos TypeScript en español siguiendo docs/reglas-documentacion.md. Usar cuando se solicite documentar código de koffisoft_web sin cambiar su comportamiento.
---

# Documentar código del sitio web

1. Leer `docs/reglas-documentacion.md` y revisar el contexto del archivo antes de editarlo.
2. Identificar componentes `.svelte`, `$props()`, snippets, `$state`, `$derived`, `$effect`, `load`, form actions, `hooks.server.ts`, stores y utilidades `.ts` que realmente necesiten contexto.
3. Agregar TSDoc o comentarios de bloque en español para explicar propósito, flujo de datos y decisiones no evidentes.
4. Documentar props, validaciones, efectos externos y accesibilidad solo cuando sus restricciones no sean claras por los tipos o el markup.
5. No refactorizar, renombrar, cambiar imports, agregar dependencias ni inventar funcionalidad.
6. Ejecutar `pnpm lint`, `pnpm typecheck` y `pnpm test`; ejecutar `pnpm test:e2e` si la ruta o interacción está cubierta por Playwright.
7. Entregar por archivo la ruta, resumen, secciones documentadas, confirmación de que no cambió la lógica y el resultado de las verificaciones.
