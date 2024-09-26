import { Router } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { prisma } from "../db/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// Create a new hospital
const createHospital = asyncHandler(async (req, res) => {
    const { name, address, city, state, zip_code, contact_number, email, website, type, accreditation, account_number,
        hospital_id, total_beds, bed_type, available_beds, price,
        specialization, qualification, experience_years, availability, contact_info,
        equipment_name, equipment_type, certification_status,
        service_name, description, insurance_company, insurance_type_id, insurance_type, cashless,
        patient_name, feedback, rating, package_name
    } = req.body;

    try {
        // Hospital validation
        if (!name || !address || !city || !state || !zip_code || !contact_number || !type) {
            throw new ApiError(400, "Missing required hospital fields");
        }

        // BedInfo validation
        if (!hospital_id || total_beds === undefined || available_beds === undefined || !bed_type) {
            throw new ApiError(400, "Missing required bed fields");
        }

        // Doctor validation
        if (!hospital_id || !specialization || !qualification || experience_years === undefined || !availability) {
            throw new ApiError(400, "Missing required doctor fields");
        }

        // MedicalEquipment validation
        if (!hospital_id || !equipment_name || !equipment_type || certification_status === undefined) {
            throw new ApiError(400, "Missing required medical equipment fields");
        }

        // Service validation
        if (!hospital_id || !service_name || availability === undefined) {
            throw new ApiError(400, "Missing required service fields");
        }

        // Insurance validation
        if (!hospital_id || !insurance_company || !insurance_type_id) {
            throw new ApiError(400, "Missing required insurance fields");
        }

        // Patient Testimonial validation
        if (!hospital_id || !patient_name || !feedback) {
            throw new ApiError(400, "Missing required testimonial fields");
        }

        // Health Package validation
        if (!hospital_id || !package_name || price === undefined) {
            throw new ApiError(400, "Missing required health package fields");
        }

        // Additional optional validations (e.g., email format, rating range)
        if (email && !/\S+@\S+\.\S+/.test(email)) {
            throw new ApiError(400, "Invalid email format.");
        }

        if (rating !== undefined && (rating < 1 || rating > 5)) {
            throw new ApiError(400, "Rating must be between 1 and 5.");
        }

        // If all validations pass, create the hospital
        const hospital = await prisma.hospital.create({
            data: {
                name,
                address,
                city,
                state,
                zip_code,
                contact_number,
                email,
                website,
                type,
                accreditation,
                account_number,
            },
        });

        // Create the bed info
        const bedInfo = await prisma.bedInfo.create({
            data: {
                hospital_id,
                total_beds,
                bed_type,
                available_beds,
                price,
            },
        });

        // Create the doctor
        const doctor = await prisma.doctor.create({
            data: {
                hospital_id,
                name,
                specialization,
                qualification,
                experience_years,
                availability,
                contact_info,
            },
        });


        // Create the medical equipment
        const medicalEquipment = await prisma.medicalEquipment.create({
            data: {
                hospital_id,
                equipment_name,
                equipment_type,
                availability,
                certification_status,
            },
        });

        const service = await prisma.service.create({
            data: {
                hospital_id,
                service_name,
                description,
                availability,
            },
        });

        // Create the insurance record
        const insurance = await prisma.insurance.create({
            data: {
                hospital_id,
                insurance_company,
                contact_info,
                insurance_type_id,
            },
        });

        // Create the insurance type
        const insuranceType = await prisma.insuranceType.create({
            data: {
                insurance_type,
                cashless
            },
        });

        // Create the PatientTestimonial
        const testimonial = await prisma.patientTestimonial.create({
            data: {
                hospital_id,
                patient_name,
                feedback,
                rating
            },
        });

        const healthPackage = await prisma.healthPackage.create({
            data: {
                hospital_id,
                package_name,
                description,
                price
            },
        });

        res.status(200).json(new ApiResponse(200, { hospital, bedInfo, doctor, medicalEquipment, service, insurance, insuranceType, testimonial, healthPackage }, "User logged out"));
    }


    catch (error) {
        throw new ApiError(400, 'Error creating hospital');
    }
});

