-- AlterTable
ALTER TABLE "BedReservation" ALTER COLUMN "checkInTime" SET DEFAULT (now() + interval '2 hours');

-- CreateTable
CREATE TABLE "HospitalLogin" (
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "hospital_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "HospitalLogin_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HospitalLogin" ADD CONSTRAINT "HospitalLogin_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "Hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;
