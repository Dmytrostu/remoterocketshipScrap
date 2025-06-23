import fetch from 'node-fetch'; // Import fetch module
import fs from 'fs'; 
import { createObjectCsvWriter } from 'csv-writer'; 

export async function fetchJobOpenings(location = "United States") {
  const queryOptions = {
    seniorityFilters: [],
    locationFilters: [location],
    locationUSStatesFilters: [],
    locationCityFilters: [],
    showHybridJobs: false,
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
    excludeIndustriesFilters: [],
    companyIdFilter: null,
    page: 1,
    itemsPerPage: 50,
    sortBy: "DateAdded",
    showOnlySavedJobs: false,
    showOnlyAppliedJobs: false,
    showOnlyHiddenJobs: false,
    savedJobOpeningIds: [],
    appliedJobOpeningIds: [],
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
        "priority": "u=1, i",
        "sec-ch-ua": `"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"`,
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": `"Windows"`,
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "cookie": "ph_phc_nS6oL3AeBB5jlWDYqogsM7HuhPENXrl5fWnJDAfTVbh_posthog=%7B%22distinct_id%22%3A%220193d502-8a84-7bb8-8b8a-b04eee659f5d%22%2C%22%24sesid%22%3A%5B1750695254718%2C%2201979d90-7ed2-7970-beee-a07a79d19e73%22%2C1750695182033%5D%2C%22%24initial_person_info%22%3A%7B%22r%22%3A%22https%3A%2F%2Fwww.google.com%2F%22%2C%22u%22%3A%22https%3A%2F%2Fwww.remoterocketship.com%2Fcompany%2Fneptuneretailsolutions%2Fjobs%2Fphp-software-engineer-backend-api-united-states%22%7D%7D",
        Referer: "https://www.remoterocketship.com/?page=1&sort=DateAdded&locations=United+States",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      method: "GET",  // Ensure the method is GET
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return data.jobOpenings;
  } catch (error) {
    console.error("Error fetching job openings:", error);
    return [];  // Return an empty array in case of error
  }
}

// Example function to fetch and write data to a CSV
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
        employmentType: job.employmentType || 'Not Specified',
        company_name: job.company?.name || 'Not Available',
        company_url: job.company?.homePageURL || '',
        company_linkedin_url: job.company?.linkedInURL || '',
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