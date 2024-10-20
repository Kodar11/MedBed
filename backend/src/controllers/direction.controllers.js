import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const checkLocationSet = async (req, res) => {
    const { id } = req.body;

    try {
        const location = await prisma.location.findUnique({
            where: {
                id: id,
            },
        });

        if (location) {
            return res.status(200).json({ message: 'Location already set', location });
        } else {
            return res.status(404).json({ message: 'Location not set' });
        }
    }
    catch (error) {
        console.error('Error checking if location is set:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const storeEndLocation = async (req, res) => {
    const { id, end } = req.body;

    if (!end) {
        return res.status(400).json({ error: 'End location must be provided' });
    }

    try {
        const newLocation = await prisma.location.create({
            data: {
                id: id,
                name: end,
                
            },
        });

        return res.status(201).json(newLocation);
    } catch (error) {
        console.error('Error storing end location:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


const getLocationById = async (req, res) => {
    const { id } = req.params;

    try {
        const location = await prisma.location.findUnique({
            where: {
                id: id,
            },
        });

        if (!location) {
            return res.status(404).json({ error: 'Location not found' });
        }

        return res.status(200).json(location);
    }
    catch (error) {
        console.error('Error fetching location by id:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export { storeEndLocation, getLocationById, checkLocationSet };
