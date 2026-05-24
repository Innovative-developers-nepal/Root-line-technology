import { status } from "http-status";
import asyncHandler from "../utils/asyncHandler";
import sendSuccess from "../utils/responseHandler";
import CustomError from "../utils/customError";
import { getFileUrl, deleteUploadedFile } from "../utils/upload";

export const uploadImageController = asyncHandler(async (req, res) => {
    if (!req.file) throw new CustomError(400, "No image file provided", "NO_FILE");
    sendSuccess(res, status.CREATED, { url: getFileUrl(req, req.file.filename) });
});

export const deleteImageController = asyncHandler(async (req, res) => {
    const { filename } = req.params as { filename: string };
    if (!filename || filename.includes("/") || filename.includes(".."))
        throw new CustomError(400, "Invalid filename", "INVALID_FILENAME");
    deleteUploadedFile(filename);
    sendSuccess(res, status.OK, { deleted: filename });
});
