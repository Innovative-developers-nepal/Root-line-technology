import { prisma } from "../config/prisma";
import { parsePagination } from "../utils/paginator";
import CustomError from "../utils/customError";
import { parseJsonFields, parseJsonList } from "../utils/parseJsonFields";
import { CreateServiceInput, UpdateServiceInput, GetServicesQuery } from "../schemas/service.schema";
import { revalidatePaths } from "./revalidate.service";

const SERVICE_SELECT = {
    id:             true,
    slug:           true,
    title:          true,
    summary:        true,
    body:           true,
    iconKey:        true,
    order:          true,
    published:      true,
    publishedAt:    true,
    seoTitle:       true,
    seoDescription: true,
    ogImage:        true,
    createdAt:      true,
    updatedAt:      true,
};

export async function createService(data: CreateServiceInput) {
    const existing = await prisma.service.findUnique({ where: { slug: data.slug } });
    if (existing) throw new CustomError(409, "A service with this slug already exists", "SLUG_CONFLICT");

    const { body, ...rest } = data;
    const created = await prisma.service.create({
        data:   { ...rest, body: JSON.stringify(body), publishedAt: data.published ? new Date() : null },
        select: SERVICE_SELECT,
    });
    await revalidatePaths(["/services", `/services/${created.slug}`]);
    return created;
}

export async function getServices(query: GetServicesQuery, adminMode = false) {
    const { cursor, limit, sort, order, published } = query;
    const pagination = parsePagination({ cursor, limit, sort, order });

    const where: Record<string, unknown> = {};
    if (!adminMode) where.published = true;
    else if (published !== undefined) where.published = published === "true";

    const items = await prisma.service.findMany({
        take:    pagination.limit + 1,
        cursor:  pagination.cursor ? { id: pagination.cursor } : undefined,
        where,
        orderBy: { [pagination.sort]: pagination.order },
        select:  SERVICE_SELECT,
    });

    const hasNext    = items.length > pagination.limit;
    const sliced     = hasNext ? items.slice(0, pagination.limit) : items;
    const nextCursor = hasNext ? sliced[sliced.length - 1].id : undefined;
    return { services: parseJsonList(sliced, ["body"]), nextCursor };
}

export async function getServiceBySlug(slug: string, adminMode = false) {
    const item = await prisma.service.findUnique({ where: { slug }, select: SERVICE_SELECT });
    if (!item) throw new CustomError(404, "Service not found", "NOT_FOUND");
    if (!adminMode && !item.published) throw new CustomError(404, "Service not found", "NOT_FOUND");
    return parseJsonFields(item, ["body"]);
}

export async function getServiceById(id: string) {
    const item = await prisma.service.findUnique({ where: { id }, select: SERVICE_SELECT });
    if (!item) throw new CustomError(404, "Service not found", "NOT_FOUND");
    return parseJsonFields(item, ["body"]);
}

export async function updateService(id: string, data: UpdateServiceInput) {
    const item = await prisma.service.findUnique({ where: { id } });
    if (!item) throw new CustomError(404, "Service not found", "NOT_FOUND");

    if (data.slug && data.slug !== item.slug) {
        const conflict = await prisma.service.findUnique({ where: { slug: data.slug } });
        if (conflict) throw new CustomError(409, "A service with this slug already exists", "SLUG_CONFLICT");
    }

    const publishedAt =
        data.published === true && !item.published
            ? new Date()
            : data.published === false
                ? null
                : item.publishedAt;

    const { body, ...rest } = data;
    const updated = await prisma.service.update({
        where:  { id },
        data:   { ...rest, ...(body !== undefined && { body: JSON.stringify(body) }), publishedAt },
        select: SERVICE_SELECT,
    });
    await revalidatePaths(["/services", `/services/${updated.slug}`]);
    return parseJsonFields(updated, ["body"]);
}

export async function toggleServicePublished(id: string) {
    const item = await prisma.service.findUnique({ where: { id } });
    if (!item) throw new CustomError(404, "Service not found", "NOT_FOUND");

    const updated = await prisma.service.update({
        where:  { id },
        data:   { published: !item.published, publishedAt: !item.published ? new Date() : null },
        select: SERVICE_SELECT,
    });
    await revalidatePaths(["/services", `/services/${updated.slug}`]);
    return updated;
}

export async function deleteService(id: string) {
    const item = await prisma.service.findUnique({ where: { id } });
    if (!item) throw new CustomError(404, "Service not found", "NOT_FOUND");
    await prisma.service.delete({ where: { id } });
    await revalidatePaths(["/services", `/services/${item.slug}`]);
}
