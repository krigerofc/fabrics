/*
  Warnings:

  - You are about to drop the column `saleId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the `SaleItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `pricePerUnit` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Sale` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Payment" DROP CONSTRAINT "Payment_saleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SaleItem" DROP CONSTRAINT "SaleItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SaleItem" DROP CONSTRAINT "SaleItem_saleId_fkey";

-- DropIndex
DROP INDEX "public"."Batch_batchNumber_key";

-- DropIndex
DROP INDEX "public"."Payment_saleId_idx";

-- DropIndex
DROP INDEX "public"."Payment_saleId_key";

-- DropIndex
DROP INDEX "public"."Sale_saleNumber_key";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "saleId";

-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "paymentId" TEXT,
ADD COLUMN     "pricePerUnit" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "quantity" DECIMAL(10,2) NOT NULL;

-- DropTable
DROP TABLE "public"."SaleItem";

-- CreateIndex
CREATE INDEX "Sale_productId_idx" ON "Sale"("productId");

-- CreateIndex
CREATE INDEX "Sale_paymentId_idx" ON "Sale"("paymentId");

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
