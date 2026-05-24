const STATUS_CODES: Record<number, string> = {
    400: "BAD_REQUEST",
    401: "UNAUTHORIZED",
    403: "FORBIDDEN",
    404: "NOT_FOUND",
    409: "CONFLICT",
    429: "RATE_LIMIT_EXCEEDED",
};

export const statusToCode = (status: number): string =>
    STATUS_CODES[status] ?? "INTERNAL_ERROR";

class CustomError extends Error {
    statusCode: number;
    success: boolean;
    code: string;
    details: any[];

    constructor(statusCode: number, message: string, code?: string, details?: any[]) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.code = code ?? statusToCode(statusCode);
        this.details = details ?? [];
        Error.captureStackTrace(this, CustomError);
    }
}

export default CustomError;
