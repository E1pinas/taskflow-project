const LLAVE = "taskflow_spotify_tareas";
const TEMA = "taskflow_spotify_tema";

function generarId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizarCancion(item) {
  if (!item || typeof item !== "object") {
    return null;
  }

  let artista = typeof item.artista === "string" ? item.artista.trim() : "";
  let cancion = typeof item.cancion === "string" ? item.cancion.trim() : "";
  let album = typeof item.album === "string" ? item.album.trim() : "";
  let imagen = typeof item.imagen === "string" ? item.imagen : "";
  let completada =
    typeof item.completada === "boolean" ? item.completada : false; 
  let dificultad =
    typeof item.dificultad === "string" ? item.dificultad : "media";

  if ((!artista || !cancion) && typeof item.texto === "string") {
    const texto = item.texto.trim();

    if (texto.includes(" - ")) {
      const [artistPart, ...songParts] = texto.split(" - ");
      artista = artista || artistPart.trim();
      cancion = cancion || songParts.join(" - ").trim();
    } else {
      cancion = cancion || texto;
    }
  }

  return {
    id:
      typeof item.id === "string" || typeof item.id === "number"
        ? String(item.id)
        : generarId(),
    artista: artista || "Artista desconocido",
    cancion: cancion || "Cancion sin nombre",
    album: album || "Sencillo",
    imagen,
    completada,
    dificultad: ["facil", "media", "dificil"].includes(dificultad)
      ? dificultad
      : "media",
  };
}

const refs = {
  listaPendientes: document.getElementById("listaTareasPendientes"),  
  listaCompletadas: document.getElementById("listaTareasCompletadas"),
  inputBusqueda: document.getElementById("buscarTarea"),
  limpiarBusqueda: document.getElementById("limpiarBusqueda"),
  filtroEstadoRadios: document.querySelectorAll('input[name="estado"]'),
  filtroDificultad: document.getElementById("filtrarDificultad"),
  botonBorrar: document.getElementById("borrarSeleccionadas"),
  botonAbrirModal: document.getElementById("abrirModal"),
  botonCompletarTodas: document.getElementById("moverCompletadas"),
  botonMoverPendientes: document.getElementById("moverPendientes"),
  botonTema: document.getElementById("toggleTema"),
  templateTarea: document.getElementById("taskTemplate"),
  toastContainer: document.getElementById("toastContainer"),
  resumenVista: document.getElementById("resumenVista"),
  contadorPendientesVista: document.getElementById("contadorPendientesVista"),
  contadorCompletadasVista: document.getElementById("contadorCompletadasVista"),
  totalTareas: document.getElementById("totalTareas"),
  completadas: document.getElementById("completadas"),
  pendientes: document.getElementById("pendientes"),
  facil: document.getElementById("facil"),
  media: document.getElementById("media"),
  dificil: document.getElementById("dificil"),
};

const estado = {
  tareas: (JSON.parse(localStorage.getItem(LLAVE)) || [])
    .map(normalizarCancion)
    .filter(Boolean),
  tareasSeleccionadas: new Set(),
  filtroTexto: "",
  estadoFiltro: "todos",
  dificultadFiltro: "todas",
  tareaEditandoId: null,
  modoSeleccion: false,
};

function getFiltroTextoActual() {
  return refs.inputBusqueda.value.trim().toLowerCase();
}

function guardarTareas() {
  localStorage.setItem(LLAVE, JSON.stringify(estado.tareas));
}

function construirTextoBusqueda(tarea) {
  return `${tarea.artista} ${tarea.cancion} ${tarea.album} ${tarea.dificultad}`.toLowerCase();
}

