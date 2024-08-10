/*
  Warnings:

  - You are about to drop the `ShoppingBag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ShoppingBag" DROP CONSTRAINT "ShoppingBag_inventory_id_fkey";

-- DropForeignKey
ALTER TABLE "ShoppingBag" DROP CONSTRAINT "ShoppingBag_store_id_fkey";

-- DropTable
DROP TABLE "ShoppingBag";
