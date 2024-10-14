document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const loggedInDiv = document.getElementById('loggedIn');
    const loggedOutDiv = document.getElementById('loggedOut');
  
    // Check if user is logged in by verifying user token stored in localStorage
    const userToken = localStorage.getItem('userToken');
  
    if (userToken) {
      loggedInDiv.classList.remove('hidden');
    } else {
      loggedOutDiv.classList.remove('hidden');
    }
  
    // Login Button Click - Redirects to your frontend login page
    loginBtn.addEventListener('click', () => {
      chrome.tabs.create({ url: 'http://localhost:5173/login' }); // React frontend login page
    });
  
    // Logout Button Click
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('userToken');
      location.reload(); // Reload popup to reflect logged out state
    });
  });
  