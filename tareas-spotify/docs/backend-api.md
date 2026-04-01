# Informacion sobre herramientas para desarrollo de aplicaciones y APIs

---

## 1. Axios

### Que es

Axios es una libreria de JavaScript que funciona como cliente HTTP basado en promesas.

Su papel es gestionar la comunicacion entre una aplicacion y un servidor: enviar solicitudes, recibir respuestas y facilitar el trabajo con datos remotos. Se usa tanto en frontend como en Node.js.

### Por que se usa

Axios suele elegirse cuando se quiere una capa de red mas completa que `fetch`:

- transforma JSON de forma comoda
- centraliza configuraciones como `baseURL`
- permite interceptores para auth, logs o manejo comun de errores
- simplifica la lectura de respuestas fallidas

### En este proyecto

En `tareas-spotify` no se esta usando Axios actualmente. La aplicacion consume la API con `fetch` nativo desde `public/src/api/client.js`.

Axios seguiria siendo una alternativa razonable si la capa de red creciera o si hiciera falta compartir interceptores y configuracion comun entre muchas peticiones.

---

## 2. Postman

### Que es

Postman es una herramienta para probar APIs manualmente sin depender del frontend.

Permite construir peticiones HTTP, definir headers y cuerpos JSON, revisar codigos de estado y comprobar exactamente que devuelve el servidor.

### Por que se usa

Se usa para validar el backend de forma aislada y para depurar integraciones:

- permite probar endpoints antes de conectarlos a la interfaz
- ayuda a distinguir si un fallo esta en backend o frontend
- facilita guardar colecciones de pruebas reutilizables
- permite documentar flujos de integracion y casos de error

### En este proyecto

Postman es util para comprobar el comportamiento de la API de tareas:

- `GET /api/v1/tasks`
- `POST /api/v1/tasks`
- `PATCH /api/v1/tasks/:id`
- `DELETE /api/v1/tasks/:id`

Tambien sirve para validar escenarios como:

- `POST` valido devuelve `201`
- `POST` invalido devuelve `400`
- `DELETE` de un recurso inexistente devuelve `404`

---

## 3. Sentry

### Que es

Sentry es una plataforma de monitorizacion de errores y rendimiento.

Se integra en la aplicacion para capturar excepciones, contexto de ejecucion y trazas cuando ocurre un fallo real en uso.

### Por que se usa

Se usa para pasar de un mantenimiento reactivo a uno mas proactivo:

- captura errores en frontend y backend
- agrupa fallos repetidos
- conserva stack traces y contexto tecnico
- ayuda a detectar problemas en produccion antes de que escalen

### En este proyecto

Ahora mismo no aparece integrado en el codigo, pero seria una mejora util si la aplicacion se desplegara o creciera en uso real. En un backend Express se suele usar como capa adicional de observabilidad, no como sustituto del middleware de errores.

---

## 4. Swagger

### Que es

Swagger es el conjunto de herramientas mas conocido alrededor de OpenAPI, la especificacion para describir APIs HTTP.

Sirve para documentar endpoints, parametros, cuerpos y respuestas de forma clara y navegable.

### Por que se usa

Se usa como contrato tecnico entre frontend y backend:

- documenta la API de forma estandar
- mejora la colaboracion entre distintas partes del proyecto
- reduce ambiguedades en integracion
- permite generar documentacion navegable y, en algunos casos, clientes automaticamente

### En este proyecto

Todavia no esta implementado, pero encajaria bien para documentar formalmente la API de tareas:

- `GET /api/v1/tasks`
- `POST /api/v1/tasks`
- `PATCH /api/v1/tasks/:id`
- `DELETE /api/v1/tasks/:id`

---

## Relacion entre estas herramientas

- `fetch` o Axios consumen la API.
- Postman la prueba manualmente.
- Swagger/OpenAPI la documenta como contrato.
- Sentry monitoriza errores cuando la app ya esta desplegada.
