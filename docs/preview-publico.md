# Vista previa publica aislada

La ruta `/preview/:token` solo consume enlaces opacos emitidos por el panel.
La API guarda un hash SHA-256 del token, lo vence en 15 minutos y lo elimina
al primer consumo exitoso. La respuesta contiene campos comerciales seguros
del aviso, plato o evento; no incluye contactos, notas internas ni
identificadores arbitrarios enviados por el cliente.

La pagina agrega `meta[name="robots"]` y el servidor devuelve `X-Robots-Tag`
con `noindex, nofollow, noarchive`, ademas de `Cache-Control: no-store`. Los
errores de token vencido o reutilizado responden como 404.

El contenido normal de `/avisos`, `/carta` y los eventos publicados llega por
los endpoints publicos de la API. Estos endpoints, junto con `sitemap.xml`,
solo consideran publicaciones vigentes en la zona horaria de El Salvador.

## Verificacion

```bash
pnpm lint
pnpm check
pnpm test
pnpm build
```
