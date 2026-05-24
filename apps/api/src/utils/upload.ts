import multer, { StorageEngine } from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { Request } from "express";
import CustomError from "./customError";
import { logger } from "./logger";

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads/images");
const MAX_SIZE   = 5 * 1024 * 1024;
const ALLOWED    = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage: StorageEngine = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename:    (_req, file, cb) => {
        const ext  = path.extname(file.originalname).toLowerCase();
        const name = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`;
        cb(null, name);
    },
});

export const uploadImage = multer({
    storage,
    limits:     { fileSize: MAX_SIZE },
    fileFilter: (_req, file, cb) => {
        if (ALLOWED.has(file.mimetype)) return cb(null, true);
        cb(new CustomError(400, "Only JPEG, PNG, WebP, and GIF images are allowed", "INVALID_FILE_TYPE"));
    },
}).single("image");

export function getFileUrl(req: Request, filename: string): string {
    const base = (process.env.BASE_URL ?? `${req.protocol}://${req.get("host")}`).replace(/\/$/, "");
    return `${base}/uploads/images/${filename}`;
}

export function deleteUploadedFile(filename: string): void {
    fs.unlink(path.join(UPLOAD_DIR, filename), (err) => {
        if (err && err.code !== "ENOENT") logger.warn(`Failed to delete upload "${filename}": ${err.message}`);
    });
}
