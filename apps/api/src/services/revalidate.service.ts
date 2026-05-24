import axios from "axios";
import { logger } from "../utils/logger";

const FRONTEND_URL      = process.env.FRONTEND_URL ?? "http://localhost:3000";
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET ?? "";

/**
 * Notify the Next.js frontend to revalidate one or more ISR paths.
 * Fire-and-forget: failures are logged but never throw.
 */
export async function revalidatePaths(paths: string[]): Promise<void> {
    if (!REVALIDATE_SECRET) {
        logger.warn("REVALIDATE_SECRET not set; skipping revalidation ping");
        return;
    }

    try {
        await axios.post(
            `${FRONTEND_URL}/api/revalidate`,
            { paths },
            {
                headers: { "x-revalidate-secret": REVALIDATE_SECRET },
                timeout: 5000,
            },
        );
    } catch (err) {
        logger.warn(`Revalidate ping failed for paths [${paths.join(", ")}]: ${(err as Error).message}`);
    }
}
