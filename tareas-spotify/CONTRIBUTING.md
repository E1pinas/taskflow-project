# 🤝 Guía de Contribución - Taskflow Spotify

> Bienvenido a la comunidad de Taskflow Spotify. Esta guía te ayudará a contribuir de forma efectiva.

---

## 📋 Tabla de Contenidos

- [Código de Conducta](#-código-de-conducta)
- [Cómo Reportar Bugs](#-cómo-reportar-bugs)
- [Cómo Sugerir Mejoras](#-cómo-sugerir-mejoras)
- [Flujo de Desarrollo](#-flujo-de-desarrollo)
- [Guía de Estilo](#-guía-de-estilo)
- [Testing Manual](#-testing-manual)

---

## ⚖️ Código de Conducta

- Sé respetuoso con otros contribuidores
- Proporciona feedback constructivo
- Reporta problemas de forma clara y específica
- Respeta la privacidad de otros

---

## 🐛 Cómo Reportar Bugs

### Checklist Antes de Reportar

- [ ] ¿Es realmente un bug? (no estoy usando mal la app)
- [ ] ¿Está el bug ya reportado?
- [ ] ¿Tengo los pasos exactos para reproducirlo?

### Información Requerida

**Por favor incluye**:

1. **Título descriptivo**

   ```
   ❌ Malo: "No funciona"
   ✅ Bien: "Bug: Modal no cierra al presionar ESC en navegador Firefox"
   ```

2. **Pasos exactos para reproducir**

   ```
   1. Abrir aplicación
   2. Agregar tarea con imagen
   3. Presionar ESC
   4. Modal sigue abierta
   ```

3. **Comportamiento Esperado**

   ```
   Modal debe cerrarse al presionar ESC
   ```

4. **Comportamiento Actual**

   ```
   Modal permanece abierta, hay que hacer clic en X
   ```

5. **Detalles del Entorno**
   - Navegador: Firefox 122.0
   - Sistema Operativo: Windows 11
   - Versión de la app: Last commit
   - ¿Funciona en otro navegador?: Sí, Chrome 122.0

6. **Screenshots/Videos** (opcional pero útil)

---

## 💡 Cómo Sugerir Mejoras

### Criterios para Feature Requests

- ¿Es útil para la mayoría de usuarios?
- ¿Es coherente con la visión del proyecto?
- ¿Se puede implementar sin añadir dependencias pesadas?

### Formato de Suggestion

**Título**: Descripción clara y corta

**Descripción**:

````markdown
## Problema

El usuario actual no puede exportar sus tareas para hacer backup.

## Solución Propuesta

Agregar opción "Descargar como JSON" en el menú.

## Beneficios

- Backup de tareas
- Portabilidad de datos
- Seguridad de datos del usuario

## Implementación Sugerida

Agregar botón que descargue:

```json
{
  "tareas": [...],
  "version": "1.0",
  "fecha": "2026-03-12"
}
```
````

## Alternativas Consideradas

- LocalStorage directo (no es portable)
- API externa (añade complejidad)

```

---

## 🔄 Flujo de Desarrollo

### Branch Naming

```

feature/nombre-feature # Nueva funcionalidad
fix/descripcion-bug # Arreglo de bug
refactor/descripcion-cambios # Refactorización
docs/actualizacion-documentacion # Documentación

```

### Ejemplos

```

feature/exportar-tareas-json
fix/modal-no-cierra-esc
refactor/simplificar-renderizado
docs/agregar-ejemplos-uso

```

---

### Commit Messages

**Formato**:
```

[tipo] descripción corta

descripción detallada (opcional)

```

**Tipos**:
- `feat`: Nueva funcionalidad
- `fix`: Arreglo de bug
- `docs`: Documentación
- `style`: Cambios de formato (no lógica)
- `refactor`: Refactorización de código
- `test`: Agregación de tests
- `chore`: Cambios en build, dependencias, etc.

**Ejemplos**:
```

feat: agregar exportación a JSON

Permite descargar tareas como archivo JSON para backup.
Incluye metadatos de versión y fecha.

fix: corregir modal que no cierra con ESC

fix: issue #42 - Modal no responde a tecla ESC en Firefox

docs: actualizar README con ejemplos de uso

refactor: simplificar función renderTareas()

speed: 10% más rápido con optimización de filtrado

````

---

## ✍️ Guía de Estilo

### JavaScript

**Nombres de Variables**

```javascript
// ✅ Bien
let tareaSeleccionada = null;
const obtenerTareasCompletadas = () => {};
const TIMEOUT_TOAST = 3000;

// ❌ Malo
let ts = null;
const getTareasCompl = () => {};
let timeout = 3000;
````

**Funciones**

```javascript
// ✅ Bien
function agregarTarea(artista, cancion, album) {
  // Una responsabilidad
  const nuevaTarea = normalizarCancion({artista, cancion, album});
  tareas.push(nuevaTarea);
  guardarTareas();
  return nuevaTarea;
}

// ❌ Malo
function agregar(a, c, al, img, dir) {
  // Hace demasiadas cosas
  const t = {id: generarId(), artista: a, ...};
  tareas.push(t);
  localStorage.setItem("tareas", JSON.stringify(tareas));
  renderTareas("");
  mostrarToast("Tarea agregada");
}
```

**Comentarios**

```javascript
// ✅ Bien - Explica el por qué
// Normalizamos para garantizar tipos consistentes y evitar errores de render
const normalizada = normalizarCancion(data);

// ❌ Malo - Explicita lo obvio
const t = normalizarCancion(data); // Normaliza la canción

// ✅ Bien - Documenta casos edge
// Si el navegador no soporta crypto.randomUUID, usamos fallback
function generarId() {
  if (typeof crypto?.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
```

### HTML

```html
<!-- ✅ Bien -->
<div id="listaTareasPendientes" class="space-y-2">
  <!-- Tareas -->
</div>

<!-- ❌ Malo -->
<div id="list" class="space">
  <!-- Tareas -->
</div>
```

### CSS/Tailwind

```html
<!-- ✅ Bien - Uso estratégico de Tailwind -->
<button class="px-4 py-2 transition bg-blue-600 rounded-lg hover:bg-blue-700">
  Agregar
</button>

<!-- ❌ Malo - Mezcla de inline styles -->
<button class="px-4 py-2" style="background: blue; color: white;">
  Agregar
</button>
```

---

## 🧪 Testing Manual

### Checklist Antes de Enviar PR

- [ ] Función principal funciona
- [ ] Sin errores en consola
- [ ] Responsive (mobile, tablet, desktop)
- [ ] Modo oscuro funciona
- [ ] localStorage persiste datos
- [ ] Drag & drop funciona
- [ ] Búsqueda filtra correctamente
- [ ] Modal abre y cierra

### Casos de Prueba Importantes

```
TEST: Agregar tarea
1. Haz clic "Agregar Tarea"
2. Completa todos los campos
3. Haz clic "Agregar"
✓ Debe aparecer en pendientes
✓ Debe persistir al refrescar

TEST: Completar tarea
1. Agregar tarea
2. Haz clic en checkbox
✓ Debe moverse a completadas
✓ Debe tener estilo tachado
✓ Debe persistir al refrescar

TEST: Eliminar tarea
1. Agregar 2 tareas
2. Haz clic "❌" en una
✓ Debe desaparecer
✓ Otra debe permanecer

TEST: Búsqueda
1. Agregar 3 tareas con artistas diferentes
2. Escribe nombre en búsqueda
✓ Solo deben aparecer coincidencias
✓ Salida de búsqueda devuelve todas

TEST: Tema oscuro
1. Haz clic en botón tema
✓ Debe cambiar a modo oscuro
✓ Persista al refrescar
2. Haz clic nuevamente
✓ Debe cambiar a modo claro
```

---

## 📦 Estructura de PRs

### Título del PR

```
[tipo] descripción clara

Ejemplos:
✅ [feat] Agregar exportación a JSON
✅ [fix] Corregir modal que no cierra
✅ [docs] Actualizar README
```

### Descripción del PR

```markdown
## Descripción

Qué hace este PR (breve)

## Tipo de Cambio

- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Documentación

## Cómo fue testeado

- [ ] Manualmente en Chrome
- [ ] Manualmente en Firefox
- [ ] Responsive en mobile
- [ ] Persiste en localStorage

## Screenshots

(Si aplica)

## Checklist

- [ ] Mi código sigue la guía de estilo
- [ ] Actualicé la documentación
- [ ] Testeé manualmente
- [ ] Sin errores en consola
```

---

## 🎯 Areas para Mejorar

Estas áreas necesitan contribuciones:

### Documentación

- [ ] Agregar más ejemplos
- [ ] Tutoriales en video
- [ ] Guías de troubleshooting

### Features

- [ ] Exportación de datos
- [ ] Sincronización multi-tab
- [ ] Categorías de tareas
- [ ] Integración Spotify API

### Testing

- [ ] Tests automatizados
- [ ] E2E testing
- [ ] Coverage reports

### Performance

- [ ] Optimización de renderizado
- [ ] Virtual scrolling para muchas tareas
- [ ] Web Workers para operaciones pesadas

---

## 🆘 Ayuda Necesaria

Si necesitas ayuda:

1. **Revisa la [Documentación de API](./API.md)**
2. **Lee el [README Principal](../README.md)**
3. **Abre una Discusión**
4. **Pregunta en Issues**

---

## 🚀 Tu Primer Contribución

### Pasos

1. **Fork el repositorio**

   ```bash
   git clone https://github.com/tu-usuario/taskflow-spotify
   cd taskflow-spotify
   ```

2. **Crea una rama**

   ```bash
   git checkout -b feature/tu-feature
   ```

3. **Haz tus cambios**
   - Edita archivos
   - Sigue la guía de estilo
   - Testea manualmente

4. **Commit**

   ```bash
   git add .
   git commit -m "[feat] Descripción de tu cambio"
   ```

5. **Push**

   ```bash
   git push origin feature/tu-feature
   ```

6. **Abre un Pull Request**
   - Llena la descripción
   - Liga a issues relacionados
   - Espera feedback

---

## 🎉 ¡Gracias por Contribuir!

