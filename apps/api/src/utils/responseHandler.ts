import { Response } from "express";
import { PaginationMeta } from "./paginator";

export interface ResponseMeta {
    pagination?: PaginationMeta;
    [key: string]: unknown;
}

const sendSuccess = (res: Response, statusCode: number, data: any, meta?: ResponseMeta) => {
    const body: Record<string, any> = { success: true, data };
    if (meta) body.meta = meta;
    res.status(statusCode).json(body);
};

export default sendSuccess;
