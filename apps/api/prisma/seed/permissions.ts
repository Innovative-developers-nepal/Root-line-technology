import { PrismaClient } from "@prisma/client";
import { PERMISSIONS } from "../../src/config/permissions";

const { USERS, REPORTS, ANALYTICS, CONTACTS, BLOG, CASE_STUDIES, SERVICES, TEAM, JOBS, APPLICATIONS } = PERMISSIONS;

const PERMISSION_LIST: { resource: string; action: string; description: string }[] = [
    { resource: USERS.resource,        action: USERS.actions.READ,           description: "View users" },
    { resource: USERS.resource,        action: USERS.actions.WRITE,          description: "Create and update users" },
    { resource: USERS.resource,        action: USERS.actions.DELETE,         description: "Delete users" },
    { resource: REPORTS.resource,      action: REPORTS.actions.READ,         description: "View reports" },
    { resource: REPORTS.resource,      action: REPORTS.actions.CREATE,       description: "Create reports" },
    { resource: REPORTS.resource,      action: REPORTS.actions.EXPORT,       description: "Export reports" },
    { resource: ANALYTICS.resource,    action: ANALYTICS.actions.READ,       description: "View analytics" },
    { resource: ANALYTICS.resource,    action: ANALYTICS.actions.ADVANCED,   description: "Advanced analytics" },
    { resource: CONTACTS.resource,     action: CONTACTS.actions.READ,        description: "Read contact submissions" },
    { resource: CONTACTS.resource,     action: CONTACTS.actions.WRITE,       description: "Update contact status" },
    { resource: BLOG.resource,         action: BLOG.actions.READ,            description: "View blog posts" },
    { resource: BLOG.resource,         action: BLOG.actions.WRITE,           description: "Create and update blog posts" },
    { resource: BLOG.resource,         action: BLOG.actions.DELETE,          description: "Delete blog posts" },
    { resource: CASE_STUDIES.resource, action: CASE_STUDIES.actions.READ,    description: "View case studies" },
    { resource: CASE_STUDIES.resource, action: CASE_STUDIES.actions.WRITE,   description: "Create and update case studies" },
    { resource: CASE_STUDIES.resource, action: CASE_STUDIES.actions.DELETE,  description: "Delete case studies" },
    { resource: SERVICES.resource,     action: SERVICES.actions.READ,        description: "View services" },
    { resource: SERVICES.resource,     action: SERVICES.actions.WRITE,       description: "Create and update services" },
    { resource: SERVICES.resource,     action: SERVICES.actions.DELETE,      description: "Delete services" },
    { resource: SERVICES.resource,     action: SERVICES.actions.PUBLISH,     description: "Publish services" },
    { resource: TEAM.resource,         action: TEAM.actions.READ,            description: "View team members" },
    { resource: TEAM.resource,         action: TEAM.actions.WRITE,           description: "Create and update team members" },
    { resource: TEAM.resource,         action: TEAM.actions.DELETE,          description: "Delete team members" },
    { resource: JOBS.resource,         action: JOBS.actions.READ,            description: "View job postings" },
    { resource: JOBS.resource,         action: JOBS.actions.WRITE,           description: "Create and update job postings" },
    { resource: JOBS.resource,         action: JOBS.actions.DELETE,          description: "Delete job postings" },
    { resource: JOBS.resource,         action: JOBS.actions.PUBLISH,         description: "Open/close job postings" },
    { resource: APPLICATIONS.resource, action: APPLICATIONS.actions.READ,    description: "View applications" },
    { resource: APPLICATIONS.resource, action: APPLICATIONS.actions.WRITE,   description: "Update application status" },
    { resource: APPLICATIONS.resource, action: APPLICATIONS.actions.DELETE,  description: "Delete applications" },
];

type ActionPair = { resource: string; action: string };

const p = (group: { resource: string; actions: Record<string, string> }, action: string): ActionPair =>
    ({ resource: group.resource, action });

const ROLE_PERMISSIONS: Record<string, ActionPair[]> = {
    "SUPER_ADMIN": PERMISSION_LIST.map(({ resource, action }) => ({ resource, action })),

    "ADMIN": PERMISSION_LIST.map(({ resource, action }) => ({ resource, action })),

    "BUSINESS_OWNER": [
        p(REPORTS, REPORTS.actions.READ),
        p(REPORTS, REPORTS.actions.CREATE),
        p(REPORTS, REPORTS.actions.EXPORT),
        p(ANALYTICS, ANALYTICS.actions.READ),
        p(ANALYTICS, ANALYTICS.actions.ADVANCED),
    ],

    "MANAGER": [
        p(REPORTS, REPORTS.actions.READ),
        p(REPORTS, REPORTS.actions.CREATE),
        p(ANALYTICS, ANALYTICS.actions.READ),
        p(ANALYTICS, ANALYTICS.actions.ADVANCED),
    ],

    "ANALYST": [
        p(REPORTS, REPORTS.actions.READ),
        p(ANALYTICS, ANALYTICS.actions.READ),
        p(ANALYTICS, ANALYTICS.actions.ADVANCED),
    ],

    "MEMBER": [
        p(REPORTS, REPORTS.actions.READ),
        p(ANALYTICS, ANALYTICS.actions.READ),
    ],
};

export async function seedPermissions(prisma: PrismaClient): Promise<void> {
    for (const perm of PERMISSION_LIST) {
        await prisma.permission.upsert({
            where:  { resource_action: { resource: perm.resource, action: perm.action } },
            update: { description: perm.description },
            create: perm,
        });
    }
    console.log(`  ✓ ${PERMISSION_LIST.length} permissions seeded`);

    let mappingCount = 0;
    for (const [roleName, pairs] of Object.entries(ROLE_PERMISSIONS)) {
        const role = await prisma.role.findUniqueOrThrow({ where: { name: roleName } });
        for (const { resource, action } of pairs) {
            const permission = await prisma.permission.findUniqueOrThrow({
                where: { resource_action: { resource, action } },
            });
            await prisma.rolePermission.upsert({
                where:  { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
                update: {},
                create: { roleId: role.id, permissionId: permission.id },
            });
            mappingCount++;
        }
    }
    console.log(`  ✓ ${mappingCount} role-permission mappings seeded`);
}
