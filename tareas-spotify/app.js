const LLAVE = "taskflow_spotify_tareas";
const TEMA = "taskflow_spotify_tema";

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
    id: typeof item.id === "number" ? item.id : Date.now() + Math.random(),
    artista,
    cancion,
    album,
    imagen,
    completada,
    orden,
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

// allow dropping on empty container to move between lists
listaTareasPendientes.addEventListener("dragover", (e) => e.preventDefault());
listaTareasPendientes.addEventListener("drop", (e) => {
  e.preventDefault();
  const draggedId = e.dataTransfer.getData("text/plain");
  const tarea = tareas.find((t) => t.id == draggedId);
  if (tarea && tarea.completada) {
    tarea.completada = false;
    guardarTareas();
    inputBusqueda.value = "";
    renderTareas();
  }
});

listaTareasCompletadas.addEventListener("dragover", (e) => e.preventDefault());
listaTareasCompletadas.addEventListener("drop", (e) => {
  e.preventDefault();
  const draggedId = e.dataTransfer.getData("text/plain");
  const tarea = tareas.find((t) => t.id == draggedId);
  if (tarea && !tarea.completada) {
    tarea.completada = true;
    guardarTareas();
    inputBusqueda.value = "";
    renderTareas();
  }
});
const botonBorrarSeleccionadas = document.getElementById("borrarSeleccionadas");
const botonAbrirModal = document.getElementById("abrirModal");
const botonMoverCompletadas = document.getElementById("moverCompletadas");
const botonMoverPendientes = document.getElementById("moverPendientes");
const botonTema = document.getElementById("toggleTema");

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

function eliminarTarea(id) {
  tareas = tareas.filter((tarea) => tarea.id !== id);
  tareasSeleccionadas.delete(id);
  guardarTareas();
  renderTareas(inputBusqueda.value.trim().toLowerCase());
}

function toggleCompletada(id) {
  const tarea = tareas.find((t) => t.id === id);
  if (tarea) {
    tarea.completada = !tarea.completada;
    guardarTareas();
    renderTareas(inputBusqueda.value.trim().toLowerCase());
  }
}

function moverTareasSeleccionadas(completar = true) {
  if (tareasSeleccionadas.size === 0) {
    alert("No se seleccionó ninguna tarea para mover.");
    salirModoMover(); // Salir del modo si no hay tareas seleccionadas
    return;
  }

  // Crear lista de tareas seleccionadas
  const tareasAMover = Array.from(tareasSeleccionadas)
    .map((id) => tareas.find((t) => t.id === id))
    .filter(Boolean);

  const listaCanciones = tareasAMover
    .map((t) => `"${t.cancion}" de ${t.artista}`)
    .join("\n• ");
  const accion = completar ? "completadas" : "pendientes";

  const confirmado = confirm(
    `¿Mover las siguientes canciones a ${accion}?\n\n• ${listaCanciones}`,
  );

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
  guardarTareas();
  renderTareas(inputBusqueda.value.trim().toLowerCase());
}

function completarTodasLasTareas() {
  const tareasPendientes = tareas.filter((tarea) => !tarea.completada);
  if (tareasPendientes.length === 0) {
    alert("No hay tareas pendientes para completar.");
    return;
  }

  const listaCanciones = tareasPendientes
    .map((t) => `"${t.cancion}" de ${t.artista}`)
    .join("\n• ");
  const confirmado = confirm(
    `¿Completar todas las tareas pendientes?\n\n• ${listaCanciones}`,
  );

  if (!confirmado) {
    return;
  }

  tareas.forEach((tarea) => {
    if (!tarea.completada) {
      tarea.completada = true;
    }
  });
  guardarTareas();
  renderTareas(inputBusqueda.value.trim().toLowerCase());
}

