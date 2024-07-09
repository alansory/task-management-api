-- DropIndex
DROP INDEX `users_username_key` ON `users`;

-- AlterTable
ALTER TABLE `tasks` MODIFY `status` ENUM('TO_DO', 'IN_PROGRESS', 'DONE') NOT NULL DEFAULT 'TO_DO';
ALTER TABLE `users` MODIFY `name` VARCHAR(100) NULL;
