// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import axios from "axios"; // For sending HTTP requests

// dotenv.config();

// const app = express();

// const HOSPITAL_ID = "1234";
// let lastCounterValue = null; // To store the last known value of the counter

// const connectDB = async () => {
//     try {
//         const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
//         console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
//     } catch (error) {
//         console.log("MONGODB connection FAILED ", error);
//         process.exit(1);
//     }
// };

// const bedCountSchema = new mongoose.Schema({
//     hospital_id: { type: String, required: true },
//     counter: { type: Number, required: true },
//     // You can add other fields as needed
// });

// // Register the schema as a model
// const BedCount = mongoose.model("BedCount", bedCountSchema);

// // Function to poll the database
// const pollDatabase = async () => {
//     try {
//         const hospital = await mongoose.model("BedCount").findOne({ hospital_id: HOSPITAL_ID });
//         if (hospital) {
//             if (lastCounterValue === null) {
//                 // Initialize with the first value if not set yet
//                 lastCounterValue = hospital.counter;
//             } else if (hospital.counter !== lastCounterValue) {
//                 console.log(`Counter changed for hospital ${HOSPITAL_ID}! New value: ${hospital.counter}`);
//                 lastCounterValue = hospital.counter; // Update the last known value
//                 console.log(lastCounterValue);
                
//                 // Hit the other server on localhost:3000 when the counter changes
//                 await axios.post("http://localhost:3002/notify", {
//                     hospital_id: HOSPITAL_ID,
//                     new_counter: hospital.counter
//                 });
//                 console.log("Notification sent to localhost:3000");
//             }
//             else{
//                 console.log("Counter is not change");
                
//             }
//         }
//     } catch (error) {
//         console.error("Error polling the database:", error);
//     }
// };

// connectDB()
//     .then(() => {
//         // Start the server
//         app.listen(process.env.PORT || 8000, () => {
//             console.log(`⚙️ Server is running at port : ${process.env.PORT}`);

//             // Start polling every 5 seconds (5000 ms)
//             setInterval(pollDatabase, 10000);
//         });
//     })
//     .catch((err) => {
//         console.log("MONGO db connection failed !!! ", err);
//     });


// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import axios from "axios"; // For sending HTTP requests

// dotenv.config();

// const app = express();

// const HOSPITAL_ID = "1234"; // Define your hospital ID
// let lastCounterValues = {}; // Store last known values for each database
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

// // Function to poll a specific database
// const pollDatabase = async (connection, dbIndex) => {
//     try {
//         const BedCount = connection.model("BedCount", bedCountSchema);
//         const hospital = await BedCount.findOne({ hospital_id: HOSPITAL_ID });
        
//         if (hospital) {
//             if (!lastCounterValues[dbIndex]) {
//                 // Initialize with the first value if not set yet
//                 lastCounterValues[dbIndex] = hospital.counter;
//             } else if (hospital.counter !== lastCounterValues[dbIndex]) {
//                 console.log(`Counter changed for hospital ${HOSPITAL_ID} in DB ${dbIndex}! New value: ${hospital.counter}`);
//                 lastCounterValues[dbIndex] = hospital.counter; // Update the last known value

//                 // Hit the other server on localhost:3002 when the counter changes
//                 await axios.post("http://localhost:3002/notify", {
//                     hospital_id: HOSPITAL_ID,
//                     new_counter: hospital.counter,
//                     database: dbIndex,
//                 });
//                 console.log("Notification sent to localhost:3002");
//             } else {
//                 console.log(`Counter is not changed in DB ${dbIndex}`);
//             }
//         }
//     } catch (error) {
//         console.error(`Error polling the database ${dbIndex}:`, error);
//     }
// };

// // Function to start polling for all databases
// const startPolling = (dbCount) => {
//     setInterval(() => {
//         connections.forEach((connection, index) => {
//             pollDatabase(connection, index + 1); // Poll each database
//         });
//     }, 10000); // Adjust the interval as needed
// };

// const startWebhookServer = async () => {
//     // Connect to multiple databases
//     const db1 = await connectDB(process.env.MONGODB_URI_1);
//     const db2 = await connectDB(process.env.MONGODB_URI_2);
//     // Add more as needed

//     // Start the server
//     app.listen(process.env.PORT || 8000, () => {
//         console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
//         startPolling(2); // Adjust the number of databases as needed
//     });
// };

// startWebhookServer()
//     .catch((err) => {
//         console.log("MONGO db connection failed !!! ", err);
//     });

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios"; // For sending HTTP requests

dotenv.config();

const app = express();

let lastCounterValues = {}; // Store last known values for each hospital in all databases
let connections = []; // Store connection instances

// Function to connect to a specific database
const connectDB = async (uri) => {
    try {
        const connectionInstance = await mongoose.createConnection(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.host}`);
        connections.push(connectionInstance); // Store the connection instance

        return connectionInstance;
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1);
    }
};

// Define the BedCount schema
const bedCountSchema = new mongoose.Schema({
    hospital_id: { type: String, required: true },
    counter: { type: Number, required: true },
});

// Function to poll all databases and check if any field has changed
const pollDatabases = async () => {
    let hasChanged = false; // Track if any counter has changed
    const updatedCounters = {}; // To store all the hospital_id and counter pairs across all databases

    try {
        // Iterate over all the database connections
        for (const connection of connections) {
            const BedCount = connection.model("BedCount", bedCountSchema);
            const hospitals = await BedCount.find(); // Get all hospitals in this database

            hospitals.forEach((hospital) => {
                // Initialize lastCounterValues for this hospital if not present
                if (!lastCounterValues[hospital.hospital_id]) {
                    lastCounterValues[hospital.hospital_id] = hospital.counter;
                }

                // Check for changes in the counter
                if (lastCounterValues[hospital.hospital_id] !== hospital.counter) {
                    hasChanged = true; // Mark that a change has occurred
                    lastCounterValues[hospital.hospital_id] = hospital.counter; // Update the last known value
                }

                // Store the latest counter for this hospital
                updatedCounters[hospital.hospital_id] = hospital.counter;
            });
        }

        // If any field has changed, send all values (not just the changed ones)
        if (hasChanged) {
            console.log(`Counters changed! Sending all values:`, updatedCounters);

            // Send the updated data to the other server
            await axios.post("http://localhost:3000/api/v1/users/notify", {
                data: updatedCounters, // Send the entire map of hospital_id: counter
            });

            console.log("Notification sent to localhost:3000 with all updated data");
        } else {
            console.log("No changes detected");
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
    // Connect to multiple databases
    await connectDB(process.env.MONGODB_URI_1);
    await connectDB(process.env.MONGODB_URI_2);
    // Add more as needed

    // Start the server
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
        startPolling(); // Start polling all databases
    });
};

startWebhookServer()
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    });
