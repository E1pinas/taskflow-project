import {
  actualizarTarea as actualizarTareaService,
  crearTarea as crearTareaService,
  eliminarTarea as eliminarTareaService,
  obtenerTodas,
} from "../services/task.service.js";

function esTextoOpcional(valor) {
  return valor === undefined || typeof valor === "string";
}

function esCancionValida(cancion) {
  return typeof cancion === "string" && cancion.trim().length > 0;
}

function esDificultadValida(dificultad) {
  return (
    dificultad === undefined ||
    ["facil", "media", "dificil"].includes(dificultad)
  );
}

function esCompletadaValida(completada) {
  return completada === undefined || typeof completada === "boolean";
}

export function obtenerTareas(_req, res) {
  const tasks = obtenerTodas();

  res.status(200).json(tasks);
}

export function crearTarea(req, res) {
  const { artista, cancion, album, imagen, dificultad, completada } = req.body ?? {};

  if (!esCancionValida(cancion)) {
    return res.status(400).json({
      message: "El campo cancion es obligatorio y debe ser texto.",
    });
  }

  if (!esTextoOpcional(artista) || !esTextoOpcional(album) || !esTextoOpcional(imagen)) {
    return res.status(400).json({
      message: "Los campos artista, album e imagen deben ser texto.",
    });
  }

  if (!esDificultadValida(dificultad)) {
    return res.status(400).json({
      message: "El campo dificultad debe ser facil, media o dificil.",
    });
  }

  if (!esCompletadaValida(completada)) {
    return res.status(400).json({
      message: "El campo completada debe ser booleano.",
    });
  }

  const nuevaTarea = crearTareaService({
    artista: typeof artista === "string" && artista.trim() ? artista.trim() : "Artista desconocido",
    cancion: cancion.trim(),
    album: typeof album === "string" && album.trim() ? album.trim() : "Sencillo",
    imagen: typeof imagen === "string" ? imagen : "",
    dificultad: dificultad ?? "media",
    completada,
  });

  return res.status(201).json(nuevaTarea);
}

export function actualizarTarea(req, res, next) {
  const { artista, cancion, album, imagen, dificultad, completada } = req.body ?? {};

  if (
    !esTextoOpcional(artista) ||
    !esTextoOpcional(cancion) ||
    !esTextoOpcional(album) ||
    !esTextoOpcional(imagen)
  ) {
    return res.status(400).json({
      message: "Los campos de texto enviados no son validos.",
    });
  }

  if (cancion !== undefined && !esCancionValida(cancion)) {
    return res.status(400).json({
      message: "Si envias cancion, debe contener texto.",
    });
  }

  if (!esDificultadValida(dificultad)) {
    return res.status(400).json({
      message: "El campo dificultad debe ser facil, media o dificil.",
    });
  }

  if (!esCompletadaValida(completada)) {
    return res.status(400).json({
      message: "El campo completada debe ser booleano.",
    });
  }

  try {
    const tareaActualizada = actualizarTareaService(req.params.id, {
      ...(artista !== undefined
        ? { artista: artista.trim() || "Artista desconocido" }
        : {}),
      ...(cancion !== undefined ? { cancion: cancion.trim() } : {}),
      ...(album !== undefined ? { album: album.trim() || "Sencillo" } : {}),
      ...(imagen !== undefined ? { imagen } : {}),
      ...(dificultad !== undefined ? { dificultad } : {}),
      ...(completada !== undefined ? { completada } : {}),
    });

    return res.status(200).json(tareaActualizada);
  } catch (error) {
    return next(error);
  }
}

export function eliminarTarea(req, res, next) {
  try {
    eliminarTareaService(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}
