// Default admin credentials (in a real application, these should be stored securely)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'  // In a real application, use proper password hashing
};

// Check if admin is logged in
function checkAdminLogin() {
  const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
  
  // Show/hide appropriate elements based on login state
  if (isLoggedIn) {
    document.body.classList.add('admin-logged-in');
    document.getElementById('login-form-container').style.display = 'none';
    document.querySelector('.admin-content').style.display = 'block';
    document.querySelector('.admin-navbar').style.display = 'block';
  } else {
    document.body.classList.remove('admin-logged-in');
    document.getElementById('login-form-container').style.display = 'flex';
    document.querySelector('.admin-content').style.display = 'none';
    document.querySelector('.admin-navbar').style.display = 'none';
    
    // If accessing admin.html directly, redirect to index
    if (window.location.pathname === '/admin.html') {
      window.location.href = 'index.html';
    }
  }
}

// Login form submission
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    // Validate credentials
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // Create session
      sessionStorage.setItem('adminLoggedIn', 'true');
      
      // Update UI
      checkAdminLogin();
    } else {
      showNotification('Invalid username or password', 'error');
    }
  } catch (error) {
    console.error('Login error:', error);
    showNotification('An error occurred during login', 'error');
  }
});

// Show/hide password functionality
document.querySelector('.show-password').addEventListener('click', () => {
  const passwordInput = document.getElementById('password');
  const icon = document.querySelector('.show-password i');
  
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {
    passwordInput.type = 'password';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  }
});

// Notification function
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Logout functionality
function logout() {
  // Clear session storage
  sessionStorage.removeItem('adminLoggedIn');
  
  // Update UI
  checkAdminLogin();
}

// Add event listener for logout button
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', logout);
    }
    
    // Check login state on page load
    checkAdminLogin();
  });
} else {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
  
  // Check login state on page load
  checkAdminLogin();
}
