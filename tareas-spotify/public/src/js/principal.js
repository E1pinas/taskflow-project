import { crearEstado } from "./core/estado.js";
import { cargarTema, guardarTema } from "./core/almacenamiento.js";
import { normalizarCancion } from "./core/modelo-tarea.js";
import {
  actualizarTarea as actualizarTareaApi,
  crearTarea as crearTareaApi,
  eliminarTarea as eliminarTareaApi,
  obtenerTareas as obtenerTareasApi,
} from "../api/client.js";
import { referencias } from "./shared/referencias-dom.js";
import { renderizarAplicacion } from "./ui/renderizado.js";

const estadoApp = crearEstado({
  tareas: [],
  modoSeleccion: false,
  tareasSeleccionadas: [],
});

const estadoUi = {
  filtroTexto: "",
  estadoFiltro: "todos",
  dificultadFiltro: "todas",
  tareaEditandoId: null,
  cargando: false,
  errorRed: "",
};
const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;

function obtenerEstadoAplicacion() {
  return {
    ...estadoApp.obtenerEstado(),
    ...estadoUi,
    textoBusquedaVisible: referencias.inputBusqueda.value.trim(),
  };
}

function renderizarEstadoActual() {
  estadoUi.filtroTexto = referencias.inputBusqueda.value.trim().toLowerCase();
  renderizarAplicacion(referencias, obtenerEstadoAplicacion());
}

function setEstadoRed(parcial) {
  Object.assign(estadoUi, parcial);
  renderizarEstadoActual();
}

function getMensajeError(error, fallback) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

function mostrarToast(mensaje, tipo = "info") {
  if (!referencias.toastContainer) {
    return;
  }

  const estilos = {
    info: "toast--accent",
    warning: "toast--neutral",
    error: "toast--neutral",
  };

  const toast = document.createElement("div");
  toast.className = `toast mb-2 rounded-lg px-4 py-2 text-sm shadow-md transition-opacity duration-300 ${estilos[tipo] || estilos.info}`;
  toast.textContent = mensaje;
  referencias.toastContainer.appendChild(toast);

  window.setTimeout(() => {
    toast.classList.add("opacity-0");
    window.setTimeout(() => toast.remove(), 300);
  }, 2400);
}

function actualizarTextoBotonTema() {
  const esOscuro = document.documentElement.classList.contains("dark");
  referencias.botonTema.textContent = esOscuro ? "Modo claro" : "Modo oscuro";
  referencias.botonTema.setAttribute(
    "aria-pressed",
    esOscuro ? "true" : "false",
  );
}

function aplicarTemaInicial() {
  const temaGuardado = cargarTema();
  const preferenciaSistema = window.matchMedia("(prefers-color-scheme: dark)");
  const temaOscuro =
    temaGuardado === null
      ? preferenciaSistema.matches
      : temaGuardado === "dark";

  document.documentElement.classList.toggle("dark", temaOscuro);
  actualizarTextoBotonTema();
}

async function cargarTareasDesdeApi() {
  setEstadoRed({ cargando: true, errorRed: "" });

  try {
    const tareas = await obtenerTareasApi();
    estadoApp.establecerTareas(
      (tareas || []).map(normalizarCancion).filter(Boolean),
    );
    setEstadoRed({ cargando: false, errorRed: "" });
  } catch (error) {
    setEstadoRed({
      cargando: false,
      errorRed: getMensajeError(error, "No se pudieron cargar las tareas."),
    });
  }
}

async function crearTareaFrontend(datos) {
  setEstadoRed({ cargando: true, errorRed: "" });

  try {
    const nuevaTarea = await crearTareaApi({
      ...datos,
      completada: false,
    });
    estadoApp.establecerTareas([
      ...estadoApp.obtenerEstado().tareas,
      normalizarCancion(nuevaTarea),
    ]);
    setEstadoRed({ cargando: false, errorRed: "" });
    mostrarToast("Cancion agregada correctamente.");
    return true;
  } catch (error) {
    const mensaje = getMensajeError(error, "No se pudo crear la tarea.");
    setEstadoRed({ cargando: false, errorRed: mensaje });
    mostrarToast(mensaje, "error");
    return false;
  }
}

