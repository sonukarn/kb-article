/*
  Warnings:

  - You are about to drop the column `imagePublicId` on the `kbpost` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `kbpost` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `kbpost` DROP COLUMN `imagePublicId`,
    DROP COLUMN `imageUrl`,
    ADD COLUMN `canEdit` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `rejectReason` VARCHAR(191) NULL;
