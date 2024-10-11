import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { prisma } from "../db/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { upload, deleteImage } from '../config/cloudinary.js';


const createHospital = asyncHandler(async (req, res) => {
    const {
        hospital,
        beds,
        doctor,
        medicalEquipment,
        service,
        insurance,
    } = req.body;

    const mainImagePath = req.files.mainImage ? req.files.mainImage.path : null;
    const subImagePaths = req.files.subImages ? req.files.subImages.map(file => file.path) : [];

    try {
        // Validate required hospital fields
        if (!hospital.name || !hospital.address || !hospital.city || !hospital.state || !hospital.zip_code || !hospital.contact_number || !hospital.type) {
            throw new ApiError(400, "Missing required hospital fields");
        }

        // Validate required bed fields
        if (beds.total_beds === undefined || beds.available_beds === undefined || !beds.bed_type) {
            throw new ApiError(400, "Missing required bed fields");
        }

        // Validate required doctor fields
        if (!doctor.specialization || !doctor.qualification || doctor.experience_years === undefined || !doctor.availability) {
            throw new ApiError(400, "Missing required doctor fields");
        }

        // Validate required medical equipment fields
        if (!medicalEquipment.equipment_name || !medicalEquipment.equipment_type || medicalEquipment.certification_status === undefined) {
            throw new ApiError(400, "Missing required medical equipment fields");
        }

        // Validate required service fields
        if (!service.service_name || service.availability === undefined) {
            throw new ApiError(400, "Missing required service fields");
        }

        // Validate required insurance fields
        if (!insurance.insurance_company || !insurance.insurance_type_id) {
            throw new ApiError(400, "Missing required insurance fields");
        }

        // Check for existing hospital
        const existingHospital = await prisma.hospital.findUnique({
            where: { email: hospital.email }
        });

        if (existingHospital) {
            throw new ApiError(409, "A hospital with this email already exists");
        }

        // Upload images to Cloudinary
        const uploadedMainImage = mainImagePath ? await upload(mainImagePath) : null;
        const uploadedSubImages = await Promise.all(subImagePaths.map(path => upload(path)));

        // Create the hospital
        const createdHospital = await prisma.hospital.create({
            data: { 
                ...hospital,
                mainImage: uploadedMainImage ? uploadedMainImage.secure_url : null,
                subImages: uploadedSubImages.map(img => img.secure_url),
            },
        });

        // Create bed info
        const createdBedInfo = await prisma.bedInfo.create({
            data: {
                hospital_id: createdHospital.id,
                ...beds,
            },
        });

        // Create doctor
        const createdDoctor = await prisma.doctor.create({
            data: {
                hospital_id: createdHospital.id,
                ...doctor,
            },
        });

        // Create medical equipment
        const createdMedicalEquipment = await prisma.medicalEquipment.create({
            data: {
                hospital_id: createdHospital.id,
                ...medicalEquipment,

            },
        });

        // Create service
        const createdService = await prisma.service.create({
            data: {
                hospital_id: createdHospital.id,
                ...service,
            },
        });

        // Create insurance record
        const createdInsurance = await prisma.insurance.create({
            data: {
                hospital_id: createdHospital.id,
                ...insurance,
            },
        });

        // Respond with the created hospital and related data
        return res.status(201).json(new ApiResponse(201, {
            createdHospital, createdBedInfo, createdDoctor, createdMedicalEquipment, createdService, createdInsurance 
        }, "Hospital created successfully"));
    } 
    catch (error) {
        console.error('Error creating hospital:', error);
        throw new ApiError(400, 'Error creating hospital: ' + error.message);
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
                Ambulances: true, // Include Ambulances if relevant
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

        // Map the hospitals to include ambulance availability
        const response = hospitals.map(hospital => ({
            hospital: {
                ...hospital,
                ambulanceAvailable: hospital.Ambulances?.some(ambulance => ambulance.status === 'Available') || false,
            },
            beds: hospital.BedInfos,
            doctors: hospital.Doctors,
            medicalEquipments: hospital.MedicalEquipments,
            services: hospital.Services,
            insurances: hospital.Insurances,
            testimonials: hospital.PatientTestimonials,
            healthPackages: hospital.HealthPackages,
        }));

        res.json(response);
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
                Ambulances: true, 
            },
        });

        if (!hospital) {
            throw new ApiError(404, "Hospital not found");
        }

        
        const ambulanceAvailable = hospital.Ambulances?.some(ambulance => ambulance.status === 'Available') || false;

        
        const response = {
            hospital: {
                ...hospital,
                ambulanceAvailable,
            },
            beds: hospital.BedInfos,
            doctors: hospital.Doctors,
            medicalEquipments: hospital.MedicalEquipments,
            services: hospital.Services,
            insurances: hospital.Insurances,
            testimonials: hospital.PatientTestimonials,
            healthPackages: hospital.HealthPackages,
        };

        res.json(response);
    } 
    catch (error) 
    {
        throw new ApiError(400, "Error fetching hospital: " + error.message);
    }
});


