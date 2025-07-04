const fs = require('fs');
const path = require('path');

// The CSS link to add
const navCssLink = '    <link rel="stylesheet" href="css/navigation.css">';

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

// Function to update navigation styles in a file
function updateNavigationStyles(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add the navigation.css link after the last stylesheet link
    if (!content.includes('navigation.css')) {
      // Find the last stylesheet link
      const lastLinkIndex = content.lastIndexOf('</style>') > content.lastIndexOf('<link rel="stylesheet"') ? 
                          content.lastIndexOf('</style>') : content.lastIndexOf('<link rel="stylesheet"');
      
      if (lastLinkIndex !== -1) {
        const insertPosition = content.indexOf('>', lastLinkIndex) + 1;
        content = content.slice(0, insertPosition) + '\n' + navCssLink + content.slice(insertPosition);
      } else {
        // If no stylesheet found, add before </head>
        const headEndIndex = content.indexOf('</head>');
        if (headEndIndex !== -1) {
          content = content.slice(0, headEndIndex) + '\n' + navCssLink + '\n' + content.slice(headEndIndex);
        }
      }
    }
    
    // Save the updated content
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated navigation styles in ${filePath}`);
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Process each HTML file
htmlFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    updateNavigationStyles(filePath);
  } else {
    console.warn(`File not found: ${filePath}`);
  }
});

console.log('Navigation styles update complete!');
