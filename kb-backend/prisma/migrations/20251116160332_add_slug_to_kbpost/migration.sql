/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `KBPost` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `kbpost` ADD COLUMN `slug` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `KBPost_slug_key` ON `KBPost`(`slug`);
