# Comparación de herramientas de IA

En este documento se va a documentar la comparación entre distintas herramientas de inteligencia artificial utilizadas durante el desarrollo del proyecto. El objetivo es analizar cómo responde cada herramienta en tareas relacionadas con programación, explicación de código, análisis del proyecto y propuestas de mejora.

## Metodología

Para realizar la comparación se utilizaron los mismos prompts en ambos asistentes. Las respuestas se analizaron teniendo en cuenta claridad, profundidad, precisión técnica, calidad de los ejemplos y calidad del código generado.

## 1. Explicación de conceptos técnicos

### 1.1 Closures

**Prompt usado:**  
Explica qué es un closure en JavaScript de forma clara, con profundidad media y un ejemplo sencillo.

**Respuesta de ChatGPT:**  
ChatGPT nos explicó que un closure en JavaScript sucede cuando una función sigue teniendo acceso a las variables de su entorno externo, incluso luego de que dicho entorno haya terminado. La respuesta relacionó este comportamiento con el entorno léxico e ilustró con un ejemplo de contador, donde una variable mantiene su valor entre varias ejecuciones. La explicación fue clara y mostró bien cómo los closures permiten mantener estado y crear comportamientos encapsulados.

**Respuesta de Claude:**  
Claude nos explicó que un closure en JavaScript es una función que mantiene acceso a las variables del entorno donde fue creada, incluso cuando ese entorno ya terminó. Para ilustrarlo, utilizó un ejemplo de contador, mostrando cómo una variable puede retener su valor entre distintas llamadas, y también un ejemplo de cuenta bancaria para representar la encapsulación de estado privado. También aportó detalles técnicos, como que los closures capturan referencias y no valores, y que cada invocación puede crear un closure independiente. En general la explicación fue más profunda y técnica, pero se mantuvieron ejemplos prácticos que ayudaban a entender el concepto.

**Comparación:**  

Los dos asistentes explicaron correctamente el concepto de closure, y usaron ejemplos prácticos para hacerlo más comprensible. ChatGPT destacó por ofrecer una explicación más clara y sencilla de entender a primera vista, apoyándose en el ejemplo del contador para mostrar cómo una variable puede conservar su valor entre distintas ejecuciones. Claude, por su parte, dio una respuesta más profunda y técnica, ya que además del contador puso otro ejemplo relacionado con una cuenta bancaria y aportó matices como la captura de referencias y la creación de closures independientes en cada llamada. Juntos, ChatGPT fue más fácil de entender para obtener una idea general del concepto, mientras que Claude dio una explicación más completa desde un punto de vista técnico.

**Conclusión:**  
Para explicar closures, ChatGPT fue más claro y sencillo, mientras que Claude destacó por su mayor profundidad técnica y por ofrecer ejemplos más variados.

### 1.2 Event loop

**Prompt usado:**  
Explica qué es un Event loop en JavaScript de forma clara, con profundidad media y un ejemplo sencillo.

**Respuesta de ChatGPT:** 
El Event Loop es el sistema que organiza cuándo se ejecuta cada tarea en JavaScript, permitiendo que el lenguaje maneje operaciones asíncronas aunque solo tenga un hilo de ejecución.

JavaScript ejecuta el código en una pila llamada Call Stack. Cuando aparece una operación que tarda tiempo, como setTimeout, fetch o un evento del usuario, esa tarea se envía al entorno del navegador o Node.js. Cuando termina, su función se coloca en una cola de tareas. El Event Loop revisa constantemente si la pila está vacía y, cuando lo está, mueve la siguiente tarea de la cola a la pila para ejecutarla.

Gracias a este sistema, JavaScript puede manejar temporizadores, peticiones a servidores y eventos del usuario sin bloquear el programa. Por eso, en algunos casos el orden de ejecución no es el mismo que el orden en que aparece el código, como ocurre con setTimeout, que siempre se ejecuta después de que el código principal haya terminado.

