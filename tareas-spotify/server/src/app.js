import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import taskRoutes from "./routes/task.routes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");
const publicRoot = path.join(projectRoot, "public");

app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/v1/tasks", taskRoutes);
app.use("/v1/tasks", taskRoutes);

app.get(/.*\..*/, (req, res, next) => {
  const relativePath = req.path.replace(/^\/+/, "");
  const filePath = path.resolve(publicRoot, relativePath);

  if (!filePath.startsWith(publicRoot)) {
    return next();
  }

  return res.sendFile(filePath, (error) => {
    if (error) {
      return next(error.code === "ENOENT" ? undefined : error);
    }
  });
});

app.get(/^(?!\/api\/|\/health$|.*\..*).*/, (_req, res, next) => {
  return res.sendFile(path.join(publicRoot, "index.html"), (error) => {
    if (error) {
      return next(error.code === "ENOENT" ? undefined : error);
    }
  });
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
