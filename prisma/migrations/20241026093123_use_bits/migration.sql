/*
  Warnings:

  - You are about to drop the column `improvement` on the `Improvement` table. All the data in the column will be lost.
  - Added the required column `improvementBits` to the `Improvement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bits` to the `Solution` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Improvement" DROP COLUMN "improvement",
ADD COLUMN     "improvementBits" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Solution" ADD COLUMN     "bits" INTEGER NOT NULL;
