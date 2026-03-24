# Taskflow Spotify

Aplicacion web para gestionar tareas musicales con frontend en JavaScript modular y backend REST en Express.

## Arquitectura

El proyecto queda dividido en dos fronteras claras:

- `server/`: backend Node.js + Express dentro del mismo proyecto Node.
- `src/`: frontend vanilla JavaScript.

### Backend por capas

Dentro de `server/src` se aplica separacion de responsabilidades:

- `config/`: carga y valida variables de entorno.
- `routes/`: mapea URLs y verbos HTTP.
- `controllers/`: valida datos de red y construye respuestas HTTP.
- `services/`: contiene la logica de negocio pura y la persistencia en memoria.
- `app.js`: compone middlewares, rutas y middleware global de errores.
- `index.js`: arranca el servidor.

### Frontend

Dentro de `src` el frontend queda organizado asi:

- `api/client.js`: capa de comunicacion HTTP con `fetch`.
- `js/core/`: estado, almacenamiento de tema y modelo de tarea.
- `js/ui/`: renderizado de listas, estadisticas y estados visuales.
- `js/shared/`: referencias al DOM.
- `js/principal.js`: orquestacion de eventos UI y sincronizacion con la API.

## Middlewares y pipeline

Express procesa cada peticion como una cadena de responsabilidad:

1. `cors()` abre el acceso del frontend al backend desde otro origen.
2. `express.json()` parsea el cuerpo JSON y lo coloca en `req.body`.
3. Las rutas delegan en controladores delgados.
4. Los controladores llaman a servicios que no conocen Express.
5. El middleware global de errores traduce fallos tecnicos a respuestas HTTP seguras.

### Middleware global de errores

El middleware final en `server/src/app.js` aplica estas reglas:

- `Error("NOT_FOUND")` devuelve `404`.
- Cualquier otro error devuelve `500`.
- Los errores internos se registran con `console.error(err)`.
- El cliente recibe un mensaje generico para no filtrar detalles sensibles.

## API REST

Base URL:

```text
http://localhost:3000/api/v1/tasks
```

### Recursos

Una tarea tiene esta forma:

```json
{
  "id": "uuid",
  "artista": "Daft Punk",
  "cancion": "Digital Love",
  "album": "Discovery",
  "imagen": "",
  "dificultad": "media",
  "completada": false,
  "creadaEn": "2026-03-22T10:00:00.000Z"
}
```

### Endpoints

#### `GET /api/v1/tasks`

Recupera todas las tareas.

Respuesta:

```json
[
  {
    "id": "uuid",
    "artista": "Daft Punk",
    "cancion": "Digital Love",
    "album": "Discovery",
    "imagen": "",
    "dificultad": "media",
    "completada": false,
    "creadaEn": "2026-03-22T10:00:00.000Z"
  }
]
```

#### `POST /api/v1/tasks`

Crea una tarea nueva.

Body:

```json
{
  "artista": "Daft Punk",
  "cancion": "Digital Love",
  "album": "Discovery",
  "imagen": "",
  "dificultad": "media",
  "completada": false
}
```

Respuesta exitosa: `201 Created`

#### `PATCH /api/v1/tasks/:id`

Actualiza campos parciales de una tarea.

Body ejemplo:

```json
{
  "completada": true
}
```

Respuesta exitosa: `200 OK`

#### `DELETE /api/v1/tasks/:id`

Elimina una tarea.

Respuesta exitosa: `204 No Content`

## Validacion de frontera

La API no confia en el cliente. Antes de llegar al servicio:

- `cancion` debe ser texto no vacio en creacion.
- `artista`, `album` e `imagen` deben ser texto si se envian.
- `dificultad` solo acepta `facil`, `media` o `dificil`.
- `completada` debe ser booleano si se envia.

Si la validacion falla, el controlador devuelve `400 Bad Request`.

## Variables de entorno

El backend sigue un enfoque 12-Factor:

- la configuracion vive fuera del codigo
- `dotenv` carga `.env` en la raiz del proyecto
- el arranque se cancela si `PORT` no existe

Archivo esperado:

```env
PORT=3000
```

## Flujo de frontend

La UI ya no guarda tareas en `localStorage`. Ahora:

1. Al cargar la pagina, `src/js/principal.js` pide las tareas al backend.
2. La UI entra en estado de carga.
3. Si la peticion funciona, renderiza tareas y estadisticas.
4. Si falla, muestra estado de error visual y feedback en la interfaz.
5. Crear, editar, completar y eliminar generan peticiones HTTP reales.

El tema claro/oscuro sigue persistiendo en `localStorage` porque es una preferencia local de interfaz, no un dato de dominio.

## Estados de red en la UI

La interfaz gestiona tres estados clave:

- carga: mensaje de sincronizacion y controles deshabilitados
- exito: renderizado normal de tareas
- error: mensaje visual en las listas y toast de error

## Ejecucion local

### Frontend + backend

```bash
npm install
npm run dev
```

El frontend queda accesible en:

```text
http://127.0.0.1:5173
```

El backend queda accesible en:

```text
http://localhost:3000
```

Healthcheck:

```text
GET http://localhost:3000/health
```

## Pruebas manuales sugeridas

### Caso feliz

1. `POST /api/v1/tasks` con una tarea valida.
2. `GET /api/v1/tasks` para verificar que aparece.
3. `PATCH /api/v1/tasks/:id` con `{ "completada": true }`.
4. `DELETE /api/v1/tasks/:id`.

### Casos de error

#### Crear sin cancion

Peticion:

```json
{
  "artista": "Daft Punk"
}
```

Respuesta esperada:

- `400 Bad Request`

#### Crear con dificultad invalida

Peticion:

```json
{
  "cancion": "Digital Love",
  "dificultad": "extrema"
}
```

Respuesta esperada:

- `400 Bad Request`

#### Eliminar un id inexistente

Respuesta esperada:

- `404 Not Found`

## Estructura del proyecto

```text
tareas-spotify/
├── server/
│   ├── api/
│   │   └── index.js
│   └── src/
│       ├── app.js
│       ├── index.js
│       ├── config/
│       │   └── env.js
│       ├── controllers/
│       │   └── task.controller.js
│       ├── routes/
│       │   └── task.routes.js
│       └── services/
│           └── task.service.js
├── src/
│   ├── api/
│   │   └── client.js
│   └── js/
│       ├── core/
│       ├── shared/
│       ├── ui/
│       └── principal.js
├── .env
├── index.html
├── package.json
├── vercel.json
└── README.md
```

## Limitaciones actuales

- la persistencia backend sigue siendo un array en memoria
- si el servidor se reinicia, las tareas se pierden
- el drag and drop reordena visualmente en cliente, pero ese orden no se persiste en servidor

## Siguiente evolucion natural

- base de datos real
- autenticacion
- logging estructurado
- documentacion OpenAPI
- monitoreo de errores con Sentry
