const LLAVE = "taskflow_spotify_tareas";
const TEMA = "taskflow_spotify_tema";

function generarId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
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
  let orden = typeof item.orden === "number" ? item.orden : Date.now();
  let dificultad = typeof item.dificultad === "string" ? item.dificultad : "media";

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

  if (!artista) {
    artista = "Artista desconocido";
  }
  if (!cancion) {
    cancion = "Cancion sin nombre";
  }
  if (!album) {
    album = "Sencillo";
  }

  return {
    id:
      typeof item.id === "string" || typeof item.id === "number"
        ? item.id
        : generarId(),
    artista,
    cancion,
    album,
    imagen,
    completada,
    orden,
    dificultad,
  };
}

let tareas = (JSON.parse(localStorage.getItem(LLAVE)) || [])
  .map(normalizarCancion)
  .filter(Boolean)
  .sort((a, b) => (a.orden || 0) - (b.orden || 0)); // Ordenar por campo orden

const tareasSeleccionadas = new Set();

let modoSeleccion = false;
let modoMoverCompletadas = false;
let modoMoverPendientes = false;

const listaTareasPendientes = document.getElementById("listaTareasPendientes");
const listaTareasCompletadas = document.getElementById(
  "listaTareasCompletadas",
);
const inputBusqueda = document.getElementById("buscarTarea");
const filtroEstadoRadios = document.querySelectorAll('input[name="estado"]');const filtroDificultadRadios = document.querySelectorAll('input[name=\"dificultad\"]');let estadoFiltro = "todos"; // 'todos' | 'pendientes' | 'completadas'
let criterioOrden = "orden"; // 'orden' | 'artista' | 'cancion' | 'album'

// allow dropping on empty container to move between lists
listaTareasPendientes.addEventListener("dragover", (e) => e.preventDefault());
listaTareasPendientes.addEventListener("drop", (e) => {
  e.preventDefault();
  const draggedId = e.dataTransfer.getData("text/plain");
  moverTareaSegunDestino(draggedId, "listaTareasPendientes");
});

listaTareasCompletadas.addEventListener("dragover", (e) => e.preventDefault());
listaTareasCompletadas.addEventListener("drop", (e) => {
  e.preventDefault();
  const draggedId = e.dataTransfer.getData("text/plain");
  moverTareaSegunDestino(draggedId, "listaTareasCompletadas");
});
const botonBorrarSeleccionadas = document.getElementById("borrarSeleccionadas");
const botonAbrirModal = document.getElementById("abrirModal");
const botonMoverCompletadas = document.getElementById("moverCompletadas");
const botonMoverPendientes = document.getElementById("moverPendientes");
const botonTema = document.getElementById("toggleTema");

const btnExportar = document.getElementById("exportarTareas");
const btnImportar = document.getElementById("importarTareas");
const inputImportFile = document.getElementById("importFile");

if (btnExportar) btnExportar.addEventListener("click", exportarTareas);
if (btnImportar && inputImportFile) {
  btnImportar.addEventListener("click", () => inputImportFile.click());
  inputImportFile.addEventListener("change", async (ev) => {
    const file = ev.target.files ? ev.target.files[0] : null;
    if (!file) return;
    try {
      const arr = await importarTareasDesdeArchivo(file);
      const confirmado = await mostrarConfirmacion({
        titulo: "Importar tareas",
        mensaje: "Los datos se reemplazarán por las tareas del archivo. ¿Continuar?",
      });
      if (confirmado) {
        tareas = (arr.map(normalizarCancion).filter(Boolean) || []).sort(
          (a, b) => (a.orden || 0) - (b.orden || 0),
        );
        commitCambios();
      }
    } catch (err) {
      mostrarToast("Error al importar: " + err.message, "error");
    } finally {
      // limpiar input para poder reusar el mismo archivo si se desea
      ev.target.value = "";
    }
  });
}

function actualizarTextoBotonTema() {
  if (!botonTema) {
    return;
  }
  botonTema.textContent = document.documentElement.classList.contains("dark")
    ? "Modo claro"
    : "Modo oscuro";
}

function aplicarTemaInicial() {
  const temaGuardado = localStorage.getItem(TEMA);
  const preferenciaSistema = window.matchMedia("(prefers-color-scheme: dark)");
  const temaOscuro =
    temaGuardado === null
      ? preferenciaSistema.matches
      : temaGuardado === "dark";

  document.documentElement.classList.toggle("dark", temaOscuro);
  actualizarTextoBotonTema();
}

