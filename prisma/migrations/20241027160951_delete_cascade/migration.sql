-- DropForeignKey
ALTER TABLE "Approach" DROP CONSTRAINT "Approach_holeId_fkey";

-- DropForeignKey
ALTER TABLE "Approach" DROP CONSTRAINT "Approach_initiatorId_fkey";

-- DropForeignKey
ALTER TABLE "Hole" DROP CONSTRAINT "Hole_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Improvement" DROP CONSTRAINT "Improvement_solutionId_fkey";

-- DropForeignKey
ALTER TABLE "Improvement" DROP CONSTRAINT "Improvement_userId_fkey";

-- DropForeignKey
ALTER TABLE "Solution" DROP CONSTRAINT "Solution_approachId_fkey";

-- AddForeignKey
ALTER TABLE "Hole" ADD CONSTRAINT "Hole_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approach" ADD CONSTRAINT "Approach_holeId_fkey" FOREIGN KEY ("holeId") REFERENCES "Hole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approach" ADD CONSTRAINT "Approach_initiatorId_fkey" FOREIGN KEY ("initiatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solution" ADD CONSTRAINT "Solution_approachId_fkey" FOREIGN KEY ("approachId") REFERENCES "Approach"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Improvement" ADD CONSTRAINT "Improvement_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Improvement" ADD CONSTRAINT "Improvement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
