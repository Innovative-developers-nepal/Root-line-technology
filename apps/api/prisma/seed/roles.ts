import { PrismaClient } from "@prisma/client";

const ROLES: {
    name:        string;
    displayName: string;
    description: string;
    hierarchy:   number;
    isSystem:    boolean;
}[] = [
    { name: "SUPER_ADMIN",    displayName: "Super Admin",     description: "Full system access",                   hierarchy: 1, isSystem: true },
    { name: "ADMIN",          displayName: "Admin",           description: "Full org access except billing",        hierarchy: 2, isSystem: true },
    { name: "BUSINESS_OWNER", displayName: "Business Owner",  description: "Manages projects and reports",          hierarchy: 3, isSystem: true },
    { name: "MANAGER",        displayName: "Manager",         description: "Manages team members and reports",      hierarchy: 4, isSystem: true },
    { name: "ANALYST",        displayName: "Analyst",         description: "Read and create analytics reports",     hierarchy: 5, isSystem: true },
    { name: "MEMBER",         displayName: "Member",          description: "Basic read access",                    hierarchy: 6, isSystem: true },
];

export async function seedRoles(prisma: PrismaClient): Promise<void> {
    for (const role of ROLES) {
    await prisma.role.upsert({
        where:  { name: role.name },
        update: { displayName: role.displayName, description: role.description, hierarchy: role.hierarchy },
        create: { name: role.name, displayName: role.displayName, description: role.description, hierarchy: role.hierarchy, isSystem: role.isSystem },
    });
    }
    console.log(`  ✓ ${ROLES.length} roles seeded`);
}
