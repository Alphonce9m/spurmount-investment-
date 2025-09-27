// Function to include HTML files
function includeHTML() {
    const elements = document.querySelectorAll('[data-include-html]');
    
    elements.forEach(element => {
        const file = element.getAttribute('data-include-html');
        if (file) {
            fetch(file)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(html => {
                    element.outerHTML = html;
                    // Re-initialize any components that might be in the included HTML
                    initializeComponents();
                })
                .catch(error => {
                    console.error(`Error including ${file}:`, error);
                });
        }
    });
}

// Initialize components after including HTML
function initializeComponents() {
    // Initialize mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navLinks && !navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close mobile menu when clicking on a link
    const navLinksList = document.querySelectorAll('.nav-links a');
    navLinksList.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks) {
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Update current year in footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Update price alert count
    updatePriceAlertCount();
}

// Function to update price alert count
function updatePriceAlertCount() {
    const alerts = JSON.parse(localStorage.getItem('priceAlerts') || '[]');
    const countElement = document.getElementById('priceAlertCount');
    if (countElement) {
        countElement.textContent = alerts.length;
        countElement.style.display = alerts.length > 0 ? 'flex' : 'none';
    }
}

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Include HTML files
    includeHTML();
    
    // Initialize components
    initializeComponents();
    
    // Back to Top Button
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.style.display = 'flex';
            } else {
                backToTopButton.style.display = 'none';
            }
        });
        
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
