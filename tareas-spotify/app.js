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
  let completada = typeof item.completada === "boolean" ? item.completada : false;
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
let draggedIndex = null;
let modoSeleccion = false;
let modoMoverCompletadas = false;
let modoMoverPendientes = false;

const listaTareasPendientes = document.getElementById("listaTareasPendientes");
const listaTareasCompletadas = document.getElementById("listaTareasCompletadas");
const inputBusqueda = document.getElementById("buscarTarea");
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
    temaGuardado === null ? preferenciaSistema.matches : temaGuardado === "dark";

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
  const tareasAMover = Array.from(tareasSeleccionadas).map(id =>
    tareas.find(t => t.id === id)
  ).filter(Boolean);

  const listaCanciones = tareasAMover.map(t => `"${t.cancion}" de ${t.artista}`).join('\n• ');
  const accion = completar ? "completadas" : "pendientes";

  const confirmado = confirm(`¿Mover las siguientes canciones a ${accion}?\n\n• ${listaCanciones}`);

  if (!confirmado) {
    return; // No salir del modo, permitir que el usuario cancele y siga seleccionando
  }

  tareasSeleccionadas.forEach(id => {
    const tarea = tareas.find(t => t.id === id);
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
  const tareasPendientes = tareas.filter(tarea => !tarea.completada);
  if (tareasPendientes.length === 0) {
    alert('No hay tareas pendientes para completar.');
    return;
  }

  const listaCanciones = tareasPendientes.map(t => `"${t.cancion}" de ${t.artista}`).join('\n• ');
  const confirmado = confirm(`¿Completar todas las tareas pendientes?\n\n• ${listaCanciones}`);

  if (!confirmado) {
    return;
  }

  tareas.forEach(tarea => {
    if (!tarea.completada) {
      tarea.completada = true;
    }
  });
  guardarTareas();
  renderTareas(inputBusqueda.value.trim().toLowerCase());
}

function handleDragStart(event) {
  draggedIndex = Array.from(event.target.parentNode.children).indexOf(event.target);
  event.target.classList.add("opacity-50");
}

function handleDragOver(event) {
  event.preventDefault();
}

function handleDrop(event) {
  event.preventDefault();
  const dropIndex = Array.from(event.target.closest("li").parentNode.children).indexOf(event.target.closest("li"));
  if (draggedIndex !== null && draggedIndex !== dropIndex) {
    const draggedTask = tareas.splice(draggedIndex, 1)[0];
    tareas.splice(dropIndex, 0, draggedTask);
    // Actualizar orden
    tareas.forEach((tarea, index) => {
      tarea.orden = index;
    });
    guardarTareas();
    renderTareas(inputBusqueda.value.trim().toLowerCase());
  }
  draggedIndex = null;
}

function handleDragEnd(event) {
  event.target.classList.remove("opacity-50");
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
  const li = document.createElement("li");
  li.className =
    "flex items-center justify-between gap-3 rounded-[10px] border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800 max-sm:flex-col max-sm:items-stretch transition-all duration-300 ease-in-out cursor-move";
  li.draggable = true;
  li.dataset.id = tarea.id;

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

    // Determinar si se soltó en un contenedor diferente
    const targetContainer = li.closest("ul");
    const draggedTask = tareas.find(t => t.id == draggedId);

    if (!draggedTask) return; // Si no se encuentra la tarea, salir

    if (targetContainer.id === "listaTareasPendientes" && draggedTask.completada) {
      // Moviendo de completadas a pendientes
      draggedTask.completada = false;
      guardarTareas();
      inputBusqueda.value = ""; // Limpiar búsqueda para mostrar la tarea movida
      renderTareas();
    } else if (targetContainer.id === "listaTareasCompletadas" && !draggedTask.completada) {
      // Moviendo de pendientes a completadas
      draggedTask.completada = true;
      guardarTareas();
      inputBusqueda.value = ""; // Limpiar búsqueda para mostrar la tarea movida
      renderTareas();
    } else {
      // Reordenar dentro del mismo contenedor
      if (draggedId !== targetId) {
        reordenarTareas(draggedId, targetId);
      }
    }
  });

  const checkSeleccion = document.createElement("input");
  checkSeleccion.type = "checkbox";
  checkSeleccion.className = `${modoSeleccion || modoMoverCompletadas || modoMoverPendientes ? "block" : "hidden"} h-4 w-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-900`;
  checkSeleccion.checked = tareasSeleccionadas.has(tarea.id);
  checkSeleccion.addEventListener("change", () => {
    if (checkSeleccion.checked) {
      tareasSeleccionadas.add(tarea.id);
    } else {
      tareasSeleccionadas.delete(tarea.id);
    }
    actualizarTextosBotones();
  });

  const checkCompletada = document.createElement("input");
  checkCompletada.type = "checkbox";
  checkCompletada.className = "h-4 w-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-900";
  checkCompletada.checked = tarea.completada;
  checkCompletada.addEventListener("change", () => toggleCompletada(tarea.id));

  const contenedorPrincipal = document.createElement("div");
  contenedorPrincipal.className = "flex items-center flex-1 gap-3";

  // Portada
  let portada = null;
  if (tarea.imagen) {
    portada = document.createElement("img");
    portada.className =
      "object-cover w-16 h-16 border rounded-lg shrink-0 border-slate-200 dark:border-slate-700 transition-opacity duration-300";
    portada.src = tarea.imagen;
    portada.alt = `Portada de ${tarea.cancion}`;
    if (tarea.completada) {
      portada.classList.add("opacity-50");
    }
    contenedorPrincipal.appendChild(portada);
  }

  // Información (canción, artista, álbum)
  const nombreCancion = document.createElement("strong");
  nombreCancion.textContent = tarea.cancion;
  nombreCancion.className =
    `mb-1 block text-[15px] text-slate-800 dark:text-slate-100 transition-all duration-300 ${tarea.completada ? "line-through opacity-60" : ""}`;

  const artistaSpan = document.createElement("span");
  artistaSpan.textContent = tarea.artista;
  artistaSpan.className = `text-[13px] text-slate-500 dark:text-slate-400 transition-all duration-300 ${tarea.completada ? "line-through opacity-60" : ""}`;

  const albumSpan = document.createElement("span");
  albumSpan.textContent = tarea.album;
  albumSpan.className = `text-xs text-slate-400 dark:text-slate-500 transition-all duration-300 ${tarea.completada ? "line-through opacity-60" : ""}`;

  const contenedorInformacion = document.createElement("div");
  contenedorInformacion.className = "flex flex-col gap-0.5";
  contenedorInformacion.append(nombreCancion, artistaSpan, albumSpan);

  contenedorPrincipal.appendChild(contenedorInformacion);

  const bloqueIzquierdo = document.createElement("div");
  bloqueIzquierdo.className = "flex items-center flex-1 gap-3 max-sm:items-start";
  bloqueIzquierdo.append(checkSeleccion, checkCompletada, contenedorPrincipal);

  const botonEliminar = document.createElement("button");
  botonEliminar.type = "button";
  botonEliminar.textContent = "Eliminar";
  botonEliminar.className =
    "rounded-lg bg-red-500 px-2.5 py-2 text-white transition hover:bg-red-600 max-sm:w-full";
  botonEliminar.addEventListener("click", () => eliminarTarea(tarea.id));

  li.append(bloqueIzquierdo, botonEliminar);
  return li;
}

