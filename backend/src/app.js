import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes import
import userRouter from './routes/user.routes.js';
import hospitalRouter from './routes/hospital.routes.js';
import userviewRouter from './routes/userview.routes.js';
import directionRouter from './routes/direction.routes.js';



// Routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/hospitals", hospitalRouter);
app.use("/api/v1/userview", userviewRouter);
app.use('/api/v1/direction', directionRouter);



let bedAvailability = new Map([
    ['25e46e6f-ebf5-401d-bf05-afce0f0da30b', 10],
    ['2ab549f5-6dcb-4e17-aae3-260ec45d5c51', 5],  // Hospital ID 2 has 5 available beds
    ['6f8b1403-4345-43a3-8731-0276cf4f23ff', 20], // Hospital ID 3 has 20 available beds
    ['73ea5d08-53f6-44d7-9667-e264085afeb8', 1],  // Hospital ID 4 has 0 available beds
    ['cb75c0f7-834a-4229-a9b0-aab2224e5952', 15]  // Hospital ID 5 has 15 available beds
]);

// Endpoint to get available beds for a specific hospital   
app.get('/api/hospitals/:id/available-beds', (req, res) => {
    const id = req.params.id; // Extract the hospital ID from the URL

    // Check if the ID exists in the Map
    if (!bedAvailability.has(id)) {
        return res.status(404).send(`Hospital ID ${id} not found.`);
    }

    // Send the available beds count as a response
    const availableBeds = bedAvailability.get(id);
    res.json({ availableBeds }); // Respond with JSON format
});

// Endpoint to increment the available beds for a specific hospital
app.post('/api/hospitals/:id/increment-beds', (req, res) => {
    const id = req.params.id; // Extract the hospital ID from the URL

    // Check if the ID exists in the Map
    if (!bedAvailability.has(id)) {
        return res.status(404).send(`Hospital ID ${id} not found.`);
    }

    // Increment the available beds for this specific hospital
    let currentBeds = bedAvailability.get(id);
    bedAvailability.set(id, currentBeds + 1);

    // Send a response with the updated available beds value
    res.send(`Available beds for Hospital ID ${id} have been incremented. Current value: ${bedAvailability.get(id)}`);
});

// Endpoint to decrement the available beds for a specific hospital
app.post('/api/hospitals/:id/decrement-beds', (req, res) => {
    const id = req.params.id; // Extract the hospital ID from the URL

    // Check if the ID exists in the Map
    if (!bedAvailability.has(id)) {
        return res.status(404).send(`Hospital ID ${id} not found.`);
    }

    // Decrement the available beds for this specific hospital
    let currentBeds = bedAvailability.get(id);
    // Ensure the bed count does not go below 0
    if (currentBeds > 0) {
        bedAvailability.set(id, currentBeds - 1);
    } else {
        return res.status(400).send(`Available beds for Hospital ID ${id} cannot be less than 0.`);
    }

    // Send a response with the updated available beds value
    res.send(`Available beds for Hospital ID ${id} have been decremented. Current value: ${bedAvailability.get(id)}`);
});





// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export { app };
