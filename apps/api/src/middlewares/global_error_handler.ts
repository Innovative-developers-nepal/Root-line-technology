import { NextFunction, Request, Response } from "express";
import CustomError, { statusToCode } from "../utils/customError";
import { logger } from "../utils";

const globalError = (err: any, req: Request, res: Response, _next: NextFunction) => {
    const statusCode: number = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        error: {
            code: err.code ?? statusToCode(statusCode),
            message: err.message || "Internal server error",
            details: err.details ?? [],
        },
    });
};

export default globalError;

export function notFound(req: Request, res: Response) {
    const endpoint = req.originalUrl;

    logger.warn(`Route not found: ${endpoint}`, {
        method: req.method,
        ip: req.ip,
    });

    throw new CustomError(
        404,
        "Route not found",
        "404",
        [`Endpoint '${endpoint}' does not exist. Please check the URL and try again.`]
    );
}