function mostrarToast(mensaje, tipo = "info") {
  if (!refs.toastContainer) {
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
  refs.toastContainer.appendChild(toast);

  window.setTimeout(() => {
    toast.classList.add("opacity-0");
    window.setTimeout(() => toast.remove(), 300);
  }, 2400);
}

function actualizarTextoBotonTema() {
  if (!refs.botonTema) {
    return;
  }

  const esOscuro = document.documentElement.classList.contains("dark");
  refs.botonTema.textContent = esOscuro ? "Modo claro" : "Modo oscuro";
  refs.botonTema.setAttribute(
    "aria-pressed",
    esOscuro ? "true" : "false",
  );
}

function aplicarTemaInicial() {
  const temaGuardado = localStorage.getItem(TEMA);
  const prefiereOscuro = window.matchMedia("(prefers-color-scheme: dark)");
  const temaOscuro =
    temaGuardado === null ? prefiereOscuro.matches : temaGuardado === "dark";

  document.documentElement.classList.toggle("dark", temaOscuro);
  actualizarTextoBotonTema();
}

function salirModoSeleccion() {
  estado.modoSeleccion = false;
  estado.tareasSeleccionadas.clear();
}

function cancelarModoSeleccion() {
  salirModoSeleccion();
  renderTareas();
}

function actualizarControlesBusqueda() {
  if (!refs.limpiarBusqueda) {
    return;
  }

  const hayTexto = refs.inputBusqueda.value.trim().length > 0;
  refs.limpiarBusqueda.disabled = !hayTexto;
  refs.limpiarBusqueda.classList.toggle("hidden", !hayTexto);
}

function getTareasFiltradas() {
  const filtroTexto = estado.filtroTexto;

  return estado.tareas.filter((tarea) => {
    if (!construirTextoBusqueda(tarea).includes(filtroTexto)) {
      return false;
    }

    if (
      estado.estadoFiltro === "pendientes" &&
      tarea.completada
    ) {
      return false;
    }

    if (
      estado.estadoFiltro === "completadas" &&
      !tarea.completada
    ) {
      return false;
    }

    if (
      estado.dificultadFiltro !== "todas" &&
      tarea.dificultad !== estado.dificultadFiltro
    ) {
      return false;
    }

    return true;
  });
}

function actualizarEstadisticas() {
  const total = estado.tareas.length;
  const completadas = estado.tareas.filter((tarea) => tarea.completada).length;
  const pendientes = total - completadas;

  refs.totalTareas.textContent = `Total: ${total}`;
  refs.completadas.textContent = `Completadas: ${completadas}`;
  refs.pendientes.textContent = `Pendientes: ${pendientes}`;
  refs.facil.textContent = `Fácil: ${estado.tareas.filter((t) => t.dificultad === "facil").length}`;
  refs.media.textContent = `Media: ${estado.tareas.filter((t) => t.dificultad === "media").length}`;
  refs.dificil.textContent = `Difícil: ${estado.tareas.filter((t) => t.dificultad === "dificil").length}`;
}

function actualizarResumenVista(tareasFiltradas) {
  const pendientes = tareasFiltradas.filter((t) => !t.completada).length;
  const completadas = tareasFiltradas.length - pendientes;
  const partes = [`${tareasFiltradas.length} resultados`];

  if (estado.filtroTexto) {
    partes.push(`busqueda: "${refs.inputBusqueda.value.trim()}"`);
  }

  if (estado.estadoFiltro !== "todos") {
    partes.push(`estado: ${estado.estadoFiltro}`);
  }

  if (estado.dificultadFiltro !== "todas") {
    partes.push(`dificultad: ${estado.dificultadFiltro}`);
  }

  if (estado.modoSeleccion) {
    partes.push(
      estado.tareasSeleccionadas.size > 0
        ? `${estado.tareasSeleccionadas.size} seleccionadas`
        : "modo seleccion activo",
    );
  }

  refs.resumenVista.textContent = partes.join(" • ");
  refs.contadorPendientesVista.textContent = String(pendientes);
  refs.contadorCompletadasVista.textContent = String(completadas);
}

function actualizarBotonesModo() {
  if (estado.modoSeleccion) {
    refs.botonBorrar.textContent =
      estado.tareasSeleccionadas.size > 0
        ? `Eliminar seleccionadas (${estado.tareasSeleccionadas.size})`
        : "Cancelar seleccion";
    return;
  }

  refs.botonBorrar.textContent = "Seleccionar para borrar";
}

function crearEstadoVacio(mensaje) {
  const item = document.createElement("li");
  item.className =
    "px-4 py-6 text-sm text-center border border-dashed surface-card rounded-xl ui-text-muted";
  item.textContent = mensaje;
  return item;
}

function aplicarEstiloDificultad(li, dificultad) {
  const estilos = {
    facil: "task-card--facil",
    media: "task-card--media",
    dificil: "task-card--dificil",
  };

  li.classList.add(estilos[dificultad] || estilos.media);
}

function crearNodoTarea(tarea) {
  const li = refs.templateTarea.content.cloneNode(true).querySelector("li");
  li.dataset.id = tarea.id;
  li.draggable = true;
  aplicarEstiloDificultad(li, tarea.dificultad);

  const checkbox = li.querySelector(".task-checkbox");
  const img = li.querySelector(".task-image");
  const cancion = li.querySelector(".task-cancion");
  const artista = li.querySelector(".task-artista");
  const album = li.querySelector(".task-album");
  const dificultad = li.querySelector(".task-dificultad");

  const estaSeleccionada = estado.tareasSeleccionadas.has(tarea.id);
  checkbox.checked = estado.modoSeleccion ? estaSeleccionada : tarea.completada;
  checkbox.dataset.action = estado.modoSeleccion ? "select" : "toggle";
  checkbox.dataset.id = tarea.id;
  checkbox.setAttribute(
    "aria-label",
    estado.modoSeleccion
      ? `Seleccionar ${tarea.cancion} para borrar`
      : `Marcar ${tarea.cancion} como completada`,
  );

  if (estado.modoSeleccion && estaSeleccionada) {
    li.style.borderColor = "var(--ui-accent)";
    li.style.boxShadow = "0 0 0 3px color-mix(in srgb, transparent 78%, var(--ui-accent))";
  }

  cancion.textContent = tarea.cancion;
  artista.textContent = tarea.artista;
  album.textContent = tarea.album;
  dificultad.textContent = `Dificultad: ${tarea.dificultad}`;

  if (tarea.completada) {
    [cancion, artista, album, dificultad].forEach((elemento) => {
      elemento.classList.add("line-through", "opacity-70");
    });
  }

  if (tarea.imagen) {
    img.src = tarea.imagen;
    img.alt = `Portada de ${tarea.cancion}`;
    img.style.display = "block";
  } else {
    img.removeAttribute("src");
    img.style.display = "none";
  }

  const editBtn = li.querySelector(".edit-btn");
  editBtn.dataset.action = "edit";
  editBtn.dataset.id = tarea.id;

  const deleteBtn = li.querySelector(".delete-btn");
  deleteBtn.dataset.action = "delete";
  deleteBtn.dataset.id = tarea.id;

  return li;
}

function renderLista(lista, items, mensajeVacio) {
  lista.innerHTML = "";

  if (items.length === 0) {
    lista.appendChild(crearEstadoVacio(mensajeVacio));
    return;
  }

  const fragment = document.createDocumentFragment();
  items.forEach((tarea) => fragment.appendChild(crearNodoTarea(tarea)));
  lista.appendChild(fragment);
}

function renderTareas() {
  estado.filtroTexto = getFiltroTextoActual();
  actualizarControlesBusqueda();

  const tareasFiltradas = getTareasFiltradas();
  const pendientes = tareasFiltradas.filter((tarea) => !tarea.completada);
  const completadas = tareasFiltradas.filter((tarea) => tarea.completada);

  renderLista(
    refs.listaPendientes,
    pendientes,
    estado.tareas.length === 0
      ? "Todavia no tienes canciones pendientes. Agrega una nueva para empezar."
      : "No hay tareas pendientes con los filtros actuales.",
  );
  renderLista(
    refs.listaCompletadas,
    completadas,
    "No hay tareas completadas con los filtros actuales.",
  );

  actualizarEstadisticas();
  actualizarResumenVista(tareasFiltradas);
  actualizarBotonesModo();
}

function commitCambios() {
  guardarTareas();
  renderTareas();
}

function agregarTarea({ artista, cancion, album, dificultad, imagen }) {
  estado.tareas.push({
    id: generarId(),
    artista: artista.trim() || "Artista desconocido",
    cancion: cancion.trim(),
    album: album.trim() || "Sencillo",
    dificultad: dificultad || "media",
    imagen: imagen || "",
    completada: false,
  });

  commitCambios();
  mostrarToast("Cancion agregada correctamente.");
}

function actualizarTarea(id, datos) {
  const tarea = estado.tareas.find((item) => item.id === id);

  if (!tarea) {
    return;
  }

  tarea.artista = datos.artista.trim() || "Artista desconocido";
  tarea.cancion = datos.cancion.trim();
  tarea.album = datos.album.trim() || "Sencillo";
  tarea.dificultad = datos.dificultad || "media";

  if (datos.imagen) {
    tarea.imagen = datos.imagen;
  }

  commitCambios();
  mostrarToast("Cancion actualizada.");
}

async function eliminarTarea(id) {
  const tarea = estado.tareas.find((item) => item.id === id);

  if (!tarea) {
    return;
  }

  const confirmado = await window.mostrarConfirmacion({
    titulo: "Eliminar cancion",
    mensaje: `¿Seguro que quieres eliminar "${tarea.cancion}"?`,
    detalle: `${tarea.artista} • ${tarea.album}`,
  });

  if (!confirmado) {
    return;
  }

  estado.tareas = estado.tareas.filter((item) => item.id !== id);
  estado.tareasSeleccionadas.delete(id);
  commitCambios();
  mostrarToast("Cancion eliminada.", "warning");
}

function toggleCompletada(id) {
  const tarea = estado.tareas.find((item) => item.id === id);

  if (!tarea) {
    return;
  }

  tarea.completada = !tarea.completada;
  commitCambios();
}

function reordenarTareas(draggedId, targetId) {
  const draggedIndex = estado.tareas.findIndex((t) => t.id === draggedId);
  const targetIndex = estado.tareas.findIndex((t) => t.id === targetId);

  if (draggedIndex === -1 || targetIndex === -1 || draggedIndex === targetIndex) {
    return;
  }

  const [draggedItem] = estado.tareas.splice(draggedIndex, 1);
  estado.tareas.splice(targetIndex, 0, draggedItem);
  commitCambios();
}

function moverTareaSegunDestino(draggedId, listaDestinoId) {
  const tarea = estado.tareas.find((item) => item.id === draggedId);

  if (!tarea) {
    return;
  }

  if (listaDestinoId === "listaTareasPendientes" && tarea.completada) {
    tarea.completada = false;
    commitCambios();
  }

  if (listaDestinoId === "listaTareasCompletadas" && !tarea.completada) {
    tarea.completada = true;
    commitCambios();
  }
}

async function completarTodasLasTareas() {
  const pendientes = estado.tareas.filter((tarea) => !tarea.completada);

  if (pendientes.length === 0) {
    mostrarToast("No hay tareas pendientes para completar.", "warning");
    return;
  }

  const confirmado = await window.mostrarConfirmacion({
    titulo: "Completar todas las tareas",
    mensaje: "¿Quieres mover todas las tareas pendientes a completadas?",
    detalle: pendientes.map((t) => `• "${t.cancion}" de ${t.artista}`).join("\n"),
  });

  if (!confirmado) {
    return;
  }

  pendientes.forEach((tarea) => {
    tarea.completada = true;
  });
  commitCambios();
  mostrarToast(`${pendientes.length} tareas completadas.`);
}

async function moverCompletadasAPendientes() {
  const completadas = estado.tareas.filter((tarea) => tarea.completada);

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

  completadas.forEach((tarea) => {
    tarea.completada = false;
  });
  commitCambios();
  mostrarToast(`${completadas.length} tareas movidas a pendientes.`, "warning");
}

function abrirModalEdicion(id) {
  const tarea = estado.tareas.find((item) => item.id === id);
  const modal = document.getElementById("modal");

  if (!tarea || !modal) {
    return;
  }

  estado.tareaEditandoId = id;

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

function prepararModalNuevaTarea() {
  estado.tareaEditandoId = null;

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

    let imagen = "";
    const archivoImagen = imagenCancion.files?.[0] || null;

    if (archivoImagen) {
      try {
        imagen = await leerImagenComoDataURL(archivoImagen);
      } catch (error) {
        mostrarToast("No se pudo leer la imagen seleccionada.", "error");
      }
    }

    const datosFormulario = {
      artista: artistaCancion.value,
      cancion,
      album: albumCancion.value,
      dificultad: dificultadCancion.value,
      imagen,
    };

    if (estado.tareaEditandoId) {
      actualizarTarea(estado.tareaEditandoId, datosFormulario);
    } else {
      agregarTarea(datosFormulario);
    }

    estado.tareaEditandoId = null;
    form.reset();
    window.cerrarModal();
  });
}

