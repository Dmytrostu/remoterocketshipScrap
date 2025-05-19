import mongoose from "mongoose";
import Job from "./model/Job.mjs";
import { fetchJobOpenings } from "./remoterocketship.mjs";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGO_URI;

// Function to update the database
const updateDB = async () => {
    try {
        const us_data = await fetchJobOpenings("United States");
        const eu_data = await fetchJobOpenings("Europe");
        console.log(`Fetched ${us_data.length} us job openings.`);
        console.log(`Fetched ${eu_data.length} eu job openings.`);

        const jobs_data = [...us_data, ...eu_data];

        for (const data of jobs_data) {
            console.log(data);
            const job_id = data.id;
            const ex_job = await Job.findOne({ id: job_id }); // Use await here

            if (!ex_job) {
                await Job.create({
                    id: data.id,
                    created_at: data.created_at,
                    roleTitle: data.roleTitle,
                    locationHumanReadableText: data.location,
                    salaryRange: data.salaryRange?.salaryHumanReadableText || 'Not Specified',
                    techStack: data.techStack,
                    employmentType: data.employmentType,
                    company_name: data.company?.name,
                    company_url: data.company?.homePageURL,
                    company_founded: data.company?.foundedYear,
                    company_employee: data.company?.employeeRange,
                    company_pfp: data.company?.profilePicURL,
                    company_linkedin_url: data.company?.linkedInURL,
                    url: data.url,
                }); // Use await to ensure document is inserted properly
                console.log(`Inserted job: ${job_id}`);
            }
        }
        process.exit(0); // Terminate the script
    } catch (error) {
        console.error("Error updating the database:", error);
        process.exit(1); // Terminate the script
    }
};

// Connect to MongoDB and run updateDB **after** successful connection
mongoose
    .connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("MongoDB connected successfully.");
        updateDB(); // Now we call updateDB after DB is connected
    })
    .catch((err) => console.error("MongoDB connection error:", err));