**Respuesta de Claude:** 
JavaScript es single‑threaded, lo que significa que solo puede hacer una cosa a la vez. El Event Loop lo resuelve monitorizando el Call Stack y haciendo cola de tareas asíncronas para ejecutarlas cuando el hilo esté libre, sin congelar el navegador.
Las tareas se clasifican en microtasks (Promises) y macrotasks (setTimeout, eventos), y las microtasks tienen siempre prioridad, por lo que se vacían por completo antes de pasar a la siguiente macrotask. Por eso un setTimeout de 0ms siempre va después de un Promise.then.
Lo importante es que el código síncrono pesado bloquea todo — UI, clicks, timers — porque el Event Loop no puede seguir hasta que el stack esté vacío. De hecho, como dato curioso, el mínimo real de setTimeout(..., 0) es de 4ms por especificación, no cero.

**Comparación:**  
Los dos asistentes explicaron correctamente el funcionamiento del Event Loop en JavaScript, pero cada uno lo hizo desde un enfoque diferente. ChatGPT dio una explicación más ordenada y didáctica, enfocándose en la relación entre Call Stack, tareas asíncronas y la cola de tareas, haciendo que su respuesta fuera más fácil de seguir para alguien que está aprendiendo el concepto. Aparte, enlazó de un modo correcto la teoría con ejemplos cotidianos como `setTimeout`, `fetch` y los eventos del usuario.


Claude, por el contrario, dio una explicación más técnica y más detallada. Incluyó conceptos más avanzados como la diferencia entre microtasks y macrotasks, la prioridad de las Promises por encima de `setTimeout`, el bloqueo que produce el código síncrono pesado y el detalle de que `setTimeout(..., 0)` no se ejecuta realmente de forma instantanea.

**Conclusión:** 
Para explicar el Event Loop, ChatGPT destacó por su claridad y estructura didáctica, mientras que Claude se lució aportando mayor profundidad técnica y detalles avanzados del modelo asíncrono de JavaScript.

### 1.3 Hoisting
**Prompt usado:**  
Explica qué es un Hoisting en JavaScript de forma clara, con profundidad media y un ejemplo sencillo.

**Respuesta de ChatGPT:** 
En JavaScript, el hoisting es el comportamiento por el cual el motor de JavaScript primero “registra” las declaraciones de variables y funciones antes de ejecutar cualquier código. Por eso en algunos casos una variable o función puede parecer que se está usando antes de que se declare.

Cuando se utiliza var, la variable se eleva y existe desde el inicio de la ejecución, pero su valor inicial es undefined hasta que se le asigna un valor. Pero las variables declaradas con let o const también se registran al principio, sólo que no se pueden usar antes de su declaración porque están en una zona llamada Temporal Dead Zone lo cual arrojara un error si se intenta acceder a ellas.

**Respuesta de Claude:** 
La subida (_hoisting_) es el comportamiento donde JavaScript lee y guarda todas las declaraciones antes de ejecutar cualquier código, lo cual hace que parezca que se “sube” hasta la parte superior de su ámbito.
var se hostea pero se inicializa como undefined, lo cual genera bugs silenciosos al acceder a ella antes de su asignación. también se alojan const let, pero caen en la Temporal Dead Zone, lanzando un error explícito si las usas antes de declararlas — lo cual es más seguro y predecible.
Las function declarations son las que tienen más privilegios: se llevan arriba enteritas con su cuerpo, por eso puedes llamarlas antes de definirlas. Las function expressions con var no tienen ese lujo — simplemente eleva la variable como undefined.

**Comparación:**  
Ambos asistentes explicaron correctamente el concepto de hoisting en JavaScript y coincidieron en la idea principal de que el motor registra primero ciertas declaraciones antes de ejecutar el código. ChatGPT presentó una explicación más clara, ordenada y fácil de seguir, diferenciando bien el comportamiento de `var`, `let`, `const` y las funciones declaradas. Su respuesta resulta muy adecuada para entender la base del concepto sin perderse en demasiados detalles.

Claude, en cambio, ofreció una explicación más técnica y crítica. Además de describir el comportamiento de `var`, `let`, `const` y las function declarations, añadió el caso de las function expressions con `var`, explicó que `var` puede provocar errores silenciosos y relacionó la aparición de `let` y `const` con la intención de corregir problemas del diseño original de JavaScript. También aportó contexto histórico, lo que da más profundidad a la explicación.

