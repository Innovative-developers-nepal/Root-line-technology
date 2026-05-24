import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { Permissions } from "../guards";
import { validate } from "../utils/validate";
import * as serviceController from "../controllers/service.controller";
import { PERMISSIONS } from "../config/permissions";
import {
    createServiceContract,
    updateServiceContract,
    getServicesContract,
    slugParamContract,
    idParamContract,
} from "../schemas/service.schema";

const router = Router();

router.get("/",        validate(getServicesContract), serviceController.getServices);
router.get("/:slug",   validate(slugParamContract),   serviceController.getServiceBySlug);

router.post(
    "/admin",
    authenticateToken,
    Permissions(PERMISSIONS.SERVICES.resource, PERMISSIONS.SERVICES.actions.WRITE),
    validate(createServiceContract),
    serviceController.createService,
);

router.get(
    "/admin/all",
    authenticateToken,
    Permissions(PERMISSIONS.SERVICES.resource, PERMISSIONS.SERVICES.actions.READ),
    validate(getServicesContract),
    serviceController.adminGetServices,
);

router.get(
    "/admin/:id",
    authenticateToken,
    Permissions(PERMISSIONS.SERVICES.resource, PERMISSIONS.SERVICES.actions.READ),
    validate(idParamContract),
    serviceController.adminGetServiceById,
);

router.put(
    "/admin/:id",
    authenticateToken,
    Permissions(PERMISSIONS.SERVICES.resource, PERMISSIONS.SERVICES.actions.WRITE),
    validate(updateServiceContract),
    serviceController.adminUpdateService,
);

router.patch(
    "/admin/:id/publish",
    authenticateToken,
    Permissions(PERMISSIONS.SERVICES.resource, PERMISSIONS.SERVICES.actions.PUBLISH),
    validate(idParamContract),
    serviceController.adminToggleServicePublished,
);

router.delete(
    "/admin/:id",
    authenticateToken,
    Permissions(PERMISSIONS.SERVICES.resource, PERMISSIONS.SERVICES.actions.DELETE),
    validate(idParamContract),
    serviceController.adminDeleteService,
);

export default router;
