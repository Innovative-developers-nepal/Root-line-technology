import { prisma } from "../config/prisma";
import { parsePagination } from "../utils/paginator";
import CustomError from "../utils/customError";
import { parseJsonFields, parseJsonList } from "../utils/parseJsonFields";
import { CreateBlogPostInput, UpdateBlogPostInput, GetBlogPostsQuery } from "../schemas/blog.schema";

const BLOG_SELECT = {
    id:          true,
    slug:        true,
    title:       true,
    excerpt:     true,
    content:     true,
    coverImage:  true,
    category:    true,
    tags:        true,
    author:      true,
    readTime:    true,
    published:   true,
    publishedAt: true,
    createdAt:   true,
    updatedAt:   true,
};

export async function createBlogPost(data: CreateBlogPostInput) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: data.slug } });
    if (existing) throw new CustomError(409, "A blog post with this slug already exists", "SLUG_CONFLICT");

    const { content, tags, ...rest } = data;
    const created = await prisma.blogPost.create({
        data: {
            ...rest,
            content: JSON.stringify(content),
            tags: JSON.stringify(tags),
            publishedAt: data.published ? new Date() : null,
        },
        select: BLOG_SELECT,
    });
    return parseJsonFields(created, ["content", "tags"]);
}

export async function getBlogPosts(query: GetBlogPostsQuery, adminMode = false) {
    const { cursor, limit, sort, order, category, published } = query;
    const pagination = parsePagination({ cursor, limit, sort, order });

    const where: Record<string, unknown> = {};
    if (!adminMode) where.published = true;
    else if (published !== undefined) where.published = published === "true";
    if (category) where.category = category;

    const posts = await prisma.blogPost.findMany({
        take:    pagination.limit + 1,
        cursor:  pagination.cursor ? { id: pagination.cursor } : undefined,
        where,
        orderBy: { [pagination.sort]: pagination.order },
        select:  BLOG_SELECT,
    });

    const hasNext    = posts.length > pagination.limit;
    const items      = hasNext ? posts.slice(0, pagination.limit) : posts;
    const nextCursor = hasNext ? items[items.length - 1].id : undefined;

    return { posts: parseJsonList(items, ["content", "tags"]), nextCursor };
}

export async function getBlogPostBySlug(slug: string, adminMode = false) {
    const post = await prisma.blogPost.findUnique({ where: { slug }, select: BLOG_SELECT });
    if (!post) throw new CustomError(404, "Blog post not found", "NOT_FOUND");
    if (!adminMode && !post.published) throw new CustomError(404, "Blog post not found", "NOT_FOUND");
    return parseJsonFields(post, ["content", "tags"]);
}

export async function getBlogPostById(id: string) {
    const post = await prisma.blogPost.findUnique({ where: { id }, select: BLOG_SELECT });
    if (!post) throw new CustomError(404, "Blog post not found", "NOT_FOUND");
    return parseJsonFields(post, ["content", "tags"]);
}

export async function updateBlogPost(id: string, data: UpdateBlogPostInput) {
    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) throw new CustomError(404, "Blog post not found", "NOT_FOUND");

    if (data.slug && data.slug !== post.slug) {
        const conflict = await prisma.blogPost.findUnique({ where: { slug: data.slug } });
        if (conflict) throw new CustomError(409, "A blog post with this slug already exists", "SLUG_CONFLICT");
    }

    const publishedAt =
        data.published === true && !post.published
            ? new Date()
            : data.published === false
                ? null
                : post.publishedAt;

    const { content, tags, ...rest } = data;
    const updated = await prisma.blogPost.update({
        where:  { id },
        data:   {
            ...rest,
            ...(content !== undefined && { content: JSON.stringify(content) }),
            ...(tags !== undefined && { tags: JSON.stringify(tags) }),
            publishedAt,
        },
        select: BLOG_SELECT,
    });
    return parseJsonFields(updated, ["content", "tags"]);
}

export async function toggleBlogPublished(id: string) {
    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) throw new CustomError(404, "Blog post not found", "NOT_FOUND");

    const toggled = await prisma.blogPost.update({
        where:  { id },
        data:   { published: !post.published, publishedAt: !post.published ? new Date() : null },
        select: BLOG_SELECT,
    });
    return parseJsonFields(toggled, ["content", "tags"]);
}

export async function deleteBlogPost(id: string) {
    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) throw new CustomError(404, "Blog post not found", "NOT_FOUND");
    await prisma.blogPost.delete({ where: { id } });
}
