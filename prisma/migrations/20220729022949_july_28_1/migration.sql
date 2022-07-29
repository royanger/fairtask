/*
  Warnings:

  - Added the required column `teamId` to the `Reward` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reward" ADD COLUMN     "teamId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
