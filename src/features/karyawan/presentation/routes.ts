import { Router } from "express";
import { KaryawanController } from "./controllers/KaryawanController";
import { KaryawanValidator } from "./middlewares/KaryawanValidator";

const router = Router();

router.get("/", KaryawanController.getAll);
router.get("/:id", KaryawanController.getById);
router.post("/", KaryawanValidator.validateCreate, KaryawanController.create);
router.put("/:id", KaryawanValidator.validateUpdate, KaryawanController.update);
router.delete("/:id", KaryawanController.delete);

export { router as karyawanRouter };