function construirTextoBusqueda(tarea) {
  return `${tarea.artista} ${tarea.cancion} ${tarea.album}`.toLowerCase();
}

function renderTareas(filtro = "") {
  listaTareasPendientes.innerHTML = "";
  listaTareasCompletadas.innerHTML = "";

  // Agregar event listeners de drop a las listas para cuando estén vacías
  listaTareasPendientes.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    listaTareasPendientes.classList.add("border-emerald-500");
  });

  listaTareasPendientes.addEventListener("dragleave", (e) => {
    e.stopPropagation();
    if (e.currentTarget === listaTareasPendientes) {
      listaTareasPendientes.classList.remove("border-emerald-500");
    }
  });

  listaTareasPendientes.addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation();
    listaTareasPendientes.classList.remove("border-emerald-500");
    const draggedId = e.dataTransfer.getData("text/plain");
    if (!draggedId) return; // Si no hay dato válido, salir
    
    const draggedTask = tareas.find(t => t.id == draggedId);

    if (draggedTask && draggedTask.completada) {
      draggedTask.completada = false;
      guardarTareas();
      inputBusqueda.value = ""; // Limpiar búsqueda
      renderTareas();
    }
  });

  listaTareasCompletadas.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    listaTareasCompletadas.classList.add("border-emerald-500");
  });

  listaTareasCompletadas.addEventListener("dragleave", (e) => {
    e.stopPropagation();
    if (e.currentTarget === listaTareasCompletadas) {
      listaTareasCompletadas.classList.remove("border-emerald-500");
    }
  });

  listaTareasCompletadas.addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation();
    listaTareasCompletadas.classList.remove("border-emerald-500");
    const draggedId = e.dataTransfer.getData("text/plain");
    if (!draggedId) return; // Si no hay dato válido, salir
    
    const draggedTask = tareas.find(t => t.id == draggedId);

    if (draggedTask && !draggedTask.completada) {
      draggedTask.completada = true;
      guardarTareas();
      inputBusqueda.value = ""; // Limpiar búsqueda
      renderTareas();
    }
  });

  const tareasFiltradas = tareas.filter((tarea) =>
    construirTextoBusqueda(tarea).includes(filtro),
  );

  const tareasPendientes = tareasFiltradas.filter(tarea => !tarea.completada);
  const tareasCompletadas = tareasFiltradas.filter(tarea => tarea.completada);

  tareasPendientes.forEach((tarea) => {
    const nodo = crearNodoTarea(tarea);
    nodo.classList.add("animate-fade-in");
    listaTareasPendientes.appendChild(nodo);
  });

  tareasCompletadas.forEach((tarea) => {
    const nodo = crearNodoTarea(tarea);
    nodo.classList.add("animate-fade-in");
    listaTareasCompletadas.appendChild(nodo);
  });
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

