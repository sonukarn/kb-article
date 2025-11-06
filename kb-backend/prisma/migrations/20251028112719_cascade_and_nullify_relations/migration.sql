-- DropForeignKey
ALTER TABLE `kbpost` DROP FOREIGN KEY `KBPost_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `updaterequest` DROP FOREIGN KEY `UpdateRequest_postId_fkey`;

-- DropForeignKey
ALTER TABLE `updaterequest` DROP FOREIGN KEY `UpdateRequest_userId_fkey`;

-- DropIndex
DROP INDEX `KBPost_authorId_fkey` ON `kbpost`;

-- AlterTable
ALTER TABLE `kbpost` MODIFY `authorId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `KBPost` ADD CONSTRAINT `KBPost_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UpdateRequest` ADD CONSTRAINT `UpdateRequest_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `KBPost`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UpdateRequest` ADD CONSTRAINT `UpdateRequest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
