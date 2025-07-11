-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "developerId" INTEGER;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
