import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { prisma } from "../db/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { upload, deleteImage } from '../config/cloudinary.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function isPasswordCorrect(user, password) {
  return await bcrypt.compare(password, user.password);
}

// Function to generate access token
function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      phone_number: user.phone_number,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
}

// Function to generate refresh token
function generateRefreshToken(user) {
  return jwt.sign(
    {
      id: user.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
}

const generateAccessAndRefreshTokens = async (id) => {

    console.log(id);
    
    try {
      const user = await prisma.hospitalLogin.findUnique({
        where: { id: id },
      });
  
      if (!user) {
        throw new ApiError(404, "User not found");
      }
  
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
  
      await prisma.hospitalLogin.update({
        where: { id: id },
        data: { refresh_token: refreshToken },  // Corrected field name
      });
  
      return { accessToken, refreshToken };
  
    } catch (error) {
      console.error("Error generating tokens:", error);  // Log the error
      throw new ApiError(500, "Something went wrong while generating tokens");
    }
  };
  

const createHospital = asyncHandler(async (req, res) => {
    console.log(req.body);

    const {
        hospital,
        beds,
        doctor,
        medicalEquipment,
        service,
        insurance,
        healthPackages,
    } = req.body;

    try {
        // Check for missing required fields
        // if (!hospital.name || !hospital.address || !hospital.city || !hospital.state || !hospital.zip_code || !hospital.contact_number || !hospital.type) {
        //     throw new ApiError(400, "Missing required hospital fields");
        // }

        // if (!Array.isArray(beds) || beds.length === 0 || !beds[0].bed_type || beds[0].total_beds === undefined || beds[0].available_beds === undefined) {
        //     throw new ApiError(400, "Missing required bed information");
        // }

        // if (!doctor.specialization || !doctor.qualification || doctor.experience_years === undefined || !doctor.availability) {
        //     throw new ApiError(400, "Missing required doctor fields");
        // }

        // if (!medicalEquipment.equipment_name || !medicalEquipment.equipment_type || medicalEquipment.availability === undefined) {
        //     throw new ApiError(400, "Missing required medical equipment fields");
        // }

        // if (!service.service_name || service.availability === undefined) {
        //     throw new ApiError(400, "Missing required service fields");
        // }

        // if (!insurance.insurance_company || !insurance.insurance_type_id) {
        //     throw new ApiError(400, "Missing required insurance fields");
        // }

        // Create the hospital record
        const createdHospital = await prisma.hospital.create({
            data: {
                ...hospital,
            },
        });

        // Create bed info records (handling multiple bed entries)
        const bedInfoPromises = beds.map((bed) => {
            return prisma.bedInfo.create({
                data: {
                    hospital_id: createdHospital.id,
                    total_beds: parseInt(bed.total_beds),
                    available_beds: parseInt(bed.available_beds),
                    bed_type: bed.bed_type,
                    price: parseFloat(bed.price),
                    live_bedcount: parseInt(bed.available_beds), // Assuming live_bedcount = available_beds initially
                },
            });
        });
        await Promise.all(bedInfoPromises);

        // Create doctor record
        // Create doctor records (assuming multiple doctors may exist)
        const doctorPromises = doctor.map((doc) => {
            return prisma.doctor.create({
                data: {
                    hospital_id: createdHospital.id,
                    name: doc.name,
                    specialization: doc.specialization,
                    qualification: doc.qualification,
                    experience_years: parseInt(doc.experience_years), // Ensure experience_years is an integer
                    availability: doc.availability,
                    contact_info: doc.contact_info || null, // Optional field
                },
            });
        });
        await Promise.all(doctorPromises);

        // Create medical equipment records (assuming multiple pieces of equipment)
        const medicalEquipmentPromises = medicalEquipment.map((equipment) => {
            return prisma.medicalEquipment.create({
                data: {
                    hospital_id: createdHospital.id,
                    equipment_name: equipment.equipment_name,
                    equipment_type: equipment.equipment_type,
                    availability: equipment.availability === 'true' || equipment.availability === true, // Boolean conversion
                    certification_status: equipment.certification_status || null, // Optional field
                },
            });
        });
        await Promise.all(medicalEquipmentPromises);

        // Create service records (assuming multiple services)
        const servicePromises = service.map((srv) => {
            return prisma.service.create({
                data: {
                    hospital_id: createdHospital.id,
                    service_name: srv.service_name,
                    service_description: srv.service_description || null, // Optional field
                    availability: srv.availability === 'true' || srv.availability === true, // Boolean conversion
                },
            });
        });
        await Promise.all(servicePromises);

        // Create insurance records (assuming multiple insurance entries)
        const insurancePromises = insurance.map((ins) => {
            console.log("hello", ins);

            return prisma.insurance.create({
                data: {
                    hospital_id: createdHospital.id, // Linking to the hospital
                    insurance_company: ins.insurance_company, // Required field
                    contact_info: ins.contact_info || null, // Optional field
                    insurance_type_id: ins.insurance_type_id, // Foreign key to InsuranceType
                    cashless: ins.cashless, // Boolean field for cashless option
                },
            });
        });
        await Promise.all(insurancePromises);

        const healthPackagePromises = healthPackages.map((pkg) => {
            return prisma.healthPackage.create({
                data: {
                    hospital_id: createdHospital.id,
                    package_name: pkg.package_name,
                    package_description: pkg.package_description || null, // Optional field
                    package_price: parseFloat(pkg.package_price), // Ensuring price is stored as a decimal
                },
            });
        });
        await Promise.all(healthPackagePromises);


        // Respond with the created records
        return res.status(201).json(new ApiResponse(201, {
            hospital: createdHospital,
            beds: await prisma.bedInfo.findMany({ where: { hospital_id: createdHospital.id } }),
            doctor: doctorPromises,
            medicalEquipment: medicalEquipmentPromises,
            service: servicePromises,
            insurance: insurancePromises,
        }, "Hospital created successfully"));
    } catch (error) {
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
                // Insurances: {
                //     include: {
                //         insurance_type: true,
                //     },
                // },
                
                Insurances:true,
                // PatientTestimonials: true,
                HealthPackages: true,
                // Ambulances: true, // Include Ambulances if relevant
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
            },
            beds: hospital.BedInfos,
            doctors: hospital.Doctors,
            medicalEquipments: hospital.MedicalEquipments,
            services: hospital.Services,
            insurances: hospital.Insurances,
            // testimonials: hospital.PatientTestimonials,
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
    const id = req.query.requestId;
    console.log(id);
    
    try {
        const hospital = await prisma.hospital.findUnique({
            where: { id },
            include: {
                BedInfos: true,
                Doctors: true,
                MedicalEquipments: true,
                Services: true,
                // Insurances: {
                //     include: {
                //         insurance_type: true,
                //     },
                // },

                Insurances: true,
                // PatientTestimonials: true,
                HealthPackages: true,
                // Ambulances: true,
            },
        });

        // console.log(hospital);
        

        if (!hospital) {
            throw new ApiError(404, "Hospital not found");
        }


        // const ambulanceAvailable = hospital.Ambulances?.some(ambulance => ambulance.status === 'Available') || false;


        const response = {
            hospital: {
                ...hospital,
                // ambulanceAvailable,
            },
            beds: hospital.BedInfos,
            doctors: hospital.Doctors,
            medicalEquipments: hospital.MedicalEquipments,
            services: hospital.Services,
            insurances: hospital.Insurances,
            // testimonials: hospital.PatientTestimonials,
            healthPackages: hospital.HealthPackages,
        };

        res.json(response);
    }
    catch (error) {
        throw new ApiError(400, "Error fetching hospital: " + error.message);
    }
});


// Update a hospital 
const updateHospital = asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log(id);
    

    const {
        hospital,
        beds,
        doctor,
        medicalEquipment,
        service,
        insurance,
        healthPackages,
        // mainImage,
        // subImages
    } = req.body;



    try {

        // const existingHospital = await prisma.hospital.findUnique({
        //     where: { id },
        //     select: {
        //         mainImage: true,
        //         subImages: true,
        //     },
        // });

        // const uploadedMainImage = mainImage ? await upload(mainImage) : existingHospital.mainImage;
        // const uploadedSubImages = subImages ? await Promise.all(subImages.map(path => upload(path))) : existingHospital.subImages;


        // const updatedHospital = await prisma.hospital.update({
        //     where: { id },
        //     data: {
        //         ...hospital,
        //         // mainImage: uploadedMainImage ? uploadedMainImage.secure_url : existingHospital.mainImage,
        //         // subImages: uploadedSubImages.map(img => img.secure_url),
        //     },
        // });

        // // Update BedInfo
        // const updatedBedInfo = await prisma.bedInfo.update({
        //     where: { hospital_id: id },
        //     data: {
        //         ...beds
        //     },
        // });

        // // Update Doctor
        // const updatedDoctor = await prisma.doctor.update({
        //     where: { hospital_id: id },
        //     data: {
        //         ...doctor
        //     },
        // });

        // // Update Medical Equipment
        // const updatedMedicalEquipment = await prisma.medicalEquipment.update({
        //     where: { hospital_id: id },
        //     data: {
        //         ...medicalEquipment
        //     }
        // });

        // // Update Service
        // const updatedService = await prisma.service.update({
        //     where: { hospital_id: id },
        //     data: {
        //         ...service
        //     },
        // });

        // // Update Insurance
        // const updatedInsurance = await prisma.insurance.update({
        //     where: { hospital_id: id },
        //     data: {
        //         ...insurance
        //     },
        // });

        const updatedHospital = await prisma.hospital.update({
            where: { id },
            data: {
                ...hospital,  // Update the main hospital data
                
                // Update BedInfos (nested update)
                BedInfos: {
                    upsert: beds.map(bed => ({
                        where: { id: bed.id },  // Assuming each bed has a unique `id`
                        update: {
                            total_beds: bed.total_beds,
                            bed_type: bed.bed_type,
                            available_beds: bed.available_beds,
                            price: bed.price,
                            live_bedcount: bed.available_beds,
                        },
                        create: {
                            id: bed.id,
                            total_beds: bed.total_beds,
                            bed_type: bed.bed_type,
                            available_beds: bed.available_beds,
                            price: bed.price,
                            live_bedcount: bed.available_beds,
                           
                        }
                    })),
                },
        
                // Update Doctors
                Doctors: {
                    upsert: doctor.map(doc => ({
                        where: { id: doc.id },
                        update: {
                            name: doc.name,
                            specialization: doc.specialization,
                            qualification: doc.qualification,
                            experience_years: doc.experience_years,
                            availability: doc.availability,
                            contact_info: doc.contact_info  ,
                        },
                        create: {
                            id: doc.id,
                            name: doc.name,
                            specialization: doc.specialization,
                            qualification: doc.qualification,
                            experience_years: doc.experience_years,
                            availability: doc.availability,
                            contact_info: doc.contact_info,
                            
                        }
                    })),
                },
        
                // Update MedicalEquipments
                MedicalEquipments: {
                    upsert: medicalEquipment.map(equipment => ({
                        where: { id: equipment.id },
                        update: {
                            equipment_name: equipment.equipment_name,
                            equipment_type: equipment.equipment_type,
                            availability: equipment.availability,
                            certification_status: equipment.certification_status,
                        },
                        create: {
                            id: equipment.id,
                            equipment_name: equipment.equipment_name,
                            equipment_type: equipment.equipment_type,
                            availability: equipment.availability,
                            certification_status: equipment.certification_status,
                            
                        }
                    })),
                },
        
                // Update Services
                Services: {
                    upsert: service.map(s => ({
                        where: { id: s.id },
                        update: {
                            service_name: s.service_name,
                            service_description: s.service_description,
                            availability: s.availability,
                        },
                        create: {
                            id: s.id,
                            service_name: s.service_name,
                            service_description: s.service_description,
                            availability: s.availability,
                            
                        }
                    })),
                },
        
                // Update Insurances
                Insurances: {
                    upsert: insurance.map(ins => ({
                        where: { id: ins.id },
                        update: {
                            insurance_company: ins.insurance_company,
                            contact_info: ins.contact_info,
                            insurance_type_id: ins.insurance_type_id,
                            cashless: ins.cashless,
                        },
                        create: {
                            id: ins.id,
                            insurance_company: ins.insurance_company,
                            contact_info: ins.contact_info,
                            insurance_type_id: ins.insurance_type_id,
                            cashless: ins.cashless,
                        }
                    })),
                },

                HealthPackages: {
                    upsert: healthPackages.map(hp => ({
                        where: { id: hp.id },
                        update: {
                            package_name: hp.package_name,
                            package_description: hp.package_description,
                            package_price: hp.package_price,
                        },
                        create: {
                            id: hp.id,
                            package_name: hp.package_name,
                            package_description: hp.package_description,
                            package_price: hp.package_price,
                            
                        }
                    })),
                },
            },
        });
        

        // Respond with the updated entities
        res.json({
            updatedHospital,
            // updatedBedInfo,
            // updatedDoctor,
            // updatedInsurance,
            // updatedHealthPackages,
            // updatedMedicalEquipment,
            // updatedService
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

        // if (hospitalToDelete.mainImage) {
        //     const publicId = hospitalToDelete.mainImage.split('/').pop().split('.')[0]; 
        //     await deleteImage(publicId);
        // }

        // for (const image of hospitalToDelete.subImages) {
        //     const publicId = image.split('/').pop().split('.')[0];
        //     await deleteImage(publicId);
        // }

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

const loginHospital = asyncHandler(async (req, res) => {
    const { hospital_id, password } = req.body;
  
    if (!hospital_id) {
      throw new ApiError(400, "Hospital ID is required");
    }
  
    // Find the hospital login details based on the hospital_id
    const hospitalLogin = await prisma.hospitalLogin.findFirst({
      where: {  hospital_id : hospital_id, password: password}
    });
  
    if (!hospitalLogin) {
      throw new ApiError(404, "Hospital does not exist");
    }
  
 
    // const isPasswordValid = await isPasswordCorrect(hospitalLogin, password);
  
    // if (!isPasswordValid) {
    //   throw new ApiError(401, "Invalid hospital credentials");
    // }
  
    // Generate access and refresh tokens for the hospital
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(hospitalLogin.id);
  
    // Retrieve hospital details for the response
    const loggedInHospital = await prisma.hospitalLogin.findUnique({
      where: { id: hospitalLogin.id }
    });
  
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "lax"
    };
  
    // Send the tokens via cookies
    res.cookie("accessToken", accessToken);
    
    return res.status(200).json(
      new ApiResponse(
        200,
        { hospital: loggedInHospital, accessToken, refreshToken },
        "Hospital logged in successfully"
      )
    );
  });
  



export { createHospital, getAllHospitals, getHospitalById, updateHospital, deleteHospital, loginHospital } ;