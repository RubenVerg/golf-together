/*
  Warnings:

  - A unique constraint covering the columns `[roomId]` on the table `Hole` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Hole" ADD COLUMN     "roomId" INTEGER;

-- CreateTable
CREATE TABLE "ChatRoom" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatRoom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Hole_roomId_key" ON "Hole"("roomId");

-- AddForeignKey
ALTER TABLE "Hole" ADD CONSTRAINT "Hole_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