// Update a hospital 
const updateHospital = asyncHandler(async (req, res) => {
    const { id } = req.params; 

    const { 
        hospital,
        beds,
        doctor,
        medicalEquipment,
        service,
        insurance,
        mainImage, 
        subImages 
    } = req.body; 

  

    try {
       
        const existingHospital = await prisma.hospital.findUnique({
            where: { id },
            select: {
                mainImage: true,
                subImages: true,
            },
        });

        const uploadedMainImage = mainImage ? await upload(mainImage) : existingHospital.mainImage;
        const uploadedSubImages = subImages ? await Promise.all(subImages.map(path => upload(path))) : existingHospital.subImages;

       
        const updatedHospital = await prisma.hospital.update({
            where: { id },
            data: { 
                ...hospital, 
                mainImage: uploadedMainImage ? uploadedMainImage.secure_url : existingHospital.mainImage,
                subImages: uploadedSubImages.map(img => img.secure_url),
            },
        });

        // Update BedInfo
        const updatedBedInfo = await prisma.bedInfo.update({
            where: { hospital_id: id },
            data: { 
                ...beds 
            },
        });

        // Update Doctor
        const updatedDoctor = await prisma.doctor.update({
            where: { hospital_id: id },
            data: { 
                ...doctor 
            },
        });

        // Update Medical Equipment
        const updatedMedicalEquipment = await prisma.medicalEquipment.update({
            where: { hospital_id: id },
            data: {
                ...medicalEquipment
            }
        });

        // Update Service
        const updatedService = await prisma.service.update({
            where: { hospital_id: id },
            data: { 
                ...service 
            },
        });

        // Update Insurance
        const updatedInsurance = await prisma.insurance.update({
            where: { hospital_id: id },
            data: { 
                ...insurance 
            },
        });

        // Respond with the updated entities
        res.json({ 
            updatedHospital, 
            updatedBedInfo, 
            updatedDoctor, 
            updatedMedicalEquipment, 
            updatedService, 
            updatedInsurance 
        });
    } catch (error) {
        throw new ApiError(400, "Error updating hospital or related entities: " + error.message);
    }
});




// Delete a hospital 
const deleteHospital = asyncHandler(async (req, res) => {
    const { id } = req.body;

    try {
        const hospitalToDelete = await prisma.hospital.findUnique({
            where: { id },
            select: {
                mainImage: true,
                subImages: true,
                BedInfos: true,
                Doctors: true,
                MedicalEquipments: true,
                Services: true,
                Insurances: true,
                PatientTestimonials: true,
                HealthPackages: true,
                Ambulances: true,
            },
        });

        if (!hospitalToDelete) {
            throw new ApiError(404, "Hospital not found");
        }

        if (hospitalToDelete.mainImage) {
            const publicId = hospitalToDelete.mainImage.split('/').pop().split('.')[0]; 
            await deleteImage(publicId);
        }

        for (const image of hospitalToDelete.subImages) {
            const publicId = image.split('/').pop().split('.')[0];
            await deleteImage(publicId);
        }

        await prisma.patientTestimonial.deleteMany({ where: { hospital_id: id } });
        await prisma.healthPackage.deleteMany({ where: { hospital_id: id } });
        await prisma.insurance.deleteMany({ where: { hospital_id: id } });
        await prisma.service.deleteMany({ where: { hospital_id: id } });
        await prisma.medicalEquipment.deleteMany({ where: { hospital_id: id } });
        await prisma.doctor.deleteMany({ where: { hospital_id: id } });
        await prisma.bedInfo.deleteMany({ where: { hospital_id: id } });

        // Finally, delete the hospital
        await prisma.hospital.delete({ where: { id } });

        return res.status(204).json(
            new ApiResponse(204, id, "Deleted successfully")
        );
    } 
    catch (error) {
        throw new ApiError(400, "Error deleting hospital and related entities: " + error.message);
    }
});



export { createHospital, getAllHospitals, getHospitalById, updateHospital, deleteHospital };
