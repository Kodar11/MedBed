-- AlterTable
ALTER TABLE "BedReservation" ALTER COLUMN "checkInTime" SET DEFAULT (now() + interval '2 hours');

-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "islocation" BOOLEAN NOT NULL DEFAULT false;
