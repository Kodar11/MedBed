import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js'; 
import { asyncHandler } from "../utils/asyncHandler.js";

const prisma = new PrismaClient();

const getDirections = (currentLocation, hospitalAddress) => {
    
    return `Directions from ${currentLocation} to ${hospitalAddress}`;
};

// Get user view
const getUserView = asyncHandler(async (req, res) => {
    const { userId, currentLocation } = req.query;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                insurance: true, 
            }
        });

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

       
        const hospitals = await prisma.hospital.findMany({
            include: {
                BedInfos: true,
                Ambulances: true,
            },
        });


        const response = hospitals.map(hospital => {
            const availableBeds = hospital.BedInfos.reduce((total, bedInfo) => total + bedInfo.available_beds, 0);
            const ambulanceContacts = hospital.Ambulances.map(ambulance => ambulance.contact_info).filter(Boolean);

            return {
                hospitalId: hospital.id,
                name: hospital.name,
                address: hospital.address,
                availableBeds,
                ambulanceContacts,
                directions: getDirections(currentLocation, hospital.address) 
            };
        });

        res.json(new ApiResponse(200, response, 'User view fetched successfully'));
    } 
    catch (error) 
    {
        if (error instanceof ApiError) 
        {
            res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
        } 
        else 
        {
            console.error('Error fetching user view:', error);
            res.status(500).json(new ApiResponse(500, null, 'An error occurred while fetching data'));
        }
    }
});

export { getUserView };
