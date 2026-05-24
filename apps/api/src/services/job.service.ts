import { prisma } from "../config/prisma";
import { parsePagination } from "../utils/paginator";
import CustomError from "../utils/customError";
import { parseJsonFields, parseJsonList } from "../utils/parseJsonFields";
import { CreateJobInput, UpdateJobInput, GetJobsQuery } from "../schemas/job.schema";
import { revalidatePaths } from "./revalidate.service";

const JOB_SELECT = {
    id:          true,
    slug:        true,
    title:       true,
    department:  true,
    location:    true,
    type:        true,
    body:        true,
    salaryRange: true,
    isOpen:      true,
    postedAt:    true,
    createdAt:   true,
    updatedAt:   true,
};

export async function createJob(data: CreateJobInput) {
    const existing = await prisma.job.findUnique({ where: { slug: data.slug } });
    if (existing) throw new CustomError(409, "A job with this slug already exists", "SLUG_CONFLICT");

    const { body, ...rest } = data;
    const created = await prisma.job.create({ data: { ...rest, body: JSON.stringify(body) }, select: JOB_SELECT });
    await revalidatePaths(["/careers", `/careers/${created.slug}`]);
    return created;
}

export async function getJobs(query: GetJobsQuery, adminMode = false) {
    const { cursor, limit, sort, order, isOpen, type } = query;
    const pagination = parsePagination({ cursor, limit, sort, order });

    const where: Record<string, unknown> = {};
    if (!adminMode) where.isOpen = true;
    else if (isOpen !== undefined) where.isOpen = isOpen === "true";
    if (type) where.type = type;

    const items = await prisma.job.findMany({
        take:    pagination.limit + 1,
        cursor:  pagination.cursor ? { id: pagination.cursor } : undefined,
        where,
        orderBy: { [pagination.sort]: pagination.order },
        select:  JOB_SELECT,
    });

    const hasNext    = items.length > pagination.limit;
    const sliced     = hasNext ? items.slice(0, pagination.limit) : items;
    const nextCursor = hasNext ? sliced[sliced.length - 1].id : undefined;
    return { jobs: parseJsonList(sliced, ["body"]), nextCursor };
}

export async function getJobBySlug(slug: string, adminMode = false) {
    const item = await prisma.job.findUnique({ where: { slug }, select: JOB_SELECT });
    if (!item) throw new CustomError(404, "Job not found", "NOT_FOUND");
    if (!adminMode && !item.isOpen) throw new CustomError(404, "Job not found", "NOT_FOUND");
    return parseJsonFields(item, ["body"]);
}

export async function getJobById(id: string) {
    const item = await prisma.job.findUnique({ where: { id }, select: JOB_SELECT });
    if (!item) throw new CustomError(404, "Job not found", "NOT_FOUND");
    return parseJsonFields(item, ["body"]);
}

export async function updateJob(id: string, data: UpdateJobInput) {
    const item = await prisma.job.findUnique({ where: { id } });
    if (!item) throw new CustomError(404, "Job not found", "NOT_FOUND");

    if (data.slug && data.slug !== item.slug) {
        const conflict = await prisma.job.findUnique({ where: { slug: data.slug } });
        if (conflict) throw new CustomError(409, "A job with this slug already exists", "SLUG_CONFLICT");
    }

    const { body, ...rest } = data;
    const updated = await prisma.job.update({ where: { id }, data: { ...rest, ...(body !== undefined && { body: JSON.stringify(body) }) }, select: JOB_SELECT });
    await revalidatePaths(["/careers", `/careers/${updated.slug}`]);
    return parseJsonFields(updated, ["body"]);
}

export async function deleteJob(id: string) {
    const item = await prisma.job.findUnique({ where: { id } });
    if (!item) throw new CustomError(404, "Job not found", "NOT_FOUND");
    await prisma.job.delete({ where: { id } });
    await revalidatePaths(["/careers", `/careers/${item.slug}`]);
}
