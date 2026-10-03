---
name: agregar-componente-shadcn
description: Agrega componentes shadcn-svelte 1.7.0 sobre Bits UI y Tailwind CSS 4 al sitio público. Usar cuando se necesite un componente de interfaz reutilizable.
---

# Agregar un componente shadcn-svelte

1. Revisar `components.json`, `src/app.css` y `src/lib/utils.ts`; conservar el estilo `new-york`, el alias `$lib/components/ui` y el tema Tailwind 4.
2. Ejecutar el CLI fijado para el componente necesario, por ejemplo `pnpm dlx shadcn-svelte@1.7.0 add button`.
3. Revisar los archivos generados bajo `src/lib/components/ui/<componente>/`; no sobrescribirlos con una abstracción propia sin una razón documentada.
4. Importar desde el `index.js` del componente y escribir props tipadas o snippets Svelte 5 según la API generada.
5. Mantener accesibilidad, estados de foco y semántica; documentar únicamente las personalizaciones no evidentes.
6. Ejecutar `pnpm format`, `pnpm lint`, `pnpm typecheck`, `pnpm test` y `pnpm build`.
