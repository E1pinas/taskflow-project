# Flujo de trabajo con Cursor

En este documento se va a documentar cómo se utilizó Cursor como IDE asistido por inteligencia artificial dentro del proyecto. Se explicará cómo se abrió el repositorio, cómo se exploró el código, qué tipo de preguntas se hicieron a la IA y qué utilidad tuvo esta herramienta dentro del flujo de desarrollo.

# Cursor Workflow

## Objetivo

Probar distintas funciones de Cursor dentro del proyecto y documentar cómo ayudan en el flujo de trabajo.

## Entorno de trabajo

- Proyecto: tareas-spotify
- Editor: Cursor
- Sistema: Windows
- Lenguaje principal probado: JavaScript

## Explora la interfaz: explorador de archivos, terminal integrada, chat y herramientas de edición

Tuve que ajustar e instalar extensiones de VS Code en Cursor para estar familiarizado con este nuevo entorno. Supe que eran similares y pude hacerlo con una opción de importación que está en los ajustes del propio Cursor. Claramente no lo hizo todo: tomó un JSON de mis ajustes de VS Code y trajo algunas extensiones que ya tenía, pero no todas. Tienen su propia IA; no sabría decir si es totalmente propia porque investigué y vi que también integra más IA como Claude, ChatGPT y Gemini. Me mencionó que funciona por tokens y que no es ilimitado, así que tengo que saber cuándo usarlo porque tengo el plan gratuito.

## Prueba el autocompletado escribiendo comentarios que describan funciones

Llegué a probar esta funcionalidad en los comentarios y veo que, cuando escribo algo mínimo, tiene una idea de lo que quiero escribir en mi comentario sobre la función que está encima. Además, funciona con el código: también tiene idea de lo que estoy programando.

## Utiliza el chat contextual para pedir explicaciones de partes del código

Sí llegué a usar el chat. Este fue mi prompt: `entiendes en que ruta estoy trabajando y si sabes menciona que haces mis funciones y dime 3 variables para saber si estamos hablando del mismo archivo que estamos trabajando ,si no sabes me preguntas para darte la ruta de trabajo que estoy ralizando`. Supo en qué archivo estaba trabajando, me mencionó qué funciones tenía con todo y nombre y me dio una breve introducción. Además, me preguntó si estaba bien su respuesta y si estaba bien la ruta de trabajo.

## Utiliza la edición inline para modificar funciones existentes

Me gusta que muestre un mini chat para corregir las funciones de nuestro código. La última función llamada `calcularMedia()` la puse con errores y me arregló la función. Me sorprende que tenga un atajo de teclado `Ctrl+K`; intenté probarlo en VS Code y no tiene esa funcionalidad de edición inline. Así podría desarrollar un 20 % más rápido mis códigos.

## Cambios generados con Composer

Con Composer generé una nueva función llamada `validarUsuario` en el archivo `doc/pruebas-cursor/funciones.js`, y además actualicé este documento `doc/ai/cursor-workflow.md` para dejar constancia de que el cambio fue asistido por la IA y afectó a varios archivos del proyecto.

# Atajos de teclado

En VS Code yo ya tenía atajos y los apliqué aquí también y funcionaban. Mencionaré los que uso más a menudo:

- `Ctrl + Shift + E`: me muestra la lista de archivos que tengo en mi proyecto y con las flechas puedo interactuar.
- `Ctrl + Ñ`: es para abrir o esconder la terminal (no cierra la terminal si está en proceso, claro).
- `Ctrl + Tab`: es para cambiar de archivos que tenga en mi editor.
- `Ctrl + 1`: si estoy en la terminal y quiero volver a mi editor presiono esta combinación.
- `Shift + F10`: si estoy en una carpeta me saldrá un menú contextual con sus opciones; lo mismo pasa si estoy sobre un archivo.

**Claro que tengo más atajos, pero estos son los que más uso en mi día a día.**

## Refactorizar Taskflow usando IA

**Usar IA para refactorizar**

