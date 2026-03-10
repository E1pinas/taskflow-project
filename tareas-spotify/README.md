# Taskflow Spotify - Tareas con LocalStorage

Aplicación web simple para gestionar tareas en el navegador usando JavaScript y persistencia local.

## Funcionalidades

- ✅ Agregar tareas desde una modal con validación completa.
- ✅ Eliminar tareas individualmente con animaciones.
- ✅ Marcar tareas como completadas/desmarcar con estilo visual.
- ✅ **Mover tareas entre secciones**: pendientes ↔ completadas.
- ✅ Persistencia con localStorage (no se pierden al refrescar).
- ✅ Filtro de búsqueda en tiempo real.
- ✅ Soporte de tema claro/oscuro con persistencia.
- ✅ Borrado masivo de tareas seleccionadas.
- ✅ Animaciones suaves en cambios de estado.
- ✅ Diseño responsivo y completamente accesible.
- ✅ Carga de imágenes para portadas de álbumes.
- ✅ Drag & drop para reordenar tareas entre secciones.
- ✅ Drag & drop para reordenar tareas.

## Testing Manual

### Casos de Prueba Documentados

#### ✅ Lista Vacía
- **Descripción**: Verificar comportamiento cuando no hay tareas.
- **Pasos**:
  1. Abrir aplicación con localStorage vacío.
  2. Verificar que se muestra lista vacía sin errores.
- **Resultado Esperado**: Lista vacía, sin crashes.
- **Estado**: ✅ Pasó

#### ✅ Agregar Tarea Sin Título
- **Descripción**: Intentar agregar tarea sin nombre de canción.
- **Pasos**:
  1. Abrir modal de agregar tarea.
  2. Dejar campo "Nombre de la canción" vacío.
  3. Intentar enviar formulario.
- **Resultado Esperado**: Validación falla, muestra alerta "Por favor, completa el artista y el nombre de la canción."
- **Estado**: ✅ Pasó

#### ✅ Agregar Tarea Sin Artista
- **Descripción**: Intentar agregar tarea sin artista.
- **Pasos**:
  1. Abrir modal de agregar tarea.
  2. Dejar campo "Artista" vacío.
  3. Intentar enviar formulario.
- **Resultado Esperado**: Validación falla, muestra alerta.
- **Estado**: ✅ Pasó

#### ✅ Agregar Tarea Completa
- **Descripción**: Agregar tarea con todos los campos.
- **Pasos**:
  1. Abrir modal.
  2. Completar artista, canción, álbum e imagen.
  3. Enviar formulario.
- **Resultado Esperado**: Tarea aparece en lista, con imagen, no completada.
- **Estado**: ✅ Pasó

#### ✅ Marcar/Desmarcar Completada
- **Descripción**: Toggle estado completada.
- **Pasos**:
  1. Agregar tarea.
  2. Hacer click en checkbox de completada.
  3. Verificar estilo tachado y opacidad.
  4. Hacer click nuevamente para desmarcar.
- **Resultado Esperado**: Estilo cambia correctamente, persiste en localStorage.
- **Estado**: ✅ Pasó

#### ✅ Eliminar Tarea Individual
- **Descripción**: Borrar una tarea específica.
- **Pasos**:
  1. Agregar varias tareas.
  2. Hacer click en "Eliminar" de una tarea.
- **Resultado Esperado**: Tarea desaparece, otras permanecen.
- **Estado**: ✅ Pasó

#### ✅ Borrado Masivo
- **Descripción**: Borrar múltiples tareas seleccionadas.
- **Pasos**:
  1. Agregar 3 tareas.
  2. Hacer click "Borrar seleccionadas" (entra modo selección).
  3. Seleccionar 2 tareas con checkboxes.
  4. Hacer click "Confirmar borrado".
  5. Confirmar en diálogo.
- **Resultado Esperado**: Solo tareas seleccionadas se eliminan.
- **Estado**: ✅ Pasó

#### ✅ Búsqueda/Filtro
- **Descripción**: Filtrar tareas por texto.
- **Pasos**:
  1. Agregar tareas con diferentes artistas/canciones.
  2. Escribir en campo búsqueda.
