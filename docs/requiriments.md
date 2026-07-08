# Sistema de Confirmación de Asistencia para Boda

## 1. Objetivo

Desarrollar una aplicación web sencilla y elegante que permita enviar a cada invitado un enlace único desde WhatsApp para consultar la información de la boda y confirmar su asistencia.

El sistema debe priorizar la simplicidad, una excelente experiencia en dispositivos móviles y una administración sencilla de los invitados.

---

# 2. Objetivos del proyecto

## Objetivos funcionales

* Mostrar la información esencial de la boda.
* Permitir confirmar o rechazar la asistencia mediante un enlace único.
* Centralizar la administración de invitados.
* Llevar el control del estado de confirmación.
* Evitar que el invitado tenga que crear cuentas o iniciar sesión.

## Objetivos no funcionales

* Diseño elegante.
* Optimizado para teléfonos.
* Carga muy rápida.
* Fácil de compartir por WhatsApp.
* Administración simple.

---

# 3. Actores

## Administrador

Los novios (o quien administre la boda).

Puede:

* Administrar invitados.
* Consultar confirmaciones.
* Obtener enlaces individuales.
* Editar la información general del evento.

---

## Invitado

Recibe un enlace único por WhatsApp.

Puede:

* Ver la información de la boda.
* Confirmar o rechazar asistencia.

No puede modificar ninguna otra información.

---

# 4. Módulos del sistema

## 4.1 Sitio de Invitación

Sitio público accesible mediante un enlace único.

Ejemplo:

```
https://luisyana.com/i/a83f92kd
```

Su propósito es informar al invitado y registrar su respuesta.

---

## 4.2 Panel Administrativo

Sitio privado para administrar toda la boda.

Ejemplo

```
https://luisyana.com/admin
```

---

# 5. Página de Invitación

## Hero

Debe contener:

* Fotografía principal
* Nombre de ambos novios
* Fecha de la boda

---

## Mensaje

Pequeño mensaje introductorio.

Debe ser corto.

No más de dos o tres párrafos.

---

## Información del evento

El sistema permitirá mostrar múltiples eventos.

Inicialmente existirán dos.

### Ceremonia

Debe contener:

* nombre
* hora inicio
* hora fin
* dirección
* descripción
* notas
* Google Maps
* Waze

---

### Recepción

Debe contener exactamente la misma estructura.

---

## Confirmación

Debe permitir responder únicamente una vez.

Opciones:

* Confirmar asistencia
* No asistiré

Al finalizar debe mostrarse un mensaje de agradecimiento.

---

## Mensaje Final

Mensaje corto de despedida.

---

# 6. Panel Administrativo

## Dashboard

Mostrar:

* Total invitados
* Confirmados
* Pendientes
* No asistirán

---

## Gestión de invitados

Cada invitado tendrá:

* Nombre
* Teléfono
* Token único
* Estado
* Fecha de confirmación

Acciones:

* Crear
* Editar
* Eliminar
* Copiar enlace

---

## Estado del invitado

Los estados serán:

```
Pendiente
Confirmado
No asistirá
```

---

# 7. Flujo principal

```
Administrador

↓

Crea invitado

↓

Sistema genera token

↓

Sistema genera URL

↓

Administrador envía por WhatsApp

↓

Invitado abre enlace

↓

Visualiza información

↓

Confirma asistencia

↓

Sistema registra respuesta

↓

Administrador puede visualizar el nuevo estado
```

---

# 8. Modelo de dominio

## Wedding

Representa toda la boda.

Contiene:

* nombres
* fotografía
* fecha
* mensaje
* mensaje final

---

## EventLocation

Representa cada evento.

Ejemplo:

* Ceremonia
* Recepción

Contiene:

* nombre
* dirección
* horario
* notas
* enlaces de mapas

---

## Guest

Representa un invitado.

Contiene:

* nombre
* teléfono
* token
* estado
* fecha de confirmación

---

# 9. Principios de diseño

La aplicación deberá seguir los siguientes principios:

* Mobile First.
* Máximo dos scrolls para completar toda la invitación.
* Una única acción principal: **Confirmar asistencia**.
* Diseño limpio y elegante.
* Animaciones suaves y discretas.
* Sin elementos innecesarios.
* Toda la información importante visible sin confundir al invitado.

---

# 10. Tecnologías propuestas

## Frontend

* Next.js

## Hosting

* Vercel

## Base de datos

* Neon PostgreSQL

## Dominio

Dominio propio (.com o similar).

---

# 11. Futuras funcionalidades (No incluidas en la primera versión)

* Video de bienvenida.
* Confirmación de acompañantes.
* Selección de menú.
* Restricciones alimenticias.
* Galería de fotografías.
* Cuenta regresiva.
* Música de fondo.
* Cronograma del evento.
* Lista de regalos.
* Confirmación mediante código QR.
* Exportación de invitados a Excel.
* Estadísticas de confirmaciones.
* Envío automático de recordatorios por WhatsApp.
* Múltiples bodas administradas desde una misma plataforma.

