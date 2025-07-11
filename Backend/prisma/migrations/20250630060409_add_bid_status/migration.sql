-- CreateEnum
CREATE TYPE "BidStatus" AS ENUM ('PENDING', 'REJECTED', 'ACCEPTED');

-- AlterTable
ALTER TABLE "Bid" ADD COLUMN     "status" "BidStatus" NOT NULL DEFAULT 'PENDING';
