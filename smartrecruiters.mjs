import fetch from "node-fetch"; // Ensure this is installed via `npm install node-fetch`
import { createObjectCsvWriter } from "csv-writer"; // Install via `npm install csv-writer`

const fetchJobs = async (url) => {
  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        cookie: "_gcl_au=1.1.2019111356.1731868692;...", // Ensure cookies are handled appropriately
        Referer: "https://jobs.smartrecruiters.com/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.content || []; // Return jobs or an empty array if none found
  } catch (error) {
    console.error(`Error fetching jobs from ${url}:`, error);
    return [];
  }
};

const get_jobs_from_smartrecruiters = async () => {
  try {
    // Fetch jobs from both URLs
    const urls = [
      "https://jobs.smartrecruiters.com/sr-jobs/search?limit=100&keyword=engineer&locationType=remote",
      "https://jobs.smartrecruiters.com/sr-jobs/search?limit=100&keyword=developer&locationType=remote",
    ];
    
    const [engineerJobs, developerJobs] = await Promise.all(urls.map(fetchJobs));

    // Combine and deduplicate jobs
    const allJobs = [...engineerJobs, ...developerJobs];
    const uniqueJobs = Array.from(
      new Map(allJobs.map((job) => [job.id, job])).values()
    );

    console.log(`Total unique jobs: ${uniqueJobs.length}`);

    // Group jobs into US and non-US categories
    const usJobs = uniqueJobs.filter((job) => job.location?.country?.toLowerCase() === "us");
    const nonUsJobs = uniqueJobs.filter((job) => job.location?.country?.toLowerCase() !== "us");

    // Combine US jobs first, then non-US jobs
    const groupedJobs = [...usJobs, ...nonUsJobs];

    // Create CSV writer
    const csvWriter = createObjectCsvWriter({
      path: "jobs_smartrecruiters.csv", // Output file
      header: [
        { id: "id", title: "Job ID" },
        { id: "name", title: "Job Title" },
        { id: "companyName", title: "Company Name" },
        { id: "companyLogo", title: "Company Logo" },
        { id: "releasedDate", title: "Posted Date" },
        { id: "city", title: "City" },
        { id: "region", title: "Region" },
        { id: "country", title: "Country" },
        { id: "remote", title: "Remote" },
        { id: "shortLocation", title: "Short Location" },
        { id: "applyUrl", title: "Application URL" },
      ],
    });

    // Map job data to CSV structure
    const records = groupedJobs.map((job) => ({
      id: job.id,
      name: job.name,
      companyName: job.company?.name || "",
      companyLogo: job.company?.logo || "",
      releasedDate: job.releasedDate,
      city: job.location?.city || "",
      region: job.location?.region || "",
      country: job.location?.country || "",
      remote: job.location?.remote || false,
      shortLocation: job.shortLocation || "",
      applyUrl: job.applyUrl || "",
    }));

    // Write records to CSV
    await csvWriter.writeRecords(records);
    console.log("Jobs data has been written to jobs_smartrecruiters.csv successfully!");
  } catch (error) {
    console.error("Error processing jobs data:", error);
  }
};

export default get_jobs_from_smartrecruiters;