En conjunto, ChatGPT destacó por su claridad y por hacer el concepto más accesible, mientras que Claude sobresalió por su mayor nivel de detalle técnico y por aportar contexto adicional sobre las causas y consecuencias del hoisting en JavaScript.

**Conclusión:**  
Para explicar hoisting, ChatGPT fue más claro y didáctico, mientras que Claude ofreció una visión más profunda, técnica y contextualizada.
## 2. Detección de bugs

### 2.1 Función 1

```js
function crearFuncionesMultiplicadoras() {
  const funciones = [];

  for (var i = 1; i <= 5; i++) {
    funciones.push(function(numero) {
      return numero * i;
    });
  }

  return funciones;
}

const multiplicadores = crearFuncionesMultiplicadoras();

console.log(multiplicadores);
console.log(multiplicadores);
console.log(multiplicadores);
```
##Repuesta de primera funcion 

**Respuesta de ChatGPT:** 
La primera función (crearFuncionesMultiplicadoras), el bug aparece en el bucle `for` porque se usa var para declarar la variable `i`. En JavaScript, `var` tiene scope de función, no de bloque. Esto significa que todas las funciones que se crean dentro del bucle comparten la misma variable `i`.

Cada función que se guarda en el array mantiene una referencia a esa variable gracias a un closure, pero no guarda el valor de `i` en el momento de la iteración. Cuando el bucle termina, `i` vale 6, porque el bucle terminó cuando `i` superó el valor 5.

Como consecuencia, cuando se ejecuta cualquiera de las funciones del array, todas utilizan el mismo valor final de `i`. Por ejemplo, si llamamos a multiplicadores o multiplicadores, todas devolverán 12, porque realmente están calculando 2 * 6. Esto rompe la intención original del programa, que era crear funciones que multiplicaran por 1, 2, 3, 4 y 5 respectivamente.
La solución es usar `let` en lugar de `var`. let tiene scope de bloque, lo que hace que en cada iteración del bucle se cree una nueva variable `i`. De esta forma, cada función recuerda el valor correcto de `i` en el momento en que se creó.

**Respuesta de Claude:** 
La función tenía un bug clásico de JavaScript: usar var dentro de un loop que crea closures. El problema es que var tiene scope de función, no de bloque, por lo que todas las funciones creadas en el loop compartían la misma variable `i`. Al ejecutarlas, el loop ya había terminado e `i` valía 6, haciendo que todas multiplicaran por 6 en lugar de por 1, 2, 3, 4, 5 — resultado siempre 30 sin importar qué función llamaras.
La causa raíz es que los closures capturan referencias, no valores. Entonces no importa el valor de `i` cuando se creó la función, sino el valor que tiene cuando se ejecuta.
La corrección fue simplemente cambiar var por `let`, que crea una nueva variable `i` por cada iteración del loop, dando a cada closure su propia copia independiente y produciendo los resultados esperados.


