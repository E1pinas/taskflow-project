# Taskflow Spotify: Gestor de Tareas Musicales con API REST

**Taskflow Spotify** es una aplicacion web full stack para gestionar tareas musicales. Combina un frontend en **JavaScript Vanilla** con un backend **Node.js + Express** que expone una API REST y sirve la propia interfaz desde el mismo proyecto.

La aplicacion permite crear, consultar, actualizar y eliminar tareas asociadas a canciones, artistas y albumes. El objetivo del proyecto es aplicar una arquitectura por capas clara, separar responsabilidades entre cliente y servidor, y documentar el comportamiento tecnico de la API de forma util para desarrollo y pruebas.

---

## Caracteristicas destacadas

- Interfaz construida con JavaScript modular y estilos generados con Tailwind CSS.
- Arquitectura full stack dentro de un mismo proyecto Node.js.
- API REST con operaciones CRUD sobre el recurso `task`.
- Validacion de datos en la frontera HTTP antes de llegar a la capa de servicio.
- Middleware global de errores para respuestas consistentes.
- Healthcheck para verificar disponibilidad del backend.
- Persistencia temporal en memoria con datos semilla al arrancar.
- Cliente HTTP en frontend desacoplado mediante `public/src/api/client.js`.

---

## Guia de uso

La interfaz esta pensada para trabajar contra la API real del backend.

1. Crea una tarea indicando al menos la cancion.
2. Consulta la lista para ver todas las tareas disponibles.
3. Actualiza una tarea para cambiar dificultad, artista, album o estado de completado.
4. Elimina una tarea cuando ya no sea necesaria.
5. Si la solicitud falla, la UI muestra el error devuelto por la API.

Desde el punto de vista funcional, cada accion visual del frontend termina convertida en una peticion HTTP real a `/api/v1/tasks`.

---

## Arquitectura del sistema

El proyecto esta organizado como una aplicacion monolitica ligera con separacion por capas.

### Backend (`server/src`)

El backend implementa una arquitectura por responsabilidades:

- `config/`: carga configuracion de entorno con `dotenv`.
- `routes/`: define endpoints y verbos HTTP.
- `controllers/`: adapta la entrada HTTP, valida datos y construye respuestas.
- `services/`: encapsula la logica de negocio y la persistencia en memoria.
- `data/`: contiene las tareas iniciales del sistema.
- `app.js`: compone middlewares, rutas, entrega de archivos estaticos y middleware global de errores.
- `index.js`: inicia el servidor en el puerto configurado.

Esta separacion evita mezclar detalles de Express con logica de dominio. Los controladores conocen `req` y `res`; los servicios no.

### Frontend (`public/`)

La interfaz se sirve desde Express y queda organizada asi:

- `public/index.html`: shell principal de la aplicacion.
- `public/src/api/client.js`: encapsula `fetch`, parseo de respuestas y manejo de errores.
- `public/src/js/core/`: estado y logica base del lado cliente.
- `public/src/js/ui/`: renderizado de componentes y estados visuales.
- `public/src/js/shared/`: referencias y utilidades compartidas del DOM.
- `public/src/js/principal.js`: coordinacion de eventos, render y sincronizacion con la API.

### Flujo tecnico de una peticion

1. El frontend dispara una accion del usuario.
2. `client.js` construye la solicitud HTTP.
3. Express recibe la peticion y ejecuta la cadena de middlewares.
4. El router delega en el controlador correspondiente.
5. El controlador valida y normaliza datos.
6. El servicio aplica la operacion sobre el almacen en memoria.
7. La respuesta vuelve en JSON al frontend.
8. La UI actualiza la representacion o muestra un error.

---

## Middlewares clave

El comportamiento del backend depende de una pipeline HTTP definida en `server/src/app.js`.

### `cors()`

Habilita intercambio de recursos entre origenes distintos. Tecnica y practicamente:

- añade cabeceras CORS a la respuesta
- permite desarrollo con frontend y backend desacoplados por origen
- evita bloqueos del navegador cuando la UI consume la API desde otro host o puerto

### `express.json({ limit: "5mb" })`

Middleware de parsing de cuerpo JSON.

