import nodemailer, { Transporter, SendMailOptions } from "nodemailer";
import { logger } from "./logger";

export * from "./templates";

let _transporter: Transporter | null = null;

function getTransporter(): Transporter {
    if (_transporter) return _transporter;

    _transporter = nodemailer.createTransport({
        host:   process.env.SMTP_HOST,
        port:   Number(process.env.SMTP_PORT ?? 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        pool: true,
    });

    return _transporter;
}

export async function verifyMailer(): Promise<void> {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        logger.warn("SMTP not configured — emails will not be sent");
        return;
    }
    try {
        await getTransporter().verify();
        logger.info("SMTP connected");
    } catch (err) {
        logger.error("SMTP connection failed", err);
    }
}

export type MailOptions = {
    to:       string | string[];
    subject:  string;
    html:     string;
    from?:    string;
    replyTo?: string;
};

export async function sendMail(options: MailOptions): Promise<void> {
    const transporter = getTransporter();

    const payload: SendMailOptions = {
        from:    options.from ?? `"${process.env.SMTP_FROM_NAME ?? "AEORanker"}" <${process.env.SMTP_FROM_EMAIL}>`,
        to:      options.to,
        subject: options.subject,
        html:    options.html,
        ...(options.replyTo && { replyTo: options.replyTo }),
    };

    try {
        await transporter.sendMail(payload);
        logger.info(`Mail sent → ${Array.isArray(options.to) ? options.to.join(", ") : options.to}`);
    } catch (err) {
        logger.error("Failed to send mail", err);
        throw err;
    }
}

