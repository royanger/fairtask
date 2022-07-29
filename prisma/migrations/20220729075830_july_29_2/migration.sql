-- AlterTable
ALTER TABLE "Reward" ADD COLUMN     "claimedById" TEXT;

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_claimedById_fkey" FOREIGN KEY ("claimedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
