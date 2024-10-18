-- AlterTable
ALTER TABLE "BedReservation" ALTER COLUMN "checkInTime" SET DEFAULT (now() + interval '2 hours');
