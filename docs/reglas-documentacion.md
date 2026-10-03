# Reglas de documentación de código

Estas reglas adaptan el espíritu de `reglas-documentacion-tsx.md` al sitio SvelteKit de Koffi-Soft.

## Propósito

Documentar en español la responsabilidad de componentes `.svelte`, rutas y archivos TypeScript sin cambiar lógica, comportamiento, arquitectura ni contratos. La documentación debe aclarar el propósito, el flujo de datos y las decisiones que no sean evidentes al leer el código.

## Reglas generales

1. No cambiar la lógica de negocio, comportamiento, firmas, imports, props ni estructura para documentar.
2. Conservar documentación correcta y mantener el estilo del archivo.
3. Explicar decisiones y restricciones, no repetir literalmente nombres ni describir cada línea.
4. No inventar rutas, estados, validaciones, efectos secundarios, endpoints o capacidades inexistentes.
5. Usar comentarios en español, breves y cercanos al código que explican.
6. No modificar el legacy ni copiar sus secretos o datos sensibles.
7. Agregar dependencias o cambiar configuración solo si la tarea lo solicita explícitamente.

## Componentes Svelte 5

Documentar componentes no triviales con TSDoc o un comentario de bloque antes de la declaración cuando aporte contexto sobre:

- responsabilidad y lugar de uso;
- props tipadas recibidas mediante `$props()`;
- snippets renderizados y su contrato;
- efectos relevantes y relación con otros componentes;
- decisiones de accesibilidad o interacción que no sean obvias.

Cuando se use `$state`, `$derived` o `$effect`, explicar únicamente el motivo del estado o efecto si no se deduce del código. No comentar asignaciones o renderizado evidente.

## Rutas y servidor

Documentar `load` functions, `form actions`, `hooks.server.ts` y archivos `.server.ts` cuando aclaren:

- qué datos consultan o transforman;
- qué datos se envían a la API;
- validaciones, estados de carga y errores;
- motivo de una cookie, redirección, guard o decisión de caché;
- límites entre código de navegador y código solo servidor.

No escribir secretos ni valores reales en comentarios, ejemplos o fixtures.

## Formularios y UI

Documentar validaciones relevantes, valores iniciales, transformaciones antes del envío, manejo de errores y comportamiento después de guardar o cancelar. Para componentes shadcn-svelte, documentar personalizaciones de estilo o accesibilidad que no sean parte de la implementación estándar.

## Stores y utilidades `.ts`

Documentar stores, funciones de composición y utilidades cuando administren estado compartido, coordinen efectos o transformen datos de la API. Explicar la forma del dato y el ciclo de vida solo cuando no sea evidente por los tipos.

## Proceso y entrega

1. Leer el archivo y su contexto antes de comentar.
2. Conservar comentarios correctos y agregar solo los necesarios.
3. Verificar que no cambió la lógica con `pnpm lint`, `pnpm typecheck` y `pnpm test`.
4. Si se documenta una ruta, ejecutar también `pnpm test:e2e` cuando sea aplicable.

En la entrega informar por archivo modificado: ruta, resumen de lo documentado, componentes o secciones afectados, confirmación de que no se cambió la lógica y verificaciones ejecutadas. Si un archivo no requiere cambios, indicarlo.
