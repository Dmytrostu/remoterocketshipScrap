import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import Job from "./model/Job.mjs";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Setup// Allow requests from your frontend URL
const allowedOrigins = [
    "https://remoterocketshipscrap.onrender.com/", // Replace with your actual frontend URL
];

app.use(
    cors()
);
app.use(helmet());  // Secure HTTP headers
app.use(morgan('combined'));  // Log HTTP requests

// Body Parser Middleware for JSON requests
app.use(express.json());  // Allows the server to accept JSON data
app.use(express.urlencoded({ extended: true }));  // Handle form data

// API route to fetch jobs
app.get("/api/jobs", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
        const skip = (page - 1) * limit;

        const totalJobs = await Job.countDocuments({ hidden: { $ne: true } });

        // Use indexes to optimize query performance
        const jobs = await Job.find({ hidden: { $ne: true } })
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(limit)
            .lean(); // Use `.lean()` for faster queries (returns plain JS objects, not Mongoose documents)

        res.json({ jobs, totalJobs });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
});


// API route to hide a job
app.post("/api/jobs/hide/:id", async (req, res, next) => {
    try {
        const jobId = req.params.id;
        await Job.findOneAndUpdate({ id: jobId }, { hidden: true });
        res.json({ message: `Job ${jobId} hidden successfully` });
    } catch (error) {
        next(error);  // Pass error to centralized error handler
    }
});

// Serve index.html for all other routes (SPA support)
// app.get("*", (req, res) => {
//     res.sendFile(path.join(process.cwd(), "public", "index.html"));
// });
// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("MongoDB connected.");
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);  // Exit the process if the connection fails
    });