- **Resultado Esperado**: Solo tareas que coinciden se muestran.
- **Estado**: ✅ Pasó

#### ✅ Persistencia localStorage
- **Descripción**: Verificar que datos persisten.
- **Pasos**:
  1. Agregar tareas y marcar algunas completadas.
  2. Refrescar página.
- **Resultado Esperado**: Tareas y estados se mantienen.
- **Estado**: ✅ Pasó

#### ✅ Tema Claro/Oscuro
- **Descripción**: Cambiar tema.
- **Pasos**:
  1. Hacer click en botón de tema.
  2. Verificar cambio visual.
  3. Refrescar página.
- **Resultado Esperado**: Tema persiste.
- **Estado**: ✅ Pasó

#### ✅ Mover Tareas Entre Secciones
- **Descripción**: Mover tareas seleccionadas entre pendientes y completadas con confirm.
- **Pasos**:
  1. Agregar 2 tareas en pendientes.
  2. Hacer click "Mover a completadas" (aparecen checkboxes).
  3. Seleccionar ambas tareas.
  4. Hacer click "Confirmar mover a completadas (2)".
  5. Verificar confirm con lista de canciones.
- **Resultado Esperado**: Aparece confirm con lista, tareas se mueven al confirmar.
- **Estado**: ✅ Pasó

#### ✅ Drag & Drop Entre Secciones
- **Descripción**: Arrastrar tarea de una sección a otra.
- **Pasos**:
  1. Agregar tareas en ambas secciones.
  2. Arrastrar tarea completada a sección pendientes.
- **Resultado Esperado**: Tarea cambia de estado y sección.
- **Estado**: ✅ Pasó

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

- `normalizarCancion` (línea 4): se creó para sanear y migrar datos antiguos/incompletos de `localStorage` a un contrato interno estable (`id`, `artista`, `cancion`, `album`, `imagen`, `completada`, `orden`), evitando errores de render y de filtrado.
- `actualizarTextoBotonTema` (línea 57): separa la lógica de etiqueta del toggle de tema para no duplicar decisiones de UI entre inicialización y click handler.
- `aplicarTemaInicial` (línea 66): define la fuente de verdad del tema al cargar (preferencia guardada o `prefers-color-scheme`) y sincroniza clase `dark` + texto del botón.
- `guardarTareas` (línea 76): encapsula persistencia; evita repetir acceso directo a `localStorage` y centraliza el side effect de escritura.
- `eliminarTarea` (línea 80): aplica mutación inmutable de estado (`filter`), limpia selección asociada y dispara persistencia + rerender coherente.
- `toggleCompletada` (línea 86): alterna estado completada de tarea específica, persiste cambios y rerenderiza lista.
- `moverTareasSeleccionadas` (línea 92): cambia estado completada de tareas seleccionadas en lote y actualiza UI.
- `reordenarTareas` (línea 102): maneja lógica de reordenamiento via drag & drop entre secciones; actualiza array, persiste orden y rerenderiza.
- `crearNodoTarea` (línea 112): fábrica de UI para cada item; concentra estructura DOM, bindings de eventos, estilos condicionales para completadas, drag & drop listeners y clases Tailwind con animaciones.
- `construirTextoBusqueda` (línea 178): normaliza índice de búsqueda agregando campos en minúsculas para comparación consistente y simple.
- `renderTareas` (línea 182): función de proyección estado->UI; separa tareas en dos contenedores (pendientes/completadas), filtra por criterio y monta nodos con animaciones de entrada.
- `agregarTarea` (línea 194): crea entidad con defaults de dominio incluyendo estado completada y orden, actualiza estado y ejecuta pipeline de persistencia + rerender.
- `leerImagenComoDataURL` (línea 208): adapta `FileReader` a promesa para integrar carga de imagen en flujo async del formulario.
- `cerrarModal` (línea 218): helper de UI para cerrar modal de forma segura (si existe en DOM).
- `salirModoSeleccion` (línea 225): revierte estado transitorio de borrado masivo (flag, selección y texto del botón).
- `inicializarFormularioModal` (línea 231): orquesta validación de refs DOM y registro del submit con validación completa (artista + canción requeridos); integra lectura de imagen, alta de tarea y cleanup del formulario.

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


