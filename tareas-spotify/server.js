import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import taskRoutes from "./server/src/routes/task.routes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname);

app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/v1/tasks", taskRoutes);

app.get(/^(?!\/api\/|\/health$).*/, (_req, res) => {
  res.sendFile(path.join(projectRoot, "public", "index.html"));
});

app.use((err, _req, res, _next) => {
  if (err.type === "entity.too.large") {
    return res.status(413).json({
      message: "La carga enviada es demasiado grande para el servidor.",
    });
  }

  if (err.message === "NOT_FOUND") {
    return res.status(404).json({
      message: "Recurso no encontrado",
    });
  }

  console.error(err);

  return res.status(500).json({
    message: "Error interno del servidor",
  });
});

export default app;
