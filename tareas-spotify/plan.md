# Plan de Refactorizacion de `app.js`

## Objetivo

Dividir [app.js](C:\Users\wadei\Documents\taskflow-project\tareas-spotify\app.js) en modulos pequenos, mantenibles y testeables, sin romper el comportamiento actual de la aplicacion.

El objetivo no es solo "ordenar codigo", sino mejorar:

- mantenibilidad
- legibilidad
- aislamiento de responsabilidades
- facilidad para probar cambios
- seguridad al trabajar en equipo

---

## Problemas tecnicos actuales

### 1. Acoplamiento fuerte

El archivo mezcla en el mismo lugar:

- estado global
- reglas de negocio
- persistencia con `localStorage`
- render del DOM
- eventos
- drag and drop
- modo seleccion/borrado
- tema claro/oscuro
- comunicacion con modales

Impacto:

- cualquier cambio pequeno puede romper otra funcionalidad
- cuesta localizar errores
- cuesta reutilizar funciones

### 2. Estado mutable sin encapsulacion

Hoy `estado` se modifica directamente desde multiples funciones.

Riesgos:

- inconsistencias de UI
- dependencias implicitas
- dificil garantizar invariantes

Ejemplos de invariantes que deberian protegerse:

- si `modoSeleccion === false`, `tareasSeleccionadas` debe quedar vacio
- si se cancela modo seleccion, la casilla debe volver a representar `completada`
- los filtros no deben modificar datos persistidos

### 3. Render y logica de negocio mezclados

Funciones como `crearNodoTarea()` no solo renderizan:

- asignan comportamiento
- cambian accesibilidad
- ajustan UI segun modo
- aplican reglas de seleccion/completado

Esto hace que el render deje de ser una capa simple y predecible.

### 4. Side effects dispersos

Hay multiples puntos donde:

- se muta estado
- se guarda en `localStorage`
- se re-renderiza

No existe una politica unica y clara de actualizacion.

### 5. Dependencia fuerte del DOM

Varias reglas de negocio dependen de:

- `refs.inputBusqueda.value`
- nodos concretos
- elementos globales del DOM

Eso complica testing y reuso.

### 6. APIs globales implicitas

Actualmente existen contratos en `window` como:

- `window.abrirModal`
- `window.cerrarModal`
- `window.mostrarConfirmacion`

Funcionan, pero deberian quedar encapsulados como servicios o controladores UI.

---

## Arquitectura objetivo

Se recomienda una arquitectura simple de tipo:

- `store` central para estado
- `selectors` para calculos derivados
- `render` para UI
- `services` para persistencia
- `controllers` para eventos y comportamiento especifico

Flujo esperado:

1. El usuario dispara un evento.
2. Un controlador llama una accion del store.
3. El store muta estado de forma controlada.
4. Si hace falta, se persiste.
5. Se dispara un render consistente.

---

## Estructura de archivos propuesta

```text
tareas-spotify/
├── app.js                     # temporal, hasta completar migracion
├── src/
│   └── js/
│       ├── main.js
│       ├── core/
│       │   ├── task-model.js
│       │   ├── store.js
│       │   └── storage.js
│       ├── selectors/
│       │   └── tasks.js
│       ├── ui/
│       │   ├── render-tasks.js
│       │   ├── render-panels.js
│       │   ├── theme.js
│       │   ├── modal-controller.js
│       │   ├── confirm-controller.js
│       │   └── dragdrop-controller.js
│       └── shared/
│           └── dom-refs.js
└── plan.md
```

---

## Responsabilidad de cada modulo

### `src/js/core/task-model.js`

Responsabilidad:

- `generarId()`
- `normalizarCancion(item)`
- validaciones de tarea
- defaults de dominio

Regla:

No debe tocar DOM ni `localStorage`.

### `src/js/core/storage.js`

Responsabilidad:

- leer tareas desde `localStorage`
- guardar tareas
- leer tema
- guardar tema

API sugerida:

```js
export function cargarTareas();
export function guardarTareas(tareas);
export function cargarTema();
export function guardarTema(tema);
```

### `src/js/core/store.js`

Responsabilidad:

- encapsular el estado global
- exponer acciones controladas
- proteger invariantes

