/*
  Warnings:

  - You are about to drop the column `code` on the `Solution` table. All the data in the column will be lost.
  - Added the required column `newCode` to the `Improvement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Improvement" ADD COLUMN     "newCode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Solution" DROP COLUMN "code";
