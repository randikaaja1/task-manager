/*
  Warnings:

  - Made the column `userId` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Task` DROP FOREIGN KEY `Task_userId_fkey`;

-- AlterTable
ALTER TABLE `Task` MODIFY `userId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
