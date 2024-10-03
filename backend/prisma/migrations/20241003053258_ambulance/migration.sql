/*
  Warnings:

  - Added the required column `live_bedcount` to the `BedInfo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "HealthPackage" DROP CONSTRAINT "HealthPackage_hospital_id_fkey";

-- AlterTable
ALTER TABLE "BedInfo" ADD COLUMN     "live_bedcount" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Ambulance" (
    "id" TEXT NOT NULL,
    "hospital_id" VARCHAR(255) NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "capacity" INTEGER NOT NULL,
    "equipment" TEXT[],
    "location" VARCHAR(255) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Available',

    CONSTRAINT "Ambulance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HealthPackage" ADD CONSTRAINT "HealthPackage_id_fkey" FOREIGN KEY ("id") REFERENCES "Hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ambulance" ADD CONSTRAINT "Ambulance_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "Hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;
