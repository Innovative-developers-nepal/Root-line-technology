import { Router } from "express";
import { login, logout, refresh, getCurrentUser, register, changePassword, getRoles } from "../controllers/auth.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { Roles } from "../guards";
import { validate } from "../utils/validate";
import { registerSchema, loginSchema, changePasswordSchema } from "../schemas";

const router = Router();

router.post("/register", authenticateToken, Roles("SUPER_ADMIN"), validate({ body: registerSchema }), register);
router.post("/login", validate({ body: loginSchema }), login);
router.post("/refresh", refresh);
router.post("/logout", authenticateToken, logout);
router.get("/me", authenticateToken, getCurrentUser);
router.post("/change-password", authenticateToken, validate({ body: changePasswordSchema }), changePassword);
router.get("/roles", authenticateToken, Roles("SUPER_ADMIN", "ADMIN"), getRoles);

export default router;
