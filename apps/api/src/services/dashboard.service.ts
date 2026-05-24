import { prisma } from '../config/prisma';

export async function getDashboardStats() {
    const [
        totalUsers,
        activeUsers,
        totalContacts,
        pendingContacts,
        totalBlogPosts,
        publishedBlogPosts,
        totalCaseStudies,
        recentContacts,
    ] = await Promise.all([
        prisma.user.count({ where: { status: { not: "DELETED" } } }),
        prisma.user.count({ where: { status: "ACTIVE" } }),
        prisma.contact.count(),
        prisma.contact.count({ where: { status: "PENDING" } }),
        prisma.blogPost.count(),
        prisma.blogPost.count({ where: { published: true } }),
        prisma.caseStudy.count(),
        prisma.contact.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                subject: true,
                status: true,
                createdAt: true,
            },
        }),
    ]);

    return {
        users: { total: totalUsers, active: activeUsers },
        contacts: { total: totalContacts, pending: pendingContacts },
        blog: { total: totalBlogPosts, published: publishedBlogPosts },
        caseStudies: { total: totalCaseStudies },
        recentContacts,
    };
}
