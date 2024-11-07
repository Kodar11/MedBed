
// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import axios from "axios"; // For sending HTTP requests

// dotenv.config();

// const app = express();

// let lastCounterValues = {}; // Store last known values for each hospital in all databases
// let connections = []; // Store connection instances

// // Function to connect to a specific database
// const connectDB = async (uri) => {
//     try {
//         const connectionInstance = await mongoose.createConnection(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//         console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.host}`);
//         connections.push(connectionInstance); // Store the connection instance

//         return connectionInstance;
//     } catch (error) {
//         console.log("MONGODB connection FAILED ", error);
//         process.exit(1);
//     }
// };

// // Define the BedCount schema
// const bedCountSchema = new mongoose.Schema({
//     hospital_id: { type: String, required: true },
//     counter: { type: Number, required: true },
// });

// // Function to poll all databases and check if any field has changed
// const pollDatabases = async () => {
//     let hasChanged = false; // Track if any counter has changed
//     const updatedCounters = {}; // To store all the hospital_id and counter pairs across all databases

//     try {
//         // Iterate over all the database connections
//         for (const connection of connections) {
//             const BedCount = connection.model("BedCount", bedCountSchema);
//             const hospitals = await BedCount.find(); // Get all hospitals in this database

//             hospitals.forEach((hospital) => {
//                 // Initialize lastCounterValues for this hospital if not present
//                 if (!lastCounterValues[hospital.hospital_id]) {
//                     lastCounterValues[hospital.hospital_id] = hospital.counter;
//                 }

//                 // Check for changes in the counter
//                 if (lastCounterValues[hospital.hospital_id] !== hospital.counter) {
//                     hasChanged = true; // Mark that a change has occurred
//                     lastCounterValues[hospital.hospital_id] = hospital.counter; // Update the last known value
//                 }

//                 // Store the latest counter for this hospital
//                 updatedCounters[hospital.hospital_id] = hospital.counter;
//             });
//         }

//         // If any field has changed, send all values (not just the changed ones)
//         if (hasChanged) {
//             console.log(`Counters changed! Sending all values:`, updatedCounters);

//             // Send the updated data to the other server
//             await axios.post("http://localhost:3000/api/v1/users/notify", {
//                 data: updatedCounters, // Send the entire map of hospital_id: counter
//             });

//             console.log("Notification sent to localhost:3000 with all updated data");
//         } else {
//             console.log("No changes detected");
//         }
//     } catch (error) {
//         console.error(`Error polling the databases:`, error);
//     }
// };

// // Function to start polling for all databases
// const startPolling = () => {
//     setInterval(() => {
//         pollDatabases(); // Poll all databases for changes
//     }, 1); // Adjust the interval as needed
// };

// const startWebhookServer = async () => {
//     // Connect to multiple databases
//     await connectDB(process.env.MONGODB_URI_1);
//     await connectDB(process.env.MONGODB_URI_2);
//     // Add more as needed

//     // Start the server
//     app.listen(process.env.PORT || 8000, () => {
//         console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
//         startPolling(); // Start polling all databases
//     });
// };

// startWebhookServer()
//     .catch((err) => {
//         console.log("MONGO db connection failed !!! ", err);
//     });


import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import axios from "axios"
import mongoose from "mongoose"



dotenv.config();

const app = express();

app.use(cors());

let lastCounterValues = {}; // Store last known values for each hospital in all databases
let connections = []; // Store connection instances
let databaseStatus = []; // Track database status for each connection

// Function to connect to a specific database
const connectDB = async (uri, dbIndex) => {
    try {
        const connectionInstance = await mongoose.createConnection(uri);
        console.log(`\n MongoDB connected! DB HOST: ${connectionInstance.host}`);
        connections.push({ connection: connectionInstance, dbIndex }); // Store the connection instance and index
        databaseStatus[dbIndex] = true; // Mark the database as up

        return connectionInstance;
    } catch (error) {
        // console.log(`MONGODB connection FAILED for URI: ${uri}`, error);
        databaseStatus[dbIndex] = false; // Mark the database as down
    }
};

// Define the BedCount schema
const bedCountSchema = new mongoose.Schema({
    hospital_id: { type: String, required: true },
    counter: { type: Number, required: true },
});

// Function to poll all databases and check if any field has changed
const pollDatabases = async () => {
    let updatedCounters = {}; // To store all the hospital_id and counter pairs across all databases

    try {
        for (const { connection, dbIndex } of connections) {
            if (!databaseStatus[dbIndex] || connection.readyState !== 1) {
                // console.log(`Database ${dbIndex} is down. Adding placeholders for hospitals in this database.`);

                // Replace counts with `1000` for hospitals associated with the downed database
                if(dbIndex == 1){
                    updatedCounters[10001] = 1000;
                    continue;
                }
                if(dbIndex == 2){
                    updatedCounters[10002] = 1000;
                    continue;
                }
            }

            const BedCount = connection.model("BedCount", bedCountSchema);
            const hospitals = await BedCount.find(); // Get all hospitals in this database

            hospitals.forEach((hospital) => {
                if (!lastCounterValues[hospital.hospital_id]) {
                    lastCounterValues[hospital.hospital_id] = hospital.counter;
                }

                if (lastCounterValues[hospital.hospital_id] !== hospital.counter) {
                    lastCounterValues[hospital.hospital_id] = hospital.counter; // Update the last known value
                }

                updatedCounters[hospital.hospital_id] = hospital.counter;
            });
        }

        // If all databases are down, replace all entries with 1000
        if (connections.every((_, index) => !databaseStatus[index + 1])) {
            console.log("All databases are down. Sending placeholder values for all hospitals.");
            Object.keys(updatedCounters).forEach((key) => {
                updatedCounters[key] = 1000;
            });
        }

        // Send data to the main server
        if (Object.keys(updatedCounters).length > 0) {
            console.log(`Updated counters:`, updatedCounters);
            await axios.post("https://medbed.onrender.com/api/v1/users/notify", {
                data: updatedCounters, // Send the updated data with placeholders as needed
            });
            // console.log("Notification sent to localhost:3000 with updated data.");
        } else {
            // console.log("No changes detected.");
        }
    } catch (error) {
        console.error(`Error polling the databases:`, error);
    }
};

// Function to start polling for all databases
const startPolling = () => {
    setInterval(() => {
        pollDatabases(); // Poll all databases for changes
    }, 10000); // Adjust the interval as needed
};

const startWebhookServer = async () => {
    await connectDB(process.env.MONGODB_URI_1, 1);
    await connectDB(process.env.MONGODB_URI_2, 2);
    // Add more as needed with unique indices

    // Start the server
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port: ${process.env.PORT}`);
        startPolling(); // Start polling all databases
    });
};

startWebhookServer().catch((err) => {
    console.log("MONGO db connection failed!", err);
});