function descompletarTodasLasTareas() {
  const tareasCompletadas = tareas.filter((tarea) => tarea.completada);
  if (tareasCompletadas.length === 0) {
    alert("No hay tareas completadas para mover.");
    return;
  }

  const listaCanciones = tareasCompletadas
    .map((t) => `"${t.cancion}" de ${t.artista}`)
    .join("\n• ");
  const confirmado = confirm(
    `¿Mover todas las tareas completadas a pendientes?\n\n• ${listaCanciones}`,
  );

  if (!confirmado) {
    return;
  }

  tareas.forEach((tarea) => {
    if (tarea.completada) {
      tarea.completada = false;
    }
  });
  guardarTareas();
  renderTareas(inputBusqueda.value.trim().toLowerCase());
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

  guardarTareas();
  renderTareas(inputBusqueda.value.trim().toLowerCase());
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
    const draggedTask = tareas.find((t) => t.id == draggedId);
    if (!draggedTask) return;

    if (
      targetContainer.id === "listaTareasPendientes" &&
      draggedTask.completada
    ) {
      draggedTask.completada = false;
      guardarTareas();
      inputBusqueda.value = "";
      renderTareas();
    } else if (
      targetContainer.id === "listaTareasCompletadas" &&
      !draggedTask.completada
    ) {
      draggedTask.completada = true;
      guardarTareas();
      inputBusqueda.value = "";
      renderTareas();
    } else {
      if (draggedId !== targetId) {
        reordenarTareas(draggedId, targetId);
      }
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

  const tareasFiltradas = tareas.filter((tarea) =>
    construirTextoBusqueda(tarea).includes(filtro),
  );

  const tareasPendientes = tareasFiltradas.filter((tarea) => !tarea.completada);
  const tareasCompletadas = tareasFiltradas.filter((tarea) => tarea.completada);

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

function agregarTarea({ artista, cancion, album, imagen }) {
  const nuevaTarea = {
    id: Date.now(),
    artista: artista.trim() || "Artista desconocido",
    cancion: cancion.trim(),
    album: album.trim() || "Sencillo",
    imagen: imagen || "",
    completada: false,
    orden: Date.now(),
  };

  tareas.push(nuevaTarea);
  tareas.sort((a, b) => a.orden - b.orden);
  guardarTareas();
  renderTareas(); // No aplicar filtro al agregar nueva tarea
}

function editarTarea(id) {
  const tarea = tareas.find((t) => t.id === id);
  if (!tarea) return;

  const nuevoArtista = prompt("Editar artista:", tarea.artista);
  if (nuevoArtista === null) return;
  const nuevaCancion = prompt("Editar canción:", tarea.cancion);
  if (nuevaCancion === null) return;
  const nuevoAlbum = prompt("Editar álbum:", tarea.album);
  if (nuevoAlbum === null) return;

  if (nuevaCancion.trim()) {
    tarea.artista = nuevoArtista.trim() || "Artista desconocido";
    tarea.cancion = nuevaCancion.trim();
    tarea.album = nuevoAlbum.trim() || "Sencillo";
    guardarTareas();
    renderTareas(inputBusqueda.value.trim().toLowerCase());
  }
}

function cerrarModal() {
  const modal = document.getElementById("modal");
  if (modal) {
    modal.classList.add("hidden");
  }
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
    !imagenCancion
  ) {
    return;
  }

  formTarea.addEventListener("submit", async (event) => {
    event.preventDefault();

    const artista = artistaCancion.value.trim();
    const cancion = nombreCancion.value.trim();
    const album = albumCancion.value.trim();
    const archivoImagen =
      imagenCancion.files && imagenCancion.files[0]
        ? imagenCancion.files[0]
        : null;

    if (!cancion) {
      alert("Por favor, completa el nombre de la canción.");
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

    agregarTarea({ artista, cancion, album, imagen });
    formTarea.reset();
    cerrarModal();
  });
}

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

document.addEventListener("modalReady", inicializarFormularioModal);
if (botonTema) {
  botonTema.addEventListener("click", () => {
    console.log("Botón de tema clickeado");
    const activarOscuro = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", activarOscuro);
    localStorage.setItem(TEMA, activarOscuro ? "dark" : "light");
    actualizarTextoBotonTema();
    console.log("Tema cambiado a:", activarOscuro ? "dark" : "light");
  });
} else {
  console.error("Botón de tema no encontrado");
}

botonAbrirModal.addEventListener("click", () => {
  if (modoSeleccion || modoMoverCompletadas || modoMoverPendientes) {
    salirModoSeleccion();
    salirModoMover();
    renderTareas(inputBusqueda.value.trim().toLowerCase());
  }
});

botonBorrarSeleccionadas.addEventListener("click", () => {
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

  const confirmado = confirm(
    "¿Seguro que quieres borrar las canciones seleccionadas?",
  );
  if (!confirmado) {
    salirModoSeleccion();
    renderTareas(inputBusqueda.value.trim().toLowerCase());
    return;
  }

  tareas = tareas.filter((tarea) => !tareasSeleccionadas.has(tarea.id));
  salirModoSeleccion();
  guardarTareas();
  renderTareas(inputBusqueda.value.trim().toLowerCase());
});

botonMoverCompletadas.addEventListener("click", () => {
  completarTodasLasTareas();
});

botonMoverPendientes.addEventListener("click", () => {
  descompletarTodasLasTareas();
});

aplicarTemaInicial();
guardarTareas();
renderTareas();
actualizarTextosBotones();
