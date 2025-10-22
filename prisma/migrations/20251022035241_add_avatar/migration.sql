-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';
