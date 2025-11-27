/*
  Warnings:

  - You are about to drop the column `paymentId` on the `Sale` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Sale" DROP CONSTRAINT "Sale_paymentId_fkey";

-- DropIndex
DROP INDEX "public"."Sale_paymentId_idx";

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "saleId" TEXT;

-- AlterTable
ALTER TABLE "Sale" DROP COLUMN "paymentId";

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;