async function actualizarTareaFrontend(id, datos) {
  setEstadoRed({ cargando: true, errorRed: "" });

  try {
    const tareaActualizada = await actualizarTareaApi(id, datos);
    estadoApp.establecerTareas(
      estadoApp
        .obtenerEstado()
        .tareas.map((tarea) =>
          tarea.id === id ? normalizarCancion(tareaActualizada) : tarea,
        ),
    );
    setEstadoRed({ cargando: false, errorRed: "" });
    mostrarToast("Cancion actualizada.");
    return true;
  } catch (error) {
    const mensaje = getMensajeError(error, "No se pudo actualizar la tarea.");
    setEstadoRed({ cargando: false, errorRed: mensaje });
    mostrarToast(mensaje, "error");
    return false;
  }
}

async function eliminarTarea(id) {
  const tarea = estadoApp.obtenerEstado().tareas.find((item) => item.id === id);

  if (!tarea) {
    return;
  }

  const confirmado = await window.mostrarConfirmacion({
    titulo: "Eliminar tarea",
    mensaje: `¿Seguro que quieres eliminar "${tarea.cancion}"?`,
    detalle: `${tarea.artista} , ${tarea.album}`,
  });

  if (!confirmado) {
    return;
  }

  setEstadoRed({ cargando: true, errorRed: "" });

  try {
    await eliminarTareaApi(id);
    estadoApp.establecerTareas(
      estadoApp.obtenerEstado().tareas.filter((item) => item.id !== id),
    );
    setEstadoRed({ cargando: false, errorRed: "" });
    mostrarToast("Cancion eliminada.", "warning");
  } catch (error) {
    const mensaje = getMensajeError(error, "No se pudo eliminar la tarea.");
    setEstadoRed({ cargando: false, errorRed: mensaje });
    mostrarToast(mensaje, "error");
  }
}

function prepararModalNuevaTarea() {
  estadoUi.tareaEditandoId = null;

  const modal = document.getElementById("modal");
  const form = document.getElementById("formTarea");

  if (!modal || !form) {
    return;
  }

  form.reset();

  const titulo = modal.querySelector("h2");
  if (titulo) {
    titulo.textContent = "Agregar cancion";
  }
}

function abrirModalEdicion(id) {
  const tarea = estadoApp.obtenerEstado().tareas.find((item) => item.id === id);
  const modal = document.getElementById("modal");

  if (!tarea || !modal) {
    return;
  }

  estadoUi.tareaEditandoId = id;

  const modalTitulo = modal.querySelector("h2");
  const artistaCancion = document.getElementById("artistaCancion");
  const nombreCancion = document.getElementById("nombreCancion");
  const albumCancion = document.getElementById("albumCancion");
  const dificultadCancion = document.getElementById("dificultadCancion");

  if (modalTitulo) {
    modalTitulo.textContent = "Editar cancion";
  }
  if (artistaCancion) {
    artistaCancion.value = tarea.artista;
  }
  if (nombreCancion) {
    nombreCancion.value = tarea.cancion;
  }
  if (albumCancion) {
    albumCancion.value = tarea.album;
  }
  if (dificultadCancion) {
    dificultadCancion.value = tarea.dificultad;
  }

  window.abrirModal();
}

function leerImagenComoDataURL(archivo) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
    reader.readAsDataURL(archivo);
  });
}

