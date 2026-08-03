# Cambios admin y backend - 2026-08-03

## Contexto

Se trabajo en el ambiente de desarrollo conectado a Neon development. No se aplicaron cambios a produccion durante esta tanda.

Tambien se creo y uso el ambiente de desarrollo en Neon para probar migraciones y funcionalidad antes de llevar cambios a produccion.

## Cambios en base de datos

- Se agrego el campo `invitation_sent` en la tabla `guests` para marcar si la invitacion ya fue enviada.
- El campo `invitation_sent` es booleano, no nullable, con valor default `false`.
- Se agrego la tabla `admin_notes` para notas internas del novio y la novia.
- `admin_notes.side` es unico, para garantizar una sola nota por lado (`groom` y `bride`).

## Cambios en admin

- Se agrego la columna **Enviada** como primera columna de la tabla de invitados.
- El check de **Enviada** solo se puede editar en invitados principales.
- Los sub invitados muestran el estado de envio de su invitado principal, pero no son editables.
- Se agrego filtro por invitacion enviada: todas, enviadas y no enviadas.
- Se agrego boton **Limpiar** en los filtros de invitados.
- La busqueda de invitados ahora ignora tildes, mayusculas y espacios repetidos.
- El menu movil ahora se cierra al seleccionar una opcion.
- Se corrigio el zoom automatico de inputs en iPhone ajustando campos admin a 16px.
- Al guardar cambios de invitado principal se muestra mensaje de confirmacion.
- Al guardar o agregar sub invitados se muestra mensaje de confirmacion.
- Se corrigio que el estado visual quedara viejo despues de guardar invitado o sub invitado.
- El dashboard ahora tiene metricas clickeables que llevan a la lista de invitados con filtros aplicados.
- Se agregaron metricas de invitaciones enviadas y no enviadas en dashboard.
- Se agrego validacion suave de duplicados al crear invitados.
- Si se detecta un invitado duplicado, el admin puede ver el registro existente o agregarlo de todos modos.
- Al convertir un invitado existente en sub invitado, la lista excluye candidatos no convenientes, como el invitado actual, invitados con sub invitados y nombres que ya existen como sub invitados del registro.

## Nueva seccion de notas

- Se agrego la seccion **Notas** al menu administrativo.
- Ruta nueva: `/admin/notes`.
- Novio y novia pueden ver ambas notas.
- Cada usuario solo puede editar la nota de su lado.
- Se muestra mensaje de confirmacion al guardar una nota.

## Cambios en invitacion publica

- Cambio manual registrado: se elimino la palabra "acompanante" de la invitacion para mostrar solo el nombre de los acompanantes.

## Migraciones

- `0001_wide_sir_ram.sql`: agrega `guests.invitation_sent`.
- `0002_cuddly_gambit.sql`: agrega `admin_notes`.

## Verificacion realizada

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
