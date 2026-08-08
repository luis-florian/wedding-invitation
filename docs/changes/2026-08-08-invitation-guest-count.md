# Conteo de invitados en invitacion - 2026-08-08

## Contexto

Se agrego una mejora visual en la invitacion publica para mostrar claramente para cuantas personas aplica cada invitacion.

## Cambios en invitacion publica

- Se agrego el texto **Invitacion para: N personas** en la seccion de confirmacion.
- El conteo se calcula como invitado principal mas sub invitados.
- Si la invitacion es para una sola persona, el texto usa singular: **persona**.
- Si la invitacion incluye sub invitados, el texto usa plural: **personas**.
- El bloque se ubico debajo del saludo del invitado y antes del texto introductorio de confirmacion.

## Cambios tecnicos

- El conteo se calcula en `RsvpSection` usando la cantidad de `companions` ya cargada para la invitacion.
- No se agregaron campos nuevos en base de datos.
- No se crearon migraciones.

## Verificacion realizada

- `npm run lint`
- `npm run typecheck`
