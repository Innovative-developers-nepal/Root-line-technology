import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import { dbConnection } from "./config/db";
import { dynamicRateLimiter } from "./middlewares/rateLimiter.middleware";
import globalError, { notFound } from "./middlewares/global_error_handler";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import healthRoutes from "./routes/health.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import contactRoutes from "./routes/contact.routes";
import blogRoutes from "./routes/blog.routes";
import commentRoutes from "./routes/comment.routes";
import caseStudyRoutes from "./routes/caseStudy.routes";
import uploadRoutes from "./routes/upload.routes";
import serviceRoutes from "./routes/service.routes";
import teamRoutes from "./routes/team.routes";
import jobRoutes from "./routes/job.routes";
import applicationRoutes from "./routes/application.routes";
import { logger } from "./utils";
import { verifyMailer } from "./utils/mailer";
import helmet from "helmet";

const app = express();
const PORT = process.env.PORT || 5000;

app.set("trust proxy", true);

app.use(helmet({
    crossOriginResourcePolicy: false,
}));

const allowedOrigins = (process.env.CORS_ORIGIN ?? "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
}));

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev", {
    stream: { write: (msg) => logger.http(msg.trimEnd()) },
}));
app.use(express.json());
app.use(cookieParser());
app.use(dynamicRateLimiter);
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

app.get("/api", (_req, res) => {
    logger.info(`Server is running in ${process.env.NODE_ENV} mode`);
    res.send("Welcome to the Rootline API!");
});

app.use("/api/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/contacts", contactRoutes);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/blog", commentRoutes);
app.use("/api/v1/case-studies", caseStudyRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/team", teamRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/applications", applicationRoutes);

app.use(notFound);
app.use(globalError);

function requestLogger(req: express.Request, res: express.Response, next: express.NextFunction) {
    const start = Date.now();
    res.on("finish", () => {
        logger.http(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`);
    });
    next();
}

app.use(requestLogger);

async function startServer() {
    logger.info(`DATABASE_URL = ${process.env.DATABASE_URL}`);
    await dbConnection();
    await verifyMailer();

    app.listen(PORT, () => {
        logger.info(`Rootline API running on http://localhost:${PORT}`);
    });
}

startServer().catch((err) => {
    logger.error(`Failed to start server with DATABASE_URL=${process.env.DATABASE_URL}: ${(err as Error).message}`);
    process.exit(1);
});
