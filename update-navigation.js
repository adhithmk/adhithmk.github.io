const fs = require('fs');
const path = require('path');

// The navigation menu HTML from index.html
const newNav = `
  <nav class="navbar">
    <div class="nav-container">
      <a href="index.html" class="logo">Adhith M K</a>
      <button class="mobile-menu-toggle" aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <ul class="nav-links">
        <li><a href="index.html" class="nav-link"><i class="fas fa-home"></i> Home</a></li>
        <li><a href="research.html" class="nav-link"><i class="fas fa-flask"></i> Research</a></li>
        <li><a href="education.html" class="nav-link"><i class="fas fa-graduation-cap"></i> Education</a></li>
        <li><a href="certifications-awards.html" class="nav-link"><i class="fas fa-award"></i> Certifications</a></li>
        <li><a href="field-work.html" class="nav-link"><i class="fas fa-mountain"></i> Field Work</a></li>
        <li><a href="blog.html" class="nav-link"><i class="fas fa-blog"></i> Blog</a></li>
        <li><a href="contact.html" class="nav-link"><i class="fas fa-envelope"></i> Contact</a></li>
      </ul>
    </div>
  </nav>`;

// Function to update navigation in a file
function updateNavigationInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Determine which page this is for the active class
    const pageName = path.basename(filePath, '.html');
    let updatedNav = newNav;
    
    // Set the active class for the current page
    if (pageName !== 'index') {
      updatedNav = updatedNav.replace(
        `href="${pageName}.html" class="nav-link"`,
        `href="${pageName}.html" class="nav-link active"`
      );
    } else {
      updatedNav = updatedNav.replace(
        'href="index.html" class="nav-link"',
        'href="index.html" class="nav-link active"'
      );
    }
    
    // Replace the navigation section
    const navRegex = /<nav[\s\S]*?<\/nav>/;
    const updatedContent = content.replace(navRegex, updatedNav);
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`Updated navigation in ${filePath}`);
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// List of HTML files to update
const htmlFiles = [
  'index.html',
  'research.html',
  'education.html',
  'certifications-awards.html',
  'field-work.html',
  'blog.html',
  'contact.html'
];

// Process each file
htmlFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    updateNavigationInFile(filePath);
  } else {
    console.warn(`File not found: ${filePath}`);
  }
});

console.log('Navigation update complete!');
