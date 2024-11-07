-- DropForeignKey
ALTER TABLE "Ambulance" DROP CONSTRAINT "Ambulance_hospital_id_fkey";

-- AlterTable
ALTER TABLE "Hospital" ADD COLUMN     "mainImage" VARCHAR(255),
ADD COLUMN     "subImages" TEXT[];
