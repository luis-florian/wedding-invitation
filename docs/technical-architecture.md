# Wedding Invitation RSVP - Arquitectura y decisiones tecnicas

## 1. Arquitectura

```txt
Next.js + TypeScript (Vercel)
  -> rutas publicas de invitacion
  -> rutas protegidas de admin
  -> Server Actions / Route Handlers
  -> permisos por lado novio/novia
  -> Drizzle ORM
  -> Neon PostgreSQL
```

El MVP no necesita un backend separado. Next.js cubre frontend, rutas server-side, acciones administrativas y endpoint de confirmacion. La base de datos conserva la persistencia y las restricciones importantes.

## 2. Stack propuesto

| Area | Decision |
| --- | --- |
| Framework | Next.js App Router |
| Lenguaje | TypeScript |
| UI | React |
| Estilos | CSS Modules o Tailwind CSS |
| Formularios | React Hook Form + Zod |
| Base de datos | Neon PostgreSQL |
| ORM / migraciones | Drizzle ORM |
| Hosting | Vercel |
| Imagenes | Next Image con assets optimizados |
| Pruebas | Vitest + Testing Library; Playwright para flujo RSVP |

La decision entre CSS Modules y Tailwind puede tomarse al iniciar el repositorio. Para este proyecto, cualquiera es suficiente si se mantienen tokens visuales consistentes.

## 3. Organizacion sugerida

```txt
src/
  app/
    i/[token]/
    admin/
    admin/login/
    admin/guests/
    admin/wedding/
  components/
    invitation/
    admin/
    ui/
  db/
    schema.ts
    migrations/
    queries/
  lib/
    auth.ts
    tokens.ts
    validation.ts
    urls.ts
  styles/
    globals.css
    tokens.css
```

No se crean capas extras hasta que exista una necesidad real. Las consultas de datos viven cerca de `db/queries`; los componentes visuales reutilizables viven en `components/ui`.

## 4. Rutas

### Publicas

```txt
/i/:token
```

Renderiza la invitacion asociada al token y permite responder.

### Administrativas

```txt
/admin/login
/admin
/admin/guests
/admin/wedding
```

Todas las rutas administrativas excepto login validan sesion en servidor antes de renderizar.

## 5. Frontend

- La invitacion publica se renderiza rapido y prioriza mobile.
- El hero usa imagen optimizada y tamanos responsivos.
- La respuesta RSVP usa un estado de envio para evitar doble click.
- El panel admin puede usar tablas compactas en escritorio y listas en movil.
- Los formularios usan Zod para validar antes de enviar.
- Los estados de carga, vacio y error deben estar presentes en pantallas admin y en invitacion publica.

## 6. Backend dentro de Next.js

Responsabilidades:

- validar tokens de invitado;
- consultar boda, eventos, invitado y sub invitados;
- registrar y actualizar RSVP de forma atomica;
- autenticar al administrador;
- consultar invitados por vista: todos, novio o novia;
- crear, editar y eliminar invitados y sub invitados verificando propiedad por lado;
- actualizar contenido de boda y eventos.

La confirmacion de asistencia debe ejecutarse en servidor verificando el token del invitado principal y guardando su estado junto con los estados de sub invitados. Para el invitado principal:

```sql
update guests
set status = $status, responded_at = now()
where token = $token;
```

Para sub invitados, la actualizacion debe limitarse a filas asociadas al `guest_id` encontrado por token. Si el token no existe, se muestra la pagina de invitacion no encontrada.

## 7. Decisiones tecnicas

1. **Next.js full-stack:** reduce infraestructura y permite proteger secretos en servidor.
2. **Neon PostgreSQL:** provee persistencia confiable y despliegue simple en Vercel.
3. **Drizzle ORM:** mantiene schema tipado y migraciones versionadas sin una capa pesada.
4. **Token publico por invitado:** evita cuentas para invitados y facilita compartir por WhatsApp.
5. **Confirmacion editable:** el invitado puede corregir su asistencia y la de sus sub invitados desde el mismo enlace.
6. **Visibilidad compartida con edicion limitada:** todos los administradores ven la lista completa, pero solo modifican invitados de su lado.
7. **Sin WhatsApp API en MVP:** el admin copia enlaces y envia manualmente.
8. **Sin multiples bodas en UI:** el modelo puede soportarlo luego, pero la interfaz inicial gestiona una boda.

## 8. Configuracion

Variables esperadas:

```txt
DATABASE_URL=
ADMIN_EMAIL=
ADMIN_PASSWORD_HASH=
SESSION_SECRET=
NEXT_PUBLIC_SITE_URL=
```

Ninguna variable con secretos debe usar prefijo `NEXT_PUBLIC_`. `NEXT_PUBLIC_SITE_URL` solo se usa para construir enlaces visibles.

## 9. Pruebas

### Unitarias

- generacion y formato de tokens;
- schemas de formularios;
- construccion de URLs de invitacion;
- validacion de estados RSVP para invitado principal y sub invitados.

### Integracion

- crear invitado con token unico;
- crear y actualizar sub invitados;
- actualizar RSVP desde el enlace publico validando token;
- listar invitados por vista `todos`, `groom` y `bride`;
- impedir edicion administrativa de invitados del otro lado;
- editar boda y eventos;
- login admin y proteccion de rutas.

### End-to-end

- admin crea invitado y copia enlace;
- admin agrega sub invitados;
- otro admin puede ver ese invitado pero no editarlo;
- invitado abre enlace y confirma asistencia de cada persona;
- admin ve dashboard actualizado;
- invitado reabre el enlace y cambia una respuesta;
- token invalido muestra pagina de error amable.

## 10. Despliegue

- Vercel para frontend y runtime server-side.
- Neon para base de datos de desarrollo y produccion.
- Migraciones aplicadas antes del deploy que depende de ellas.
- Dominio propio configurado en Vercel.
- HTTPS provisto por Vercel.
- Smoke test final en telefono: abrir enlace, revisar mapas y confirmar RSVP.
