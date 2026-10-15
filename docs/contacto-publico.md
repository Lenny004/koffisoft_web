# Formulario publico de contacto

La ruta `/contacto` valida nombre, correo, telefono y mensaje en el servidor
de SvelteKit y entrega el formulario a `POST /contact` usando el cliente
server-only. La sede se agrega desde `LOCATION_ID`; no se guarda estado del
formulario en cookies ni en el navegador.

El campo honeypot `website` queda oculto para personas y ayuda a descartar
automatizaciones. La API aplica ademas limite por IP y sede y deduplicacion
de mensajes recientes.

Los campos obligatorios se marcan con `*`, se muestra la leyenda del
formulario y los atributos `minlength`, `maxlength` y `placeholder` reflejan
los limites del contrato. La respuesta de exito confirma recepcion; los
errores de API se muestran sin exponer secretos ni detalles internos.
