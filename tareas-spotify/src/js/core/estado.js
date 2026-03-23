function clonarSeleccion(seleccion) {
  return new Set(seleccion);
}

export function crearEstado(inicial) {
  let estado = {
    tareas: inicial.tareas || [],
    modoSeleccion: Boolean(inicial.modoSeleccion),
    tareasSeleccionadas: clonarSeleccion(inicial.tareasSeleccionadas || []),
  };

  const suscriptores = new Set();

  function obtenerEstado() {
    return {
      ...estado,
      tareas: [...estado.tareas],
      tareasSeleccionadas: clonarSeleccion(estado.tareasSeleccionadas),
    };
  }

  function suscribirse(listener) {
    suscriptores.add(listener);
    return () => suscriptores.delete(listener);
  }

  function notificar() {
    const instantanea = obtenerEstado();
    suscriptores.forEach((listener) => listener(instantanea));
  }

  function actualizar(productor) {
    const siguienteEstado = productor(estado);

    if (!siguienteEstado) {
      return;
    }

    estado = siguienteEstado;
    notificar();
  }

  function establecerTareas(tareas) {
    actualizar((actual) => {
      const idsValidos = new Set(tareas.map((tarea) => tarea.id));
      const seleccionFiltrada = new Set(
        [...actual.tareasSeleccionadas].filter((id) => idsValidos.has(id)),
      );

      return {
        ...actual,
        tareas: [...tareas],
        tareasSeleccionadas: seleccionFiltrada,
      };
    });
  }

  function activarModoSeleccion() {
    if (estado.modoSeleccion) {
      return;
    }

    actualizar((actual) => ({
      ...actual,
      modoSeleccion: true,
      tareasSeleccionadas: new Set(),
    }));
  }

  function toggleModoSeleccion() {
    if (estado.modoSeleccion) {
      cancelarModoSeleccion();
      return;
    }

    activarModoSeleccion();
  }

  function cancelarModoSeleccion() {
    if (!estado.modoSeleccion && estado.tareasSeleccionadas.size === 0) {
      return;
    }

    actualizar((actual) => ({
      ...actual,
      modoSeleccion: false,
      tareasSeleccionadas: new Set(),
    }));
  }

  function toggleTarea(id) {
    actualizar((actual) => {
      if (actual.modoSeleccion) {
        const siguienteSeleccion = new Set(actual.tareasSeleccionadas);

        if (siguienteSeleccion.has(id)) {
          siguienteSeleccion.delete(id);
        } else {
          siguienteSeleccion.add(id);
        }

        return {
          ...actual,
          tareasSeleccionadas: siguienteSeleccion,
        };
      }

      return {
        ...actual,
        tareas: actual.tareas.map((tarea) =>
          tarea.id === id
            ? { ...tarea, completada: !tarea.completada }
            : tarea,
        ),
      };
    });
  }

  function eliminarSeleccionadas() {
    actualizar((actual) => ({
      ...actual,
      tareas: actual.tareas.filter(
        (tarea) => !actual.tareasSeleccionadas.has(tarea.id),
      ),
      modoSeleccion: false,
      tareasSeleccionadas: new Set(),
    }));
  }

  return {
    obtenerEstado,
    suscribirse,
    establecerTareas,
    activarModoSeleccion,
    toggleModoSeleccion,
    cancelarModoSeleccion,
    toggleTarea,
    eliminarSeleccionadas,
  };
}
