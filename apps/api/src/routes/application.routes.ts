import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { Permissions } from "../guards";
import { validate } from "../utils/validate";
import * as appController from "../controllers/application.controller";
import { PERMISSIONS } from "../config/permissions";
import {
    createApplicationContract,
    updateApplicationStatusContract,
    getApplicationsContract,
    idParamContract,
} from "../schemas/application.schema";

const router = Router();

// Public — submit application (rate-limited globally)
router.post("/", validate(createApplicationContract), appController.createApplication);

// Admin
router.get(
    "/admin/all",
    authenticateToken,
    Permissions(PERMISSIONS.APPLICATIONS.resource, PERMISSIONS.APPLICATIONS.actions.READ),
    validate(getApplicationsContract),
    appController.adminGetApplications,
);

router.get(
    "/admin/:id",
    authenticateToken,
    Permissions(PERMISSIONS.APPLICATIONS.resource, PERMISSIONS.APPLICATIONS.actions.READ),
    validate(idParamContract),
    appController.adminGetApplicationById,
);

router.patch(
    "/admin/:id/status",
    authenticateToken,
    Permissions(PERMISSIONS.APPLICATIONS.resource, PERMISSIONS.APPLICATIONS.actions.WRITE),
    validate(updateApplicationStatusContract),
    appController.adminUpdateApplicationStatus,
);

router.delete(
    "/admin/:id",
    authenticateToken,
    Permissions(PERMISSIONS.APPLICATIONS.resource, PERMISSIONS.APPLICATIONS.actions.DELETE),
    validate(idParamContract),
    appController.adminDeleteApplication,
);

export default router;
