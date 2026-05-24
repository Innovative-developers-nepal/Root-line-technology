import { prisma } from "../config/prisma";
import { parsePagination } from "../utils/paginator";
import CustomError from "../utils/customError";
import { CreateCaseStudyInput, UpdateCaseStudyInput, GetCaseStudiesQuery } from "../schemas/caseStudy.schema";

const CASE_STUDY_SELECT = {
    id:                 true,
    slug:               true,
    title:              true,
    subtitle:           true,
    excerpt:            true,
    category:           true,
    industry:           true,
    author:             true,
    authorTitle:        true,
    readTime:           true,
    coverImage:         true,
    tags:               true,
    metrics:            true,
    summaryStats:       true,
    bottomStats:        true,
    graphs:             true,
    tableOfContents:    true,
    overviewContent:    true,
    keyWinsContent:     true,
    keyInsightContent:  true,
    challengeSolutions: true,
    published:          true,
    publishedAt:        true,
    createdAt:          true,
    updatedAt:          true,
};

export async function createCaseStudy(data: CreateCaseStudyInput) {
    const existing = await prisma.caseStudy.findUnique({ where: { slug: data.slug } });
    if (existing) throw new CustomError(409, "A case study with this slug already exists", "SLUG_CONFLICT");

    const { tags, metrics, summaryStats, bottomStats, graphs, tableOfContents, overviewContent, keyWinsContent, keyInsightContent, challengeSolutions, ...rest } = data;
    return prisma.caseStudy.create({
        data: {
            ...rest,
            tags: JSON.stringify(tags),
            metrics: JSON.stringify(metrics),
            summaryStats: JSON.stringify(summaryStats),
            bottomStats: JSON.stringify(bottomStats),
            graphs: JSON.stringify(graphs),
            tableOfContents: JSON.stringify(tableOfContents),
            overviewContent: JSON.stringify(overviewContent),
            keyWinsContent: JSON.stringify(keyWinsContent),
            keyInsightContent: JSON.stringify(keyInsightContent),
            challengeSolutions: JSON.stringify(challengeSolutions),
            publishedAt: data.published ? new Date() : null,
        },
        select: CASE_STUDY_SELECT,
    });
}

export async function getCaseStudies(query: GetCaseStudiesQuery, adminMode = false) {
    const { cursor, limit, sort, order, category, industry, published } = query;
    const pagination = parsePagination({ cursor, limit, sort, order });

    const where: Record<string, unknown> = {};
    if (!adminMode) where.published = true;
    else if (published !== undefined) where.published = published === "true";
    if (category) where.category = category;
    if (industry) where.industry = industry;

    const studies = await prisma.caseStudy.findMany({
        take:    pagination.limit + 1,
        cursor:  pagination.cursor ? { id: pagination.cursor } : undefined,
        where,
        orderBy: { [pagination.sort]: pagination.order },
        select:  CASE_STUDY_SELECT,
    });

    const hasNext    = studies.length > pagination.limit;
    const items      = hasNext ? studies.slice(0, pagination.limit) : studies;
    const nextCursor = hasNext ? items[items.length - 1].id : undefined;

    return { caseStudies: items, nextCursor };
}

export async function getCaseStudyBySlug(slug: string, adminMode = false) {
    const study = await prisma.caseStudy.findUnique({ where: { slug }, select: CASE_STUDY_SELECT });
    if (!study) throw new CustomError(404, "Case study not found", "NOT_FOUND");
    if (!adminMode && !study.published) throw new CustomError(404, "Case study not found", "NOT_FOUND");
    return study;
}

export async function getCaseStudyById(id: string) {
    const study = await prisma.caseStudy.findUnique({ where: { id }, select: CASE_STUDY_SELECT });
    if (!study) throw new CustomError(404, "Case study not found", "NOT_FOUND");
    return study;
}

export async function updateCaseStudy(id: string, data: UpdateCaseStudyInput) {
    const study = await prisma.caseStudy.findUnique({ where: { id } });
    if (!study) throw new CustomError(404, "Case study not found", "NOT_FOUND");

    if (data.slug && data.slug !== study.slug) {
        const conflict = await prisma.caseStudy.findUnique({ where: { slug: data.slug } });
        if (conflict) throw new CustomError(409, "A case study with this slug already exists", "SLUG_CONFLICT");
    }

    const publishedAt =
        data.published === true && !study.published
            ? new Date()
            : data.published === false
                ? null
                : study.publishedAt;

    const { tags, metrics, summaryStats, bottomStats, graphs, tableOfContents, overviewContent, keyWinsContent, keyInsightContent, challengeSolutions, ...rest } = data;
    return prisma.caseStudy.update({
        where:  { id },
        data:   {
            ...rest,
            ...(tags !== undefined && { tags: JSON.stringify(tags) }),
            ...(metrics !== undefined && { metrics: JSON.stringify(metrics) }),
            ...(summaryStats !== undefined && { summaryStats: JSON.stringify(summaryStats) }),
            ...(bottomStats !== undefined && { bottomStats: JSON.stringify(bottomStats) }),
            ...(graphs !== undefined && { graphs: JSON.stringify(graphs) }),
            ...(tableOfContents !== undefined && { tableOfContents: JSON.stringify(tableOfContents) }),
            ...(overviewContent !== undefined && { overviewContent: JSON.stringify(overviewContent) }),
            ...(keyWinsContent !== undefined && { keyWinsContent: JSON.stringify(keyWinsContent) }),
            ...(keyInsightContent !== undefined && { keyInsightContent: JSON.stringify(keyInsightContent) }),
            ...(challengeSolutions !== undefined && { challengeSolutions: JSON.stringify(challengeSolutions) }),
            publishedAt,
        },
        select: CASE_STUDY_SELECT,
    });
}

export async function toggleCaseStudyPublished(id: string) {
    const study = await prisma.caseStudy.findUnique({ where: { id } });
    if (!study) throw new CustomError(404, "Case study not found", "NOT_FOUND");

    return prisma.caseStudy.update({
        where:  { id },
        data:   { published: !study.published, publishedAt: !study.published ? new Date() : null },
        select: CASE_STUDY_SELECT,
    });
}

export async function deleteCaseStudy(id: string) {
    const study = await prisma.caseStudy.findUnique({ where: { id } });
    if (!study) throw new CustomError(404, "Case study not found", "NOT_FOUND");
    await prisma.caseStudy.delete({ where: { id } });
}
