import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { seedRoles }       from "./seed/roles";
import { seedPermissions } from "./seed/permissions";
import { seedUsers }       from "./seed/users";
import { seedBlog }        from "./seed/blog";
import { seedCaseStudies } from "./seed/caseStudy";
import { seedJobs } from "./seed/jobs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma  = new PrismaClient({ adapter });

const isDemo = process.argv.includes("--demo");

async function main() {
    console.log(`Seeding database${isDemo ? " (demo mode)" : ""}...`);

    await seedRoles(prisma);
    await seedPermissions(prisma);

    if (isDemo) {
        await seedUsers(prisma);
        await seedBlog(prisma);
        await seedJobs(prisma);
        await seedCaseStudies(prisma);
    }

    console.log("\nSeeding complete.");
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
        process.exit(1);
    });
