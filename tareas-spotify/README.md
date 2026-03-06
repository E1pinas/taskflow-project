# Taskflow Spotify - Tareas con LocalStorage

Aplicación web simple para gestionar tareas en el navegador usando JavaScript y persistencia local.

## Funcionalidades

- Agregar tareas desde una modal.
- Eliminar tareas individualmente.
- Persistencia con localStorage ,no se pierden al refrescar.
- Filtro de búsqueda en tiempo real.
- Soporte de tema claro/oscuro.

## Estructura

- `index.html`: estructura principal de la app.
- `modal.html`: contenido de la modal para crear tareas.
- `modal.js`: carga e inicializa la modal.
- `app.js`: lógica de tareas (CRUD + persistencia + filtro + tema).
- `input.css`: entrada de Tailwind.
- `output.css`: CSS compilado de Tailwind.
- `tailwind.config.js`: configuración de contenido y `darkMode`.

## Ejecución local

1. Instala dependencias:
   `npm install`
2. Compila CSS:
   `npm run build:css`
3. Abre `index.html` en tu navegador.
4. Pulsa agregar tarea para crear una nueva.
5. Usa el campo buscar tarea para filtrar.
6. Pulsa Eliminar para borrar una tarea.

## Desarrollo

- Ejecuta `npm run watch:css` para recompilar `output.css` automáticamente.
- Ejecuta `npm run dev` para correr watch de Tailwind y servidor local en paralelo.
- La app queda disponible en `http://127.0.0.1:5173`.

## Persistencia

Las tareas se guardan en localStorage con la clave:

taskflow_spotify_tareas

## Mapa Técnico de Funciones JS

Referencia para revisión técnica (líneas actuales de inicio en los archivos).

### app.js

- `normalizarCancion` (línea 4): se creó para sanear y migrar datos antiguos/incompletos de `localStorage` a un contrato interno estable (`id`, `artista`, `cancion`, `album`, `imagen`), evitando errores de render y de filtrado.
- `actualizarTextoBotonTema` (línea 57): separa la lógica de etiqueta del toggle de tema para no duplicar decisiones de UI entre inicialización y click handler.
- `aplicarTemaInicial` (línea 66): define la fuente de verdad del tema al cargar (preferencia guardada o `prefers-color-scheme`) y sincroniza clase `dark` + texto del botón.
- `guardarTareas` (línea 76): encapsula persistencia; evita repetir acceso directo a `localStorage` y centraliza el side effect de escritura.
- `eliminarTarea` (línea 80): aplica mutación inmutable de estado (`filter`), limpia selección asociada y dispara persistencia + rerender coherente.
- `crearNodoTarea` (línea 87): fábrica de UI para cada item; concentra estructura DOM, bindings de eventos y clases Tailwind en un único punto.
- `construirTextoBusqueda` (línea 153): normaliza índice de búsqueda agregando campos en minúsculas para comparación consistente y simple.
- `renderTareas` (línea 157): función de proyección estado->UI; limpia lista, filtra por criterio y monta nodos, manteniendo render determinista.
- `agregarTarea` (línea 169): crea entidad con defaults de dominio, actualiza estado y ejecuta pipeline de persistencia + rerender.
- `leerImagenComoDataURL` (línea 183): adapta `FileReader` a promesa para integrar carga de imagen en flujo async del formulario.
- `cerrarModal` (línea 193): helper de UI para cerrar modal de forma segura (si existe en DOM).
- `salirModoSeleccion` (línea 200): revierte estado transitorio de borrado masivo (flag, selección y texto del botón).
- `inicializarFormularioModal` (línea 206): orquesta validación de refs DOM y registro del submit; integra lectura de imagen, alta de tarea y cleanup del formulario.

### modal.js

- `DOMContentLoaded` handler (línea 1): carga `modal.html` de forma diferida para mantener `index.html` limpio y desacoplar markup modal.
- `inicializarModal` (línea 10): conecta triggers abrir/cerrar con toggling de `hidden`, manteniendo comportamiento de modal aislado del resto de app.

### Eventos y Flujo (app.js)

- `inputBusqueda` `input` handler (línea 256): actualiza filtrado en tiempo real y cancela modo selección para prevenir estados ambiguos.
- `modalReady` listener (línea 263): inicializa formulario solo cuando el modal fue inyectado por `modal.js`.
- `botonTema` click handler (línea 265): alterna clase `dark`, persiste preferencia y sincroniza copy del botón.
- `botonAbrirModal` click handler (línea 273): asegura que al abrir modal no quede activo un flujo de borrado masivo.
- `botonBorrarSeleccionadas` click handler (línea 280): implementa máquina de estados simple de borrado en 2 pasos (entrar selección -> confirmar).
- Bootstrap final (líneas 309-311): aplica tema, asegura persistencia consistente y renderiza estado inicial.


