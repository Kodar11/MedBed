import { PrismaClient } from '@prisma/client'; 

const prisma = new PrismaClient();


const storeEndLocation = async (req, res) => {
    const { id,end } = req.body;


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
    } 
    catch (error) {
        console.error('Error storing end location:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getLocationById = async (req, res) => {
  const { id } = req.params  ; // Extracting id from request parameters

  try {
      const location = await prisma.location.findUnique({
          where: {
              id: id, // Ensure id is an integer
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

export { storeEndLocation ,getLocationById };