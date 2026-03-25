function construirTextoBusqueda(tarea) {
  return `${tarea.artista} ${tarea.cancion} ${tarea.album} ${tarea.dificultad}`.toLowerCase();
}

function getTareasFiltradas(estadoApp) {
  return estadoApp.tareas.filter((tarea) => {
    if (!construirTextoBusqueda(tarea).includes(estadoApp.filtroTexto)) {
      return false;
    }

    if (estadoApp.estadoFiltro === "pendientes" && tarea.completada) {
      return false;
    }

    if (estadoApp.estadoFiltro === "completadas" && !tarea.completada) {
      return false;
    }

    if (
      estadoApp.dificultadFiltro !== "todas" &&
      tarea.dificultad !== estadoApp.dificultadFiltro
    ) {
      return false;
    }

    return true;
  });
}

function crearEstadoVacio(mensaje) {
  const item = document.createElement("li");
  item.className =
    "px-4 py-6 text-sm text-center border border-dashed surface-card rounded-xl ui-text-muted";
  item.textContent = mensaje;
  return item;
}

function crearEstadoInformativo(mensaje, variante = "info") {
  const item = crearEstadoVacio(mensaje);

  if (variante === "error") {
    item.classList.add("border-red-400", "text-red-600");
  }

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

function crearNodoTarea(referencias, estadoApp, tarea) {
  const li = referencias.templateTarea.content.cloneNode(true).querySelector("li");
  const checkbox = li.querySelector(".task-checkbox");
  const img = li.querySelector(".task-image");
  const cancion = li.querySelector(".task-cancion");
  const artista = li.querySelector(".task-artista");
  const album = li.querySelector(".task-album");
  const dificultad = li.querySelector(".task-dificultad");
  const estaSeleccionada = estadoApp.tareasSeleccionadas.has(tarea.id);

  li.dataset.id = tarea.id;
  li.dataset.estado = tarea.completada ? "completada" : "pendiente";
  li.dataset.dificultad = tarea.dificultad;
  li.draggable = !estadoApp.cargando;
  aplicarEstiloDificultad(li, tarea.dificultad);

  checkbox.checked = estadoApp.modoSeleccion ? estaSeleccionada : tarea.completada;
  checkbox.disabled = estadoApp.cargando;
  checkbox.setAttribute(
    "aria-label",
    estadoApp.modoSeleccion
      ? `Seleccionar ${tarea.cancion} para borrar`
      : `Marcar ${tarea.cancion} como completada`,
  );

  if (estadoApp.modoSeleccion && estaSeleccionada) {
    li.style.borderColor = "var(--ui-accent)";
    li.style.boxShadow =
      "0 0 0 3px color-mix(in srgb, transparent 78%, var(--ui-accent))";
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

  return li;
}

function renderLista(referencias, estadoApp, lista, items, mensajeVacio) {
  lista.innerHTML = "";

  if (estadoApp.cargando) {
    lista.appendChild(crearEstadoInformativo("Cargando tareas desde el servidor..."));
    return;
  }

  if (estadoApp.errorRed) {
    lista.appendChild(crearEstadoInformativo(estadoApp.errorRed, "error"));
    return;
  }

  if (items.length === 0) {
    lista.appendChild(crearEstadoVacio(mensajeVacio));
    return;
  }

  const fragment = document.createDocumentFragment();
  items.forEach((tarea) => {
    fragment.appendChild(crearNodoTarea(referencias, estadoApp, tarea));
  });
  lista.appendChild(fragment);
}

function renderEstadisticas(referencias, tareas) {
  const total = tareas.length;
  const completadas = tareas.filter((tarea) => tarea.completada).length;
  const pendientes = total - completadas;

  referencias.totalTareas.textContent = `Total: ${total}`;
  referencias.completadas.textContent = `Completadas: ${completadas}`;
  referencias.pendientes.textContent = `Pendientes: ${pendientes}`;
  referencias.facil.textContent = `Fácil: ${tareas.filter((t) => t.dificultad === "facil").length}`;
  referencias.media.textContent = `Media: ${tareas.filter((t) => t.dificultad === "media").length}`;
  referencias.dificil.textContent = `Difícil: ${tareas.filter((t) => t.dificultad === "dificil").length}`;
}

function renderResumen(referencias, estadoApp, tareasFiltradas) {
  const pendientes = tareasFiltradas.filter((t) => !t.completada).length;
  const completadas = tareasFiltradas.length - pendientes;
  const partes = [`${tareasFiltradas.length} resultados`];

  if (estadoApp.filtroTexto) {
    partes.push(`busqueda: "${estadoApp.textoBusquedaVisible}"`);
  }

  if (estadoApp.estadoFiltro !== "todos") {
    partes.push(`estado: ${estadoApp.estadoFiltro}`);
  }

  if (estadoApp.dificultadFiltro !== "todas") {
    partes.push(`dificultad: ${estadoApp.dificultadFiltro}`);
  }

  if (estadoApp.modoSeleccion) {
    partes.push(
      estadoApp.tareasSeleccionadas.size > 0
        ? `${estadoApp.tareasSeleccionadas.size} seleccionadas`
        : "modo seleccion activo",
    );
  }

  if (estadoApp.cargando) {
    partes.push("sincronizando con servidor");
  }

  if (estadoApp.errorRed) {
    partes.push("error de red");
  }

  referencias.resumenVista.textContent = partes.join(" • ");
  referencias.contadorPendientesVista.textContent = String(pendientes);
  referencias.contadorCompletadasVista.textContent = String(completadas);
}

function renderControles(referencias, estadoApp) {
  const hayTareas = estadoApp.tareas.length > 0;
  const controlesDeshabilitados = estadoApp.cargando;

  referencias.contenedorBusqueda.classList.toggle("hidden", !hayTareas);
  referencias.contenedorResumen.classList.toggle("hidden", !hayTareas);

  referencias.inputBusqueda.disabled = controlesDeshabilitados;
  referencias.filtroDificultad.disabled = controlesDeshabilitados;
  referencias.botonAbrirModal.disabled = controlesDeshabilitados;
  referencias.botonBorrar.disabled = controlesDeshabilitados;
  referencias.botonCompletarTodas.disabled = controlesDeshabilitados;
  referencias.botonMoverPendientes.disabled = controlesDeshabilitados;

  referencias.filtroEstadoRadios.forEach((radio) => {
    radio.disabled = controlesDeshabilitados;
  });

  referencias.botonBorrar.textContent = estadoApp.modoSeleccion
    ? estadoApp.tareasSeleccionadas.size > 0
      ? `Eliminar seleccionadas (${estadoApp.tareasSeleccionadas.size})`
      : "Cancelar seleccion"
    : "Seleccionar para borrar";
}

export function renderizarAplicacion(referencias, estadoApp) {
  const tareasFiltradas = getTareasFiltradas(estadoApp);
  const tareasPendientes = tareasFiltradas.filter((tarea) => !tarea.completada);
  const tareasCompletadas = tareasFiltradas.filter((tarea) => tarea.completada);

  renderLista(
    referencias,
    estadoApp,
    referencias.listaPendientes,
    tareasPendientes,
    estadoApp.tareas.length === 0
      ? "Todavia no tienes tareas pendientes. Agrega una nueva para empezar."
      : "No hay tareas pendientes con los filtros actuales.",
  );
  renderLista(
    referencias,
    estadoApp,
    referencias.listaCompletadas,
    tareasCompletadas,
    "No hay tareas completadas con los filtros actuales.",
  );
  renderEstadisticas(referencias, estadoApp.tareas);
  renderResumen(referencias, estadoApp, tareasFiltradas);
  renderControles(referencias, estadoApp);
}
