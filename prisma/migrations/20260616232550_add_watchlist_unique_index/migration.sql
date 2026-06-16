/*
  Warnings:

  - A unique constraint covering the columns `[userId,movieId]` on the table `watchlist` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `verification_identifier_idx` ON `verification`;

-- CreateIndex
CREATE UNIQUE INDEX `watchlist_userId_movieId_key` ON `watchlist`(`userId`, `movieId`);
