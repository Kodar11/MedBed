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



// let bedAvailability = new Map([
//     ['4529ad37-43bc-40d1-8653-49ec83783030', 10],
//     ['4afecc49-17e3-46cb-900d-142f1580732f', 5],  // Hospital ID 2 has 5 available beds
//     ['973c2140-fd4a-4518-bb50-2f68aaa35993', 20], // Hospital ID 3 has 20 available beds
//     ['a3cb08f4-1eb9-4408-88de-1fd04ffeb006', 1],  // Hospital ID 4 has 0 available beds
//     ['e449baf0-ad62-465a-b946-3c2399331bd2', 15]  // Hospital ID 5 has 15 available beds
// ]);

// Endpoint to get available beds for a specific hospital   
// app.get('/api/hospitals/:id/available-beds', (req, res) => {
//     const id = req.params.id; // Extract the hospital ID from the URL

//     // Check if the ID exists in the Map
//     if (!bedAvailability.has(id)) {
//         return res.status(404).send(`Hospital ID ${id} not found.`);
//     }

//     // Send the available beds count as a response
//     const availableBeds = bedAvailability.get(id);
//     res.json({ availableBeds }); // Respond with JSON format
// });

// // Endpoint to increment the available beds for a specific hospital
// app.post('/api/hospitals/:id/increment-beds', (req, res) => {
//     const id = req.params.id; // Extract the hospital ID from the URL

//     // Check if the ID exists in the Map
//     if (!bedAvailability.has(id)) {
//         return res.status(404).send(`Hospital ID ${id} not found.`);
//     }

//     // Increment the available beds for this specific hospital
//     let currentBeds = bedAvailability.get(id);
//     bedAvailability.set(id, currentBeds + 1);

//     // Send a response with the updated available beds value
//     res.send(`Available beds for Hospital ID ${id} have been incremented. Current value: ${bedAvailability.get(id)}`);
// });

// // Endpoint to decrement the available beds for a specific hospital
// app.post('/api/hospitals/:id/decrement-beds', (req, res) => {
//     const id = req.params.id; // Extract the hospital ID from the URL

//     // Check if the ID exists in the Map
//     if (!bedAvailability.has(id)) {
//         return res.status(404).send(`Hospital ID ${id} not found.`);
//     }

//     // Decrement the available beds for this specific hospital
//     let currentBeds = bedAvailability.get(id);
//     // Ensure the bed count does not go below 0
//     if (currentBeds > 0) {
//         bedAvailability.set(id, currentBeds - 1);
//     } else {
//         return res.status(400).send(`Available beds for Hospital ID ${id} cannot be less than 0.`);
//     }

//     // Send a response with the updated available beds value
//     res.send(`Available beds for Hospital ID ${id} have been decremented. Current value: ${bedAvailability.get(id)}`);
// });

let notifications = {}; // In-memory storage for notifications, using hospital_id as the key

// Endpoint to receive data from the webhook
app.post("/notify", (req, res) => {
    const { data, database } = req.body; // Destructure the incoming data and database index

    // Store the incoming notification in memory
    Object.keys(data).forEach(hospital_id => {
        notifications[hospital_id] = data[hospital_id]; // Store the latest counter for each hospital
    });

    console.log(`Received notification for database ${database}. Updated counters:`, notifications);

    res.status(200).send({ message: "Notification received and stored" });
});




// Starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export { app };
