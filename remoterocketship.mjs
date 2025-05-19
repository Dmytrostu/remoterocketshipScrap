import fetch from 'node-fetch'; // Use ES module import
import fs from 'fs';
import { createObjectCsvWriter } from 'csv-writer'; // Import the csv-writer package

export async function fetchJobOpenings(location="United States") {
  const queryOptions = {
    seniorityFilters: [],
    locationFilters: [location],
    locationUSStatesFilters: [],
    techStackFilters: [],
    jobTitleFilters: ["Frontend Engineer", "Backend Engineer", "Full-stack Engineer"],
    keywordFilters: [],
    excludedKeywordFilters: [],
    companySizeFilters: [],
    employmentTypeFilters: [],
    visaFilter: null,
    minSalaryFilter: null,
    showJobsWithoutSalaryWithMinSalaryFilter: false,
    degreeRequiredFilter: null,
    industriesFilters: [],
    companyIdFilter: null,
    page: 1,
    itemsPerPage: 50,
    sortBy: "DateAdded",
    showOnlySavedJobs: false,
    showOnlyAppliedJobs: false,
    showOnlyHiddenJobs: false,
    userSubscription: null,
    hiddenJobOpeningIds: [],
    numberOfJobsHiddenInThisSession: 0,
  };

  const queryString = encodeURIComponent(JSON.stringify(queryOptions));
  const apiUrl = `https://www.remoterocketship.com/api/fetch_job_openings?q=${queryString}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        priority: "u=1, i",
        "sec-ch-ua": `"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"`,
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": `"Windows"`,
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        cookie:
          "ph_phc_nS6oL3AeBB5jlWDYqogsM7HuhPENXrl5fWnJDAfTVbh_posthog=%7B%22distinct_id%22%3A%2201945e61-c223-7d69-931d-018d5367440d%22%2C%22%24sesid%22%3A%5B1736750306869%2C%2201945e61-c222-776c-8281-e87efe47740f%22%2C1736750252578%5D%2C%22%24initial_person_info%22%3A%7B%22r%22%3A%22https%3A%2F%2Fwww.google.com%2F%22%2C%22u%22%3A%22https%3A%2F%2Fwww.remoterocketship.com%2F%22%7D%7D",
        Referer:
          "https://www.remoterocketship.com/?page=1&sort=DateAdded&jobTitle=Frontend+Engineer%2CBackend+Engineer%2CFull-stack+Engineer",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return data.jobOpenings;
  } catch (error) {
    console.error("Error fetching job openings:", error);
  }
}

// Call the function
const get_jobs_from_remoterocketship = () => {


  // Fetch and write response to files
  async function fetchDataAndWriteToFile() {
    try {
      // Check if the response is OK
      const us_data = await fetchJobOpenings("United States"); // Parse the JSON data
      const eu_data = await fetchJobOpenings("Europe"); // Parse the JSON data
      const ww_data = await fetchJobOpenings("Worldwide"); // Parse the JSON data
      const data = [...us_data, ...eu_data, ...ww_data];
      // Convert JSON data to CSV format
      const csvWriter = createObjectCsvWriter({
        path: 'jobs_remoterocketship.csv',
        header: [
          { id: 'id', title: 'ID' },
          { id: 'roleTitle', title: 'Role Title' },
          { id: 'url', title: 'Job URL' },
          { id: 'locationHumanReadableText', title: 'Location' },
          { id: 'salaryRange', title: 'Salary Range' },
          { id: 'techStack', title: 'Tech Stack' },
          { id: 'employmentType', title: 'Employment Type' },
          { id: 'company_name', title: 'Company Name' },
          { id: 'company_url', title: 'Company URL' },
          { id: 'company_linkedin_url', title: 'Company LinkedIn' },
          { id: 'created_at', title: 'Created At' },
        ]
      });

      // Transform data for CSV writing
      const csvData = data.map(job => ({
        id: job.id,
        created_at: job.created_at,
        roleTitle: job.roleTitle,
        locationHumanReadableText: job.location,
        salaryRange: job.salaryRange?.salaryHumanReadableText || 'Not Specified',
        techStack: job.techStack?.join(', ') || '',
        employmentType: job.employmentType,
        company_name: job.company?.name,
        company_url: job.company?.homePageURL,
        company_linkedin_url: job.company?.linkedInURL,
        url: job.url,
      }));

      // Write data to a CSV file
      await csvWriter.writeRecords(csvData);
      console.log("Data successfully written to jobs_remoterocketship.csv");

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Execute the function
  fetchDataAndWriteToFile();

}

export default get_jobs_from_remoterocketship