API sugerida:

```js
export function getState();
export function subscribe(listener);
export function inicializarEstado(payload);
export function setFiltroTexto(valor);
export function setFiltroEstado(valor);
export function setFiltroDificultad(valor);
export function activarModoSeleccion();
export function cancelarModoSeleccion();
export function toggleSeleccionTarea(id);
export function toggleCompletada(id);
export function agregarTarea(payload);
export function actualizarTarea(id, payload);
export function eliminarTarea(id);
export function eliminarSeleccionadas();
export function completarTodas();
export function moverCompletadasAPendientes();
export function reordenarTareas(draggedId, targetId);
export function moverTareaSegunDestino(id, destino);
```

### `src/js/selectors/tasks.js`

Responsabilidad:

- calculos puros derivados del estado

Ejemplos:

```js
export function getTareasFiltradas(state);
export function getTareasPendientesVisibles(state);
export function getTareasCompletadasVisibles(state);
export function getEstadisticas(state);
export function getResumenVista(state);
```

Ventaja:

Estas funciones se pueden testear sin DOM.

### `src/js/shared/dom-refs.js`

Responsabilidad:

- centralizar `document.getElementById(...)`
- evitar repetir busquedas del DOM

Ejemplo:

```js
export const refs = {
  inputBusqueda: document.getElementById("buscarTarea"),
  botonBorrar: document.getElementById("borrarSeleccionadas"),
  ...
};
```

### `src/js/ui/render-tasks.js`

Responsabilidad:

- render de listas
- render de tarea individual
- estados vacios

Regla:

No debe decidir logica de negocio. Solo reflejar el estado recibido.

### `src/js/ui/render-panels.js`

Responsabilidad:

- estadisticas
- resumen
- textos de botones
- contadores

### `src/js/ui/theme.js`

Responsabilidad:

- aplicar tema inicial
- alternar tema
- sincronizar texto del boton

### `src/js/ui/modal-controller.js`

Responsabilidad:

- abrir/cerrar modal principal
- cargar datos para edicion
- procesar submit del formulario

### `src/js/ui/confirm-controller.js`

Responsabilidad:

- exponer una API de confirmacion desacoplada del resto

Ejemplo:

```js
export async function confirmar({ titulo, mensaje, detalle });
```

### `src/js/ui/dragdrop-controller.js`

Responsabilidad:

- `dragstart`
- `dragover`
- `dragleave`
- `drop`
- coordinacion con store

### `src/js/main.js`

Responsabilidad:

- inicializar la app
- suscribir render al store
- registrar listeners globales
- coordinar modulos

Debe ser pequeno.

Objetivo:

- 40 a 80 lineas, no un archivo grande otra vez

---

## Invariantes funcionales obligatorios

Durante el refactor se deben preservar estas reglas:

1. En modo normal, la casilla representa `completada`.
2. En modo borrado, la misma casilla representa `seleccionada para eliminar`.
3. Al cancelar modo borrado:
   - `modoSeleccion = false`
   - `tareasSeleccionadas` queda vacio
   - todas las casillas vuelven a representar `completada`
4. Los filtros solo afectan vista, nunca persistencia.
5. Editar una tarea no debe cambiar su estado de seleccion.
6. Drag & drop no debe alterar filtros ni romper seleccion.
7. `localStorage` debe seguir soportando datos antiguos normalizados.

---

## Orden tecnico recomendado de implementacion

### Fase 1. Congelar comportamiento actual

Antes de mover codigo:

- crear checklist manual de regresion
- definir flujo critico de la app
- documentar comportamiento esperado

Checklist minima:

- agregar tarea
- editar tarea
- borrar tarea individual
- activar modo borrado
- seleccionar varias tareas
- cancelar modo borrado
- eliminar seleccionadas
- completar/descompletar tarea
- completar todas
- mover completadas a pendientes
- filtros por texto/estado/dificultad
- drag & drop
- persistencia al recargar
- tema oscuro/claro

### Fase 2. Extraer dominio y persistencia

Mover primero:

- `generarId`
- `normalizarCancion`
- acceso a `localStorage`

Motivo:

Es la parte menos riesgosa y mas facil de testear.

