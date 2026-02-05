/*
  Warnings:

  - Added the required column `owners_phone` to the `pets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pets" ADD COLUMN     "owners_phone" TEXT NOT NULL;
