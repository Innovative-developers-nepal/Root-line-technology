import { Router } from "express";
import { livenessCheck, readinessCheck } from "../controllers/health.controller";

const router = Router();

router.get("/", livenessCheck);
router.get("/ready", readinessCheck);

export default router;
