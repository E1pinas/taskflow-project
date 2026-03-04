# Taskflow Spotify - Tareas con LocalStorage

Aplicación web simple para gestionar tareas en el navegador usando JavaScript y persistencia local.

## Funcionalidades

- Agregar tareas desde una modal.
- Eliminar tareas individualmente.
- Persistencia con localStorage ,no se pierden al refrescar.
- Filtro de búsqueda en tiempo real.

## Estructura

- `index.html`: estructura principal de la app.
- `modal.html`: contenido de la modal para crear tareas.
- `modal.js`: carga e inicializa la modal.
- `app.js`: lógica de tareas (CRUD básico + persistencia + filtro).
- `style.css`: estilos base.

## Ejecución local

1. Abre index.html en tu navegador.
2. Pulsa agregar tarea para crear una nueva.
3. Usa el campo buscar tarea para filtrar.
4. Pulsa Eliminar para borrar una tarea.

## Persistencia

Las tareas se guardan en localStorage con la clave:

taskflow_spotify_tareas


