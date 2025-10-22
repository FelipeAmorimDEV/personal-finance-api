-- AlterTable
ALTER TABLE "users" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'user';

-- AlterTable
ALTER TABLE "users" ADD COLUMN "avatar" TEXT;

