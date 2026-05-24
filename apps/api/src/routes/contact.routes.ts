import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { Roles, Permissions } from "../guards";
import { validate } from "../utils/validate";
import * as contactController from "../controllers/contact.controller";
import { PERMISSIONS } from "../config/permissions";
import { submitContactContract, getContactsContract, updateContactStatusContract } from "../schemas/contact.schema";

const router = Router();

router.post(
    "/",
    validate(submitContactContract),
    contactController.submitContact
);

router.get(
    "/",
    authenticateToken,
    Permissions(PERMISSIONS.CONTACTS.resource, PERMISSIONS.CONTACTS.actions.READ),
    contactController.getContacts
);

router.patch(
    "/:id/status",
    authenticateToken,
    Permissions(PERMISSIONS.CONTACTS.resource, PERMISSIONS.CONTACTS.actions.WRITE),
    validate(updateContactStatusContract),
    contactController.updateContactStatus
);

export default router;
