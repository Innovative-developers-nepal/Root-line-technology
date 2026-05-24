import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import CustomError from "./customError";

export interface RouteSchema {
    body?:   ZodSchema;
    params?: ZodSchema;
    query?:  ZodSchema;
}

export const validate =
    (contract: RouteSchema) =>
    (req: Request, _res: Response, next: NextFunction): void => {
        const allErrors: { field: string; message: string }[] = [];

        const parseSource = (schema: ZodSchema, data: unknown, prefix: string) => {
            const result = schema.safeParse(data);
            if (!result.success) {
                for (const issue of result.error.issues) {
                    const rawField = issue.path.join(".");
                    allErrors.push({
                        field:   prefix ? `${prefix}${rawField ? "." + rawField : ""}` : rawField,
                        message: issue.message,
                    });
                }
                return null;
            }
            return result.data;
        };

        if (contract.body) {
            const parsed = parseSource(contract.body, req.body, "");
            if (parsed !== null) req.body = parsed;
        }
        if (contract.params) {
            const parsed = parseSource(contract.params, req.params, "params");
            if (parsed !== null) req.params = parsed as typeof req.params;
        }
        if (contract.query) {
            const parsed = parseSource(contract.query, req.query, "query");
            if (parsed !== null) Object.assign(req.query, parsed);
        }

        if (allErrors.length > 0) {
            return next(new CustomError(400, "Validation failed", "VALIDATION_ERROR", allErrors));
        }
        next();
    };
