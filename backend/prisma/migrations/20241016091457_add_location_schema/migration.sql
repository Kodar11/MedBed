-- CreateTable
CREATE TABLE "User" (
    "id" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(255) NOT NULL,
    "refresh_token" VARCHAR(255),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BedReservation" (
    "id" VARCHAR(255) NOT NULL,
    "paymentId" VARCHAR(255) NOT NULL,
    "reservationTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checkInTime" TIMESTAMP(3) NOT NULL DEFAULT (now() + interval '2 hours'),
    "check_in" BOOLEAN NOT NULL DEFAULT false,
    "late_patient" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,

    CONSTRAINT "BedReservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserInsurance" (
    "id" VARCHAR(255) NOT NULL,
    "insurance_company" VARCHAR(255) NOT NULL,
    "insurance_type_id" VARCHAR(255) NOT NULL,
    "valid_till" TIMESTAMP(3) NOT NULL,
    "policy_number" VARCHAR(255) NOT NULL,
    "coverage_amount" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "UserInsurance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hospital" (
    "id" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "city" VARCHAR(255) NOT NULL,
    "state" VARCHAR(255) NOT NULL,
    "zip_code" VARCHAR(255) NOT NULL,
    "contact_number" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "website" VARCHAR(255),
    "type" VARCHAR(255) NOT NULL,
    "accreditation" VARCHAR(255),
    "account_number" VARCHAR(255),

    CONSTRAINT "Hospital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customization" (
    "id" VARCHAR(255) NOT NULL,
    "hospital_id" VARCHAR(255) NOT NULL,
    "active_Service" BOOLEAN NOT NULL DEFAULT true,
    "deposit_Amount" INTEGER NOT NULL,

    CONSTRAINT "Customization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BedInfo" (
    "id" VARCHAR(255) NOT NULL,
    "hospital_id" VARCHAR(255) NOT NULL,
    "total_beds" INTEGER NOT NULL,
    "bed_type" VARCHAR(255) NOT NULL,
    "available_beds" INTEGER NOT NULL,
    "price" DECIMAL(65,30),
    "live_bedcount" INTEGER NOT NULL,

    CONSTRAINT "BedInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Doctor" (
    "id" VARCHAR(255) NOT NULL,
    "hospital_id" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "specialization" VARCHAR(255) NOT NULL,
    "qualification" VARCHAR(255) NOT NULL,
    "experience_years" INTEGER NOT NULL,
    "availability" VARCHAR(255) NOT NULL,
    "contact_info" VARCHAR(255),

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalEquipment" (
    "id" VARCHAR(255) NOT NULL,
    "hospital_id" VARCHAR(255) NOT NULL,
    "equipment_name" VARCHAR(255) NOT NULL,
    "equipment_type" VARCHAR(255) NOT NULL,
    "availability" BOOLEAN NOT NULL,
    "certification_status" VARCHAR(255),

    CONSTRAINT "MedicalEquipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" VARCHAR(255) NOT NULL,
    "hospital_id" VARCHAR(255) NOT NULL,
    "service_name" VARCHAR(255) NOT NULL,
    "service_description" VARCHAR(255),
    "availability" BOOLEAN NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Insurance" (
    "id" VARCHAR(255) NOT NULL,
    "hospital_id" VARCHAR(255) NOT NULL,
    "insurance_company" VARCHAR(255) NOT NULL,
    "contact_info" VARCHAR(255),
    "insurance_type_id" VARCHAR(255) NOT NULL,
    "cashless" BOOLEAN NOT NULL,

    CONSTRAINT "Insurance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientTestimonial" (
    "id" VARCHAR(255) NOT NULL,
    "hospital_id" VARCHAR(255) NOT NULL,
    "patient_name" VARCHAR(255) NOT NULL,
    "feedback" VARCHAR(255) NOT NULL,
    "rating" INTEGER,

    CONSTRAINT "PatientTestimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthPackage" (
    "id" VARCHAR(255) NOT NULL,
    "hospital_id" VARCHAR(255) NOT NULL,
    "package_name" VARCHAR(255) NOT NULL,
    "package_description" VARCHAR(255),
    "package_price" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "HealthPackage_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "BedReservation_userId_idx" ON "BedReservation"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Hospital_email_key" ON "Hospital"("email");

-- AddForeignKey
ALTER TABLE "BedReservation" ADD CONSTRAINT "BedReservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BedReservation" ADD CONSTRAINT "BedReservation_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customization" ADD CONSTRAINT "Customization_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "Hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BedInfo" ADD CONSTRAINT "BedInfo_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "Hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "Hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalEquipment" ADD CONSTRAINT "MedicalEquipment_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "Hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "Hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Insurance" ADD CONSTRAINT "Insurance_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "Hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientTestimonial" ADD CONSTRAINT "PatientTestimonial_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "Hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthPackage" ADD CONSTRAINT "HealthPackage_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "Hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;
