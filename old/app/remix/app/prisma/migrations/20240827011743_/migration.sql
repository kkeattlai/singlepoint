/*
  Warnings:

  - Added the required column `sort` to the `DeliveryType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DeliveryType" ADD COLUMN     "sort" INTEGER NOT NULL;
