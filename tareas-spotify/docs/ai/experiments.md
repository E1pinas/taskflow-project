# Experimentos de programación

Este documento recoge un experimento comparativo entre resolver pequeños problemas de programación sin ayuda de IA y con ayuda de IA. Después se repite el experimento con tareas relacionadas al proyecto **tareas-spotify**.

## 1. Problemas genéricos

### Problemas escogidos

1. Calcular factorial de un número.
2. Hallar el máximo común divisor (y mínimo común múltiplo) de dos enteros.
3. Comprobar si una cadena es palíndroma.

### Resolución sin IA

- **Factorial**: escribí un bucle simple `for` en ~2 minutos, con validación básica de número no negativo.
- **MCD/MCM**: implementé el algoritmo de Euclides en ~5 minutos, luego agregué cálculo de MCM en unos minutos más.
- **Palíndromo**: utilicé `.split('').reverse().join('')` y comparé cadenas; tardé ~1 minutos.

En total requirió aproximadamente 10–12 minutos. El código funcionó, pero no manejaba casos especiales (entrada inválida, tildes, espacios, límites) y requería mejoras manuales posteriores.

### Resolución con IA

- Se solicitó a cursor mejorar cada función y ampliar validación. La IA generó:
  - Un `calcularFactorial()` con verificación de tipo, rango y mensaje de error.
  - Un `calcularMCD()` que también devuelve MCM y controla negativos/decimales.
  - Un `esPalindromo()` que normaliza texto (quita tildes, espacios, acentos) y devuelve datos detallados.

El proceso con IA tomó menos de 2 minutos en total para copiar las funciones sugeridas y probarlas.

### Comparación

En este experimento genérico, sin ayuda de IA la implementación llevó alrededor de veinte minutos; con cursor el trabajo se redujo a apenas dos minutos. El código generado manualmente era correcto pero muy básico, mientras que las funciones sugeridas por la IA fueron más robustas, incorporando validaciones y cubriendo casos extremos. Además, escribirlo a mano ayudó a comprender los conceptos fundamentales, pero el código de la IA incluyó detalles (normalización de texto, límites matemáticos) que ampliaron mi entendimiento del problema.

## 2. Problemas del proyecto tareas-spotify

### Tareas escogidas

1. Validar la entrada de una canción/tarea.
2. Analizar estadísticas de una playlist/tareas.
3. Buscar y filtrar canciones según término y estado.

### Resolución sin IA

Desarrollé manualmente en el archivo de pruebas:

- `validarEntradaCancion()` con cheques de tipo/texto.
- `analizarPlaylist()` iterando y acumulando contadores.
- `buscarCanciones()` filtrando por campos y estado.

El proceso tomó unos 20 minutos porque ajusté lógica de filtros y validaciones.

### Resolución con IA

Utilicé cursor para generar funciones a partir de descripciones; el código estuvo listo en segundos, e incluyó recomendaciones como devolver objetos `ok/errores`, ordenar resultados por artista, etc. El tiempo total fue inferior a 3 minutos.

### Comparación

En las tareas específicas del proyecto, la construcción manual consumió unos veinte minutos, mientras que con IA se tardó alrededor de tres minutos. Sin IA las funciones funcionaban, pero carecían de algunos detalles como el ordenamiento de resultados o una estructura uniforme de respuestas; con cursor esas mejoras venían incorporadas y hasta incluía ejemplos de prueba. La elaboración manual permitió entender la lógica básica, aunque la IA aportó sugerencias de diseño y validación que profundizaron la comprensión del dominio musical y de la app.

## Conclusión

El uso de IA aceleró significativamente la implementación y mejoró la calidad del código al proponer validaciones y casos de uso adicionales. Resolver manualmente ayuda a entender cada paso, pero la asistencia de cursor sirve como una segunda opinión valiosa y permite concentrarse en la lógica de alto nivel. Documentar estos experimentos puede orientar futuras decisiones sobre cuándo aprovechar la IA en el flujo de trabajo de desarrollo.

## 3. Ampliación de la aplicación tareas-spotify

A partir del trabajo inicial, utilicé la IA para generar ideas de mejoras y luego implementarlas una a una, revisando siempre el código propuesto.

- Se añadió un filtro visual por estado (listas de pendientes/completadas) usando radios; la IA sugirió la estructura HTML y la lógica de filtrado.
- Inicialmente se incorporó un control de dificultad también con radios, pero tras probar resultó muy desordenado. Cambié a un `select` más compacto y agradable (la idea original vino de la IA, y la revisión humana detectó el problema de legibilidad).
- Se incorporó un control de ordenación con un `select`; Copilot generó la función de ordenamiento inmutable.
- Se implementó exportar/importar JSON de tareas, aunque después decidí retirar la UI porque no lo usaría; la IA ayudó a escribir el código, que fue eliminado posteriormente.
- El editor de tareas pasó de usar `prompt` a reusar la misma modal de creación; la IA recomendó cómo gestionar el estado de edición y reiniciar el formulario.
- Se mejoró el botón de alternar tema oscuro para que cambie de apariencia y texto, facilitando su uso (la IA sugirió que el texto se actualice, y añadí cambios de color manualmente). Durante la implementación apareció un error de JavaScript por no declarar `dificultadCancion` en el inicializador del modal, lo que rompía la adición de tareas y el toggle; fue corregido manualmente tras detectarlo en la consola.
  Cada una de estas mejoras se registró como commits separados, evidenciando el flujo de trabajo de IA: idea → sugerencia → revisión humana → commit.

Estos pasos demuestran cómo la IA puede servir tanto para ideación como para acelerar la codificación sin reemplazar la revisión y el criterio del desarrollador.
