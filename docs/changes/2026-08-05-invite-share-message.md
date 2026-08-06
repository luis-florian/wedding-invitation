# Mensaje para compartir invitacion - 2026-08-05

## Contexto

Se agrego una mejora administrativa para copiar un mensaje completo de invitacion junto con el link unico de cada invitado.

El cambio se desarrollo y probo primero en Neon development. Luego se aplico la migracion correspondiente en Neon production.

## Cambios en base de datos

- Se agrego el campo `invite_message` en la tabla `weddings`.
- El campo `invite_message` es texto nullable.
- Si el campo esta vacio, la aplicacion usa un mensaje predeterminado en el boton de copiar mensaje.

## Cambios en admin

- En la pantalla **Boda** se agrego el campo **Mensaje para compartir invitacion**.
- El mensaje se puede editar desde `/admin/wedding`.
- En la tabla de invitados, la columna **Link** paso a funcionar como **Compartir**.
- En esa columna se mantienen dos acciones:
  - **Copiar**: copia solo el link de invitacion.
  - **Mensaje**: copia el mensaje de invitacion mas el link unico del invitado.
- En la pantalla de edicion de invitado tambien se agrego el boton **Mensaje** junto al boton de copiar link.
- El mensaje copiado incluye automaticamente la seccion:

```txt
Tu invitacion:
https://...
```

## Mensaje predeterminado

```txt
Hola... 🤍

Con mucho amor y mucha ilusion, queremos decirte que estas cordialmente invitado a nuestra boda. Sera un gran placer compartir este hermoso momento juntos.

Con mucho carino,
Nathaly y Luis.
```

## Migracion

- `0003_gorgeous_king_cobra.sql`: agrega `weddings.invite_message`.

## Produccion

- Se creo backup local JSON antes de aplicar la migracion en production.
- Backup creado en:
  `/Volumes/SSD Kingston KC3000/dev/projects/wedding-invitation-prod-backups/prod-backup-before-invite-message-2026-08-06T00-55-08-340Z.json`
- Se aplico la migracion `0003_gorgeous_king_cobra.sql` en Neon production.
- Se verifico que Drizzle registrara 4 migraciones en production.

## Verificacion realizada

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
