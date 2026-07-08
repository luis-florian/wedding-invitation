# Wedding Invitation RSVP - Modelo de datos y seguridad

## 1. Principios

- PostgreSQL en Neon como base de datos persistente.
- Un solo proyecto de boda en el MVP.
- Invitados identificados por un token unico y dificil de adivinar.
- Invitados sin cuenta ni sesion.
- Sub invitados asociados a un invitado principal, sin token propio.
- Administrador protegido por login.
- Administradores con visibilidad compartida y edicion limitada a invitados de su lado.
- Confirmacion editable desde el mismo enlace.
- Fechas almacenadas como `timestamptz` en UTC.
- Validaciones importantes en interfaz y base de datos.

## 2. Relaciones

```txt
wedding
  -> admin_users
  -> wedding_events
  -> guests
       -> guest_companions
       -> rsvp status por persona
```

El MVP puede operar con una sola fila en `weddings`, pero conservar la tabla hace mas facil evolucionar hacia multiples bodas en el futuro.

## 3. Tablas

### `weddings`

| Campo | Tipo | Regla |
| --- | --- | --- |
| `id` | uuid | PK |
| `couple_names` | text | obligatorio |
| `wedding_date` | timestamptz | obligatorio |
| `hero_image_url` | text | opcional |
| `intro_message` | text | opcional |
| `final_message` | text | opcional |
| `created_at` | timestamptz | automatico |
| `updated_at` | timestamptz | automatico |

Para el MVP se puede crear una boda inicial por migracion o seed.

### `admin_users`

Representa usuarios con acceso al panel administrativo.

| Campo | Tipo | Regla |
| --- | --- | --- |
| `id` | uuid | PK |
| `email` | text | unico, obligatorio |
| `name` | text | obligatorio |
| `password_hash` | text | obligatorio |
| `side` | text | `groom` o `bride` |
| `created_at` | timestamptz | automatico |
| `updated_at` | timestamptz | automatico |

Reglas:

- todos los administradores pueden ver todos los invitados;
- un administrador solo puede crear, editar o eliminar invitados de su `side`;
- la configuracion general de boda puede quedar disponible para ambos lados en el MVP.

### `wedding_events`

Representa ceremonia, recepcion u otro bloque de evento.

| Campo | Tipo | Regla |
| --- | --- | --- |
| `id` | uuid | PK |
| `wedding_id` | uuid | FK a `weddings.id`, obligatorio |
| `name` | text | obligatorio |
| `starts_at` | timestamptz | obligatorio |
| `ends_at` | timestamptz | opcional |
| `address` | text | obligatorio |
| `description` | text | opcional |
| `notes` | text | opcional |
| `google_maps_url` | text | opcional |
| `waze_url` | text | opcional |
| `sort_order` | integer | orden visual |
| `created_at` | timestamptz | automatico |
| `updated_at` | timestamptz | automatico |

Inicialmente se crean dos eventos: ceremonia y recepcion.

### `guests`

| Campo | Tipo | Regla |
| --- | --- | --- |
| `id` | uuid | PK |
| `wedding_id` | uuid | FK a `weddings.id`, obligatorio |
| `name` | text | obligatorio |
| `phone` | text | opcional |
| `owner_side` | text | `groom` o `bride`, obligatorio |
| `token` | text | unico, obligatorio |
| `status` | text | `pending`, `confirmed`, `declined` |
| `responded_at` | timestamptz | opcional |
| `created_at` | timestamptz | automatico |
| `updated_at` | timestamptz | automatico |

Restricciones:

- `token` unico globalmente;
- `owner_side` limitado por `check`;
- `status` limitado por `check`;
- `responded_at` se actualiza cuando el invitado confirma o cambia su respuesta;
- nombre no vacio;
- telefono con longitud razonable si se captura.

### `guest_companions`

Representa sub invitados asociados a un invitado principal. No tienen enlace propio.