- Antes yo usaba `Date.now() + Math.random()` y me corrigió con una función `generarId()` que mantiene el identificador único y el orden como número secuencial, evitando colisiones y haciendo el reordenamiento más seguro.
- Se creó una función `commitCambios()` que centraliza la lógica de guardar en `localStorage` y volver a pintar la interfaz, en lugar de repetir `guardarTareas()` y `renderTareas()` en muchas funciones.
- Se añadió `mostrarToast(mensaje, tipo)` con un contenedor `toastContainer` para reemplazar los `alert`, y ahora los errores y avisos salen como notificaciones bonitas en la esquina inferior derecha.
- La edición y confirmación de acciones (borrar, mover y completar tareas) ahora usan dos modales HTML independientes: `modal.html` para agregar canción y `confirm-modal.html` para confirmaciones, cada una cargada con su propio archivo JS (`modal.js` y `confirm-modal.js`).
- En el archivo de pruebas `doc/pruebas-cursor/funciones.js` se creó la función `validarUsuario` y se ordenó el resto del código de ejemplo para que sirva como laboratorio de funciones junto con `calcularMedia`, `calcularResumenCarrito` y `analizarNotasAlumnos`.

## Revisión manual y commits (antes de aceptar cambios)

- Antes de aceptar cambios generados por IA, revisé manualmente los archivos principales afectados (por ejemplo `app.js`, `index.html`, `modal.html`, `modal.js`, `confirm-modal.html` y `confirm-modal.js`) para asegurar que el flujo no se rompiera y que la UX quedara consistente (sin `alert/confirm` nativos).
- También separé los cambios en commits con mensajes claros para que quede fácil rastrear qué se cambió y por qué:
- `docs: documenta uso de IA y ejemplos de pruebas`: documentación del flujo y carpeta `doc/` con ejemplos.
- `feat: toasts y modal de confirmación para acciones de tareas`: refactor de IDs/orden, centralización con `commitCambios()`, toasts y modales de confirmación.

## Realiza al menos cinco consultas distintas utilizando el servidor MCP

- Use el servidor MCP filesystem para listar los archivos y carpetas de la raíz de mi proyecto.
- Use el servidor MCP filesystem para leer el archivo README.md de mi proyecto y resumirlo.
- Use el servidor MCP filesystem para identificar las carpetas principales del proyecto y explicar la función probable de cada una.
- Use el servidor MCP filesystem para buscar archivos importantes de configuración o archivos de entrada principal.
- Use el servidor MCP filesystem para hacer un resumen técnico de la estructura general del proyecto.

## Proceso de Instalación de MCP - Paso a Paso

### Paso 1: Configurar el archivo mcp.json

Necesitas crear o editar el archivo de configuración `mcp.json` en la carpeta `.vscode` de tu proyecto. Este archivo debe contener la configuración del servidor, incluyendo:

- El comando para ejecutar el servidor
- Los argumentos necesarios (como las rutas permitidas)
- Variables de entorno si son necesarias

Ejemplo de configuración básica:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "/ruta/a/tu/proyecto"]
    }
  }
}
```

### Paso 2: Reiniciar Cursor

Después de configurar el archivo `mcp.json`, necesitas reiniciar completamente Cursor para que cargue la nueva configuración. Simplemente cierra la aplicación y ábrela nuevamente.

### Paso 3: Verificar que funciona

Una vez reiniciado Cursor, puedes verificar que MCP está funcionando preguntándole a la IA sobre archivos específicos de tu proyecto. Si responde correctamente con información de archivos que no le has mostrado directamente, significa que MCP está configurado correctamente.

### Paso 4: Ajustar permisos si es necesario

Si encuentras errores de acceso, puede que necesites ajustar los permisos del servidor. Algunos servidores requieren configuración adicional de seguridad o rutas específicas permitidas.

## Explica en qué casos puede ser útil MCP en proyectos reales

Entiendo que se usa mas en proyectos gigantes ,ejemplo claro cuando eres novato y haces un ``git clone del repo de la empresa `` y tienes mucho carpetas y proyectos con esta herramienta te puedes guiarte a como esta estrcuturado los archivos y carpetas del proyecto , y haci puedes comprender mas el proyecto y puedes realizar busquedas mas eficiente con esta herramienta w 