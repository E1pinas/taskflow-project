// Archivo de pruebas y ejemplos generado con Cursor

let suma = () => {
  return 2 + 2;
};

// 1. Llama a la función y muestra el resultado
console.log(suma()); // Mostraría 4

// 2. Función más flexible con parámetros
let sumaParametros = (a, b) => {
  return a + b;
};
console.log(sumaParametros(2, 2)); // Mostraría 4

const nombreObjeto = new Object();
nombreObjeto.nombre = "E1Piñas";
console.log(nombreObjeto);

// Creación de una función para calcular el resumen de un carrito de compras
// productos es un array de objetos con los siguientes campos: nombre, precio, cantidad, oferta
// iva es el porcentaje de impuesto
// descuento es el porcentaje de descuento
// el resultado es un objeto con los siguientes campos:
// ok, productosValidos, productosInvalidos, subtotal, descuentoAplicado, baseImponible, impuestos, totalFinal
function calcularResumenCarrito(productos, iva = 21, descuento = 0) {
  if (!Array.isArray(productos)) {
    return {
      ok: false,
      error: "La lista de productos no es válida",
    };
  }

  let subtotal = 0;
  let totalDescuento = 0;
  let productosValidos = 0;
  let productosInvalidos = [];

  for (let i = 0; i < productos.length; i++) {
    const producto = productos[i];

    if (
      !producto ||
      typeof producto.nombre !== "string" ||
      typeof producto.precio !== "number" ||
      typeof producto.cantidad !== "number"
    ) {
      productosInvalidos.push({
        indice: i,
        motivo: "Producto con estructura incorrecta",
      });
      continue;
    }

    if (producto.precio < 0 || producto.cantidad <= 0) {
      productosInvalidos.push({
        indice: i,
        motivo: "Precio o cantidad no válidos",
      });
      continue;
    }

    const totalProducto = producto.precio * producto.cantidad;
    subtotal += totalProducto;
    productosValidos++;

    if (producto.oferta === true) {
      totalDescuento += totalProducto * 0.1;
    }
  }

  if (descuento > 0) {
    totalDescuento += subtotal * (descuento / 100);
  }

  const baseImponible = subtotal - totalDescuento;
  const impuestos = baseImponible * (iva / 100);
  const totalFinal = baseImponible + impuestos;

  return {
    ok: true,
    productosValidos,
    productosInvalidos,
    subtotal: Number(subtotal.toFixed(2)),
    descuentoAplicado: Number(totalDescuento.toFixed(2)),
    baseImponible: Number(baseImponible.toFixed(2)),
    impuestos: Number(impuestos.toFixed(2)),
    totalFinal: Number(totalFinal.toFixed(2)),
  };
}
// Creación de una función para analizar las notas de los alumnos
// alumnos es un array de objetos con los siguientes campos: nombre, notas
// notas es un array de números
// el resultado es un objeto con los siguientes campos:
// ok, totalAlumnos, aprobados, suspendidos, mediaGeneral, mejorAlumno, peorAlumno, resultados
function analizarNotasAlumnos(alumnos) {
  if (!Array.isArray(alumnos)) {
    return {
      ok: false,
      error: "Debes enviar un array de alumnos",
    };
  }

  let aprobados = 0;
  let suspendidos = 0;
  let sumaMedias = 0;
  let mejorAlumno = null;
  let peorAlumno = null;
  let resultados = [];

  for (const alumno of alumnos) {
    if (
      !alumno ||
      typeof alumno.nombre !== "string" ||
      !Array.isArray(alumno.notas)
    ) {
      continue;
    }

    if (alumno.notas.length === 0) {
      resultados.push({
        nombre: alumno.nombre,
        media: 0,
        estado: "Sin notas",
      });
      continue;
    }

    let suma = 0;
    let notasValidas = 0;

    for (const nota of alumno.notas) {
      if (typeof nota === "number" && nota >= 0 && nota <= 10) {
        suma += nota;
        notasValidas++;
      }
    }

    const media = notasValidas > 0 ? suma / notasValidas : 0;
    const estado = media >= 5 ? "Aprobado" : "Suspendido";

    if (estado === "Aprobado") {
      aprobados++;
    } else {
      suspendidos++;
    }

    sumaMedias += media;

    const resultadoAlumno = {
      nombre: alumno.nombre,
      media: Number(media.toFixed(2)),
      estado,
    };

    resultados.push(resultadoAlumno);

    if (!mejorAlumno || media > mejorAlumno.media) {
      mejorAlumno = {
        nombre: alumno.nombre,
        media: Number(media.toFixed(2)),
      };
    }

    if (!peorAlumno || media < peorAlumno.media) {
      peorAlumno = {
        nombre: alumno.nombre,
        media: Number(media.toFixed(2)),
      };
    }
  }

  const mediaGeneral =
    resultados.length > 0 ? sumaMedias / resultados.length : 0;

  return {
    ok: true,
    totalAlumnos: resultados.length,
    aprobados,
    suspendidos,
    mediaGeneral: Number(mediaGeneral.toFixed(2)),
    mejorAlumno,
    peorAlumno,
    resultados,
  };
}


function calcularMedia(notas) {
    if (!Array.isArray(notas) || notas.length === 0) {
        return "No hay notas";
    }

    let total = 0;

    for (let i = 0; i < notas.length; i++) {
        total += notas[i];
    }

    let media = total / notas.length;
    return media.toFixed(2);
}

console.log(calcularMedia([10, 10, 10, 10, 10]));

function validarUsuario(usuario) {
    if (
        !usuario ||
        typeof usuario.nombre !== "string" ||
        typeof usuario.edad !== "number"
    ) {
        return {
            ok: false,
            error: "Debes enviar un objeto con nombre (string) y edad (number)"
        };
    }

    const nombreLimpio = usuario.nombre.trim();

    if (nombreLimpio.length === 0) {
        return {
            ok: false,
            error: "El nombre no puede estar vacío"
        };
    }

    if (usuario.edad < 0 || usuario.edad > 120) {
        return {
            ok: false,
            error: "La edad debe estar entre 0 y 120 años"
        };
    }

    const esMayorDeEdad = usuario.edad >= 18;

    return {
        ok: true,
        nombre: nombreLimpio,
        edad: usuario.edad,
        esMayorDeEdad
    };
}
