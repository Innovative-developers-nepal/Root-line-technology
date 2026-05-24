import { prisma } from "../config/prisma";
import { parsePagination } from "../utils/paginator";
import CustomError from "../utils/customError";
import { parseJsonFields, parseJsonList } from "../utils/parseJsonFields";
import { CreateTeamMemberInput, UpdateTeamMemberInput, GetTeamMembersQuery } from "../schemas/team.schema";
import { revalidatePaths } from "./revalidate.service";

const TEAM_SELECT = {
    id:          true,
    name:        true,
    role:        true,
    bio:         true,
    avatar:      true,
    socialLinks: true,
    order:       true,
    published:   true,
    createdAt:   true,
    updatedAt:   true,
};

export async function createTeamMember(data: CreateTeamMemberInput) {
    const { socialLinks, ...rest } = data;
    const created = await prisma.teamMember.create({
        data: {
            ...rest,
            ...(socialLinks !== undefined && { socialLinks: JSON.stringify(socialLinks) }),
        },
        select: TEAM_SELECT,
    });
    await revalidatePaths(["/about"]);
    return created;
}

export async function getTeamMembers(query: GetTeamMembersQuery, adminMode = false) {
    const { cursor, limit, sort, order, published } = query;
    const pagination = parsePagination({ cursor, limit, sort, order });

    const where: Record<string, unknown> = {};
    if (!adminMode) where.published = true;
    else if (published !== undefined) where.published = published === "true";

    const items = await prisma.teamMember.findMany({
        take:    pagination.limit + 1,
        cursor:  pagination.cursor ? { id: pagination.cursor } : undefined,
        where,
        orderBy: { [pagination.sort]: pagination.order },
        select:  TEAM_SELECT,
    });

    const hasNext    = items.length > pagination.limit;
    const sliced     = hasNext ? items.slice(0, pagination.limit) : items;
    const nextCursor = hasNext ? sliced[sliced.length - 1].id : undefined;
    return { members: parseJsonList(sliced, ["socialLinks"]), nextCursor };
}

export async function getTeamMemberById(id: string) {
    const item = await prisma.teamMember.findUnique({ where: { id }, select: TEAM_SELECT });
    if (!item) throw new CustomError(404, "Team member not found", "NOT_FOUND");
    return parseJsonFields(item, ["socialLinks"]);
}

export async function updateTeamMember(id: string, data: UpdateTeamMemberInput) {
    const item = await prisma.teamMember.findUnique({ where: { id } });
    if (!item) throw new CustomError(404, "Team member not found", "NOT_FOUND");

    const { socialLinks, ...rest } = data;
    const updated = await prisma.teamMember.update({
        where: { id },
        data: {
            ...rest,
            ...(socialLinks !== undefined && { socialLinks: JSON.stringify(socialLinks) }),
        },
        select: TEAM_SELECT,
    });
    await revalidatePaths(["/about"]);
    return updated;
}

export async function deleteTeamMember(id: string) {
    const item = await prisma.teamMember.findUnique({ where: { id } });
    if (!item) throw new CustomError(404, "Team member not found", "NOT_FOUND");
    await prisma.teamMember.delete({ where: { id } });
    await revalidatePaths(["/about"]);
}
