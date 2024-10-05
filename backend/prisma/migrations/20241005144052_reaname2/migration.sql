/*
  Warnings:

  - The primary key for the `BedInfo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `price` on the `BedInfo` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - The primary key for the `Doctor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `HealthPackage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `package_price` on the `HealthPackage` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - The primary key for the `Hospital` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Insurance` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `InsuranceType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MedicalEquipment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `availability` on the `MedicalEquipment` table. All the data in the column will be lost.
  - The primary key for the `PatientTestimonial` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Service` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `price` on table `BedInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contact_info` on table `Doctor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `package_description` on table `HealthPackage` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contact_info` on table `Insurance` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `certification_status` to the `MedicalEquipment` table without a default value. This is not possible if the table is not empty.
  - Made the column `rating` on table `PatientTestimonial` required. This step will fail if there are existing NULL values in that column.
  - Made the column `service_description` on table `Service` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "BedInfo" DROP CONSTRAINT "BedInfo_hospital_id_fkey";

-- DropForeignKey
ALTER TABLE "Doctor" DROP CONSTRAINT "Doctor_hospital_id_fkey";

-- DropForeignKey
ALTER TABLE "HealthPackage" DROP CONSTRAINT "HealthPackage_hospital_id_fkey";

-- DropForeignKey
ALTER TABLE "Insurance" DROP CONSTRAINT "Insurance_hospital_id_fkey";

-- DropForeignKey
ALTER TABLE "Insurance" DROP CONSTRAINT "Insurance_insurance_type_id_fkey";

-- DropForeignKey
ALTER TABLE "MedicalEquipment" DROP CONSTRAINT "MedicalEquipment_hospital_id_fkey";

-- DropForeignKey
ALTER TABLE "PatientTestimonial" DROP CONSTRAINT "PatientTestimonial_hospital_id_fkey";

-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_hospital_id_fkey";

-- DropIndex
DROP INDEX "Hospital_email_key";

-- AlterTable
ALTER TABLE "BedInfo" DROP CONSTRAINT "BedInfo_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "hospital_id" SET DATA TYPE TEXT,
ALTER COLUMN "bed_type" SET DATA TYPE TEXT,
ALTER COLUMN "price" SET NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "live_bedcount" DROP NOT NULL,
ADD CONSTRAINT "BedInfo_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Doctor" DROP CONSTRAINT "Doctor_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "hospital_id" SET DATA TYPE TEXT,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "specialization" SET DATA TYPE TEXT,
ALTER COLUMN "qualification" SET DATA TYPE TEXT,
ALTER COLUMN "availability" SET DATA TYPE TEXT,
ALTER COLUMN "contact_info" SET NOT NULL,
ALTER COLUMN "contact_info" SET DATA TYPE TEXT,
ADD CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "HealthPackage" DROP CONSTRAINT "HealthPackage_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "hospital_id" SET DATA TYPE TEXT,
ALTER COLUMN "package_name" SET DATA TYPE TEXT,
ALTER COLUMN "package_description" SET NOT NULL,
ALTER COLUMN "package_description" SET DATA TYPE TEXT,
ALTER COLUMN "package_price" SET DATA TYPE DOUBLE PRECISION,
ADD CONSTRAINT "HealthPackage_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Hospital" DROP CONSTRAINT "Hospital_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "address" SET DATA TYPE TEXT,
ALTER COLUMN "city" SET DATA TYPE TEXT,
ALTER COLUMN "state" SET DATA TYPE TEXT,
ALTER COLUMN "zip_code" SET DATA TYPE TEXT,
ALTER COLUMN "contact_number" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET DATA TYPE TEXT,
ALTER COLUMN "website" SET DATA TYPE TEXT,
ALTER COLUMN "type" SET DATA TYPE TEXT,
ALTER COLUMN "accreditation" SET DATA TYPE TEXT,
ALTER COLUMN "account_number" SET DATA TYPE TEXT,
ADD CONSTRAINT "Hospital_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Insurance" DROP CONSTRAINT "Insurance_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "hospital_id" SET DATA TYPE TEXT,
ALTER COLUMN "insurance_company" SET DATA TYPE TEXT,
ALTER COLUMN "contact_info" SET NOT NULL,
ALTER COLUMN "contact_info" SET DATA TYPE TEXT,
ALTER COLUMN "insurance_type_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Insurance_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "InsuranceType" DROP CONSTRAINT "InsuranceType_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "insurance_type" SET DATA TYPE TEXT,
ADD CONSTRAINT "InsuranceType_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "MedicalEquipment" DROP CONSTRAINT "MedicalEquipment_pkey",
DROP COLUMN "availability",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "hospital_id" SET DATA TYPE TEXT,
ALTER COLUMN "equipment_name" SET DATA TYPE TEXT,
ALTER COLUMN "equipment_type" SET DATA TYPE TEXT,
DROP COLUMN "certification_status",
ADD COLUMN     "certification_status" BOOLEAN NOT NULL,
ADD CONSTRAINT "MedicalEquipment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PatientTestimonial" DROP CONSTRAINT "PatientTestimonial_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "hospital_id" SET DATA TYPE TEXT,
ALTER COLUMN "patient_name" SET DATA TYPE TEXT,
ALTER COLUMN "feedback" SET DATA TYPE TEXT,
ALTER COLUMN "rating" SET NOT NULL,
ADD CONSTRAINT "PatientTestimonial_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Service" DROP CONSTRAINT "Service_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "hospital_id" SET DATA TYPE TEXT,
ALTER COLUMN "service_name" SET DATA TYPE TEXT,
ALTER COLUMN "availability" SET DATA TYPE TEXT,
ALTER COLUMN "service_description" SET NOT NULL,
ALTER COLUMN "service_description" SET DATA TYPE TEXT,
ADD CONSTRAINT "Service_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "BedInfo" ADD CONSTRAINT "BedInfo_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalEquipment" ADD CONSTRAINT "MedicalEquipment_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Insurance" ADD CONSTRAINT "Insurance_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientTestimonial" ADD CONSTRAINT "PatientTestimonial_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthPackage" ADD CONSTRAINT "HealthPackage_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
