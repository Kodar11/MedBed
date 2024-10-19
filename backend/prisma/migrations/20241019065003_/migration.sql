/*
  Warnings:

  - The primary key for the `HospitalLogin` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "HospitalLogin" DROP CONSTRAINT "HospitalLogin_pkey",
ADD CONSTRAINT "HospitalLogin_pkey" PRIMARY KEY ("id");
