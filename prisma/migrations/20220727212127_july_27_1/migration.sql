-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "assignedId" TEXT;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assignedId_fkey" FOREIGN KEY ("assignedId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