### Fase 3. Crear store

Crear un store con:

- estado interno privado
- acciones publicas
- suscripciones

Objetivo:

eliminar mutacion libre de `estado`.

### Fase 4. Extraer selectors

Mover:

- filtros
- estadisticas
- resumen

Regla:

deben ser funciones puras.

### Fase 5. Separar render

Mover:

- `crearNodoTarea`
- render de listas
- render de paneles
- actualizacion de textos

Meta:

que el render reciba `state` y pinte la vista sin decidir negocio.

### Fase 6. Separar controladores UI

Mover:

- modal principal
- confirmacion
- tema
- drag & drop

### Fase 7. Limpiar `app.js`

Cuando todo este migrado:

- reemplazar `app.js` por `src/js/main.js`
- o dejar `app.js` solo como punto de entrada que importe `main.js`

---

## Criterios de calidad por modulo

Cada archivo nuevo debe cumplir:

- una responsabilidad principal
- funciones cortas
- nombres explicitos
- sin side effects ocultos
- sin dependencia innecesaria de `window`
- sin tocar DOM si pertenece a capa de dominio
- sin leer `localStorage` fuera de `storage.js`

---

## Recomendaciones de buenas practicas laborales

### 1. No refactorizar todo en una sola entrega

Hacer cambios pequenos y revisables.

### 2. Una responsabilidad por PR o bloque de trabajo

Ejemplos:

- PR 1: extraer `storage.js`
- PR 2: introducir `store.js`
- PR 3: mover `selectors`
- PR 4: mover render
- PR 5: mover drag & drop

### 3. Refactor sin cambio de comportamiento

Mientras no haya ticket funcional, el objetivo es mover estructura, no redisenar comportamiento.

### 4. Mantener una checklist de regresion obligatoria

Antes de cerrar cada fase:

- revisar flujos clave
- verificar persistencia
- verificar modo borrado
- verificar checkbox dual

### 5. Documentar contratos

Cada modulo debe dejar claro:

- que recibe
- que devuelve
- que side effects produce

### 6. Evitar dependencias globales nuevas

Si un modulo requiere `window`, encapsularlo.

### 7. Proteger naming y consistencia

Usar un idioma unico en codigo.

Recomendacion:

- mantener nombres en espanol por consistencia con el proyecto

### 8. No mezclar refactor y cambios visuales grandes

Separar:

- refactor de arquitectura
- mejoras de UX/UI

Eso reduce ruido en revision.

---

## Testing recomendado

### Tests unitarios prioritarios

- `normalizarCancion`
- `getTareasFiltradas`
- `getEstadisticas`
- `toggleCompletada`
- `toggleSeleccionTarea`
- `cancelarModoSeleccion`
- `eliminarSeleccionadas`

### Tests de integracion prioritarios

- checkbox dual segun modo
- cancelar modo borrado limpia seleccion
- persistencia al recargar
- drag & drop entre listas

### Si no se incorpora framework todavia

Mantener un documento con pruebas manuales versionadas.

---

## Riesgos del refactor

1. Romper la relacion entre checkbox y modo seleccion.
2. Romper persistencia de datos ya guardados.
3. Duplicar renders o perder sincronizacion visual.
4. Introducir dependencias circulares entre modulos.
5. Mover demasiado rapido sin validacion por fases.

Mitigacion:

- cambios pequenos
- checklist por fase
- pruebas manuales obligatorias
- validar sintaxis y comportamiento despues de cada paso

---

## Definicion de terminado

El trabajo se considera bien hecho cuando:

- `app.js` deja de concentrar toda la aplicacion
- el estado queda encapsulado
- persistencia esta aislada
- render y negocio estan separados
- checkbox dual sigue funcionando sin regresiones
- la app mantiene el comportamiento actual
- el equipo puede tocar una parte sin miedo a romper otra

---

## Siguiente paso recomendado

Ejecutar primero una migracion minima de bajo riesgo:

1. crear `src/js/core/task-model.js`
2. crear `src/js/core/storage.js`
3. mover funciones puras ahi
4. dejar `app.js` consumiendo esos modulos
5. validar que todo siga funcionando

Ese paso crea una base limpia para continuar con store y render.
