export function generarId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function normalizarCancion(item) {
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