function guardarTareas() {
  localStorage.setItem(LLAVE, JSON.stringify(tareas));
}

function exportarTareas() {
  const data = JSON.stringify(tareas, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tareas.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importarTareasDesdeArchivo(archivo) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!Array.isArray(parsed)) {
          reject(new Error("El JSON no contiene un array"));
          return;
        }
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("No se pudo leer el archivo"));
    reader.readAsText(archivo);
  });
}

function commitCambios(filtro = inputBusqueda.value.trim().toLowerCase()) {
  guardarTareas();
  renderTareas(filtro);
}

function mostrarToast(mensaje, tipo = "info") {
  const contenedor = document.getElementById("toastContainer");
  if (!contenedor) return;

  const toast = document.createElement("div");
  toast.className =
    "mb-2 rounded-lg px-4 py-2 text-sm shadow-md text-white" +
    (tipo === "error"
      ? " bg-red-600"
      : tipo === "warning"
      ? " bg-orange-500"
      : " bg-emerald-600");
  toast.textContent = mensaje;

  contenedor.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("opacity-0", "transition-opacity", "duration-300");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2500);
}

function eliminarTarea(id) {
  tareas = tareas.filter((tarea) => tarea.id !== id);
  tareasSeleccionadas.delete(id);
  commitCambios();
}

function toggleCompletada(id) {
  const tarea = tareas.find((t) => t.id === id);
  if (tarea) {
    tarea.completada = !tarea.completada;
    commitCambios();
  }
}

async function moverTareasSeleccionadas(completar = true) {
  if (tareasSeleccionadas.size === 0) {
    mostrarToast("No se seleccionó ninguna tarea para mover.", "warning");
    salirModoMover(); // Salir del modo si no hay tareas seleccionadas
    return;
  }

  // Crear lista de tareas seleccionadas
  const tareasAMover = Array.from(tareasSeleccionadas)
    .map((id) => tareas.find((t) => t.id === id))
    .filter(Boolean);

  const listaCanciones = tareasAMover
    .map((t) => `• "${t.cancion}" de ${t.artista}`)
    .join("\n");
  const accion = completar ? "completadas" : "pendientes";

  const confirmado = await mostrarConfirmacion({
    titulo: "Mover canciones",
    mensaje: `¿Mover las siguientes canciones a ${accion}?`,
    detalle: listaCanciones,
  });

  if (!confirmado) {
    return; // No salir del modo, permitir que el usuario cancele y siga seleccionando
  }

  tareasSeleccionadas.forEach((id) => {
    const tarea = tareas.find((t) => t.id === id);
    if (tarea) {
      tarea.completada = completar;
    }
  });
  tareasSeleccionadas.clear();
  salirModoMover();
  commitCambios();
}

async function completarTodasLasTareas() {
  const tareasPendientes = tareas.filter((tarea) => !tarea.completada);
  if (tareasPendientes.length === 0) {
    mostrarToast("No hay tareas pendientes para completar.", "warning");
    return;
  }

  const listaCanciones = tareasPendientes
    .map((t) => `• "${t.cancion}" de ${t.artista}`)
    .join("\n");
  const confirmado = await mostrarConfirmacion({
    titulo: "Completar todas las tareas",
    mensaje: "¿Completar todas las tareas pendientes?",
    detalle: listaCanciones,
  });

  if (!confirmado) {
    return;
  }

  tareas.forEach((tarea) => {
    if (!tarea.completada) {
      tarea.completada = true;
    }
  });
  commitCambios();
}

async function descompletarTodasLasTareas() {
  const tareasCompletadas = tareas.filter((tarea) => tarea.completada);
  if (tareasCompletadas.length === 0) {
    mostrarToast("No hay tareas completadas para mover.", "warning");
    return;
  }

  const listaCanciones = tareasCompletadas
    .map((t) => `• "${t.cancion}" de ${t.artista}`)
    .join("\n");
  const confirmado = await mostrarConfirmacion({
    titulo: "Mover a pendientes",
    mensaje: "¿Mover todas las tareas completadas a pendientes?",
    detalle: listaCanciones,
  });

  if (!confirmado) {
    return;
  }

  tareas.forEach((tarea) => {
    if (tarea.completada) {
      tarea.completada = false;
    }
  });
  commitCambios();
}

