import express from "express";
import mongoose from "mongoose";
import Job from "../model/Job.mjs";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Serve static files
app.use(express.static("public"));

// API route to fetch jobs
app.get("/api/jobs", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
        const skip = (page - 1) * limit;

        const jobs = await Job.find({ hidden: { $ne: true } })
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(limit);

        res.json({ jobs });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
});

// API route to hide jobs
app.post("/api/jobs/hide/:id", async (req, res) => {
    try {
        const jobId = req.params.id;
        await Job.findOneAndUpdate({ id: jobId }, { hidden: true });
        res.json({ message: `Job ${jobId} hidden successfully` });
    } catch (error) {
        console.error("Error hiding job:", error);
        res.status(500).json({ error: "Failed to hide job" });
    }
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected."))
.catch(err => console.error("MongoDB connection error:", err));

// Export Express app as a serverless function
export default app;
