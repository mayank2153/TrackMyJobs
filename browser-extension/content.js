// Extract job data from the Indeed page
function extractJobFromIndeed() {
  console.log("Extracting job data");
  const jobTitleElement = document.querySelector('.ia-JobHeader-title');
  const companyElement = document.querySelector('.css-vorqyc.e1wnkr790');
  console.log("jobTitleElement:", jobTitleElement);
  console.log("companyElement:", companyElement);
  
  if (jobTitleElement && companyElement) {
    const jobData = {
      profile: jobTitleElement.innerText.trim(),
      company: companyElement.innerText.trim(),
      jobPortal: "Indeed"
    };
    
    console.log("Job Data Extracted:", jobData);
    return jobData;
  } else {
    console.error("Failed to extract job data. Check element selectors.");
    return null;
  }
}

// Create and show the confirmation popup
function showConfirmationPopup(jobData) {
  // Create modal container
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  `;

  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    max-width: 400px;
  `;

  // Add job details to modal
  modalContent.innerHTML = `
    <h2>Job Application Detected</h2>
    <p>We've detected the following job application details:</p>
    <p><strong>Job Title:</strong> ${jobData.profile}</p>
    <p><strong>Company:</strong> ${jobData.company}</p>
    <p><strong>Job Portal:</strong> ${jobData.jobPortal}</p>
    <p>Do you want to save these details to track your application?</p>
    <button id="confirmYes" style="margin-right: 10px;">Yes, Save Details</button>
    <button id="confirmNo">No, Don't Save</button>
  `;

  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Handle user's choice
  return new Promise((resolve) => {
    document.getElementById('confirmYes').addEventListener('click', () => {
      document.body.removeChild(modal);
      resolve(true);
    });

    document.getElementById('confirmNo').addEventListener('click', () => {
      document.body.removeChild(modal);
      resolve(false);
    });
  });
}

// Handle job data extraction and confirmation
// Handle job data extraction and confirmation
async function handleJobDataExtraction() {
  console.log("Extracting job data...");
  const jobData = extractJobFromIndeed();
  
  if (jobData) {
    // Use built-in browser confirmation instead of custom modal
    const confirmed = window.confirm(`Job Application Detected\n\nWe've detected the following job application details:\n\nJob Title: ${jobData.profile}\nCompany: ${jobData.company}\nJob Portal: ${jobData.jobPortal}\n\nDo you want to save these details to track your application?`);
    
    if (confirmed) {
      console.log("User confirmed. Sending job data to background script...");
      if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage({ type: 'SAVE_JOB_DATA', jobData: jobData }, (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error sending message:", chrome.runtime.lastError);
          } else {
            console.log("Background script response:", response);
          }
        });
      } else {
        console.error("Chrome runtime API not available. Check extension permissions.");
      }
    } else {
      console.log("User cancelled. Job data not sent.");
    }
  } else {
    console.error("No job data to send.");
  }
}


// Check if we're on the correct page and run the script
function checkAndRunScript() {
  console.log("Checking current URL:", window.location.href);
  if (window.location.href.includes("smartapply.indeed.com/beta/indeedapply/form/review")) {
    console.log("Indeed job review page detected.");
    handleJobDataExtraction();
  } else {
    console.log("Not on the correct Indeed job review page.");
  }
}

// Function to observe URL changes
function observeUrlChanges() {
  let lastUrl = location.href; 
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      console.log('URL changed to', url);
      checkAndRunScript();
    }
  }).observe(document, {subtree: true, childList: true});
}

// Run the script when the page loads
window.addEventListener('load', () => {
  console.log("Page loaded. Running initial checks.");
  checkAndRunScript();
  observeUrlChanges();
});

// Also run the script immediately in case the page is already loaded
console.log("Script initialized. Running initial checks.");
checkAndRunScript();
observeUrlChanges();