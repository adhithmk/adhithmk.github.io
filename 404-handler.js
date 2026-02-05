// Simple 404 handler for static hosting
(function() {
    // Check if this is a 404 page by looking for common 404 indicators
    const is404 = document.title.includes('404') || 
                  document.body.innerText.includes('404') ||
                  document.body.innerText.includes('File not found') ||
                  document.body.innerText.includes('Nothing matches the given URI');
    
    if (is404) {
        // Redirect to custom 404 page if not already there
        if (!window.location.pathname.includes('404.html')) {
            window.location.href = '/404.html';
        }
    }
})();
