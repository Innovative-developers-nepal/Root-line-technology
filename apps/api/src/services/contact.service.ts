import { prisma } from "../config/prisma";
import { SubmitContactInput, GetContactsQuery } from "../schemas/contact.schema";
import { parsePagination } from "../utils/paginator";
import { sendMail, contactConfirmationTemplate, contactNotificationTemplate } from "../utils/mailer";
import { logger } from "../utils/logger";
import CustomError from "../utils/customError";

const CONTACT_SELECT = {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    subject: true,
    message: true,
    status: true,
    createdAt: true,
    updatedAt: true,
};

export async function submitContact(data: SubmitContactInput) {
    const contact = await prisma.contact.create({
        data,
        select: CONTACT_SELECT,
    });

    const subjectLabel = data.subject.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

    // confirmation to submitter
    sendMail({
        to:      data.email,
        subject: `We received your message — ${subjectLabel}`,
        html:    contactConfirmationTemplate(data.firstName, subjectLabel, data.message),
    }).catch((err) => logger.error("Contact confirmation mail failed", err));

    // internal notification
    const notifyTo = process.env.CONTACT_NOTIFY_EMAIL;
    if (notifyTo) {
        sendMail({
            to:      notifyTo,
            subject: `[Contact] ${subjectLabel} from ${data.firstName} ${data.lastName}`,
            html:    contactNotificationTemplate({ ...data, subject: subjectLabel }),
            replyTo: data.email,
        }).catch((err) => logger.error("Contact notification mail failed", err));
    }

    return contact;
}

export async function getContacts(query: GetContactsQuery) {
    const { cursor, limit, sort, order, status } = query;
    const pagination = parsePagination({ cursor, limit, sort, order });

    const contacts = await prisma.contact.findMany({
        take: pagination.limit + 1,
        cursor: pagination.cursor ? { id: pagination.cursor } : undefined,
        where: status ? { status } : undefined,
        orderBy: { [pagination.sort]: pagination.order },
        select: CONTACT_SELECT,
    });

    const hasNext = contacts.length > pagination.limit;
    const items = hasNext ? contacts.slice(0, pagination.limit) : contacts;
    const nextCursor = hasNext ? items[items.length - 1].id : undefined;

    return {
        contacts: items,
        nextCursor,
    };
}

export async function updateContactStatus(id: string, status: string) {
    const contact = await prisma.contact.findUnique({ where: { id } });
    if (!contact) {
        throw new CustomError(404, "Contact not found");
    }
    return prisma.contact.update({
        where: { id },
        data: { status },
        select: CONTACT_SELECT,
    });
}
