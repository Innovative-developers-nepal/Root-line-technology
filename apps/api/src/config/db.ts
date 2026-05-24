import { logger } from "../utils";
import { prisma } from "./prisma";

export async function dbConnection() {

    try {

        await prisma.$connect();

        logger.info("Database connected");
    } catch (error: any) {

        logger.error('Server error', {
            message: error.message,
            stack: error.stack
        });
        throw error
    }
}