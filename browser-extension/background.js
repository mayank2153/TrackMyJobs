
console.log("in background js")

chrome.storage.local.get(['userId'], function(result) {
  console.log("function ke andar")
  console.log("result:",result)
  if (result.userId) {
    console.log('User is logged in with ID:', result.userId);
    // Proceed with other extension functionalities
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'SAVE_JOB_DATA') {
        const { profile, company, jobPortal } = message.jobData;
    
        console.log('Received job data:', profile, company, jobPortal);
    
        fetch('http://localhost:4000/api/application/add-Application', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId, // Send userId in the body
            jobTitle: profile,
            company: company,
            jobPortal: jobPortal
          })
        })
          .then(response => response.json())
          .then(data => {
            console.log('Job data saved successfully:', data);
            sendResponse({ success: true });
          })
          .catch(error => {
            console.error('Error saving job data:', error);
            sendResponse({ success: false });
          });
    
        return true; 
      }
    });
  } else {
    console.log('User is not logged in.');
    chrome.tabs.create({ url: "http://localhost:5173/login" });
  }
});
  