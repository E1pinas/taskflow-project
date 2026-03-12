// ============================================
// EJERCICIOS CONECTADOS CON TAREAS-SPOTIFY
// Funciones de utilidad para el proyecto de gestión de tareas musicales
// ============================================

// 1. VALIDAR ENTRADA DE CANCIÓN TIPO TAREAS-SPOTIFY
// Valida que la canción tenga los campos requeridos
function validarEntradaCancion(cancion) {
  if (!cancion || typeof cancion !== "object") {
    return {
      ok: false,
      error: "Debes enviar un objeto de canción válido"
    };
  }

  const artistaValido = typeof cancion.artista === "string" && cancion.artista.trim().length > 0;
  const cancionValida = typeof cancion.cancion === "string" && cancion.cancion.trim().length > 0;
  const albumValido = !cancion.album || typeof cancion.album === "string";

  const errores = [];
  if (!artistaValido) errores.push("Artista requerido y debe ser texto no vacío");
  if (!cancionValida) errores.push("Canción requerida y debe ser texto no vacío");
  if (!albumValido) errores.push("Álbum debe ser texto");

  if (errores.length > 0) {
    return {
      ok: false,
      errores
    };
  }

  return {
    ok: true,
    artista: cancion.artista.trim(),
    cancion: cancion.cancion.trim(),
    album: cancion.album?.trim() || "Sencillo",
    completada: cancion.completada === true
  };
}

console.log("=== 1. VALIDAR ENTRADA DE CANCIÓN ===");
console.log(validarEntradaCancion({ artista: "The Weeknd", cancion: "Blinding Lights", album: "After Hours" }));
console.log(validarEntradaCancion({ artista: "", cancion: "Song" }));

// ============================================

// 2. ANALIZAR ESTADÍSTICAS DE PLAYLIST
// Calcula métricas de la lista de tareas musicales
function analizarPlaylist(canciones) {
  if (!Array.isArray(canciones)) {
    return {
      ok: false,
      error: "Debe ser un array de canciones"
    };
  }

  let totalCanciones = 0;
  let completadas = 0;
  let pendientes = 0;
  let artistas = new Set();
  let albums = new Set();
  let cancPorArtista = {};

  for (const cancion of canciones) {
    if (validarEntradaCancion(cancion).ok) {
      totalCanciones++;
      
      if (cancion.completada) {
        completadas++;
      } else {
        pendientes++;
      }

      artistas.add(cancion.artista);
      if (cancion.album) albums.add(cancion.album);

      if (!cancPorArtista[cancion.artista]) {
        cancPorArtista[cancion.artista] = 0;
      }
      cancPorArtista[cancion.artista]++;
    }
  }

  const porcentajeCompletado = totalCanciones > 0 ? Number(((completadas / totalCanciones) * 100).toFixed(2)) : 0;

  return {
    ok: true,
    totalCanciones,
    completadas,
    pendientes,
    porcentajeCompletado,
    artistasUnicos: artistas.size,
    albumsUnicos: albums.size,
    cancionesArtista: Object.fromEntries(
      Object.entries(cancPorArtista).sort((a, b) => b[1] - a[1])
    )
  };
}

console.log("\n=== 2. ANALIZAR ESTADÍSTICAS DE PLAYLIST ===");
const miPlaylist = [
  { artista: "The Weeknd", cancion: "Blinding Lights", album: "After Hours", completada: true },
  { artista: "The Weeknd", cancion: "Starboy", album: "Starboy", completada: true },
  { artista: "Dua Lipa", cancion: "Levitating", album: "Future Nostalgia", completada: false },
  { artista: "Dua Lipa", cancion: "Don't Start Now", album: "Future Nostalgia", completada: true }
];
console.log(analizarPlaylist(miPlaylist));

// ============================================

// 3. BUSCAR Y FILTRAR CANCIONES
// Busca canciones por término en cualquier campo
function buscarCanciones(canciones, termino, filtarPor = "todos") {
  if (!Array.isArray(canciones) || typeof termino !== "string") {
    return {
      ok: false,
      error: "Debe enviar un array de canciones y un término válido"
    };
  }

  const terminoLimpio = termino.toLowerCase().trim();
  if (terminoLimpio.length === 0) {
    return {
      ok: false,
      error: "El término de búsqueda no puede estar vacío"
    };
  }

  let resultados = canciones.filter(cancion => {
    const coincide = 
      cancion.artista?.toLowerCase().includes(terminoLimpio) ||
      cancion.cancion?.toLowerCase().includes(terminoLimpio) ||
      cancion.album?.toLowerCase().includes(terminoLimpio);

    if (filtarPor === "completadas") {
      return coincide && cancion.completada === true;
    } else if (filtarPor === "pendientes") {
      return coincide && cancion.completada !== true;
    }

    return coincide;
  });

  return {
    ok: true,
    termino,
    filtro: filtarPor,
    totalResultados: resultados.length,
    resultados
  };
}

console.log("\n=== 3. BUSCAR Y FILTRAR CANCIONES ===");
console.log(buscarCanciones(miPlaylist, "the weeknd"));
console.log("\nBúsqueda de 'dua' filtrada por completadas:");
console.log(buscarCanciones(miPlaylist, "dua", "completadas"));

// Exportar funciones si se usa en módulo
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    validarEntradaCancion,
    analizarPlaylist,
    buscarCanciones
  };
}
