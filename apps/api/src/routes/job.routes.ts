import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { Permissions } from "../guards";
import { validate } from "../utils/validate";
import * as jobController from "../controllers/job.controller";
import { PERMISSIONS } from "../config/permissions";
import {
    createJobContract,
    updateJobContract,
    getJobsContract,
    slugParamContract,
    idParamContract,
} from "../schemas/job.schema";

const router = Router();

router.get("/",      validate(getJobsContract),    jobController.getJobs);
router.get("/:slug", validate(slugParamContract),  jobController.getJobBySlug);

router.get(
    "/admin/all",
    authenticateToken,
    Permissions(PERMISSIONS.JOBS.resource, PERMISSIONS.JOBS.actions.READ),
    validate(getJobsContract),
    jobController.adminGetJobs,
);

router.get(
    "/admin/:id",
    authenticateToken,
    Permissions(PERMISSIONS.JOBS.resource, PERMISSIONS.JOBS.actions.READ),
    validate(idParamContract),
    jobController.adminGetJobById,
);

router.post(
    "/admin",
    authenticateToken,
    Permissions(PERMISSIONS.JOBS.resource, PERMISSIONS.JOBS.actions.WRITE),
    validate(createJobContract),
    jobController.adminCreateJob,
);

router.put(
    "/admin/:id",
    authenticateToken,
    Permissions(PERMISSIONS.JOBS.resource, PERMISSIONS.JOBS.actions.WRITE),
    validate(updateJobContract),
    jobController.adminUpdateJob,
);

router.delete(
    "/admin/:id",
    authenticateToken,
    Permissions(PERMISSIONS.JOBS.resource, PERMISSIONS.JOBS.actions.DELETE),
    validate(idParamContract),
    jobController.adminDeleteJob,
);

export default router;
