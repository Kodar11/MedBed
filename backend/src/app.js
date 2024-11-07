import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cors());

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

// export const notifications = {}; // In-memory storage for notifications, using hospital_id as the key

// // Endpoint to receive data from the webhook
// app.post("/notify", (req, res) => {
//     const { data, database } = req.body; // Destructure the incoming data and database index

//     // Store the incoming notification in memory
//     Object.keys(data).forEach(hospital_id => {
//         // Update notifications only if there's new data, otherwise, retain the existing value
//         notifications[hospital_id] = data[hospital_id] || notifications[hospital_id];
//     });

//     console.log(`Received notification for database ${database}. Updated counters:`, notifications);

//     res.status(200).send({ message: "Notification received and stored" });
// });

// // Endpoint to get available beds and reservation counts
// app.get('/api/hospitals/available-beds', async (req, res) => {
//     try {
//         // Create a new object to hold updated notifications
//         const updatedNotifications = {};

//         // Loop through the notifications and get reservation counts
//         for (const hospital_id in notifications) {
//             // Fetch the number of reservations for this hospital
//             const reservationCount = await prisma.bedReservation.count({
//                 where: {
//                     hospitalId: hospital_id,
//                 },
//             });

//             // Get the current available bed count from the notifications
//             const availableBeds = notifications[hospital_id].available_beds || 0; // Default to 0 if not defined

//             // Subtract the reservation count from the available beds and store the result
//             updatedNotifications[hospital_id] = {
//                 availableBeds: availableBeds - reservationCount, // Subtract reservations from available beds
//                 reservations: reservationCount, // Add reservation count for reference
//             };
//         }

//         // Send the updated notifications object as JSON response
//         res.status(200).json(updatedNotifications);
//     } catch (error) {
//         console.error('Error fetching available beds and reservations:', error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// });


// const logNotifications = () => {
//     setInterval(() => {
//         console.log("Current notifications:", JSON.stringify(notifications, null, 2)); // Pretty-print the notifications
//     }, 10000); // Log every 10 seconds
// };

// // Call the logging function at the start of your server or wherever appropriate
// logNotifications();

// Starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export { app };