function reordenarTareas(draggedId, targetId) {
  const draggedIndex = tareas.findIndex((t) => t.id == draggedId);
  const targetIndex = tareas.findIndex((t) => t.id == targetId);

  if (draggedIndex === -1 || targetIndex === -1) return;

  const [draggedItem] = tareas.splice(draggedIndex, 1);
  tareas.splice(targetIndex, 0, draggedItem);

  // Actualizar orden
  tareas.forEach((tarea, index) => {
    tarea.orden = index;
  });

  commitCambios();
}

function moverTareaSegunDestino(draggedId, targetListId) {
  const tarea = tareas.find((t) => t.id == draggedId);
  if (!tarea) return;

  if (targetListId === "listaTareasPendientes" && tarea.completada) {
    tarea.completada = false;
    inputBusqueda.value = "";
    commitCambios("");
  } else if (
    targetListId === "listaTareasCompletadas" &&
    !tarea.completada
  ) {
    tarea.completada = true;
    inputBusqueda.value = "";
    commitCambios("");
  }
}

function crearNodoTarea(tarea) {
  const template = document.getElementById("taskTemplate");
  const li = template.content.cloneNode(true).querySelector("li");
  li.dataset.id = tarea.id;
  li.draggable = true;

  const selectCheckbox = li.querySelector(".select-checkbox");
  selectCheckbox.checked = tareasSeleccionadas.has(tarea.id);
  selectCheckbox.addEventListener("change", () => {
    if (selectCheckbox.checked) {
      tareasSeleccionadas.add(tarea.id);
    } else {
      tareasSeleccionadas.delete(tarea.id);
    }
    actualizarTextosBotones();
  });
  selectCheckbox.classList.toggle(
    "hidden",
    !(modoSeleccion || modoMoverCompletadas || modoMoverPendientes),
  );

  const checkbox = li.querySelector(".task-checkbox");
  checkbox.checked = tarea.completada;
  checkbox.addEventListener("change", () => toggleCompletada(tarea.id));

  const img = li.querySelector(".task-image");
  if (tarea.imagen) {
    img.src = tarea.imagen;
    img.style.display = "block";
  } else {
    img.style.display = "none";
  }

  const cancion = li.querySelector(".task-cancion");
  cancion.textContent = tarea.cancion;
  if (tarea.completada) {
    cancion.classList.add("line-through", "text-slate-500");
  }

  const artista = li.querySelector(".task-artista");
  artista.textContent = tarea.artista;
  if (tarea.completada) {
    artista.classList.add("line-through", "text-slate-500");
  }

  const album = li.querySelector(".task-album");
  album.textContent = tarea.album;
  if (tarea.completada) {
    album.classList.add("line-through", "text-slate-500");
  }

  const dificultad = li.querySelector(".task-dificultad");
  dificultad.textContent = `Dificultad: ${tarea.dificultad}`;
  if (tarea.completada) {
    dificultad.classList.add("line-through", "text-slate-500");
  }

  const editBtn = li.querySelector(".edit-btn");
  editBtn.addEventListener("click", () => editarTarea(tarea.id));

  const deleteBtn = li.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => eliminarTarea(tarea.id));

  // cuando se renderiza, ocultar/mostrar checkbox de selección según modo actual
  selectCheckbox.classList.toggle(
    "hidden",
    !(modoSeleccion || modoMoverCompletadas || modoMoverPendientes),
  );

  // Drag and drop handlers
  li.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", tarea.id);
    li.classList.add("opacity-50");
  });

  li.addEventListener("dragend", () => {
    li.classList.remove("opacity-50");
  });

  li.addEventListener("dragover", (e) => {
    e.preventDefault();
    li.classList.add("border-emerald-500");
  });

  li.addEventListener("dragleave", () => {
    li.classList.remove("border-emerald-500");
  });

  li.addEventListener("drop", (e) => {
    e.preventDefault();
    li.classList.remove("border-emerald-500");
    const draggedId = e.dataTransfer.getData("text/plain");
    const targetId = tarea.id;

    const targetContainer = li.closest("ul");
    if (
      targetContainer &&
      (targetContainer.id === "listaTareasPendientes" ||
        targetContainer.id === "listaTareasCompletadas")
    ) {
      moverTareaSegunDestino(draggedId, targetContainer.id);
    } else if (draggedId !== targetId) {
      reordenarTareas(draggedId, targetId);
    }
  });

  return li;
}

function construirTextoBusqueda(tarea) {
  return `${tarea.artista} ${tarea.cancion} ${tarea.album}`.toLowerCase();
}

