/*
  Warnings:

  - You are about to drop the column `mainImage` on the `Hospital` table. All the data in the column will be lost.
  - You are about to drop the column `subImages` on the `Hospital` table. All the data in the column will be lost.
  - You are about to drop the `InsuranceType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cashless` to the `Insurance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Insurance" DROP CONSTRAINT "Insurance_insurance_type_id_fkey";

-- AlterTable
ALTER TABLE "BedReservation" ALTER COLUMN "checkInTime" SET DEFAULT (now() + interval '2 hours');

-- AlterTable
ALTER TABLE "Hospital" DROP COLUMN "mainImage",
DROP COLUMN "subImages";

-- AlterTable
ALTER TABLE "Insurance" ADD COLUMN     "cashless" BOOLEAN NOT NULL;

-- DropTable
DROP TABLE "InsuranceType";
