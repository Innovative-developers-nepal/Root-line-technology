import { prisma } from "../config/prisma";
import { parsePagination } from "../utils/paginator";
import CustomError from "../utils/customError";
import {
    CreateApplicationInput,
    UpdateApplicationStatusBody,
    GetApplicationsQuery,
} from "../schemas/application.schema";

const APP_SELECT = {
    id:         true,
    jobId:      true,
    firstName:  true,
    lastName:   true,
    email:      true,
    phone:      true,
    coverNote:  true,
    resumeFile: true,
    status:     true,
    createdAt:  true,
    updatedAt:  true,
};

export async function createApplication(data: CreateApplicationInput) {
    const job = await prisma.job.findUnique({ where: { id: data.jobId } });
    if (!job) throw new CustomError(404, "Job not found", "JOB_NOT_FOUND");
    if (!job.isOpen) throw new CustomError(400, "This job is no longer accepting applications", "JOB_CLOSED");

    return prisma.jobApplication.create({ data, select: APP_SELECT });
}

export async function getApplications(query: GetApplicationsQuery) {
    const { cursor, limit, sort, order, jobId, status } = query;
    const pagination = parsePagination({ cursor, limit, sort, order });

    const where: Record<string, unknown> = {};
    if (jobId)  where.jobId = jobId;
    if (status) where.status = status;

    const items = await prisma.jobApplication.findMany({
        take:    pagination.limit + 1,
        cursor:  pagination.cursor ? { id: pagination.cursor } : undefined,
        where,
        orderBy: { [pagination.sort]: pagination.order },
        select:  { ...APP_SELECT, job: { select: { id: true, title: true, slug: true } } },
    });

    const hasNext    = items.length > pagination.limit;
    const sliced     = hasNext ? items.slice(0, pagination.limit) : items;
    const nextCursor = hasNext ? sliced[sliced.length - 1].id : undefined;
    return { applications: sliced, nextCursor };
}

export async function getApplicationById(id: string) {
    const item = await prisma.jobApplication.findUnique({
        where:  { id },
        select: { ...APP_SELECT, job: { select: { id: true, title: true, slug: true } } },
    });
    if (!item) throw new CustomError(404, "Application not found", "NOT_FOUND");
    return item;
}

export async function updateApplicationStatus(id: string, body: UpdateApplicationStatusBody) {
    const item = await prisma.jobApplication.findUnique({ where: { id } });
    if (!item) throw new CustomError(404, "Application not found", "NOT_FOUND");
    return prisma.jobApplication.update({ where: { id }, data: { status: body.status }, select: APP_SELECT });
}

export async function deleteApplication(id: string) {
    const item = await prisma.jobApplication.findUnique({ where: { id } });
    if (!item) throw new CustomError(404, "Application not found", "NOT_FOUND");
    await prisma.jobApplication.delete({ where: { id } });
}