function actualizarEstadisticas() {
  const total = tareas.length;
  const completadas = tareas.filter((t) => t.completada).length;
  const pendientes = total - completadas;
  document.getElementById("totalTareas").textContent = `Total: ${total}`;
  document.getElementById("completadas").textContent =
    `Completadas: ${completadas}`;
  document.getElementById("pendientes").textContent =
    `Pendientes: ${pendientes}`;
}

function renderTareas(filtro = "") {
  listaTareasPendientes.innerHTML = "";
  listaTareasCompletadas.innerHTML = "";

  const tareasFiltradas = tareas.filter((tarea) => {
    const pasaTexto = construirTextoBusqueda(tarea).includes(filtro);
    if (!pasaTexto) return false;

    if (estadoFiltro === "pendientes") {
      return !tarea.completada;
    }
    if (estadoFiltro === "completadas") {
      return tarea.completada;
    }
    if (dificultadFiltro !== \"todas\") {
      return tarea.dificultad === dificultadFiltro;
    }
    return true;
  });

  // aplicar ordenamiento antes de separar por estado
  const ordenadas = aplicarOrden(tareasFiltradas);
  const tareasPendientes = ordenadas.filter((tarea) => !tarea.completada);
  const tareasCompletadas = ordenadas.filter((tarea) => tarea.completada);

  tareasPendientes.forEach((tarea) => {
    const nodo = crearNodoTarea(tarea);
    listaTareasPendientes.appendChild(nodo);
  });

  tareasCompletadas.forEach((tarea) => {
    const nodo = crearNodoTarea(tarea);
    listaTareasCompletadas.appendChild(nodo);
  });

  actualizarEstadisticas();
}

function aplicarOrden(lista) {
  const copia = [...lista];
  if (criterioOrden === "orden") {
    return copia.sort((a, b) => (a.orden || 0) - (b.orden || 0));
  }
  return copia.sort((a, b) => {
    const fa = String(a[criterioOrden] || "").toLowerCase();
    const fb = String(b[criterioOrden] || "").toLowerCase();
    if (fa < fb) return -1;
    if (fa > fb) return 1;
    return 0;
  });
}

function agregarTarea({ artista, cancion, album, dificultad, imagen }) {
  const nuevaTarea = {
    id: generarId(),
    artista: artista.trim() || "Artista desconocido",
    cancion: cancion.trim(),
    album: album.trim() || "Sencillo",
    dificultad: dificultad || "media",
    imagen: imagen || "",
    completada: false,
    orden:
      tareas.length === 0
        ? 0
        : Math.max(
            ...tareas.map((t) =>
              typeof t.orden === "number" ? t.orden : 0,
            ),
          ) + 1,
  };

  tareas.push(nuevaTarea);
  tareas.sort((a, b) => (a.orden || 0) - (b.orden || 0));
  commitCambios("");
}

function editarTarea(id) {
  const tarea = tareas.find((t) => t.id === id);
  if (!tarea) return;

  tareaEditandoId = id;

  // poblar formulario modal con datos existentes
  const modal = document.getElementById("modal");
  const modalTitulo = modal ? modal.querySelector("h2") : null;
  if (modalTitulo) modalTitulo.textContent = "Editar canción";

  const artistaCancion = document.getElementById("artistaCancion");
  const nombreCancion = document.getElementById("nombreCancion");
  const albumCancion = document.getElementById("albumCancion");
  const dificultadCancion = document.getElementById("dificultadCancion");
  // no se puede rellenar el input de tipo file por seguridad

  if (artistaCancion) artistaCancion.value = tarea.artista;
  if (nombreCancion) nombreCancion.value = tarea.cancion;
  if (albumCancion) albumCancion.value = tarea.album;
  if (dificultadCancion) dificultadCancion.value = tarea.dificultad;

  if (modal) modal.classList.remove("hidden");
}

function salirModoSeleccion() {
  modoSeleccion = false;
  tareasSeleccionadas.clear();
  botonBorrarSeleccionadas.textContent = "Borrar seleccionadas";
}

function activarModoMoverCompletadas() {
  modoMoverCompletadas = true;
  tareasSeleccionadas.clear(); // Limpiar cualquier selección previa
  actualizarTextosBotones();
  renderTareas(inputBusqueda.value.trim().toLowerCase());
}

