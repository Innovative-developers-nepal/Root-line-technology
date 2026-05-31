/*
  Warnings:

  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `organizationId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Organization_ownerId_idx";

-- DropIndex
DROP INDEX "Organization_slug_idx";

-- DropIndex
DROP INDEX "Organization_stripeCustomerId_key";

-- DropIndex
DROP INDEX "Organization_slug_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Organization";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "blog_comments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "blogPostId" TEXT NOT NULL,
    "parentId" TEXT,
    "authorName" TEXT NOT NULL,
    "authorEmail" TEXT NOT NULL,
    "userId" TEXT,
    "content" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "blog_comments_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "blog_posts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "blog_comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "blog_comments" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "avatar" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "lastLoginAt" DATETIME,
    "roleId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("avatar", "createdAt", "deletedAt", "email", "emailVerified", "firstName", "id", "lastLoginAt", "lastName", "passwordHash", "roleId", "status", "twoFactorEnabled", "twoFactorSecret", "updatedAt") SELECT "avatar", "createdAt", "deletedAt", "email", "emailVerified", "firstName", "id", "lastLoginAt", "lastName", "passwordHash", "roleId", "status", "twoFactorEnabled", "twoFactorSecret", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");
CREATE TABLE "new_blog_posts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "category" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "readTime" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" DATETIME,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_blog_posts" ("author", "category", "content", "coverImage", "createdAt", "excerpt", "id", "published", "publishedAt", "readTime", "slug", "tags", "title", "updatedAt") SELECT "author", "category", "content", "coverImage", "createdAt", "excerpt", "id", "published", "publishedAt", "readTime", "slug", "tags", "title", "updatedAt" FROM "blog_posts";
DROP TABLE "blog_posts";
ALTER TABLE "new_blog_posts" RENAME TO "blog_posts";
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "blog_posts"("slug");
CREATE INDEX "blog_posts_slug_idx" ON "blog_posts"("slug");
CREATE INDEX "blog_posts_published_idx" ON "blog_posts"("published");
CREATE INDEX "blog_posts_category_idx" ON "blog_posts"("category");
CREATE INDEX "blog_posts_createdAt_idx" ON "blog_posts"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "blog_comments_blogPostId_idx" ON "blog_comments"("blogPostId");

-- CreateIndex
CREATE INDEX "blog_comments_parentId_idx" ON "blog_comments"("parentId");

-- CreateIndex
CREATE INDEX "blog_comments_isApproved_idx" ON "blog_comments"("isApproved");
