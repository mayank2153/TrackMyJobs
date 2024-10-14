
function extractJobFromIndeed() {
    const jobTitleElement = document.querySelector('.ia-JobHeader-title');
    const companyElement = document.querySelector('.css-vorqyc.e1wnkr790');
  
    if (jobTitleElement && companyElement) {
      const jobData = {
        profile: jobTitleElement.innerText.trim(),
        company: companyElement.innerText.trim(),
        jobPortal: "Indeed"
      };
  
      console.log("Job Data Extracted:", jobData);
      return jobData;
    } else {
      console.error("Failed to extract job data.");
      return null;
    }
  }
  
  function handleSubmitButtonClick() {
    const jobData = extractJobFromIndeed();
    
    if (jobData) {
      chrome.runtime.sendMessage({ type: 'SAVE_JOB_DATA', jobData: jobData }, (response) => {
        console.log("Job data sent to background script:", response);
      });
    }
  }
  
  function attachSubmitListener() {
    const submitButton = document.querySelector('.css-1w423hw.e8ju0x50');
  
    if (submitButton) {
      console.log("Submit button found, attaching event listener.");
      submitButton.addEventListener('click', () => {
        console.log("Submit button clicked, extracting job data...");
        handleSubmitButtonClick();
      });
    } else {
      console.error("Submit button not found.");
    }
  }
  
  if (window.location.href.includes("smartapply.indeed.com/beta/indeedapply/form/review")) {
    console.log("Indeed job review page detected.");
    window.addEventListener('load', () => {
      attachSubmitListener();
    });
  }
  