| Campo | Tipo | Regla |
| --- | --- | --- |
| `id` | uuid | PK |
| `guest_id` | uuid | FK a `guests.id`, obligatorio |
| `name` | text | obligatorio |
| `status` | text | `pending`, `confirmed`, `declined` |
| `responded_at` | timestamptz | opcional |
| `sort_order` | integer | orden visual |
| `created_at` | timestamptz | automatico |
| `updated_at` | timestamptz | automatico |

Restricciones:

- `status` limitado por `check`;
- nombre no vacio;
- al eliminar un invitado principal se eliminan sus sub invitados;
- no se permiten sub invitados sin invitado principal.

## 4. Estados de asistencia

```txt
pending    -> aun no responde
confirmed  -> asistira
declined   -> no asistira
```

La respuesta publica puede cambiar entre `pending`, `confirmed` y `declined` desde el mismo enlace. El invitado principal puede actualizar su propio estado y el de sus sub invitados. Cada cambio actualiza `responded_at` en la fila correspondiente.

## 5. Seguridad del token publico

- El token se genera en servidor usando aleatoriedad criptografica.
- Longitud recomendada: al menos 128 bits de entropia representados en formato URL-safe.
- El token no debe ser secuencial ni derivarse del nombre o telefono.
- Las URLs con token se tratan como informacion sensible.
- No registrar tokens completos en logs de produccion.
- Token invalido o inexistente muestra un mensaje generico, sin revelar si hubo invitados similares.

## 6. Autenticacion administrativa

El panel `/admin` requiere sesion de administrador. Cada sesion conoce el `admin_user.id` y su `side`.

Para el MVP se contemplan al menos dos usuarios administrativos, uno para el lado del novio y otro para el lado de la novia:

- email y contrasena configurados para produccion;
- contrasena almacenada como hash, nunca en texto plano;
- cookie de sesion `HttpOnly`, `Secure` y `SameSite=Lax`;
- cierre de sesion disponible desde el panel.

Si despues se necesitan roles mas finos, se puede agregar un campo `role` o usar un proveedor de autenticacion administrado.

## 7. Reglas de acceso

### Invitado

Puede leer solamente la invitacion asociada a su token y actualizar el estado de asistencia de ese invitado principal y sus sub invitados.

No puede:

- listar invitados;
- ver telefonos de otros invitados;
- editar informacion de boda;
- agregar o eliminar sub invitados si el MVP mantiene esa gestion solo en admin;
- modificar invitados que no pertenecen a su token.

### Administrador

Puede:

- leer y modificar la boda;
- leer y modificar eventos;
- leer todos los invitados y sub invitados;
- filtrar por `Todos`, `Invitados novio` e `Invitados novia`;
- crear, editar y eliminar invitados solo cuando `guests.owner_side = admin_users.side`;
- crear, editar y eliminar sub invitados solo cuando su invitado principal pertenece al mismo lado;
- cambiar manualmente el estado de invitados y sub invitados de su propio lado.

## 8. Validacion e integridad

- Campos obligatorios validados en UI y base de datos.
- URLs de mapas deben ser URLs validas si se capturan.
- Limites razonables: nombre `160`, telefono `40`, mensajes `2000`, direccion `500`, notas `1000`.
- Las operaciones de respuesta deben ser atomicas para guardar el estado del invitado principal y sus sub invitados en conjunto.
- La actualizacion publica debe verificar el token del invitado principal antes de modificar cualquier sub invitado.
- Las operaciones administrativas de escritura deben verificar el `owner_side` contra el lado del administrador autenticado en servidor, no solo en la interfaz.
- Si dos cambios llegan casi al mismo tiempo, gana el ultimo guardado y se refleja en `updated_at`.
- Los errores tecnicos se traducen a mensajes simples para el usuario.

## 9. Proteccion operativa

- HTTPS obligatorio en produccion.
- Secretos solo en variables de entorno del servidor.
- No exponer `DATABASE_URL` al navegador.
- Backups y ramas de Neon separados para desarrollo y produccion.
- Migraciones versionadas.
- Revisar que el build no incluya credenciales.
- Probar token invalido, cambio de respuesta, cambios de sub invitados y acceso admin sin sesion antes de publicar.
