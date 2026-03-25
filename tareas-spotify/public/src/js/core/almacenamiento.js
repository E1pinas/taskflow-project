const LLAVE_TAREAS = "taskflow_spotify_tareas";
const LLAVE_TEMA = "taskflow_spotify_tema";

export function cargarTareas() {
  try {
    return JSON.parse(localStorage.getItem(LLAVE_TAREAS)) || [];
  } catch (error) {
    return [];
  }
}

export function guardarTareas(tareas) {
  localStorage.setItem(LLAVE_TAREAS, JSON.stringify(tareas));
}

export function cargarTema() {
  return localStorage.getItem(LLAVE_TEMA);
}

export function guardarTema(tema) {
  localStorage.setItem(LLAVE_TEMA, tema);
}
