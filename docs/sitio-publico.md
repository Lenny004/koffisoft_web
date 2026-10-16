# Contenido editable del sitio público

El layout raíz consulta `GET /site?locationId=LOCATION_ID` desde el servidor. Si la API no está configurada o falla, conserva el contenido editorial de respaldo y marca `siteContentSource` como `fallback`; no se muestran enlaces sociales inventados.

El contenido remoto alimenta el hero de la portada, la página Nosotros, contacto, ubicación, reservas y el pie de página. La dirección se compone con los campos de sede y los horarios se presentan agrupados por día.

El mapper `src/lib/api/mappers.ts` mantiene la frontera entre el contrato HTTP y el modelo visual. La prueba `src/lib/api/site-mapper.test.ts` verifica que perfil, contacto, horario y redes se traduzcan correctamente.
