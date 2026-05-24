import { Router } from "express";
import { getAllUsers, createUser, getUserById, updateUser, deleteUser } from "../controllers/user.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { Permissions } from "../guards";
import { validate } from "../utils/validate";
import { createUserSchema, updateUserSchema } from "../schemas";
import { PERMISSIONS } from "../config/permissions";

const router = Router();

router.get("/",
    authenticateToken,
    Permissions(PERMISSIONS.USERS.resource, PERMISSIONS.USERS.actions.READ),
    getAllUsers
);

router.post("/",
    authenticateToken,
    Permissions(PERMISSIONS.USERS.resource, PERMISSIONS.USERS.actions.WRITE),
    validate({ body: createUserSchema }),
    createUser
);

router.get("/:id",
    authenticateToken,
    Permissions(PERMISSIONS.USERS.resource, PERMISSIONS.USERS.actions.READ),
    getUserById
);

router.patch("/:id",
    authenticateToken,
    Permissions(PERMISSIONS.USERS.resource, PERMISSIONS.USERS.actions.WRITE),
    validate({ body: updateUserSchema }),
    updateUser
);

router.delete("/:id",
    authenticateToken,
    Permissions(PERMISSIONS.USERS.resource, PERMISSIONS.USERS.actions.DELETE),
    deleteUser
);

export default router;