function inicializarFormularioModal() {
  const form = document.getElementById("formTarea");
  const artistaCancion = document.getElementById("artistaCancion");
  const nombreCancion = document.getElementById("nombreCancion");
  const albumCancion = document.getElementById("albumCancion");
  const dificultadCancion = document.getElementById("dificultadCancion");
  const imagenCancion = document.getElementById("imagenCancion");

  if (
    !form ||
    !artistaCancion ||
    !nombreCancion ||
    !albumCancion ||
    !dificultadCancion ||
    !imagenCancion
  ) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const cancion = nombreCancion.value.trim();
    if (!cancion) {
      mostrarToast("El nombre de la cancion es obligatorio.", "warning");
      nombreCancion.focus();
      return;
    }

    let imagen;
    const archivoImagen = imagenCancion.files?.[0] || null;

    if (archivoImagen) {
      if (archivoImagen.size > MAX_IMAGE_SIZE_BYTES) {
        mostrarToast(
          "La imagen no puede superar 2 MB en produccion.",
          "warning",
        );
        return;
      }

      try {
        imagen = await leerImagenComoDataURL(archivoImagen);
      } catch (_error) {
        mostrarToast("No se pudo leer la imagen seleccionada.", "error");
      }
    }

    const datosFormulario = {
      artista: artistaCancion.value,
      cancion,
      album: albumCancion.value,
      dificultad: dificultadCancion.value,
      ...(imagen !== undefined ? { imagen } : {}),
    };

    const ok = estadoUi.tareaEditandoId
      ? await actualizarTareaFrontend(estadoUi.tareaEditandoId, datosFormulario)
      : await crearTareaFrontend(datosFormulario);

    if (!ok) {
      return;
    }

    estadoUi.tareaEditandoId = null;
    form.reset();
    window.cerrarModal();
  });
}

async function borrarSeleccionadas() {
  const { tareas, tareasSeleccionadas } = estadoApp.obtenerEstado();
  const cantidad = tareasSeleccionadas.size;

  if (cantidad === 0) {
    estadoApp.cancelarModoSeleccion();
    return;
  }

  const detalle = tareas
    .filter((tarea) => tareasSeleccionadas.has(tarea.id))
    .map((tarea) => `• "${tarea.cancion}" de ${tarea.artista}`)
    .join("\n");

  const confirmado = await window.mostrarConfirmacion({
    titulo: "Eliminar seleccionadas",
    mensaje: `¿Seguro que quieres eliminar ${cantidad} canciones?`,
    detalle,
  });

  if (!confirmado) {
    return;
  }

  setEstadoRed({ cargando: true, errorRed: "" });

  try {
    await Promise.all(
      [...tareasSeleccionadas].map((id) => eliminarTareaApi(id)),
    );
    estadoApp.eliminarSeleccionadas();
    setEstadoRed({ cargando: false, errorRed: "" });
    mostrarToast(`${cantidad} canciones eliminadas.`, "warning");
  } catch (error) {
    const mensaje = getMensajeError(
      error,
      "No se pudieron eliminar todas las tareas.",
    );
    setEstadoRed({ cargando: false, errorRed: mensaje });
    mostrarToast(mensaje, "error");
  }
}

async function actualizarEstadoMasivo(
  tareasObjetivo,
  completada,
  mensajeExito,
  mensajeError,
  tipoToast = "info",
) {
  setEstadoRed({ cargando: true, errorRed: "" });

  try {
    const tareasActualizadas = await Promise.all(
      tareasObjetivo.map((tarea) =>
        actualizarTareaApi(tarea.id, { completada }),
      ),
    );

    const mapa = new Map(
      tareasActualizadas.map((tarea) => [tarea.id, normalizarCancion(tarea)]),
    );

    estadoApp.establecerTareas(
      estadoApp
        .obtenerEstado()
        .tareas.map((tarea) => mapa.get(tarea.id) || tarea),
    );
    setEstadoRed({ cargando: false, errorRed: "" });
    mostrarToast(mensajeExito, tipoToast);
  } catch (error) {
    const mensaje = getMensajeError(error, mensajeError);
    setEstadoRed({ cargando: false, errorRed: mensaje });
    mostrarToast(mensaje, "error");
  }
}