function activarModoMoverPendientes() {
  modoMoverPendientes = true;
  tareasSeleccionadas.clear(); // Limpiar cualquier selección previa
  actualizarTextosBotones();
  renderTareas(inputBusqueda.value.trim().toLowerCase());
}

function salirModoMover() {
  modoMoverCompletadas = false;
  modoMoverPendientes = false;
  tareasSeleccionadas.clear();
  actualizarTextosBotones();
}

function actualizarTextosBotones() {
  if (modoMoverCompletadas) {
    if (tareasSeleccionadas.size === 0) {
      botonMoverCompletadas.textContent = "Cancelar";
      botonMoverCompletadas.classList.add("bg-red-500", "hover:bg-red-600");
      botonMoverCompletadas.classList.remove(
        "bg-green-500",
        "hover:bg-green-600",
        "bg-blue-500",
        "hover:bg-blue-600",
      );
    } else {
      botonMoverCompletadas.textContent = `Confirmar mover a completadas (${tareasSeleccionadas.size})`;
      botonMoverCompletadas.classList.add("bg-green-500", "hover:bg-green-600");
      botonMoverCompletadas.classList.remove(
        "bg-red-500",
        "hover:bg-red-600",
        "bg-blue-500",
        "hover:bg-blue-600",
      );
    }
  } else {
    botonMoverCompletadas.textContent = "Mover a completadas";
    botonMoverCompletadas.classList.remove(
      "bg-green-500",
      "hover:bg-green-600",
      "bg-red-500",
      "hover:bg-red-600",
    );
    botonMoverCompletadas.classList.add("bg-blue-500", "hover:bg-blue-600");
  }

  if (modoMoverPendientes) {
    if (tareasSeleccionadas.size === 0) {
      botonMoverPendientes.textContent = "Cancelar";
      botonMoverPendientes.classList.add("bg-red-500", "hover:bg-red-600");
      botonMoverPendientes.classList.remove(
        "bg-green-500",
        "hover:bg-green-600",
        "bg-orange-500",
        "hover:bg-orange-600",
      );
    } else {
      botonMoverPendientes.textContent = `Confirmar mover a pendientes (${tareasSeleccionadas.size})`;
      botonMoverPendientes.class.add("bg-green-500", "hover:bg-green-600");
      botonMoverPendientes.classList.remove(
        "bg-red-500",
        "hover:bg-red-600",
        "bg-orange-500",
        "hover:bg-orange-600",
      );
    }
  } else {
    botonMoverPendientes.textContent = "Mover a pendientes";
    botonMoverPendientes.classList.remove(
      "bg-green-500",
      "hover:bg-green-600",
      "bg-red-500",
      "hover:bg-red-600",
    );
    botonMoverPendientes.classList.add("bg-orange-500", "hover:bg-orange-600");
  }

  // actualizar botón de borrado masivo
  if (modoSeleccion) {
    if (tareasSeleccionadas.size === 0) {
      botonBorrarSeleccionadas.textContent = "Confirmar borrado";
    } else {
      botonBorrarSeleccionadas.textContent = `Borrar seleccionadas (${tareasSeleccionadas.size})`;
    }
  }
}

function inicializarFormularioModal() {
  const modal = document.getElementById("modal");
  const modalTitulo = modal ? modal.querySelector("h2") : null;
  const formTarea = document.getElementById("formTarea");
  const artistaCancion = document.getElementById("artistaCancion");
  const nombreCancion = document.getElementById("nombreCancion");
  const albumCancion = document.getElementById("albumCancion");
  const imagenCancion = document.getElementById("imagenCancion");

  function leerImagenComoDataURL(archivo) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () =>
        resolve(typeof reader.result === "string" ? reader.result : "");
      reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
      reader.readAsDataURL(archivo);
    });
  }
  if (
    !formTarea ||
    !artistaCancion ||
    !nombreCancion ||
    !albumCancion ||
    !dificultadCancion ||
    !imagenCancion
  ) {
    return;
  }

  formTarea.addEventListener("submit", async (event) => {
    event.preventDefault();

    const artista = artistaCancion.value.trim();
    const cancion = nombreCancion.value.trim();
    const album = albumCancion.value.trim();
    const dificultad = dificultadCancion.value;
    const archivoImagen =
      imagenCancion.files && imagenCancion.files[0]
        ? imagenCancion.files[0]
        : null;

    if (!cancion) {
      mostrarToast("Por favor, completa el nombre de la canción.", "warning");
      return;
    }

    let imagen = "";
    if (archivoImagen) {
      try {
        imagen = await leerImagenComoDataURL(archivoImagen);
      } catch (error) {
        imagen = "";
      }
    }

    if (modoSeleccion) {
      salirModoSeleccion();
    }

    if (tareaEditandoId) {
      const tarea = tareas.find((t) => t.id === tareaEditandoId);
      if (tarea) {
        tarea.artista = artista || "Artista desconocido";
        tarea.cancion = cancion;
        tarea.album = album || "Sencillo";
        tarea.dificultad = dificultad || "media";
        if (imagen) tarea.imagen = imagen;
        guardarTareas();
        renderTareas(inputBusqueda.value.trim().toLowerCase());
      }
      tareaEditandoId = null;
      if (modalTitulo) modalTitulo.textContent = "Agregar canción";
    } else {
      agregarTarea({ artista, cancion, album, dificultad, imagen });
    }

    formTarea.reset();
    cerrarModal();
  });
}

