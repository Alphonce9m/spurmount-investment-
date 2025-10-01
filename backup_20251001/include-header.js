// Function to include header in all pages
document.addEventListener('DOMContentLoaded', function() {
    // Create header container
    const headerContainer = document.createElement('div');
    headerContainer.id = 'header-container';
    
    // Insert at the beginning of the body
    document.body.insertBefore(headerContainer, document.body.firstChild);
    
    // Fetch and insert header
    fetch('partials/header.html')
        .then(response => response.text())
        .then(html => {
            headerContainer.innerHTML = html;
            // Reinitialize any header-related scripts
            if (typeof initHeader === 'function') {
                initHeader();
            }
        })
        .catch(error => {
            console.error('Error loading header:', error);
            headerContainer.innerHTML = '<div class="error">Error loading navigation. Please refresh the page.</div>';
        });
});