async function borrarSeleccionadas() {
  const ids = Array.from(estado.tareasSeleccionadas);

  if (ids.length === 0) {
    cancelarModoSeleccion();
    return;
  }

  const detalle = estado.tareas
    .filter((tarea) => estado.tareasSeleccionadas.has(tarea.id))
    .map((tarea) => `• "${tarea.cancion}" de ${tarea.artista}`)
    .join("\n");

  const confirmado = await window.mostrarConfirmacion({
    titulo: "Eliminar seleccionadas",
    mensaje: `¿Seguro que quieres eliminar ${ids.length} canciones?`,
    detalle,
  });

  if (!confirmado) {
    return;
  }

  estado.tareas = estado.tareas.filter(
    (tarea) => !estado.tareasSeleccionadas.has(tarea.id),
  );
  salirModoSeleccion();
  commitCambios();
  mostrarToast(`${ids.length} canciones eliminadas.`, "warning");
}

function gestionarClickLista(event) {
  const accionable = event.target.closest("[data-action]");

  if (!accionable) {
    return;
  }

  const { action, id } = accionable.dataset;

  if (action === "edit") {
    abrirModalEdicion(id);
  }

  if (action === "delete") {
    eliminarTarea(id);
  }
}

function gestionarCambioLista(event) {
  const accionable = event.target.closest("[data-action]");

  if (!accionable) {
    return;
  }

  const { action, id } = accionable.dataset;

  if (action === "toggle") {
    toggleCompletada(id);
  }

  if (action === "select") {
    if (accionable.checked) {
      estado.tareasSeleccionadas.add(id);
    } else {
      estado.tareasSeleccionadas.delete(id);
    }

    actualizarBotonesModo();
    actualizarResumenVista(getTareasFiltradas());
    renderTareas();
  }
}