### 2.2 Función 2
```js
async function obtenerUsuariosConPosts(userIds) {
  const usuarios = userIds.map(async (id) => {
    const user = await fetch(`https://api.example.com/users/${id}`)
      .then(res => res.json());

    const posts = await fetch(`https://api.example.com/posts/${id}`)
      .then(res => res.json());

    return {
      ...user,
      posts
    };
  });

  return usuarios;
}
```
**Respuesta de ChatGPT:** 
(``obtenerUsuariosConPosts``), el bug está relacionado con el uso de async dentro de ``map``. Cuando se usa ``map`` con una función async, cada iteración devuelve una promesa, no el resultado final. Esto significa que la variable usuarios no contiene los objetos de usuario con sus posts, sino un array de promesas.

El problema ocurre porque la función devuelve ese array directamente sin esperar a que todas las promesas se resuelvan. Como consecuencia, cuando se imprime el resultado en consola, lo que se obtiene es algo parecido a ``[Promise, Promise, Promise]`` en lugar de los datos reales de los usuarios.

Para solucionar este problema, se debe usar ``Promise.all()``, que permite esperar a que todas las promesas se resuelvan antes de devolver el resultado final.

**Respuesta de Claude:** 
La función ``obtenerUsuariosConPosts`` tiene dos bugs relacionados entre sí.
El primero es que ``Array.map`` no sabe nada de ``async/await``. Cuando usas una función async como callback de `map`, lo que obtienes no es el valor resuelto sino una promesa por cada elemento. El array usuarios termina siendo un array de promesas sin resolver, no de objetos con datos reales.
El segundo es consecuencia directa del primero: el return usuarios devuelve ese array de promesas, y aunque ejecutar hace await sobre ``obtenerUsuariosConPosts``, ese await solo espera a que la función externa termine, no a que se resuelvan las promesas internas. Así que resultado en el console.log no va a ser un array de usuarios con sus posts, sino un array tipo ``[Promise, Promise, Promise]``.
Hay otro problema de rendimiento que vale la pena señalar aunque no rompa el código: dentro del map, las dos peticiones fetch se hacen de forma secuencial para cada usuario, es decir, primero espera al usuario y luego pide los posts. Si tienes tres usuarios son seis peticiones en fila en lugar de aprovechar la concurrencia.
La corrección pasa por envolver el resultado del ``map`` con ``Promise.all``, que recibe un array de promesas y devuelve una sola promesa que se resuelve cuando todas se completan. Así sí puedes hacer await sobre el resultado real. Y de paso, puedes usar ``Promise.all`` también para las dos peticiones de cada usuario, de modo que se lancen en paralelo en lugar de en secuencia.

### 2.3 Función 3

```js
function actualizarInventario(inventario, ventas) {
  ventas.forEach(venta => {
    const producto = inventario.find(p => p.id === venta.id);

    if (producto) {
      producto.stock -= venta.cantidad;
    }
  });

  return inventario;
}

const inventarioOriginal = [
  { id: 1, stock: 10 },
  { id: 2, stock: 5 }
];

const ventas = [
  { id: 1, cantidad: 3 }
];

const nuevoInventario = actualizarInventario(inventarioOriginal, ventas);

console.log("Original:", inventarioOriginal);
console.log("Nuevo:", nuevoInventario);
```

**Respuesta de ChatGPT:** 
`(actualizarInventario)`, el bug está relacionado con la mutación de objetos. La función busca un producto dentro del inventario y luego modifica directamente su propiedad stock restando la cantidad vendida. El problema es que los objetos en JavaScript se pasan por referencia. Esto significa que cuando se modifica el objeto dentro de la función, también se está modificando el objeto original fuera de la función.

La consecuencia es que inventarioOriginal cambia aunque el programador probablemente esperaba mantenerlo intacto. Cuando se imprime en consola, tanto inventarioOriginal como nuevoInventario muestran el mismo valor actualizado, porque ambos apuntan al mismo objeto modificado.

Para evitar este problema, es necesario crear una copia del inventario antes de modificarlo. Así se mantiene el principio de inmutabilidad, que es una práctica común en programación moderna.

**Respuesta de Claude:** 
La función ``actualizarInventario`` tiene un bug de mutación de datos que pasa desapercibido fácilmente porque el código parece correcto a primera vista y de hecho funciona, pero con un efecto secundario muy problemático.
El problema es que ``inventario.find`` devuelve una referencia directa al objeto dentro del array original, no una copia. Entonces cuando haces producto.stock -= venta.cantidad estás modificando el objeto original en memoria. Como resultado, ``inventarioOriginal`` e inventarioNuevo apuntan exactamente al mismo array con los mismos objetos, y ambos reflejan los cambios. Si haces el console.log verás que "Original" también muestra stock 7 en lugar de 10, aunque nunca quisiste tocarlo.
Esto es especialmente peligroso en aplicaciones reales porque el inventario original puede estar siendo usado en otros lugares del código, en un estado de React, en una caché, o en un log de auditoría, y todos recibirán los cambios sin saberlo. Es el tipo de bug que no lanza ningún error y es difícil de rastrear porque los síntomas aparecen lejos de donde está la causa.
La corrección consiste en no tocar nunca el array original y construir uno nuevo con los datos actualizados, usando map para crear copias de cada objeto:


## 3.Impletacio de codigo de IA
### 3.1 Funcion 1 

**Prompt ChatGPT & Claude**
Una función que reciba un array de números y devuelva el número que más veces se repite.

**Repuesta Generada por ChatGPT**
```js
function numeroMasRepetido(array) {
  const contador = {};
  let masRepetido = array[0];
  let maxVeces = 0;

  for (let numero of array) {
    contador[numero] = (contador[numero] || 0) + 1;

    if (contador[numero] > maxVeces) {
      maxVeces = contador[numero];
      masRepetido = numero;
    }
  }

  return masRepetido;
}

