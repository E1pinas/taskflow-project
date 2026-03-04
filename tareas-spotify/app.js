const STORAGE_KEY = "taskflow_spotify_tareas";

function normalizarCancion(item) {
  if (!item || typeof item !== "object") {
    return null;
  }

  let artista = typeof item.artista === "string" ? item.artista.trim() : "";
  let cancion = typeof item.cancion === "string" ? item.cancion.trim() : "";
  let album = typeof item.album === "string" ? item.album.trim() : "";
  let imagen = typeof item.imagen === "string" ? item.imagen : "";

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
  };
}

let tareas = (JSON.parse(localStorage.getItem(STORAGE_KEY)) || [])
  .map(normalizarCancion)
  .filter(Boolean);

const tareasSeleccionadas = new Set();
let modoSeleccion = false;

const listaTareas = document.getElementById("listaTareas");
const inputBusqueda = document.getElementById("buscarTarea");
const botonBorrarSeleccionadas = document.getElementById("borrarSeleccionadas");
const botonAbrirModal = document.getElementById("abrirModal");

function guardarTareas() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tareas));
}

function eliminarTarea(id) {
  tareas = tareas.filter((tarea) => tarea.id !== id);
  tareasSeleccionadas.delete(id);
  guardarTareas();
  renderTareas(inputBusqueda.value.trim().toLowerCase());
}

function crearNodoTarea(tarea) {
  const li = document.createElement("li");
  li.className = "tarea";

  const check = document.createElement("input");
  check.type = "checkbox";
  check.className = "checkbox-seleccion";
  check.checked = tareasSeleccionadas.has(tarea.id);
  check.addEventListener("change", () => {
    if (check.checked) {
      tareasSeleccionadas.add(tarea.id);
      return;
    }
    tareasSeleccionadas.delete(tarea.id);
  });

  const contenedorPrincipal = document.createElement("div");
  contenedorPrincipal.className = "contenedor-principal";

  // Portada
  let portada = null;
  if (tarea.imagen) {
    portada = document.createElement("img");
    portada.className = "portada-cancion";
    portada.src = tarea.imagen;
    portada.alt = `Portada de ${tarea.cancion}`;
    contenedorPrincipal.appendChild(portada);
  }

  // Información (canción, artista, álbum)
  const nombreCancion = document.createElement("strong");
  nombreCancion.textContent = tarea.cancion;
  nombreCancion.className = "nombre-cancion";

  const artistaSpan = document.createElement("span");
  artistaSpan.textContent = tarea.artista;
  artistaSpan.className = "detalle-artista";

  const albumSpan = document.createElement("span");
  albumSpan.textContent = tarea.album;
  albumSpan.className = "detalle-album";

  const contenedorInformacion = document.createElement("div");
  contenedorInformacion.className = "contenedor-informacion";
  contenedorInformacion.append(nombreCancion, artistaSpan, albumSpan);

  contenedorPrincipal.appendChild(contenedorInformacion);

  const bloqueIzquierdo = document.createElement("div");
  bloqueIzquierdo.className = "tarea-info";
  bloqueIzquierdo.append(check, contenedorPrincipal);

  const botonEliminar = document.createElement("button");
  botonEliminar.type = "button";
  botonEliminar.textContent = "Eliminar";
  botonEliminar.addEventListener("click", () => eliminarTarea(tarea.id));

  li.append(bloqueIzquierdo, botonEliminar);
  return li;
}

function construirTextoBusqueda(tarea) {
  return `${tarea.artista} ${tarea.cancion} ${tarea.album}`.toLowerCase();
}

function renderTareas(filtro = "") {
  listaTareas.innerHTML = "";
  listaTareas.classList.toggle("modo-seleccion", modoSeleccion);

  const tareasFiltradas = tareas.filter((tarea) =>
    construirTextoBusqueda(tarea).includes(filtro),
  );

  tareasFiltradas.forEach((tarea) => {
    listaTareas.appendChild(crearNodoTarea(tarea));
  });
}

function agregarTarea({ artista, cancion, album, imagen }) {
  const nuevaTarea = {
    id: Date.now(),
    artista: artista.trim() || "Artista desconocido",
    cancion: cancion.trim(),
    album: album.trim() || "Sencillo",
    imagen: imagen || "",
  };

  tareas.push(nuevaTarea);
  guardarTareas();
  renderTareas(inputBusqueda.value.trim().toLowerCase());
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

    if (!cancion) {
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

inputBusqueda.addEventListener("input", (event) => {
  if (modoSeleccion) {
    salirModoSeleccion();
  }
  renderTareas(event.target.value.trim().toLowerCase());
});

document.addEventListener("modalReady", inicializarFormularioModal);
botonAbrirModal.addEventListener("click", () => {
  if (modoSeleccion) {
    salirModoSeleccion();
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

guardarTareas();
renderTareas();
