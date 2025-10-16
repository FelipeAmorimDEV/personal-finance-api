-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "color" TEXT NOT NULL DEFAULT '#fff',
ADD COLUMN     "icon" TEXT NOT NULL DEFAULT '0';

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "color" TEXT NOT NULL DEFAULT '#fff',
ADD COLUMN     "icon" TEXT NOT NULL DEFAULT '0';