console.log(numeroMasRepetido([1, 2, 3, 2, 4, 2, 5])); // 2
console.log(numeroMasRepetido([7, 7, 1, 1, 7, 3]));    // 7
```

### Puntos fuertes
- Es más fácil de leer para una persona que está aprendiendo.
- Usa un `for...of`, que suele ser más claro que encadenar varios métodos funcionales.
- Recorre el array una sola vez, así que es eficiente.
- La lógica se entiende paso a paso: contar y actualizar el más repetido al mismo tiempo.

### Punto débil
- No controla el caso de un array vacío.
- Si se llama con `[]`, `array[0]` será `undefined`.



**Repuesta Generada por Claude**
```js
function encontrarMasFrecuente(numeros) {
  if (!numeros || numeros.length === 0) return null;

  const frecuencias = numeros.reduce((acc, num) => {
    acc[num] = (acc[num] || 0) + 1;
    return acc;
  }, {});

  return Number(
    Object.entries(frecuencias).reduce((a, b) => (b[1] > a[1] ? b : a))[0]
  );
}

// Ejemplos
console.log(encontrarMasFrecuente([1, 2, 2, 3, 3, 3, 4])); // 3
console.log(encontrarMasFrecuente([5, 5, 1, 1, 5]));        // 5
console.log(encontrarMasFrecuente([]));                      // null
```

### Puntos fuertes
- Sí controla correctamente el caso de array vacío.
- Usa `reduce`, que es una herramienta potente en JavaScript.
- El resultado final está bien resuelto para arrays numéricos.

### Puntos débiles
- Es menos intuitivo para un usuario principiante.
- Hace más pasos mentales para entenderlo: `reduce` para contar, `Object.entries` para convertir, otro `reduce` para elegir el mayor y `Number(...)` para corregir el tipo.
- Aunque funciona, es menos directo de leer y mantener. 

### 3.2 Funcion 2
**Prompt ChatGPT & Claude**
Una función que reciba un string y verifique si es un palíndromo ignorando espacios y mayúsculas.

**Repuesta Generada por ChatGPT**
```js
function esPalindromo(texto) {
  const textoLimpio = texto
    .toLowerCase()
    .replace(/\s+/g, "");

  const textoInvertido = textoLimpio
    .split("")
    .reverse()
    .join("");

  return textoLimpio === textoInvertido;
}

console.log(esPalindromo("Anita lava la tina")); // true
console.log(esPalindromo("Reconocer")); // true
console.log(esPalindromo("Hola mundo")); // false
```

**Puntos fuertes**

- Es más fácil de leer para alguien que está aprendiendo JavaScript.
- La lógica está muy bien separada en pasos:limpiar el texto,invertirlo,comparar.
- Sirve muy bien para explicar cómo funcionan split, reverse y join.

**Puntos débiles**

- No valida que la entrada sea realmente un string.
- Solo elimina espacios, pero no elimina signos de puntuación, comas, tildes especiales o símbolos.
- Puede fallar en casos reales donde el texto venga con caracteres adicionales.

**Repuesta Generada por Claude**
```js
function esPalindromo(str) {
  if (!str || typeof str !== "string") return false;

  const limpio = str
    .toLowerCase()
    .replace(/[^a-záéíóúüñ0-9]/gi, "");

  return limpio === limpio.split("").reverse().join("");
}

