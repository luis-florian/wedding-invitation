# Wedding Invitation RSVP - Plan de implementacion

## 1. Estrategia

Construir el MVP en incrementos verticales. Cada fase debe dejar una parte usable: primero la base tecnica, luego el modelo, despues invitacion publica y finalmente panel administrativo.

No se implementan funcionalidades futuras hasta cerrar el flujo principal de RSVP.

## 2. Fases

### Fase 1 - Base del proyecto

**Alcance**

- Inicializar Next.js con TypeScript.
- Configurar lint, formato y estructura de carpetas.
- Definir tokens visuales globales.
- Crear componentes UI basicos: botones, inputs, badges, dialogs y toasts.
- Configurar variables de entorno y `.env.example`.

**Resultado:** la aplicacion compila, tiene layout base y puede desplegarse sin datos reales.

### Fase 2 - Base de datos y migraciones

**Alcance**

- Configurar Neon PostgreSQL.
- Agregar Drizzle ORM.
- Crear schema para `weddings`, `admin_users`, `wedding_events`, `guests` y `guest_companions`.
- Crear migraciones e indices.
- Agregar seed inicial para la boda, ceremonia y recepcion.
- Agregar usuarios administrativos iniciales para novio y novia.
- Implementar generacion de tokens.

**Resultado:** la aplicacion puede leer y escribir datos persistentes con migraciones reproducibles.

### Fase 3 - Invitacion publica y RSVP

**Alcance**

- Crear ruta `/i/[token]`.
- Consultar invitacion por token.
- Mostrar hero, mensaje, eventos, mapas y despedida.
- Implementar estados de token invalido, carga y error.
- Registrar o actualizar `confirmed`, `declined` o `pending` para el invitado principal.
- Mostrar estado actual si ya habia respondido.
- Mostrar y actualizar el estado de cada sub invitado.

**Resultado:** un invitado puede abrir su enlace, ver el estado actual y cambiar su asistencia o la de sus sub invitados desde telefono.

### Fase 4 - Autenticacion y panel admin

**Alcance**

- Crear login administrativo.
- Proteger rutas `/admin`.
- Crear dashboard con totales.
- Crear listado de invitados con filtros por estado y vistas `Todos`, `Invitados novio`, `Invitados novia`.
- Crear, editar y eliminar invitados del lado del administrador autenticado.
- Crear, editar y eliminar sub invitados dentro de cada invitado principal.
- Copiar enlace individual.
- Permitir ajuste manual de estado solo para invitados propios.
- Mostrar invitados del otro lado en modo solo lectura.

**Resultado:** los novios pueden ver toda la lista, operar solo sus invitados y revisar confirmaciones separadas o consolidadas.

### Fase 5 - Configuracion de boda

**Alcance**

- Editar nombres de los novios, fecha, foto, mensaje inicial y mensaje final.
- Editar ceremonia y recepcion.
- Validar URLs de Google Maps y Waze.
- Previsualizar o guardar cambios y reflejarlos en la invitacion publica.

**Resultado:** el contenido de la invitacion se puede administrar sin tocar codigo.

### Fase 6 - Pulido, pruebas y despliegue

**Alcance**

- Revisar responsive en telefono, tablet y escritorio.
- Validar contraste, foco visible y accesibilidad basica.
- Optimizar imagen principal.
- Agregar pruebas unitarias e integracion para token y RSVP.
- Agregar prueba E2E del flujo admin -> invitado -> dashboard.
- Configurar Vercel, Neon y dominio propio.
- Ejecutar smoke test en produccion.

**Resultado:** MVP desplegado y listo para compartir enlaces reales por WhatsApp.

## 3. Definition of Done

Una funcionalidad se considera terminada cuando:

- cumple el comportamiento documentado;
- funciona en movil y escritorio;
- valida datos en UI y servidor;
- maneja carga, error y estado vacio cuando aplica;
- no expone secretos al navegador;
- tiene pruebas proporcionales al riesgo;
- no rompe TypeScript, lint ni build;
- queda integrada al flujo real del usuario.

## 4. Validacion final del MVP

Antes de cerrar el MVP:

1. Crear o editar la informacion de la boda.
2. Crear ceremonia y recepcion con enlaces de mapas.
3. Crear un invitado desde admin.
4. Agregar sub invitados.
5. Entrar con un admin del otro lado y comprobar que puede verlo pero no editarlo.
6. Revisar vistas `Todos`, `Invitados novio` e `Invitados novia`.
7. Copiar el enlace individual.
8. Abrir el enlace en telefono.
9. Confirmar asistencia del invitado principal y definir estado de sub invitados.
10. Ver el mensaje de agradecimiento.
11. Reabrir el enlace y cambiar una respuesta.
12. Revisar que el dashboard muestre los cambios actualizados.
13. Probar un token invalido.
14. Cerrar sesion admin y comprobar que `/admin` queda protegido.

## 5. Posterior al MVP

Despues de validar el uso real se pueden evaluar:

- seleccion de menu;
- restricciones alimenticias;
- exportacion a Excel;
- recordatorios por WhatsApp;
- QR de entrada;
- galeria;
- cronograma extendido;
- multiples bodas.
