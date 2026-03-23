import { Router } from "express";
import {
  actualizarTarea,
  crearTarea,
  eliminarTarea,
  obtenerTareas,
} from "../controllers/task.controller.js";

const router = Router();

router.get("/", obtenerTareas);
router.post("/", crearTarea);
router.patch("/:id", actualizarTarea);
router.delete("/:id", eliminarTarea);

export default router;