function gestionarDragStart(event) {
  const item = event.target.closest("li[data-id]");

  if (!item || !event.dataTransfer) {
    return;
  }

  event.dataTransfer.setData("text/plain", item.dataset.id);
  item.classList.add("opacity-50");
}

function gestionarDragEnd(event) {
  const item = event.target.closest("li[data-id]");

  if (item) {
    item.classList.remove("opacity-50");
  }
}

function gestionarDragOver(event) {
  const lista = event.currentTarget;
  event.preventDefault();

  const item = event.target.closest("li[data-id]");
  lista.style.borderColor = "var(--ui-accent)";

  if (item) {
    item.style.borderColor = "var(--ui-accent)";
  }
}

function gestionarDragLeave(event) {
  const lista = event.currentTarget;
  const item = event.target.closest("li[data-id]");

  if (item) {
    item.style.removeProperty("border-color");
  }

  if (!lista.contains(event.relatedTarget)) {
    lista.style.removeProperty("border-color");
  }
}

function gestionarDrop(event) {
  event.preventDefault();

  const lista = event.currentTarget;
  const draggedId = event.dataTransfer?.getData("text/plain");
  const item = event.target.closest("li[data-id]");

  lista.style.removeProperty("border-color");
  lista.querySelectorAll("li[data-id]").forEach((nodo) => {
    nodo.style.removeProperty("border-color");
  });

  if (!draggedId) {
    return;
  }

  if (item && item.dataset.id !== draggedId) {
    reordenarTareas(draggedId, item.dataset.id);
    return;
  }

  moverTareaSegunDestino(draggedId, lista.id);
}

