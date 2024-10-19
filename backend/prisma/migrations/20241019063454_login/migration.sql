/*
  Warnings:

  - You are about to alter the column `refresh_token` on the `HospitalLogin` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "HospitalLogin" ALTER COLUMN "refresh_token" DROP NOT NULL,
ALTER COLUMN "refresh_token" SET DATA TYPE VARCHAR(255);
