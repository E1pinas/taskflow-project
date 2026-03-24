# Backend API

## Axios

Axios es una libreria HTTP para JavaScript usada para consumir APIs desde navegador o Node.js.

Se usa porque:

- simplifica peticiones `GET`, `POST`, `PATCH` y `DELETE`
- convierte respuestas JSON automaticamente
- permite interceptores para auth, logs o manejo comun de errores
- hace mas simple centralizar configuracion como `baseURL`

En este proyecto se ha usado `fetch` nativo, pero Axios seria una alternativa razonable si la capa de red creciera.

## Postman

Postman es una herramienta para probar APIs manualmente.

Se usa porque:

- permite enviar peticiones HTTP sin depender del frontend
- ayuda a validar codigos de estado, cabeceras y cuerpos JSON
- permite guardar colecciones para probar casos felices y errores
- facilita documentar flujos de integracion

En este proyecto es util para comprobar:

- `POST` valido devuelve `201`
- `POST` invalido devuelve `400`
- `DELETE` de un recurso inexistente devuelve `404`

## Sentry

Sentry es una plataforma de observabilidad centrada en errores y rendimiento.

Se usa porque:

- captura excepciones en frontend y backend
- agrupa errores repetidos
- conserva stack traces y contexto de ejecucion
- ayuda a detectar fallos en produccion antes de que escalen

En un backend Express suele integrarse como capa de monitoreo adicional, no como sustituto del middleware de errores.

## Swagger

Swagger es el ecosistema mas conocido para describir y explorar APIs HTTP. Hoy normalmente se habla de OpenAPI como especificacion y Swagger como conjunto de herramientas.

Se usa porque:

- documenta endpoints, parametros y respuestas de forma estandar
- permite generar documentacion navegable
- mejora la colaboracion entre frontend y backend
- ayuda a mantener un contrato de API claro y verificable

En una evolucion futura de este proyecto, Swagger/OpenAPI serviria para exponer formalmente:

- `GET /api/v1/tasks`
- `POST /api/v1/tasks`
- `PATCH /api/v1/tasks/:id`
- `DELETE /api/v1/tasks/:id`

## Relacion entre estas herramientas

- Axios o `fetch` consumen la API.
- Postman la prueba manualmente.
- Swagger la documenta como contrato.
- Sentry monitoriza errores cuando la app ya esta desplegada.
