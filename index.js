import get_jobs_from_remoterocketship from "./remoterocketship.mjs";
import get_jobs_from_smartrecruiters from "./smartrecruiters.mjs";

export const fetchAllJobs = async () => {
  try {
    // Run both job-fetching functions in parallel
    await Promise.all([
      get_jobs_from_remoterocketship(),
      get_jobs_from_smartrecruiters(),
    ]);

    console.log("Both job-fetching tasks completed successfully!");
  } catch (error) {
    console.error("Error occurred while fetching jobs:", error);
  }
};

// Execute the function
fetchAllJobs();
