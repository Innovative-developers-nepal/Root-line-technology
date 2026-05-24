import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { Permissions } from "../guards";
import { validate } from "../utils/validate";
import * as caseStudyController from "../controllers/caseStudy.controller";
import { PERMISSIONS } from "../config/permissions";
import {
    createCaseStudyContract,
    updateCaseStudyContract,
    getCaseStudiesContract,
} from "../schemas/caseStudy.schema";
import { slugParamContract, idParamContract } from "../schemas/blog.schema";

const router = Router();

// Public routes
router.get(
    "/",
    validate(getCaseStudiesContract),
    caseStudyController.getCaseStudies
);

router.get(
    "/:slug",
    validate(slugParamContract),
    caseStudyController.getCaseStudyBySlug
);

// Admin routes
router.post(
    "/admin",
    authenticateToken,
    Permissions(PERMISSIONS.CASE_STUDIES.resource, PERMISSIONS.CASE_STUDIES.actions.WRITE),
    validate(createCaseStudyContract),
    caseStudyController.createCaseStudy
);

router.get(
    "/admin/all",
    authenticateToken,
    Permissions(PERMISSIONS.CASE_STUDIES.resource, PERMISSIONS.CASE_STUDIES.actions.READ),
    validate(getCaseStudiesContract),
    caseStudyController.adminGetCaseStudies
);

router.get(
    "/admin/:id",
    authenticateToken,
    Permissions(PERMISSIONS.CASE_STUDIES.resource, PERMISSIONS.CASE_STUDIES.actions.READ),
    validate(idParamContract),
    caseStudyController.adminGetCaseStudyById
);

router.put(
    "/admin/:id",
    authenticateToken,
    Permissions(PERMISSIONS.CASE_STUDIES.resource, PERMISSIONS.CASE_STUDIES.actions.WRITE),
    validate(updateCaseStudyContract),
    caseStudyController.adminUpdateCaseStudy
);

router.patch(
    "/admin/:id/publish",
    authenticateToken,
    Permissions(PERMISSIONS.CASE_STUDIES.resource, PERMISSIONS.CASE_STUDIES.actions.WRITE),
    validate(idParamContract),
    caseStudyController.adminToggleCaseStudyPublished
);

router.delete(
    "/admin/:id",
    authenticateToken,
    Permissions(PERMISSIONS.CASE_STUDIES.resource, PERMISSIONS.CASE_STUDIES.actions.DELETE),
    validate(idParamContract),
    caseStudyController.adminDeleteCaseStudy
);

export default router;
