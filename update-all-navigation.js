const fs = require('fs');
const path = require('path');

// Function to update navigation in a single HTML file
function updateNavigationInFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if the file already has the Certifications link
        if (content.includes('href="certifications.html"')) {
            console.log(`Skipping ${filePath} - already has Certifications link`);
            return;
        }
        
        // Pattern to find the navigation menu
        const navPattern = /(<nav[^>]*>)([\s\S]*?<div[^>]*nav-links[^>]*>)([\s\S]*?)(<\/div>[\s\S]*?<\/nav>)/i;
        const match = content.match(navPattern);
        
        if (match) {
            const [fullMatch, navStart, navDivStart, navLinks, navEnd] = match;
            
            // Skip if already has Certifications link
            if (navLinks.includes('href="certifications.html"')) {
                console.log(`Skipping ${filePath} - already has Certifications link`);
                return;
            }
            
            // Create the new navigation HTML with Certifications link
            const newNavLinks = navLinks.replace(
                /(<a[^>]*href=["']contact.html["'][^>]*>Contact<\/a>)/i,
                (match) => {
                    return `<a href="certifications.html">Certifications</a>\n                        ${match}`;
                }
            );
            
            // Replace the old navigation with the updated one
            const updatedContent = content.replace(
                navPattern,
                `$1$2${newNavLinks}$4`
            );
            
            // Write the updated content back to the file
            fs.writeFileSync(filePath, updatedContent, 'utf8');
            console.log(`Updated navigation in ${filePath}`);
        } else {
            console.log(`No navigation found in ${filePath}`);
        }
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
    }
}

// Function to find all HTML files in the directory
function updateNavigationInAllHTMLFiles(directory) {
    const files = fs.readdirSync(directory);
    
    files.forEach(file => {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            // Skip node_modules and other directories
            if (file !== 'node_modules' && !file.startsWith('.')) {
                updateNavigationInAllHTMLFiles(filePath);
            }
        } else if (file.endsWith('.html') && file !== 'certifications.html') {
            updateNavigationInFile(filePath);
        }
    });
}

// Start updating navigation in all HTML files
const rootDir = __dirname;
console.log('Starting navigation update...');
updateNavigationInAllHTMLFiles(rootDir);
console.log('Navigation update complete!');