function registrarEventosListas() {
  [refs.listaPendientes, refs.listaCompletadas].forEach((lista) => {
    lista.addEventListener("click", gestionarClickLista);
    lista.addEventListener("change", gestionarCambioLista);
    lista.addEventListener("dragstart", gestionarDragStart);
    lista.addEventListener("dragend", gestionarDragEnd);
    lista.addEventListener("dragover", gestionarDragOver);
    lista.addEventListener("dragleave", gestionarDragLeave);
    lista.addEventListener("drop", gestionarDrop);
  });
}

function registrarEventosControles() {
  refs.inputBusqueda.addEventListener("dragover", (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "none";
  });

  refs.inputBusqueda.addEventListener("drop", (event) => {
    event.preventDefault();
  });

  refs.inputBusqueda.addEventListener("input", () => {
    renderTareas();
  });

  refs.limpiarBusqueda.addEventListener("click", () => {
    refs.inputBusqueda.value = "";
    renderTareas();
    refs.inputBusqueda.focus();
  });

  refs.filtroEstadoRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.checked) {
        estado.estadoFiltro = radio.value;
        renderTareas();
      }
    });
  });

  refs.filtroDificultad.addEventListener("change", () => {
    estado.dificultadFiltro = refs.filtroDificultad.value;
    renderTareas();
  });

  refs.botonTema?.addEventListener("click", () => {
    const activarOscuro = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", activarOscuro);
    localStorage.setItem(TEMA, activarOscuro ? "dark" : "light");
    actualizarTextoBotonTema();
  });

  refs.botonAbrirModal.addEventListener("click", () => {
    cancelarModoSeleccion();
    prepararModalNuevaTarea();
    window.abrirModal();
  });

  refs.botonBorrar.addEventListener("click", async () => {
    if (!estado.modoSeleccion) {
      estado.modoSeleccion = true;
      renderTareas();
      return;
    }

    if (estado.tareasSeleccionadas.size === 0) {
      cancelarModoSeleccion();
      return;
    }

    await borrarSeleccionadas();
  });

  refs.botonCompletarTodas.addEventListener("click", completarTodasLasTareas);
  refs.botonMoverPendientes.addEventListener("click", moverCompletadasAPendientes);

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      estado.modoSeleccion &&
      !document.getElementById("modal")?.classList.contains("hidden")
    ) {
      return;
    }

    if (event.key === "Escape" && estado.modoSeleccion) {
      cancelarModoSeleccion();
    }
  });
}

document.addEventListener("modalReady", inicializarFormularioModal);

aplicarTemaInicial();
registrarEventosListas();
registrarEventosControles();
renderTareas();
