# Estadísticas públicas sin cookies

El layout público registra las navegaciones mediante `fetch` con
`credentials: omit` y `keepalive`. El proxy `/analytics/page-view` vive en
SvelteKit, no expone `API_BASE_URL` al navegador y nunca reenvía cookies.

Se envían la ruta, la sede configurada, el tipo y clave del recurso cuando se
conocen, y el referer para que la API conserve solo su dominio. Las rutas de
preview se excluyen y un fallo de red no cambia la navegación ni muestra un
error al visitante.

La API filtra bots, aplica límite de tráfico y agrega los datos por día. El
contrato completo de captura y retención vive en `koffisoft_api/docs/analytics.md`.