// Read all hospitals
const getAllHospitals = asyncHandler(async (req, res) => {
    const { name, city, state } = req.query; // Extract query parameters

    try {
        const query = {
            where: {},
            include: {
                BedInfos: true,
                Doctors: true,
                MedicalEquipments: true,
                Services: true,
                Insurances: {
                    include: {
                        insurance_type: true,
                    },
                },
                PatientTestimonials: true,
                HealthPackages: true,
            },
        };

        // Build the query based on the provided parameters
        if (name) {
            query.where.name = { contains: name, mode: 'insensitive' }; // Case-insensitive search
        }
        if (city) {
            query.where.city = { contains: city, mode: 'insensitive' };
        }
        if (state) {
            query.where.state = { contains: state, mode: 'insensitive' };
        }

        const hospitals = await prisma.hospital.findMany(query);

        if (hospitals.length === 0) {
            throw new ApiError(404, "No hospitals found matching the criteria");
        }

        res.json(hospitals);
    } 
    catch (error) {
        throw new ApiError(400, "Error fetching hospitals: " + error.message);
    }
});

// Read a single hospital by ID
const getHospitalById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const hospital = await prisma.hospital.findUnique({
            where: { id },
            include: {
                BedInfos: true,
                Doctors: true,
                MedicalEquipments: true,
                Services: true,
                Insurances: {
                    include: {
                        insurance_type: true,
                    },
                },
                PatientTestimonials: true,
                HealthPackages: true,
            },
        });

        if (!hospital) {
            throw new ApiError(404, "Hospital not found");
        }

        res.json(hospital);
    } 
    catch (error) {
        throw new ApiError(400, "Error fetching hospital: " + error.message);
    }
});


// Update a hospital 
const updateHospital = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { 
        name, address, city, state, zip_code, contact_number, email, website, 
        type, accreditation, account_number, 
        hospital_id, total_beds, bed_type, available_beds, price,
        specialization, qualification, experience_years, availability, contact_info,
        equipment_name, equipment_type, certification_status,
        service_name, description, insurance_company, insurance_type_id, 
        insurance_type, cashless,
        patient_name, feedback, rating, package_name 
    } = req.body;

    try {
        // Update the hospital
        const hospital = await prisma.hospital.update({
            where: { id },
            data: { 
                name, address, city, state, zip_code, contact_number, email, website, type, accreditation, account_number 
            },
        });

        // Update BedInfo
        const bedInfo = await prisma.bedInfo.update({
            where: { hospital_id },
            data: { total_beds, bed_type, available_beds, price },
        });

        // Update Doctor
        const doctor = await prisma.doctor.update({
            where: { hospital_id },
            data: { 
                specialization, qualification, experience_years, availability, contact_info 
            },
        });

        // Update Medical Equipment
        const medicalEquipment = await prisma.medicalEquipment.update({
            where: { hospital_id },
            data: { 
                equipment_name, equipment_type, availability: true, certification_status 
            },
        });

        // Update Service
        const service = await prisma.service.update({
            where: { hospital_id },
            data: { 
                service_name, description, availability: true 
            },
        });

        // Update Insurance
        const insurance = await prisma.insurance.update({
            where: { hospital_id },
            data: { 
                insurance_company, insurance_type_id 
            },
        });

        // Update Patient Testimonial
        const testimonial = await prisma.patientTestimonial.update({
            where: { hospital_id },
            data: { 
                patient_name, feedback, rating 
            },
        });

        // Update Health Package
        const healthPackage = await prisma.healthPackage.update({
            where: { hospital_id },
            data: { 
                package_name, description, price 
            },
        });

        res.json({ hospital, bedInfo, doctor, medicalEquipment, service, insurance, testimonial, healthPackage });
    } catch (error) {
        throw new ApiError(400, "Error updating hospital or related entities: " + error.message);
    }
});


// Delete a hospital 
const deleteHospital = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        // Delete related entities first to maintain referential integrity
        await prisma.patientTestimonial.deleteMany({ where: { hospital_id: id } });
        await prisma.healthPackage.deleteMany({ where: { hospital_id: id } });
        await prisma.insurance.deleteMany({ where: { hospital_id: id } });
        await prisma.service.deleteMany({ where: { hospital_id: id } });
        await prisma.medicalEquipment.deleteMany({ where: { hospital_id: id } });
        await prisma.doctor.deleteMany({ where: { hospital_id: id } });
        await prisma.bedInfo.deleteMany({ where: { hospital_id: id } });

        // Finally, delete the hospital
        await prisma.hospital.delete({ where: { id } });

        res.status(204).send();
    } 
    catch (error) 
    {
        throw new ApiError(400, "Error deleting hospital and related entities: " + error.message);
    }
});


export { createHospital, getAllHospitals, getHospitalById, updateHospital, deleteHospital };
