import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { Permissions } from "../guards";
import { validate } from "../utils/validate";
import * as teamController from "../controllers/team.controller";
import { PERMISSIONS } from "../config/permissions";
import {
    createTeamMemberContract,
    updateTeamMemberContract,
    getTeamMembersContract,
    idParamContract,
} from "../schemas/team.schema";

const router = Router();

router.get("/", validate(getTeamMembersContract), teamController.getTeamMembers);

router.get(
    "/admin/all",
    authenticateToken,
    Permissions(PERMISSIONS.TEAM.resource, PERMISSIONS.TEAM.actions.READ),
    validate(getTeamMembersContract),
    teamController.adminGetTeamMembers,
);

router.get(
    "/admin/:id",
    authenticateToken,
    Permissions(PERMISSIONS.TEAM.resource, PERMISSIONS.TEAM.actions.READ),
    validate(idParamContract),
    teamController.adminGetTeamMemberById,
);

router.post(
    "/admin",
    authenticateToken,
    Permissions(PERMISSIONS.TEAM.resource, PERMISSIONS.TEAM.actions.WRITE),
    validate(createTeamMemberContract),
    teamController.adminCreateTeamMember,
);

router.put(
    "/admin/:id",
    authenticateToken,
    Permissions(PERMISSIONS.TEAM.resource, PERMISSIONS.TEAM.actions.WRITE),
    validate(updateTeamMemberContract),
    teamController.adminUpdateTeamMember,
);

router.delete(
    "/admin/:id",
    authenticateToken,
    Permissions(PERMISSIONS.TEAM.resource, PERMISSIONS.TEAM.actions.DELETE),
    validate(idParamContract),
    teamController.adminDeleteTeamMember,
);

export default router;