Funcionamiento:

- inspecciona el `Content-Type`
- lee el cuerpo de la solicitud
- convierte JSON a objeto JavaScript en `req.body`
- limita el tamano de carga a 5 MB

Si el body supera ese limite, Express genera un error `entity.too.large` que mas tarde se transforma en una respuesta `413`.

### Middlewares de entrega de frontend

El servidor sirve archivos estaticos de `public/` mediante `sendFile()` y resuelve el fallback de SPA con `index.html`.

Esto permite:

- servir la interfaz desde el mismo backend
- responder recursos estaticos cuando la URL contiene extension de archivo
- devolver `index.html` en rutas de navegacion que no sean API ni `health`

### Middleware global de errores

Es el ultimo eslabon del pipeline y centraliza el manejo de excepciones.

Reglas actuales:

- `entity.too.large` -> `413 Payload Too Large`
- `NOT_FOUND` -> `404 Not Found`
- cualquier otro error -> `500 Internal Server Error`

Ventajas:

- unifica el formato de errores
- protege detalles internos del servidor
- evita repetir bloques `try/catch` de respuesta en todas las rutas

---

## Contratos de la API REST

Base URL:

```text
http://localhost:3000/api/v1/tasks
```

Alias adicional soportado:

```text
http://localhost:3000/v1/tasks
```

| Metodo | Endpoint | Descripcion | Payload |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/tasks` | Obtener todas las tareas | N/A |
| `POST` | `/api/v1/tasks` | Crear una tarea nueva | `artista`, `cancion`, `album`, `imagen`, `dificultad`, `completada` |
| `PATCH` | `/api/v1/tasks/:id` | Actualizar una tarea parcialmente | Cualquier subconjunto valido del recurso |
| `DELETE` | `/api/v1/tasks/:id` | Eliminar una tarea por ID | N/A |

### Estructura del recurso

```json
{
  "id": "6c987e69-4a82-4f8e-bf4a-8a4b1b6a5a1c",
  "artista": "Daft Punk",
  "cancion": "Digital Love",
  "album": "Discovery",
  "imagen": "/img/discovery.jpg",
  "dificultad": "media",
  "completada": false,
  "creadaEn": "2026-04-01T12:00:00.000Z"
}
```

### Reglas de validacion

- `cancion` es obligatoria en creacion y debe ser texto no vacio.
- `artista`, `album` e `imagen` deben ser texto si se envian.
- `dificultad` solo admite `facil`, `media` o `dificil`.
- `completada` debe ser booleano si se envia.

### Normalizaciones del servidor

- `artista` vacio se convierte en `Artista desconocido`.
- `album` vacio se convierte en `Sencillo`.
- `dificultad` omitida se convierte en `media`.
- `completada` omitida se convierte en `false`.

---

## Validacion y pruebas manuales

La API esta pensada para ser validada con herramientas como Postman o `curl`. Los escenarios mas importantes ya vienen definidos por el comportamiento del controlador y del middleware global de errores.

### Error 400: Bad Request

Escenario:

- intentar crear una tarea sin `cancion`
- enviar `dificultad` con un valor fuera del enum permitido
- enviar un tipo incorrecto en `completada`

Respuesta esperada:

```json
{
  "message": "El campo cancion es obligatorio y debe ser texto."
}
```

### Error 404: Not Found

Escenario:

- intentar actualizar o eliminar una tarea con un `id` inexistente

Respuesta esperada:

```json
{
  "message": "Recurso no encontrado"
}
```

### Error 413: Payload Too Large

Escenario:

- enviar un body JSON mayor de 5 MB, por ejemplo una cadena o imagen embebida excesivamente grande

Respuesta esperada:

```json
{
  "message": "La carga enviada es demasiado grande para el servidor."
}
```

### Error 500: Internal Server Error

Escenario:

- fallo no controlado en middleware, controlador o servicio

Respuesta esperada:

- codigo `500`
- mensaje JSON generico
- detalle tecnico solo en consola del servidor

---

## Ejemplos de intercambio de datos

### Crear una tarea

Request:

```http
POST /api/v1/tasks
Content-Type: application/json
```

```json
{
  "artista": "Daft Punk",
  "cancion": "Digital Love",
  "album": "Discovery",
  "imagen": "/img/discovery.jpg",
  "dificultad": "media",
  "completada": false
}
```

Response `201 Created`:

```json
{
  "id": "6c987e69-4a82-4f8e-bf4a-8a4b1b6a5a1c",
  "artista": "Daft Punk",
  "cancion": "Digital Love",
  "album": "Discovery",
  "imagen": "/img/discovery.jpg",
  "dificultad": "media",
  "completada": false,
  "creadaEn": "2026-04-01T12:00:00.000Z"
}
```

### Actualizar una tarea

Request:

```http
PATCH /api/v1/tasks/6c987e69-4a82-4f8e-bf4a-8a4b1b6a5a1c
Content-Type: application/json
```

```json
{
  "completada": true,
  "dificultad": "dificil"
}
```

Response `200 OK`:

```json
{
  "id": "6c987e69-4a82-4f8e-bf4a-8a4b1b6a5a1c",
  "artista": "Daft Punk",
  "cancion": "Digital Love",
  "album": "Discovery",
  "imagen": "/img/discovery.jpg",
  "dificultad": "dificil",
  "completada": true,
  "creadaEn": "2026-04-01T12:00:00.000Z"
}
```

### Listar tareas

```bash
curl -s http://localhost:3000/api/v1/tasks
```

### Crear una tarea con `curl`

```bash
curl -i -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d "{\"artista\":\"Joji\",\"cancion\":\"Glimpse of Us\",\"album\":\"Smithereens\",\"imagen\":\"/img/joji.jpg\",\"dificultad\":\"media\",\"completada\":false}"
```

### Marcar una tarea como completada

```bash
curl -i -X PATCH http://localhost:3000/api/v1/tasks/6c987e69-4a82-4f8e-bf4a-8a4b1b6a5a1c \
  -H "Content-Type: application/json" \
  -d "{\"completada\":true}"
