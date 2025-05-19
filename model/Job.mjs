import mongoose from '../config/db.mjs';

// Define Job Schema
const jobSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  roleTitle: { type: String, required: true },
  url: { type: String, required: true },
  locationHumanReadableText: { type: String, required: true },
  salaryRange: { type: String, required: false },
  techStack: { type: [String], required: false },
  employmentType: { type: String, required: true },
  company_name: { type: String, required: true },
  company_url: { type: String, required: false },
  company_founded: { type: String, required: false },
  company_employee: { type: String, required: false },
  company_pfp: { type: String, required: false },
  company_linkedin_url: { type: String, required: false },
  created_at: { type: Date, default: Date.now },
  hidden: {type: Boolean, default: false},
});

// Create Job model
const Job = mongoose.model("jobs", jobSchema);

export default Job
