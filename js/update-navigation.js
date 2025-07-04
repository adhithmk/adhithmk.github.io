// Function to update navigation menu with Certifications link
function updateNavigation() {
    // Get all navigation elements
    const navBars = document.querySelectorAll('.navbar .nav-links');
    
    // Check if navigation exists on the page
    if (navBars.length > 0) {
        navBars.forEach(nav => {
            // Check if Certifications link already exists
            const certLinkExists = Array.from(nav.children).some(
                link => link.textContent.trim() === 'Certifications' || 
                       (link.href && link.href.includes('certifications'))
            );
            
            if (!certLinkExists) {
                // Create Certifications link
                const certLink = document.createElement('a');
                certLink.href = 'certifications.html';
                certLink.textContent = 'Certifications';
                
                // Add active class if on certifications page
                if (window.location.pathname.includes('certifications')) {
                    certLink.classList.add('active');
                }
                
                // Insert before the Contact link if it exists, otherwise append to the end
                const contactLink = Array.from(nav.children).find(
                    link => link.textContent.trim() === 'Contact' || 
                           (link.href && link.href.includes('contact'))
                );
                
                if (contactLink) {
                    nav.insertBefore(certLink, contactLink);
                } else {
                    nav.appendChild(certLink);
                }
            }
            
            // Update active states
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            nav.querySelectorAll('a').forEach(link => {
                link.classList.remove('active');
                const linkPage = link.getAttribute('href');
                if (linkPage && (currentPage === linkPage || 
                    (currentPage === '' && linkPage === 'index.html') ||
                    (currentPage.includes(linkPage.replace('.html', '')) && linkPage !== 'index.html'))) {
                    link.classList.add('active');
                }
            });
        });
    }
}

// Run when DOM is fully loaded
document.addEventListener('DOMContentLoaded', updateNavigation);

// Also run when page is fully loaded in case DOMContentLoaded already fired
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateNavigation);
} else {
    updateNavigation();
}
