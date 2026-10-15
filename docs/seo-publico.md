# SEO del sitio publico

El layout server-side consulta `/seo` por cada pagina editorial y usa un
fallback local cuando la API no esta disponible. El componente `SeoHead`
renderiza titulo, descripcion, robots, canonical, Open Graph, Twitter y el
JSON-LD `Restaurant` con datos recibidos del contenido del sitio.

El detalle de cada plato resuelve `resourceType=menu_item` por slug. Los
eventos y avisos publicados quedan disponibles para sitemap y canonical desde
la API.

`/sitemap.xml` y `/robots.txt` se sirven en SvelteKit como proxy server-side
de los feeds de la API. Si la API no esta configurada, robots conserva una
respuesta minima y sitemap responde con estado de servicio no disponible.

La configuracion sigue usando `API_BASE_URL` y `LOCATION_ID`; la URL publica
que genera los canonicals se administra en `PUBLIC_SITE_URL` de la API.
