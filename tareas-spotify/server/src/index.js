import { port } from "./config/env.js";
import app from "./app.js";

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
