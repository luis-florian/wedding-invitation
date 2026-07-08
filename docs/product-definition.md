# Wedding Invitation RSVP - Definicion del producto

## 1. Proposito

La aplicacion es un sitio web de invitacion de boda con confirmacion de asistencia. Cada invitado principal recibe por WhatsApp un enlace unico, revisa la informacion del evento y confirma si asistira o no junto con sus sub invitados.

El foco del MVP es simplicidad: una experiencia elegante en telefono para el invitado y un panel administrativo basico para que los novios puedan gestionar sus invitados y ver todas las respuestas.

## 2. Problema

Gestionar confirmaciones por mensajes manuales suele producir informacion dispersa, respuestas duplicadas y poca visibilidad del estado real de los invitados. El sistema debe resolver esto con:

- un enlace individual por invitado principal;
- informacion clara de la boda en un solo lugar;
- confirmacion sin crear cuenta;
- panel para consultar pendientes, confirmados y personas que no asistiran, incluyendo sub invitados;
- vistas separadas para invitados del novio, invitados de la novia y todos los invitados.

## 3. Usuarios

### Administrador

Normalmente los novios o una persona encargada.

Puede:

- editar la informacion general de la boda;
- ver los invitados del novio, de la novia y todos juntos;
- registrar, editar y eliminar invitados principales y sub invitados de su propio lado;
- copiar el enlace individual de cada invitado;
- revisar el estado de confirmacion;
- ver totales del evento.

No puede editar ni eliminar invitados que pertenecen al otro lado, aunque si puede verlos.

### Invitado

Recibe un enlace unico por WhatsApp.

Puede:

- abrir su invitacion personalizada;
- consultar fecha, mensaje, ceremonia y recepcion;
- confirmar asistencia o indicar que no asistira;
- cambiar posteriormente su respuesta desde el mismo enlace;
- definir el estado de asistencia de cada sub invitado asociado a su invitacion;
- ver un mensaje final de agradecimiento.

No crea cuenta, no inicia sesion y no puede modificar datos administrativos.

## 4. Alcance funcional del MVP

### 4.1 Invitacion publica

Ruta esperada:

```txt
/i/:token
```

La pagina muestra:

- fotografia principal;
- nombres de los novios;
- fecha de la boda;
- mensaje introductorio corto;
- datos de ceremonia y recepcion;
- botones para abrir Google Maps y Waze;
- seccion de confirmacion;
- mensaje final.

El enlace debe validar que el token exista. Si no existe, se muestra una pagina amable de invitacion no encontrada.

### 4.2 Confirmacion de asistencia

Opciones:

- `Confirmar asistencia`;
- `No asistire`.

Reglas:

- el invitado principal puede ver y cambiar su estado actual desde el mismo enlace;
- si ya respondio, se muestra su respuesta registrada y se permite actualizarla;
- el invitado puede cambiar el estado de cada sub invitado asociado;
- cada cambio guarda estado y fecha de ultima actualizacion;
- no se solicita login, codigo adicional ni datos extra en el MVP.

### 4.3 Panel administrativo

Ruta esperada:

```txt
/admin
```

Incluye:

- dashboard con totales: invitados, confirmados, pendientes y no asistiran;
- listado de invitados con vistas `Todos`, `Invitados novio` e `Invitados novia`;
- creacion, edicion y eliminacion de invitados;
- gestion de sub invitados por invitado principal;
- copia del enlace individual;
- edicion basica de informacion de la boda;
- administracion de eventos de la boda, inicialmente ceremonia y recepcion.

### 4.4 Invitados

Campos principales:

| Campo | Regla |
| --- | --- |
| Nombre | Obligatorio |
| Telefono | Opcional pero recomendado para envio por WhatsApp |
| Lado | `novio` o `novia`, define propiedad y permisos de edicion |
| Token | Generado automaticamente, unico y no editable |
| Estado | `pending`, `confirmed` o `declined` |
| Fecha de confirmacion | Se actualiza cuando responde o cambia su estado |

### 4.5 Sub invitados

Los sub invitados son personas asociadas a un invitado principal. No tienen enlace propio; se administran desde el enlace del invitado principal y desde el panel administrativo.

Campos principales:

| Campo | Regla |
| --- | --- |
| Nombre | Obligatorio |
| Estado | `pending`, `confirmed` o `declined` |
| Fecha de confirmacion | Se actualiza cuando cambia su estado |

## 5. Fuera del MVP

- Video de bienvenida.
- Seleccion de menu.
- Restricciones alimenticias.
- Galeria de fotografias.
- Cuenta regresiva.
- Musica de fondo.
- Cronograma extendido del evento.
- Lista de regalos.
- Confirmacion mediante codigo QR.
- Exportacion a Excel.
- Estadisticas avanzadas.
- Envio automatico de recordatorios por WhatsApp.
- Multiples bodas administradas desde una misma plataforma.

## 6. Principios del producto

1. **Mobile-first:** la mayoria de invitados abrira el enlace desde WhatsApp en telefono.
2. **Una accion principal:** confirmar o rechazar asistencia debe ser evidente.
3. **Sin friccion:** el invitado no crea cuenta ni completa formularios largos.
4. **Elegancia sobria:** el diseno debe sentirse de boda, no de formulario generico.
5. **Administracion simple:** el panel debe priorizar crear invitados, copiar enlaces y revisar estados.
6. **Carga rapida:** imagenes optimizadas, poco JavaScript y contenido directo.
7. **Visibilidad compartida:** los administradores ven todos los invitados, pero solo modifican los de su lado.

## 7. Criterios de exito

El MVP esta listo cuando:

1. el administrador puede configurar la boda y sus eventos principales;
2. el administrador puede crear invitados principales, agregar sub invitados y copiar enlaces de su lado;
3. un invitado puede abrir su enlace desde telefono y entender la informacion sin esfuerzo;
4. el invitado puede confirmar, rechazar o cambiar su asistencia y la de sus sub invitados;
5. el panel refleja inmediatamente los cambios de estado en vistas por lado y vista total;
6. la aplicacion funciona correctamente en produccion con dominio propio, HTTPS y base de datos persistente.