async function completarTodasLasTareas() {
  const pendientes = estadoApp
    .obtenerEstado()
    .tareas.filter((tarea) => !tarea.completada);

  if (pendientes.length === 0) {
    mostrarToast("No hay tareas pendientes para completar.", "warning");
    return;
  }

  const confirmado = await window.mostrarConfirmacion({
    titulo: "Completar todas las tareas",
    mensaje: "¿Quieres mover todas las tareas pendientes a completadas?",
    detalle: pendientes
      .map((t) => `• "${t.cancion}" de ${t.artista}`)
      .join("\n"),
  });

  if (!confirmado) {
    return;
  }

  await actualizarEstadoMasivo(
    pendientes,
    true,
    `${pendientes.length} tareas completadas.`,
    "No se pudieron completar las tareas.",
  );
}

async function moverCompletadasAPendientes() {
  const completadas = estadoApp
    .obtenerEstado()
    .tareas.filter((tarea) => tarea.completada);

  if (completadas.length === 0) {
    mostrarToast("No hay tareas completadas para mover.", "warning");
    return;
  }

  const confirmado = await window.mostrarConfirmacion({
    titulo: "Mover a pendientes",
    mensaje: "¿Quieres devolver todas las tareas completadas a pendientes?",
    detalle: completadas
      .map((t) => `• "${t.cancion}" de ${t.artista}`)
      .join("\n"),
  });

  if (!confirmado) {
    return;
  }

  await actualizarEstadoMasivo(
    completadas,
    false,
    `${completadas.length} tareas movidas a pendientes.`,
    "No se pudieron mover las tareas.",
    "warning",
  );
}

function reordenarTareas(draggedId, targetId) {
  const tareas = [...estadoApp.obtenerEstado().tareas];
  const draggedIndex = tareas.findIndex((t) => t.id === draggedId);
  const targetIndex = tareas.findIndex((t) => t.id === targetId);

  if (
    draggedIndex === -1 ||
    targetIndex === -1 ||
    draggedIndex === targetIndex
  ) {
    return;
  }

  const [draggedItem] = tareas.splice(draggedIndex, 1);
  tareas.splice(targetIndex, 0, draggedItem);
  estadoApp.establecerTareas(tareas);
}

async function moverTareaSegunDestino(draggedId, listaDestinoId) {
  const tarea = estadoApp
    .obtenerEstado()
    .tareas.find((item) => item.id === draggedId);

  if (!tarea) {
    return;
  }

  if (listaDestinoId === "listaTareasPendientes" && tarea.completada) {
    await actualizarTareaFrontend(draggedId, { completada: false });
  }

  if (listaDestinoId === "listaTareasCompletadas" && !tarea.completada) {
    await actualizarTareaFrontend(draggedId, { completada: true });
  }
}

function gestionarClickLista(event) {
  const accionable = event.target.closest("[data-action]");
  const tarea = event.target.closest("[data-role='task']");

  if (!accionable || !tarea) {
    return;
  }

  const { action } = accionable.dataset;
  const { id } = tarea.dataset;

  if (action === "edit") {
    abrirModalEdicion(id);
  }

  if (action === "delete") {
    eliminarTarea(id);
  }
}

async function gestionarCambioLista(event) {
  const accionable = event.target.closest("[data-action='toggle-tarea']");
  const tarea = event.target.closest("[data-role='task']");

  if (!accionable || !tarea) {
    return;
  }

  const estadoActual = estadoApp.obtenerEstado();

  if (estadoActual.modoSeleccion) {
    estadoApp.toggleTarea(tarea.dataset.id);
    return;
  }

  const tareaActual = estadoActual.tareas.find(
    (item) => item.id === tarea.dataset.id,
  );

  if (!tareaActual) {
    return;
  }

  await actualizarTareaFrontend(tarea.dataset.id, {
    completada: !tareaActual.completada,
  });
}

function gestionarDragStart(event) {
  const item = event.target.closest("[data-role='task']");

  if (!item || !event.dataTransfer) {
    return;
  }

  event.dataTransfer.setData("text/plain", item.dataset.id);
  item.classList.add("opacity-50");
}

function gestionarDragEnd(event) {
  const item = event.target.closest("[data-role='task']");

  if (item) {
    item.classList.remove("opacity-50");
  }
}

