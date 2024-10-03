/*
  Warnings:

  - You are about to drop the column `description` on the `HealthPackage` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `HealthPackage` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Service` table. All the data in the column will be lost.
  - Added the required column `package_price` to the `HealthPackage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "HealthPackage" DROP CONSTRAINT "HealthPackage_id_fkey";

-- AlterTable
ALTER TABLE "HealthPackage" DROP COLUMN "description",
DROP COLUMN "price",
ADD COLUMN     "package_description" VARCHAR(255),
ADD COLUMN     "package_price" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "description",
ADD COLUMN     "service_description" VARCHAR(255);

-- AddForeignKey
ALTER TABLE "HealthPackage" ADD CONSTRAINT "HealthPackage_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "Hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;
