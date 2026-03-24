# Prompt Engineering

En este documento se va a documentar cómo se aplicaron técnicas de prompt engineering durante el uso de herramientas de inteligencia artificial en el proyecto. Se mostrarán ejemplos de prompts simples y prompts mejorados, explicando cómo una instrucción más clara y específica permite obtener respuestas más útiles.

## Prompts Útiles

A continuación, se listan al menos diez prompts útiles aplicados al desarrollo, categorizados por técnica de prompt engineering. Cada prompt incluye una explicación de por qué funciona bien.

### 1. Definir un Rol: Desarrollador Senior para Refactorización

**Prompt:** "Actúa como un desarrollador senior con 10 años de experiencia en JavaScript. Refactoriza la función de manejo de tareas en app.js del proyecto taskflow-project para que sea más legible, eficiente y siga las mejores prácticas de código limpio. Explica brevemente los cambios realizados."

**Por qué funciona bien:** Al asignar un rol específico, la IA responde con un enfoque más profesional, priorizando aspectos como mantenibilidad, claridad, rendimiento y buenas prácticas. Esto hace que la salida sea más útil para tareas reales de desarrollo, proporcionando refactorizaciones que integran bien con el código existente del proyecto.

### 2. Few-Shot Prompting: Generar Código con Ejemplos

**Prompt:** "Genera una función JavaScript para validar el email en el formulario de registro del proyecto taskflow-project. Debe devolver true o false, manejar espacios en blanco y correos con subdominios. Ejemplo 1: Para 'user@example.com' debe retornar true. Ejemplo 2: Para 'invalid-email' debe retornar false."

**Por qué funciona bien:** Proporcionar ejemplos concretos guía a la IA hacia el formato y comportamiento esperado, reduciendo ambigüedades y mejorando la precisión del código generado. En el contexto del proyecto, esto asegura que la validación se integre correctamente con el flujo de registro y maneje casos límite reales de usuarios.

### 3. Razonamiento Paso a Paso: Implementar una Función Compleja

**Prompt:** "Implementa una función que calcule el factorial de un número de manera recursiva para el módulo de cálculos matemáticos en taskflow-project. Razona paso a paso: Primero, define qué es el factorial. Segundo, explica la lógica recursiva. Tercero, escribe el código. Cuarto, agrega validación para números negativos."

**Por qué funciona bien:** Pedir razonamiento paso a paso obliga a la IA a estructurar su respuesta lógicamente, lo que resulta en explicaciones claras y código bien pensado, facilitando el aprendizaje y la verificación. Esto es especialmente útil en el proyecto para funciones complejas que requieren comprensión profunda antes de la implementación.

### 4. Restricciones Claras: Generar Código sin Librerías Externas

**Prompt:** "Genera una función JavaScript pura (sin usar librerías externas como Lodash) que ordene un array de objetos de tareas por prioridad en el proyecto taskflow-project. La función debe ser inmutable y no modificar el array original."

**Por qué funciona bien:** Especificar restricciones claras evita que la IA use dependencias innecesarias, asegurando que el código sea autónomo y cumpla con requisitos específicos del proyecto. En este caso, mantiene la simplicidad del proyecto al no introducir nuevas dependencias para una funcionalidad básica.

### 5. Rol + Few-Shot: Documentar una API

**Prompt:** "Actúa como un redactor técnico experimentado. Documenta la API REST del proyecto taskflow-project usando el formato Markdown. Ejemplo de documentación: Para el endpoint GET /users, describe parámetros, respuesta y ejemplos de uso. Aplica esto al endpoint POST /tasks."

**Por qué funciona bien:** Combinar rol con ejemplos proporciona estructura y estilo consistente, resultando en documentación profesional y fácil de seguir. Esto mejora la calidad de la documentación del proyecto, facilitando su mantenimiento y uso por otros desarrolladores.

### 6. Paso a Paso + Restricciones: Refactorizar para Rendimiento

**Prompt:** "Razona paso a paso cómo optimizar la función de renderizado de listas de tareas en taskflow-project para manejar grandes datasets. Primero, identifica cuellos de botella. Segundo, sugiere alternativas. Tercero, implementa la solución sin usar bucles anidados. Limita la respuesta a 300 palabras."

**Por qué funciona bien:** El razonamiento paso a paso asegura análisis profundo, mientras que las restricciones mantienen la respuesta concisa y enfocada, ideal para revisiones rápidas. En el proyecto, esto permite optimizaciones específicas que mejoran el rendimiento de la interfaz de usuario.

### 7. Few-Shot para Testing

**Prompt:** "Escribe pruebas unitarias para la función de cálculo de factorial en taskflow-project usando Jest. Ejemplo: Para input 5, expect output 120. Otro ejemplo: Para input 0, expect output 1. Incluye casos de error."

**Por qué funciona bien:** Los ejemplos ilustran claramente qué probar, llevando a pruebas completas que cubren casos normales y casos límite, mejorando la calidad del código. Esto asegura que las funciones del proyecto estén bien testeadas antes de su despliegue.

### 8. Rol para Debugging

**Prompt:** "Actúa como un especialista en depuración. Analiza el código de manejo de modales en modal.js del proyecto taskflow-project que presenta errores y explica qué está mal. Sugiere una corrección manteniendo el estilo original del código."

**Por qué funciona bien:** El rol enfoca a la IA en debugging sistemático, proporcionando diagnósticos precisos y soluciones prácticas sin reinventar la rueda. Esto acelera la resolución de bugs en el proyecto, manteniendo la consistencia del código.

### 9. Restricciones para Documentación

**Prompt:** "Documenta la clase TaskManager en app.js del proyecto taskflow-project usando JSDoc. Usa solo comentarios de una línea para métodos simples y multi-línea para complejos. No incluyas ejemplos de uso en los comentarios."

**Por qué funciona bien:** Restricciones específicas en el formato aseguran consistencia en la documentación, facilitando el mantenimiento y la legibilidad. En el proyecto, esto crea una documentación uniforme que ayuda a nuevos colaboradores a entender rápidamente el código.

### 10. Combinado: Generar y Documentar Componente

**Prompt:** "Actúa como un desarrollador full-stack. Crea un componente React que muestre una lista de tareas en el proyecto taskflow-project. Razona paso a paso: 1. Define props. 2. Escribe JSX. 3. Agrega estilos básicos con Tailwind. 4. Documenta con comentarios. Usa few-shot: Similar a un componente de usuarios que mapea array a elementos li."

**Por qué funciona bien:** Combinar técnicas (rol, paso a paso, few-shot) crea un prompt integral que produce código completo, bien estructurado y documentado, maximizando la utilidad en una sola interacción. Esto permite desarrollar componentes rápidamente en el proyecto, integrando funcionalidad y estilo de manera coherente.


