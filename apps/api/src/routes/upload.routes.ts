import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { Permissions } from "../guards";
import { PERMISSIONS } from "../config/permissions";
import { uploadImage } from "../utils/upload";
import { uploadImageController, deleteImageController } from "../controllers/upload.controller";

const router = Router();

router.post("/",
    authenticateToken,
    Permissions(PERMISSIONS.BLOG.resource, PERMISSIONS.BLOG.actions.WRITE),
    uploadImage,
    uploadImageController,
);

router.delete("/:filename",
    authenticateToken,
    Permissions(PERMISSIONS.BLOG.resource, PERMISSIONS.BLOG.actions.WRITE),
    deleteImageController,
);

export default router;