// Ejemplos
console.log(esPalindromo("Anita lava la tina"));  // true
console.log(esPalindromo("A man a plan a canal")); // true
console.log(esPalindromo("Hola mundo"));           // false
console.log(esPalindromo("Reconocer"));            // true
console.log(esPalindromo(""));                     // false
```

  **Puntos fuertes**
  
  - Valida la entrada antes de procesarla.
  - No solo elimina espacios: elimina cualquier carácter que no sea letra o número.
  - Funciona mejor en situaciones reales, por ejemplo con comas, signos o frases más sucias.
  - El código es más robusto para usar en una aplicación.
  
  **Puntos débiles**
  
  - Es un poco menos didáctico para un principiante, porque la expresión regular es más compleja.
  - La línea ``replace(/[^a-záéíóúüñ0-9]/gi, "")`` puede costar más de entender si todavía estás aprendiendo expresiones regulares.
  - Decide que una cadena vacía devuelva false, lo cual es válido, pero hay ejercicios donde ese caso se trata de otra forma.

### 3.3 Funcion 3 
**Prompt ChatGPT & Claude**
Una función que reciba una lista de usuarios con edad y devuelva solo los usuarios mayores de 18 ordenados por edad.

**Repuesta Generada por ChatGPT**

```js
function obtenerMayoresDeEdadOrdenados(usuarios) {
  return usuarios
    .filter(usuario => usuario.edad > 18)
    .sort((a, b) => a.edad - b.edad);
}

// Ejemplo real
const usuarios = [
  { nombre: "Ana", edad: 17 },
  { nombre: "Luis", edad: 25 },
  { nombre: "Marta", edad: 19 },
  { nombre: "Carlos", edad: 32 },
  { nombre: "Elena", edad: 18 }
];

console.log(obtenerMayoresDeEdadOrdenados(usuarios));
```



**Puntos fuertes**

- Es más simple y directo de leer.
- Usa `filter()` y `sort()` de forma clara y correcta.
- La intención se entiende rápido: primero filtrar, luego ordenar.
- Es una buena solución para alguien que está aprendiendo JavaScript.

**Puntos débiles**

- No valida la entrada antes de procesarla.
- Si `usuarios` es `null`, `undefined` o no es un array, el código falla.
- No protege contra datos incorrectos en un caso real.
- Es bueno para ejemplos sencillos, pero menos robusto para una aplicación.

**Repuesta Generada por Claude**
```js
function filtrarYOrdenarUsuarios(usuarios) {
  if (!usuarios || usuarios.length === 0) return [];

  return usuarios
    .filter(usuario => usuario.edad > 18)
    .sort((a, b) => a.edad - b.edad);
}

// Ejemplo
const usuarios = [
  { nombre: "Ana",    edad: 25 },
  { nombre: "Luis",   edad: 16 },
  { nombre: "Carlos", edad: 32 },
  { nombre: "María",  edad: 18 },
  { nombre: "Pedro",  edad: 21 },
];

console.log(filtrarYOrdenarUsuarios(usuarios));
```

**Puntos fuertes**

- Valida parcialmente la entrada antes de procesarla.
- Controla el caso en el que `usuarios` no exista o esté vacío.
- Mantiene una solución clara usando `filter()` y `sort()`.
- Es más robusto que el código de ChatGPT para uso real.

**Puntos débiles**

- La validación no es completa, porque no comprueba si `usuarios` es realmente un array.
- Por ejemplo, una cadena como `"hola"` tiene `length`, pero no tiene `filter()`, así que fallaría.
- El comentario del resultado en el ejemplo está mal ordenado.
- Aunque mejora la seguridad del código, todavía se puede hacer mejor con `Array.isArray()`.

**Conclusión final comparando ambas IA**

Si juntamos las tres funciones, el patrón general queda bastante claro:

- ChatGPT gana en claridad, legibilidad y valor didáctico.
- Claude gana en validación, robustez y preparación para casos reales.