```

### Eliminar una tarea

```bash
curl -i -X DELETE http://localhost:3000/api/v1/tasks/6c987e69-4a82-4f8e-bf4a-8a4b1b6a5a1c
```

---

## Instalacion y puesta en marcha

### Prerrequisitos

- Node.js
- npm

### 1. Clonar el proyecto

```bash
git clone <tu-repositorio>
cd tareas-spotify
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raiz:

```env
PORT=3000
```

### 4. Iniciar el entorno de desarrollo

```bash
npm run dev
```

Este comando ejecuta:

- compilacion de estilos con Tailwind en modo observacion
- backend Express con `nodemon`

### 5. Abrir la aplicacion

Aplicacion:

```text
http://localhost:3000
```

API:

```text
http://localhost:3000/api/v1/tasks
```

Healthcheck:

```text
http://localhost:3000/health
```

---

## Estructura del proyecto

```text
tareas-spotify/
├── docs/
├── public/
│   ├── index.html
│   ├── modal.html
│   ├── confirm-modal.html
│   ├── modal.js
│   ├── confirm-modal.js
│   ├── output.css
│   └── src/
│       ├── api/
│       │   └── client.js
│       └── js/
│           ├── core/
│           ├── shared/
│           ├── ui/
│           └── principal.js
├── server/
│   └── src/
│       ├── app.js
│       ├── index.js
│       ├── config/
│       │   └── env.js
│       ├── controllers/
│       │   └── task.controller.js
│       ├── data/
│       │   └── tarea-principio.js
│       ├── routes/
│       │   └── task.routes.js
│       └── services/
│           └── task.service.js
├── input.css
├── package.json
├── vercel.json
└── README.md
```

---

## Stack tecnologico

### Frontend

- JavaScript Vanilla
- Tailwind CSS CLI
- HTML modular servido desde Express

### Backend

- Node.js
- Express 5
- CORS
- Dotenv

### Desarrollo

- Nodemon
- Concurrently

---

## Limitaciones actuales

- la persistencia sigue siendo un array en memoria
- no hay base de datos
- no hay autenticacion ni autorizacion
- no existe documentacion Swagger activa en esta version
- no hay tests automatizados

---


