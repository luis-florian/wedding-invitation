# Wedding Invitation RSVP - UX y propuesta visual

## 1. Objetivo de experiencia

La experiencia debe sentirse como una invitacion digital personal, elegante y facil de completar. El invitado debe poder entender donde y cuando es la boda, abrir mapas y responder en pocos segundos.

El panel administrativo debe ser practico: menos decoracion, mas visibilidad de estados y acciones rapidas.
Todos los administradores pueden consultar invitados de ambos lados, pero las acciones de edicion quedan limitadas a los invitados propios.

## 2. Navegacion

### Invitado

Flujo principal:

```txt
WhatsApp -> /i/:token -> ver invitacion -> confirmar o rechazar -> agradecimiento
```

No hay menu complejo. La invitacion es una pagina vertical con secciones claras.

### Administrador

Rutas principales:

```txt
/admin/login
/admin
/admin/guests
/admin/wedding
```

En movil se puede usar una navegacion superior compacta. En escritorio se puede usar una barra lateral sencilla.

## 3. Pantallas

### 3.1 Invitacion

**Objetivo:** presentar la boda y registrar la respuesta del invitado.

Secciones:

1. **Hero**
   - fotografia principal;
   - nombres de los novios;
   - fecha de la boda;
   - saludo opcional con el nombre del invitado.

2. **Mensaje**
   - texto breve de bienvenida;
   - maximo dos o tres parrafos cortos.

3. **Eventos**
   - tarjeta o bloque para ceremonia;
   - tarjeta o bloque para recepcion;
   - hora de inicio y fin;
   - direccion;
   - descripcion o notas;
   - botones para Google Maps y Waze.

4. **Confirmacion**
   - estado actual si ya respondio;
   - boton principal `Confirmar asistencia`;
   - accion secundaria `No asistire`;
   - lista de sub invitados con control de estado para cada persona;
   - opcion de guardar cambios si modifica respuestas previas;
   - estado de carga al enviar;
   - mensaje de exito al terminar.

5. **Despedida**
   - mensaje final corto.

Estados:

- cargando invitacion;
- token invalido;
- invitacion encontrada sin respuesta;
- respuesta enviada;
- respuesta ya registrada con opcion de editar;
- error temporal con opcion de reintentar.

### 3.2 Admin login

**Objetivo:** proteger el panel.

Elementos:

- email o usuario;
- contrasena;
- accion `Entrar`;
- errores claros para credenciales invalidas o sesion expirada.

### 3.3 Dashboard admin

**Objetivo:** ver el estado general de confirmaciones.

Elementos:

- total de invitados;
- confirmados;
- pendientes;
- no asistiran;
- desglose entre invitados principales y sub invitados;
- resumen por lado: novio y novia;
- ultimas confirmaciones;
- acceso rapido a crear invitado y copiar enlaces.

### 3.4 Gestion de invitados

**Objetivo:** administrar la lista de invitados.

Elementos:

- tabs o control segmentado: `Todos`, `Invitados novio`, `Invitados novia`;
- busqueda por nombre o telefono;
- filtro por estado;
- tabla o lista con nombre, telefono, lado, estado y fecha de confirmacion;
- conteo de sub invitados por invitado principal;
- acciones: editar, eliminar, copiar enlace y gestionar sub invitados.

Reglas de permisos en UI:

- todos los administradores pueden abrir cualquier invitado en modo lectura;
- editar, eliminar y gestionar sub invitados solo aparece habilitado para invitados del mismo lado del administrador;
- los invitados del otro lado muestran sus acciones bloqueadas o solo lectura;
- la vista `Todos` conserva las mismas reglas, no habilita edicion cruzada.

Formulario:

- nombre obligatorio;
- telefono opcional;
- lado `novio` o `novia`, definido al crear y visible en edicion;
- estado visible pero normalmente controlado por la respuesta del invitado;
- token solo lectura si se muestra.

Sub invitados:

- se agregan dentro del detalle o formulario del invitado principal;
- tienen nombre y estado propio;
- no tienen token propio;
- pueden editarse desde admin o desde el enlace publico del invitado principal.

Eliminar requiere confirmacion.

### 3.5 Configuracion de boda

**Objetivo:** editar el contenido mostrado en la invitacion.

Campos:

- nombres de los novios;
- fecha de la boda;
- fotografia principal;
- mensaje introductorio;
- mensaje final.

Eventos:

- nombre del evento;
- hora inicio;
- hora fin;
- direccion;
- descripcion;
- notas;
- enlace de Google Maps;
- enlace de Waze.

## 4. Accesibilidad y feedback

- Objetivos tactiles de al menos `44 x 44 px`.
- Labels visibles en formularios administrativos.
- Contraste minimo WCAG AA.
- Foco visible para teclado.
- Botones deshabilitados mientras se envia una respuesta.
- Mensajes de error cerca de la accion que fallo.
- Confirmaciones de eliminacion con nombre del invitado.
- Animaciones suaves y respetando `prefers-reduced-motion`.
- El color no debe ser el unico indicador del estado de RSVP.

## 5. Propuesta visual

La invitacion debe sentirse romantica, limpia y moderna. Evitar una apariencia de dashboard publico o landing page generica. La foto de los novios o una imagen principal del evento debe ser el primer elemento visual fuerte.

### Paleta inicial

| Token | Valor | Uso |
| --- | --- | --- |
| `background` | `#FBF7F1` | Fondo calido general |
| `surface` | `#FFFFFF` | Paneles y tarjetas discretas |
| `surface-soft` | `#F3E9DE` | Bloques secundarios |
| `text-primary` | `#2B2522` | Texto principal |
| `text-secondary` | `#6F625A` | Texto auxiliar |
| `border` | `#DDD0C4` | Bordes sutiles |
| `brand` | `#8A5A44` | Acciones principales |
| `brand-hover` | `#704532` | Hover o pressed |
| `accent` | `#6E7F68` | Detalles y estados positivos |
| `danger` | `#A44949` | No asistire, errores |

### Tipografia y forma

- Usar una fuente serif elegante para nombres o encabezados principales.
- Usar una sans serif legible para cuerpo, formularios y panel admin.
- Escala sugerida: `14`, `16`, `20`, `28`, `40` px.
- Bordes de `8px` en tarjetas y formularios.
- Sombras muy sutiles o inexistentes; preferir espacio, bordes y contraste.
- Espaciado basado en multiplos de `4px`.

### Componentes clave

- `InvitationHero`.
- `EventBlock`.
- `MapActions`.
- `RSVPButtons`.
- `StatusBadge`.
- `AdminMetric`.
- `GuestList`.
- `ConfirmDialog`.
- `Toast`.

El panel admin puede reutilizar tokens, pero debe ser mas denso y funcional que la invitacion publica.
