/*
  Warnings:

  - Added the required column `sort` to the `Brand` table without a default value. This is not possible if the table is not empty.
  - Made the column `sort` on table `Category` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Brand" ADD COLUMN     "sort" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "sort" SET NOT NULL,
ALTER COLUMN "sort" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Option" ALTER COLUMN "sort" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ProductImage" ALTER COLUMN "sort" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Sku" ALTER COLUMN "sort" DROP DEFAULT;

-- AlterTable
ALTER TABLE "StoreDeliveryOption" ALTER COLUMN "sort" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Variant" ALTER COLUMN "sort" DROP DEFAULT;
