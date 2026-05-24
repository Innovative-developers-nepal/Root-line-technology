import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../../src/utils/bcrypt";

export async function seedUsers(prisma: PrismaClient): Promise<void> {
    const passwordHash = await hashPassword("P@ssw0rd");

    const superAdminRole = await prisma.role.findUniqueOrThrow({ where: { name: "SUPER_ADMIN" } });
    const adminRole      = await prisma.role.findUniqueOrThrow({ where: { name: "ADMIN" } });

    await prisma.user.upsert({
        where:  { email: "superadmin@example.com" },
        update: { roleId: superAdminRole.id, passwordHash, firstName: "superadmin", lastName: "Admin" },
        create: { firstName: "superadmin", lastName: "Admin", email: "superadmin@example.com", passwordHash, roleId: superAdminRole.id },
    });

    await prisma.user.upsert({
        where:  { email: "admin@example.com" },
        update: { roleId: adminRole.id, passwordHash, firstName: "Admin", lastName: "User" },
        create: { firstName: "Admin", lastName: "User", email: "admin@example.com", passwordHash, roleId: adminRole.id },
    });

    await prisma.user.upsert({
        where:  { email: "bob@example.com" },
        update: {},
        create: { firstName: "Bob", lastName: "Demo", email: "bob@example.com", passwordHash: "hashed_placeholder" },
    });

    console.log("  ✓ Demo users seeded");
}
