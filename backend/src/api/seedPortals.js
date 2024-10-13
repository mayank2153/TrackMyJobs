import mongoose from "mongoose";
import { Portal } from "../models/portal.schema.js";  
import ConnectDB from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();  // This will load variables from .env into process.env


// Array of top 10 job portals
const jobPortals = [
    "LinkedIn",
    "Indeed",
    "Glassdoor",
    "Monster",
    "Naukri",
    "SimplyHired",
    "AngelList",
    "ZipRecruiter",
    "CareerBuilder",
    "Dice"
];

// Insert portals into database
const insertJobPortals = async () => {
    try {
        ConnectDB()  // Connect to MongoDB

        // Insert the portals into the JobPortal collection
        const insertedPortals = await Portal.insertMany(
            jobPortals.map(portal => ({ name: portal }))
        );

        console.log("Job portals added successfully:", insertedPortals);

        // Disconnect from DB after insertion
        await mongoose.disconnect();
    } catch (error) {
        console.error("Error inserting job portals:", error);
        process.exit(1);
    }
};

// Run the script
insertJobPortals();