function leerImagenComoDataURL(archivo) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
    reader.readAsDataURL(archivo);
  });
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
      botonMoverCompletadas.classList.remove("bg-green-500", "hover:bg-green-600", "bg-blue-500", "hover:bg-blue-600");
    } else {
      botonMoverCompletadas.textContent = `Confirmar mover a completadas (${tareasSeleccionadas.size})`;
      botonMoverCompletadas.classList.add("bg-green-500", "hover:bg-green-600");
      botonMoverCompletadas.classList.remove("bg-red-500", "hover:bg-red-600", "bg-blue-500", "hover:bg-blue-600");
    }
  } else {
    botonMoverCompletadas.textContent = "Mover a completadas";
    botonMoverCompletadas.classList.remove("bg-green-500", "hover:bg-green-600", "bg-red-500", "hover:bg-red-600");
    botonMoverCompletadas.classList.add("bg-blue-500", "hover:bg-blue-600");
  }

  if (modoMoverPendientes) {
    if (tareasSeleccionadas.size === 0) {
      botonMoverPendientes.textContent = "Cancelar";
      botonMoverPendientes.classList.add("bg-red-500", "hover:bg-red-600");
      botonMoverPendientes.classList.remove("bg-green-500", "hover:bg-green-600", "bg-orange-500", "hover:bg-orange-600");
    } else {
      botonMoverPendientes.textContent = `Confirmar mover a pendientes (${tareasSeleccionadas.size})`;
      botonMoverPendientes.classList.add("bg-green-500", "hover:bg-green-600");
      botonMoverPendientes.classList.remove("bg-red-500", "hover:bg-red-600", "bg-orange-500", "hover:bg-orange-600");
    }
  } else {
    botonMoverPendientes.textContent = "Mover a pendientes";
    botonMoverPendientes.classList.remove("bg-green-500", "hover:bg-green-600", "bg-red-500", "hover:bg-red-600");
    botonMoverPendientes.classList.add("bg-orange-500", "hover:bg-orange-600");
  }
}

function inicializarFormularioModal() {
  const formTarea = document.getElementById("formTarea");
  const artistaCancion = document.getElementById("artistaCancion");
  const nombreCancion = document.getElementById("nombreCancion");
  const albumCancion = document.getElementById("albumCancion");
  const imagenCancion = document.getElementById("imagenCancion");
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

    if (!cancion || !artista) {
      alert("Por favor, completa el artista y el nombre de la canción.");
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
  if (!modoMoverPendientes) {
    // Activar modo mover a pendientes
    salirModoSeleccion();
    salirModoMover();
    activarModoMoverPendientes();
    return;
  }

  // Si ya está en modo, verificar si hay tareas seleccionadas
  if (tareasSeleccionadas.size === 0) {
    // Si no hay tareas seleccionadas, salir del modo (cancelar)
    salirModoMover();
    return;
  }

  // Si hay tareas seleccionadas, intentar mover las seleccionadas
  moverTareasSeleccionadas(false);
});

aplicarTemaInicial();
guardarTareas();
renderTareas();
actualizarTextosBotones();
