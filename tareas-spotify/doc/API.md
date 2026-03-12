# 📚 Documentación de API - Taskflow Spotify

> Referencia técnica completa de todas las funciones del proyecto.

---

## 🎯 Índice

- [Configuración Global](#-configuración-global)
- [Funciones de Almacenamiento](#-funciones-de-almacenamiento)
- [Funciones CRUD](#-funciones-crud)
- [Funciones de UI](#-funciones-de-ui)
- [Funciones de Estado](#-funciones-de-estado)
- [Event Handlers](#event-handlers)

---

## ⚙️ Configuración Global

### Constantes

```javascript
const LLAVE = "taskflow_spotify_tareas"; // Clave de localStorage para tareas
const TEMA = "taskflow_spotify_tema"; // Clave de localStorage para tema
```

### Variables Globales

```javascript
let tareas = []; // Array principal de tareas
const tareasSeleccionadas = new Set(); // Rastreo de tareas seleccionadas

let modoSeleccion = false; // Flag de modo selección activo
let modoMoverCompletadas = false; // Flag de modo mover a completadas
let modoMoverPendientes = false; // Flag de modo mover a pendientes
```

---

## 💾 Funciones de Almacenamiento

### `generarId()`

**Descripción**: Genera un ID único para una nueva tarea.

**Retorna**: `string` - UUID único

**Ejemplo**:

```javascript
const id = generarId();
console.log(id); // "550e8400-e29b-41d4-a716-446655440000"
```

**Implementación**:

- Intenta usar `crypto.randomUUID()` si disponible
- Fallback: Combina timestamp + número aleatorio

---

### `normalizarCancion(item)`

**Descripción**: Normaliza y valida un objeto de tarea, asegurando estructura consistente.

**Parámetros**:

- `item` (object) - Objeto a normalizar

**Retorna**: `object | null` - Tarea normalizada o null si inválida

**Propiedades Garantizadas**:

```javascript
{
  id: string,           // UUID único
  artista: string,      // Nombre del artista
  cancion: string,      // Nombre de la canción
  album: string,        // Nombre del álbum
  imagen: string,       // URL o data URL de imagen
  completada: boolean,  // Estado completado
  orden: number,        // Ordenamiento en lista
  dificultad: string    // 'facil' | 'media' | 'dificil'
}
```

**Ejemplo**:

```javascript
const raw = {
  artista: "The Weeknd",
  cancion: "Blinding Lights",
};

const normalizada = normalizarCancion(raw);
// {
//   id: "auto-generado",
//   artista: "The Weeknd",
//   cancion: "Blinding Lights",
//   album: "Sencillo",
//   imagen: "",
//   completada: false,
//   orden: [timestamp],
//   dificultad: "media"
// }
```

---

### `guardarTareas()`

**Descripción**: Persiste el array de tareas en localStorage.

**Parámetros**: Ninguno

**Retorna**: `void`

**Side Effects**:

- Actualiza `localStorage[LLAVE]` con JSON stringificado

**Ejemplo**:

```javascript
tareas.push(nuevaTarea);
guardarTareas(); // Ahora persiste en localStorage
```

---

## 🔧 Funciones CRUD

### `agregarTarea(artista, cancion, album, imagen)`

**Descripción**: Crea y agrega una nueva tarea.

**Parámetros**:

- `artista` (string) - Nombre del artista
- `cancion` (string) - Nombre de la canción
- `album` (string) - Nombre del álbum
- `imagen` (string) - URL o data URL de imagen

**Retorna**: `void`

**Side Effects**:

- Agrega tarea a array global `tareas`
- Llama `commitCambios()` para persistir

**Ejemplo**:

```javascript
agregarTarea(
  "Taylor Swift",
  "Anti-Hero",
  "Midnights",
  "https://example.com/cover.jpg",
);
```

---

### `editarTarea(id, artista, cancion, album, imagen)`

**Descripción**: Actualiza los datos de una tarea existente.

**Parámetros**:

- `id` (string) - ID de la tarea a editar
- `artista` (string) - Nuevo nombre del artista
- `cancion` (string) - Nuevo nombre de la canción
- `album` (string) - Nuevo nombre del álbum
- `imagen` (string) - Nueva URL o data URL

**Retorna**: `void`

**Side Effects**:

- Modifica tarea en array
- Llama `commitCambios()` para persistir

**Ejemplo**:

```javascript
editarTarea(
  "uuid123",
  "Billie Eilish",
  "Happier Than Ever",
  "Happier Than Ever",
  "new-url",
);
```

---

### `eliminarTarea(id)`

**Descripción**: Elimina una tarea por su ID.

**Parámetros**:

- `id` (string) - ID de la tarea a eliminar

**Retorna**: `void`

**Side Effects**:

- Remueve tarea del array
- Limpia del set de seleccionadas
- Llama `commitCambios()`

**Ejemplo**:

```javascript
eliminarTarea("uuid123");
```

---

### `completarTarea(id, completar = true)`

**Descripción**: Marca una tarea como completada o no completada.

**Parámetros**:

- `id` (string) - ID de la tarea
- `completar` (boolean) - true para marcar completada, false para pendiente

**Retorna**: `void`

**Side Effects**:

- Alterna propiedad `completada`
- Llama `commitCambios()`

**Ejemplo**:

```javascript
completarTarea("uuid123", true); // Marca como completada
completarTarea("uuid123", false); // Marca como pendiente
```

---

## 🎨 Funciones de UI

### `renderTareas(filtro = "")`

**Descripción**: Renderiza las tareas en el DOM, divididas en pendientes y completadas.

**Parámetros**:

- `filtro` (string) - Texto para filtrar tareas por búsqueda

**Retorna**: `void`

**Lógica**:

1. Limpia contenedores DOM
2. Filtra tareas por búsqueda (artista + canción)
3. Separa en pendientes y completadas
4. Crea nodos para cada tarea
5. Inserta en DOM con animaciones

**Ejemplo**:

```javascript
renderTareas("taylor"); // Solo muestra tareas de Taylor Swift
renderTareas(""); // Muestra todas
```

---

### `crearNodoTarea(tarea)`

**Descripción**: Crea un elemento DOM para una tarea individual.

**Parámetros**:

- `tarea` (object) - Objeto de tarea

**Retorna**: `HTMLElement` - Elemento listo para insertar en DOM

**Atributos Incluidos**:

- Drag & drop listeners
- Click handlers para editar/eliminar/completar
- Condicionales de estilo (completada, seleccionada)
- Imagen de portada

**Ejemplo**:

```javascript
const nodo = crearNodoTarea(miTarea);
document.getElementById("listaTareas").appendChild(nodo);
```

---

### `mostrarToast(mensaje, tipo = "info")`

**Descripción**: Muestra una notificación temporal en pantalla.

**Parámetros**:

- `mensaje` (string) - Texto a mostrar
- `tipo` (string) - 'info' | 'success' | 'error' | 'warning'

**Retorna**: `void`

**Comportamiento**:

- Aparece durante 3 segundos
- Se auto-destruye después

**Ejemplo**:

```javascript
mostrarToast("Tarea agregada", "success");
mostrarToast("Error al guardar", "error");
mostrarToast("Campo requerido", "warning");
```

---

### `mostrarConfirmacion(opciones)`

**Descripción**: Muestra un modal de confirmación con opciones de sí/no.

**Parámetros**:

- `opciones` (object):
  - `titulo` (string) - Título del modal
  - `mensaje` (string) - Mensaje principal
  - `detalle` (string) - Detalles adicionales (opcional)

**Retorna**: `Promise<boolean>` - true si confirmó, false si canceló

**Ejemplo**:

```javascript
const confirmado = await mostrarConfirmacion({
  titulo: "¿Eliminar tareas?",
  mensaje: "Esta acción no se puede deshacer",
  detalle: "• Tarea 1\n• Tarea 2",
});

if (confirmado) {
  // Usuario confirmó la acción
}
```

---

## 🎯 Funciones de Estado

### `commitCambios(filtro = "")`

**Descripción**: Persiste cambios y re-renderiza la UI.

**Parámetros**:

- `filtro` (string) - Filtro de búsqueda a aplicar

**Retorna**: `void`

**Pipeline**:

1. Llama `guardarTareas()`
2. Llama `renderTareas(filtro)`

**Ejemplo**:

```javascript
tareas.push(nueva);
commitCambios(); // Guarda + re-renderiza
```

---

### `aplicarTemaInicial()`

**Descripción**: Carga y aplica el tema al iniciar la página.

**Parámetros**: Ninguno

**Retorna**: `void`

**Lógica**:

1. Lee tema guardado de localStorage
2. Si no existe, usa preferencia del sistema (`prefers-color-scheme`)
3. Aplica clase `dark` al documento
4. Actualiza texto del botón

**Ejemplo**:

```javascript
aplicarTemaInicial(); // Se ejecuta en bootstrap
```

---

### `actualizarTextoBotonTema()`

**Descripción**: Actualiza el texto del botón según el tema actual.

**Parámetros**: Ninguno

**Retorna**: `void`

**Ejemplo**:

```javascript
actualizarTextoBotonTema();
// Cambia botón de "Modo oscuro" a "Modo claro" y vice versa
```

---

## 🎪 Event Handlers

### Click: Botón Tema

```javascript
botonTema.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  localStorage.setItem(
    TEMA,
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  );
  actualizarTextoBotonTema();
});
```

---

### Click: Agregar Tarea

```javascript
botonAbrirModal.addEventListener("click", () => {
  salirModoSeleccion();
  // Abre modal para agregar tarea
});
```

---

### Input: Búsqueda

```javascript
inputBusqueda.addEventListener("input", (e) => {
  const filtro = e.target.value.trim().toLowerCase();
  salirModoSeleccion();
  renderTareas(filtro);
});
```

---

### Drag & Drop

```javascript
// El usuario arrastra una tarea
elemento.addEventListener("dragstart", (e) => {
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", tareaId);
});

// El usuario suelta sobre un contenedor
contenedor.addEventListener("drop", (e) => {
  e.preventDefault();
  const tareaId = e.dataTransfer.getData("text/plain");
  moverTareaSegunDestino(tareaId, contenedorDestino);
});
```

---

## 📋 Patrones Comunes

### Patrón: Agregar → Guardar → Renderizar

```javascript
function agregarAlgo() {
  tareas.push(nuevoElemento);
  commitCambios(); // Esto hace: guardar + renderizar
}
```

### Patrón: Modal con Confirmación

```javascript
const confirmado = await mostrarConfirmacion({
  titulo: "Acción",
  mensaje: "¿Continuar?",
  detalle: "Detalles aquí",
});

if (confirmado) {
  realizarAccion();
}
```

### Patrón: Filtrado Real-Time

```javascript
inputBusqueda.addEventListener("input", (e) => {
  const filtro = e.target.value.toLowerCase();
  renderTareas(filtro);
});
```

---

## 🧯 Manejo de Errores

### Validación de Entrada

El código valida:

- Tipos de datos (string, boolean, number)
- Valores vacíos
- IDs existentes antes de eliminar

### Fallbacks

- Si `crypto.randomUUID()` no existe, usa timestamp + random
- Si localStorage no disponible, funciona en memoria

---

## 🚀 Performance

### Optimizaciones Incluidas

1. **Delegación de Eventos**: Handlers en contenedores, no en cada item
2. **Filtrado Eficiente**: Búsqueda con `.toLowerCase()` una sola vez
3. **Mutation Efectiva**: `.filter()` en lugar de `.splice()`
4. **No Re-renders Innecesarios**: Solo cuando cambia estado

---

## 📚 Referencias

- [MDN: localStorage](https://developer.mozilla.org/es/docs/Web/API/Window/localStorage)
- [MDN: Drag and Drop API](https://developer.mozilla.org/es/docs/Web/API/HTML_Drag_and_Drop_API)
- [MDN: Promise](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise)

---

**Documentación generada automáticamente. Última actualización: Marzo 2026**