const selectOrden = document.getElementById("ordenarPor");

// Prevenir drag & drop en el input de búsqueda
inputBusqueda.addEventListener("dragover", (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = "none";
});

inputBusqueda.addEventListener("drop", (e) => {
  e.preventDefault();
  e.stopPropagation();
  // No hacer nada: prevenir que se suelte en el input
});

inputBusqueda.addEventListener("input", (event) => {
  if (modoSeleccion || modoMoverCompletadas || modoMoverPendientes) {
    salirModoSeleccion();
    salirModoMover();
  }
  renderTareas(event.target.value.trim().toLowerCase());
});

// actualizar estadoFiltro cuando cambian los radios
filtroEstadoRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    if (radio.checked) {
      estadoFiltro = radio.value;
      renderTareas(inputBusqueda.value.trim().toLowerCase());
    }
  });
});
// actualizar dificultadFiltro cuando cambian los radios
filtroDificultadRadios.forEach((radio) => {
  radio.addEventListener(\"change\", () => {
    if (radio.checked) {
      dificultadFiltro = radio.value;
      renderTareas(inputBusqueda.value.trim().toLowerCase());
    }
  });
});
// ordenar cuando cambia la selección
if (selectOrden) {
  selectOrden.addEventListener("change", () => {
    criterioOrden = selectOrden.value;
    renderTareas(inputBusqueda.value.trim().toLowerCase());
  });
}

document.addEventListener("modalReady", inicializarFormularioModal);
if (botonTema) {
  botonTema.addEventListener("click", () => {
    const activarOscuro = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", activarOscuro);
    localStorage.setItem(TEMA, activarOscuro ? "dark" : "light");
    actualizarTextoBotonTema();
  });
}

botonAbrirModal.addEventListener("click", () => {
  if (modoSeleccion || modoMoverCompletadas || modoMoverPendientes) {
    salirModoSeleccion();
    salirModoMover();
    renderTareas(inputBusqueda.value.trim().toLowerCase());
  }
  // si abrimos el modal manualmente, nos aseguramos de salir de modo edición
  tareaEditandoId = null;
  const modal = document.getElementById("modal");
  const modalTitulo = modal ? modal.querySelector("h2") : null;
  if (modalTitulo) modalTitulo.textContent = "Agregar canción";
});

botonBorrarSeleccionadas.addEventListener("click", async () => {
  if (!modoSeleccion) {
    modoSeleccion = true;
    botonBorrarSeleccionadas.textContent = "Confirmar borrado";
    renderTareas(inputBusqueda.value.trim().toLowerCase());
    return;
  }

  if (tareasSeleccionadas.size === 0) {
    salirModoSeleccion();
    renderTareas(inputBusqueda.value.trim().toLowerCase());
    return;
  }

  const confirmado = await mostrarConfirmacion({
    titulo: "Borrar canciones",
    mensaje: "¿Seguro que quieres borrar las canciones seleccionadas?",
  });
  if (!confirmado) {
    salirModoSeleccion();
    renderTareas(inputBusqueda.value.trim().toLowerCase());
    return;
  }

  tareas = tareas.filter((tarea) => !tareasSeleccionadas.has(tarea.id));
  salirModoSeleccion();
  commitCambios();
});

botonMoverCompletadas.addEventListener("click", () => {
  completarTodasLasTareas();
});

botonMoverPendientes.addEventListener("click", () => {
  descompletarTodasLasTareas();
});

aplicarTemaInicial();
renderTareas();
actualizarTextosBotones();
