import { randomUUID } from "node:crypto";
import { tareaPrincipio } from "../data/tarea-principio.js";

let tasks = tareaPrincipio.map((task) => ({ ...task }));

function createTaskId() {
  return randomUUID();
}

export function obtenerTodas() {
  return [...tasks];
}

export function crearTarea(data) {
  const nuevaTarea = {
    id: createTaskId(),
    artista: data.artista,
    cancion: data.cancion,
    album: data.album,
    imagen: data.imagen,
    dificultad: data.dificultad,
    completada: Boolean(data.completada ?? false),
    creadaEn: new Date().toISOString(),
  };

  tasks.push(nuevaTarea);

  return nuevaTarea;
}

export function actualizarTarea(id, cambios) {
  const indice = tasks.findIndex((task) => task.id === id);

  if (indice === -1) {
    throw new Error("NOT_FOUND");
  }

  tasks[indice] = {
    ...tasks[indice],
    ...cambios,
  };

  return tasks[indice];
}

export function eliminarTarea(id) {
  const indice = tasks.findIndex((task) => task.id === id);

  if (indice === -1) {
    throw new Error("NOT_FOUND");
  }

  tasks.splice(indice, 1);
}