function gestionarDragOver(event) {
  const lista = event.currentTarget;
  const item = event.target.closest("[data-role='task']");

  event.preventDefault();
  lista.style.borderColor = "var(--ui-accent)";

  if (item) {
    item.style.borderColor = "var(--ui-accent)";
  }
}

function gestionarDragLeave(event) {
  const lista = event.currentTarget;
  const item = event.target.closest("[data-role='task']");

  if (item) {
    item.style.removeProperty("border-color");
  }

  if (!lista.contains(event.relatedTarget)) {
    lista.style.removeProperty("border-color");
  }
}

async function gestionarDrop(event) {
  const lista = event.currentTarget;
  const draggedId = event.dataTransfer?.getData("text/plain");
  const item = event.target.closest("[data-role='task']");

  event.preventDefault();
  lista.style.removeProperty("border-color");
  lista.querySelectorAll("[data-role='task']").forEach((nodo) => {
    nodo.style.removeProperty("border-color");
  });

  if (!draggedId) {
    return;
  }

  if (item && item.dataset.id !== draggedId) {
    reordenarTareas(draggedId, item.dataset.id);
    return;
  }

  await moverTareaSegunDestino(draggedId, lista.id);
}

function registrarEventosListas() {
  [referencias.listaPendientes, referencias.listaCompletadas].forEach(
    (lista) => {
      lista.addEventListener("click", gestionarClickLista);
      lista.addEventListener("change", gestionarCambioLista);
      lista.addEventListener("dragstart", gestionarDragStart);
      lista.addEventListener("dragend", gestionarDragEnd);
      lista.addEventListener("dragover", gestionarDragOver);
      lista.addEventListener("dragleave", gestionarDragLeave);
      lista.addEventListener("drop", gestionarDrop);
    },
  );
}

function registrarEventosControles() {
  referencias.inputBusqueda.addEventListener("dragover", (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "none";
  });

  referencias.inputBusqueda.addEventListener("drop", (event) => {
    event.preventDefault();
  });

  referencias.inputBusqueda.addEventListener("input", () => {
    renderizarEstadoActual();
  });

  referencias.filtroEstadoRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.checked) {
        estadoUi.estadoFiltro = radio.value;
        renderizarEstadoActual();
      }
    });
  });

  referencias.filtroDificultad.addEventListener("change", () => {
    estadoUi.dificultadFiltro = referencias.filtroDificultad.value;
    renderizarEstadoActual();
  });

  referencias.botonTema.addEventListener("click", () => {
    const activarOscuro = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", activarOscuro);
    guardarTema(activarOscuro ? "dark" : "light");
    actualizarTextoBotonTema();
  });

  referencias.botonAbrirModal.addEventListener("click", () => {
    estadoApp.cancelarModoSeleccion();
    prepararModalNuevaTarea();
    window.abrirModal();
  });

  referencias.botonBorrar.addEventListener("click", async () => {
    const estadoActual = estadoApp.obtenerEstado();

    if (!estadoActual.modoSeleccion) {
      estadoApp.toggleModoSeleccion();
      return;
    }

    if (estadoActual.tareasSeleccionadas.size === 0) {
      estadoApp.cancelarModoSeleccion();
      return;
    }

    await borrarSeleccionadas();
  });

  referencias.botonCompletarTodas.addEventListener(
    "click",
    completarTodasLasTareas,
  );
  referencias.botonMoverPendientes.addEventListener(
    "click",
    moverCompletadasAPendientes,
  );

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      estadoApp.obtenerEstado().modoSeleccion &&
      !document.getElementById("modal")?.classList.contains("hidden")
    ) {
      return;
    }

    if (event.key === "Escape" && estadoApp.obtenerEstado().modoSeleccion) {
      estadoApp.cancelarModoSeleccion();
    }
  });
}

estadoApp.suscribirse(() => {
  renderizarEstadoActual();
});

document.addEventListener("modalReady", inicializarFormularioModal);

aplicarTemaInicial();
registrarEventosListas();
registrarEventosControles();
renderizarEstadoActual();
cargarTareasDesdeApi();
