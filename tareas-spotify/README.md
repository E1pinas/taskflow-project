# 🎵 Taskflow Spotify - Gestor de Tareas Musical

> **Aplicación web interactiva para gestionar tareas de canciones con persistencia local, drag & drop y modo oscuro.**

Una app moderna y responsiva que combina productividad con música. Organiza tus canciones y tareas favoritas con un diseño intuitivo.

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Instalación](#-instalación)
- [Uso Rápido](#-uso-rápido)
- [Ejemplos de Uso](#-ejemplos-de-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API de Funciones](#-api-de-funciones)
- [Testing](#-testing)

---

## ✨ Características

**Gestión de Tareas:**

- ✅ Agregar tareas con artista, canción, álbum e imagen
- ✅ Editar información de tareas existentes
- ✅ Marcar tareas como completadas/no completadas
- ✅ Eliminar tareas individuales o en lotes
- ✅ Búsqueda en tiempo real
- ✅ **Drag & Drop** para reordenar tareas entre secciones

**Experiencia de Usuario:**

- 🌗 Tema claro/oscuro con persistencia
- 📊 Panel de estadísticas (total, completadas, pendientes)
- 💾 Persistencia con localStorage
- 📱 Diseño completamente responsivo
- ♿ Accesible y usable
- ⚡ Animaciones suaves en cambios de estado

**Características Avanzadas:**

- 🖼️ Carga de imágenes para portadas de álbumes
- 📋 Búsqueda y filtrado por canción o artista
- 🎯 Confirmación modal para acciones críticas
- 🔄 Sincronización de datos en tiempo real

---

## 🚀 Instalación

### Requisitos Previos

- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Node.js 14+ (solo si quieres compilar estilos)

### Pasos

1. **Clonar o descargar el repositorio**

```bash
git clone <tu-repo>
cd tareas-spotify
```

2. **Instalar dependencias** (opcional, solo para desarrollo)

```bash
npm install
```

3. **Compilar estilos CSS** (opcional)

```bash
npm run build
```

4. **Abrir en navegador**

```bash
# Simplemente abre index.html en tu navegador
```

---

## ⚡ Uso Rápido

### Agregar una Tarea

1. Haz clic en el botón **"+ Agregar Tarea"**
2. Completa los campos:
   - **Artista**: Nombre del artista
   - **Canción**: Nombre de la canción
   - **Álbum**: Nombre del álbum
   - **Imagen**: URL de la portada (opcional)
3. Haz clic en **"Agregar"**

### Marcar como Completada

- Haz clic en el **checkbox** junto a la tarea
- La tarea se moverá a la sección "Completadas" automáticamente

### Eliminar Tareas

- **Individualmente**: Haz clic en el botón ❌
- **En lotes**: Activa el modo selección y confirma

### Buscar Tareas

- Escribe en el campo de búsqueda
- Las tareas se filtran en tiempo real por artista o canción

### Cambiar Tema

- Haz clic en el botón de tema en la cabecera (☀️ / 🌙)
- El tema se guarda automáticamente

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Crear una Tarea Musical

```javascript
// La app automáticamente crea una tarea como esta:
{
  id: "uuid-unico",
  artista: "Taylor Swift",
  cancion: "Lavender Haze",
  album: "Midnights",
  imagen: "https://example.com/album.jpg",
  completada: false,
  orden: 1678123456789,
  dificultad: "media"
}
```

### Ejemplo 2: Flujo Completo de Usuario

```
1. Usuario abre la app
2. Sistema carga tareas del localStorage
3. Usuario agrega tarea: "The Weeknd - Blinding Lights"
4. Usuario carga imagen de la portada
5. Usuario marca como completada (automáticamente se mueve)
6. Usuario activa modo oscuro
7. Al refrescar, TODO persiste ✓
```

### Ejemplo 3: Búsqueda y Filtrado

```
Tareas guardadas:
- The Weeknd - Blinding Lights
- Taylor Swift - Anti-Hero
- The Weeknd - Starboy

Usuario escribe "The Weeknd" en búsqueda
Resultado:
- The Weeknd - Blinding Lights
- The Weeknd - Starboy
```

---

## 🏗️ Diseño de la App

### Estructura Visual

```
┌─────────────────────────────────────┐
│  Taskflow Spotify | 🌗 [Tema]       │  ← Cabecera
├─────────────────────────────────────┤
│ [+ Agregar] [🗑️ Borrar] Búsqueda... │  ← Controles
├──────────────────┬──────────────────┤
│  PENDIENTES      │   COMPLETADAS    │  ← Dos secciones
│  • Tarea 1       │   • Tarea 3 ✓    │     con drag & drop
│  • Tarea 2       │                  │
├──────────────────┤                  │
│     STATS        │                  │
│ Total:   3       │                  │
│ Completadas: 1   │                  │
│ Pendientes:  2   │                  │
└──────────────────┴──────────────────┘
```

---

## 🔌 API de Funciones

### Funciones Principales del Core (`app.js`)

#### `generarId()`

Genera un ID único para cada tarea usando `crypto.randomUUID()` o fallback con timestamp.

```javascript
const id = generarId(); // "a1b2c3d4-e5f6-47a8-9b0c-1d2e3f4a5b6c"
```

#### `normalizarCancion(item)`

Normaliza un objeto de tarea garantizando tipos de datos correctos y valores por defecto.

```javascript
const tareaData = {
  artista: "The Weeknd",
  cancion: "Blinding Lights",
  album: "After Hours",
  imagen: "https://example.com/cover.jpg",
};
const tarea = normalizarCancion(tareaData);
```

#### `guardarTareas()`

Persiste el array de tareas en localStorage bajo la clave `taskflow_spotify_tareas`.

```javascript
guardarTareas(); // Guarda todas las tareas en localStorage
```

#### `renderTareas(filtro = "")`

Renderiza las tareas en el DOM, aplicando filtro por búsqueda.

```javascript
renderTareas("taylor"); // Muestra solo tareas de Taylor Swift
renderTareas(""); // Muestra todas las tareas
```

#### `agregarTarea(artista, cancion, album, imagen)`

Crea una nueva tarea y la agrega a la lista.

```javascript
agregarTarea("Billie Eilish", "Bad Guy", "When We All Fall Asleep", "url");
// Nueva tarea agregada con ID único
```

#### `editarTarea(id, artista, cancion, album, imagen)`

Modifica los datos de una tarea existente.

```javascript
editarTarea("uuid123", "New Artist", "New Song", "New Album", "new-url");
```

#### `eliminarTarea(id)`

Elimina una tarea por su ID.

```javascript
eliminarTarea("uuid123"); // Tarea eliminada
```

#### `completarTarea(id, completar = true)`

Marca una tarea como completada o no completada.

```javascript
completarTarea("uuid123", true); // Marca como completada
completarTarea("uuid123", false); // Marca como pendiente
```

#### `moverTareasConConfirmacion(directriz)`

Mueve tareas entre "Pendientes" y "Completadas" con confirmación modal.

```javascript
moverTareasConConfirmacion("completadas"); // Mueve seleccionadas a completadas
moverTareasConConfirmacion("pendientes"); // Mueve seleccionadas a pendientes
```

### Funciones de Tema

#### `aplicarTemaInicial()`

Carga el tema guardado en localStorage o usa la preferencia del sistema.

```javascript
aplicarTemaInicial(); // Se ejecuta al cargar la página
```

#### `botonTema.click()` handler

Alterna entre modo claro y oscuro.

```javascript
// Click en botón de tema
// Resultado: documento alterna clase "dark"
```

### Funciones de Interfaz

#### `mostrarToast(mensaje, tipo = "info")`

Muestra una notificación temporal en pantalla.

```javascript
mostrarToast("Tarea agregada", "success");
mostrarToast("Error al guardar", "error");
mostrarToast("Aviso importante", "warning");
```

#### `mostrarConfirmacion(opciones)`

Abre un modal de confirmación con título, mensaje y detalles.

```javascript
const confirmado = await mostrarConfirmacion({
  titulo: "¿Eliminar tareas?",
  mensaje: "Esta acción no se puede deshacer",
  detalle: "• Tarea 1\n• Tarea 2",
});

if (confirmado) {
  // Usuario confirmó
}
```

---

## 🎯 Flujo de Datos

```
localStorage
    ↓
[Array de tareas normalizado]
    ↓
renderTareas(filtro)
    ↓
[DOM actualizado]
    ↓
usuario interactúa
    ↓
commitCambios()
    ↓
guardarTareas() → localStorage
```

---

## ✅ Testing y Casos de Prueba

### Guía de Testing Manual

Estos casos aseguran que todas las funcionalidades principales funcionan correctamente:

#### ✅ Lista Vacía

- **Descripción**: Verificar comportamiento cuando no hay tareas.
- **Pasos**:
  1. Abrir aplicación con localStorage vacío.
  2. Verificar que se muestra lista vacía sin errores.
- **Resultado Esperado**: Lista vacía, sin crashes.
- **Estado**: ✅ Pasó

#### ✅ Agregar Tarea Sin Canción

- **Descripción**: Intentar agregar tarea sin nombre de canción.
- **Pasos**:
  1. Abrir modal de agregar tarea.
  2. Dejar campo "Nombre de la canción" vacío.
  3. Intentar enviar formulario.
- **Resultado Esperado**: Validación falla, muestra alerta "Por favor, completa el nombre de la canción."
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

---

## 📁 Estructura del Proyecto

```
tareas-spotify/
├── index.html              # Página principal
├── modal.html              # Contenido del modal
├── confirm-modal.html      # Confirmaciones
├── app.js                  # Lógica principal (CRUD, filtrado, tema)
├── modal.js                # Carga e inicializa modal
├── confirm-modal.js        # Confirmaciones
├── spotify-functions.js    # Funciones auxiliares
├── input.css               # Estilos sin compilar
├── output.css              # Estilos compilados
├── tailwind.config.js      # Configuración de Tailwind
├── postcss.config.js       # Configuración de PostCSS
├── package.json            # Dependencias del proyecto
└── doc/                    # Documentación
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

---

## 🤝 Contribuciones

### Reporte de Errores

Si encuentras un bug, reporta con:
- Pasos exactos para reproducir
- Comportamiento esperado vs actual
- Navegador y versión usada
- Screenshot o video si es necesario

### Mejoras Sugeridas

Ideas para nuevas features:
- [ ] Exportar tareas a JSON/CSV
- [ ] Categorías o etiquetas
- [ ] Sincronización con API de Spotify
- [ ] Notificaciones sonoras
- [ ] Modo multiusuario
- [ ] Estadísticas avanzadas

---

## ❓ FAQ

**P: ¿Dónde se guardan mis tareas?**
R: En localStorage del navegador. No se envían a ningún servidor.

**P: ¿Puedo perder mis tareas?**
R: Solo si borras el localStorage o los datos del navegador. La app persiste todo automáticamente.

**P: ¿Funciona sin internet?**
R: Sí, completamente offline. No necesita conexión a internet.

**P: ¿Puedo importar tareas?**
R: Actualmente no, pero es una feature futura planeada.

**P: ¿Cómo cambio el tema?**
R: Haz clic en el botón de tema (☀️/🌙) en la barra superior. Se guarda automáticamente.

**P: ¿Dónde puedo ver la documentación técnica?**
R: Ver la sección [API de Funciones](#-api-de-funciones) arriba para detalles de cada función.

---

## 🔍 Referencia Técnica Detallada

### Arquitectura del Código

- **Estado Global**: Array `tareas` mantiene el estado en memoria
- **Persistencia**: localStorage sincronizado en cada cambio
- **DOM**: Renderizado reactivo sin framework (vanilla JS)
- **Eventos**: Delegados y normalizados con handlers específicos
- **Estilos**: Tailwind CSS + utilidades personalizadas

### Funciones Clave por Módulo

**app.js** - Lógica principal:
- `normalizarCancion()`: Valida y normaliza datos de entrada
- `guardarTareas()`: Persiste a localStorage
- `commitCambios()`: Guarda + re-renderiza
- `renderTareas()`: Proyecta estado a DOM
- `agregarTarea()`: CRUD create
- `editarTarea()`: CRUD update
- `eliminarTarea()`: CRUD delete
- `completarTarea()`: Toggle estado

**modal.js** - Gestión de modales:
- Carga dinámicamente modal.html
- Inyecta en DOM y binds eventos

**confirm-modal.js** - Confirmaciones:
- Modal para acciones críticas
- Promise-based API

**spotify-functions.js** - Utilidades:
- Helpers y funciones compartidas

---

## 📦 Stack Tecnológico

| Tecnología | Propósito |
|-----------|-----------|
| **HTML5** | Estructura semántica |
| **CSS3** | Estilos base |
| **Tailwind CSS** | Utility-first CSS framework |
| **Vanilla JS** | Lógica sin dependencias |
| **localStorage** | Persistencia de datos |
| **Drag & Drop API** | Reordenamiento de tareas |

---

## 🚀 Roadmap Futuro

- [ ] Backend con autenticación
- [ ] Sincronización en tiempo real
- [ ] PWA (Progressive Web App)
- [ ] Integración con Spotify API
- [ ] Colaboración multiusuario
- [ ] Estadísticas avanzadas
- [ ] Exportación de datos

---

**🎵 Taskflow Spotify – Hecho con ❤️ usando Vanilla JS + Tailwind CSS**
*Organiza tu música, gestiona tus tareas.*
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
```
