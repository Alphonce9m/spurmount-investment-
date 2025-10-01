// enhancements.js - Modern interactive features for SpurMount Wholesale

document.addEventListener('DOMContentLoaded', function() {
    // 1. Initialize Dark Mode Toggle
    initDarkMode();
    
    // 2. Add animation to scroll-triggered elements
    initScrollAnimations();
    
    // 3. Add hover effects to product cards
    initProductCardHover();
    
    // 4. Improve form interactions
    enhanceForms();
    
    // 5. Add loading state to buttons
    initLoadingStates();
    
    // 6. Initialize tooltips
    initTooltips();
});

// Dark Mode Toggle
function initDarkMode() {
    const darkModeToggle = document.createElement('button');
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.setAttribute('aria-label', 'Toggle dark mode');
    darkModeToggle.innerHTML = '🌙';
    document.body.appendChild(darkModeToggle);
    
    // Check for saved user preference, if any, on load
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '☀️';
    }
    
    // Toggle dark mode on button click
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        // Save user preference
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
            darkModeToggle.innerHTML = '☀️';
        } else {
            localStorage.setItem('darkMode', 'disabled');
            darkModeToggle.innerHTML = '🌙';
        }
    });
    
    // Add dark mode styles
    const style = document.createElement('style');
    style.textContent = `
        .dark-mode {
            --bg-color: #1a1a1a;
            --text-color: #f5f5f5;
            --card-bg: #2d2d2d;
            --border-color: #444;
            --primary-color: #ff5a5f;
            --hover-color: #ff7a7f;
            --shadow-color: rgba(0, 0, 0, 0.3);
        }
        
        .dark-mode body {
            background-color: var(--bg-color);
            color: var(--text-color);
        }
        
        .dark-mode .product-card,
        .dark-mode .feature,
        .dark-mode .location-card {
            background-color: var(--card-bg);
            border-color: var(--border-color);
            box-shadow: 0 2px 10px var(--shadow-color);
        }
        
        .dark-mode .nav-links a,
        .dark-mode .footer-section a,
        .dark-mode .top-bar a {
            color: var(--text-color);
        }
        
        .dark-mode .nav-links a:hover,
        .dark-mode .footer-section a:hover {
            color: var(--primary-color);
        }
        
        .dark-mode input,
        .dark-mode select,
        .dark-mode textarea {
            background-color: #333;
            color: #fff;
            border-color: #555;
        }
    `;
    document.head.appendChild(style);
}

// Scroll Animations
function initScrollAnimations() {
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('fade-in');
            }
        });
    };
    
    // Initial check
    animateOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);
}

// Product Card Hover Effects
function initProductCardHover() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

// Form Enhancements
function enhanceForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Add floating labels
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Skip if already has a label
            if (!input.id || !input.labels || input.labels.length === 0) return;
            
            // Add floating label class
            const label = input.labels[0];
            label.classList.add('floating-label');
            
            // Check if input has value on load
            if (input.value) {
                label.classList.add('active');
            }
            
            // Add/remove active class on focus/blur
            input.addEventListener('focus', () => {
                label.classList.add('active');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    label.classList.remove('active');
                }
            });
            
            // Update on input change
            input.addEventListener('input', () => {
                if (input.value) {
                    label.classList.add('active');
                } else {
                    label.classList.remove('active');
                }
            });
        });
        
        // Add form validation
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            inputs.forEach(input => {
                if (input.required && !input.value) {
                    input.classList.add('invalid');
                    isValid = false;
                } else {
                    input.classList.remove('invalid');
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                
                // Scroll to first invalid input
                const firstInvalid = form.querySelector('.invalid');
                if (firstInvalid) {
                    firstInvalid.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                    firstInvalid.focus();
                }
            }
        });
    });
}

// Button Loading States
function initLoadingStates() {
    const buttons = document.querySelectorAll('button[type="submit"], .btn-loading');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (button.classList.contains('loading')) return;
            
            const originalText = button.innerHTML;
            button.innerHTML = '<span class="spinner"></span> ' + (button.dataset.loadingText || 'Processing...');
            button.classList.add('loading');
            button.disabled = true;
            
            // Reset after 3 seconds (for demo purposes)
            setTimeout(() => {
                button.innerHTML = originalText;
                button.classList.remove('loading');
                button.disabled = false;
            }, 3000);
        });
    });
}

// Tooltip Initialization
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[title]');
    
    tooltipElements.forEach(element => {
        const tooltip = document.createElement('span');
        tooltip.className = 'tooltip';
        tooltip.textContent = element.getAttribute('title');
        
        // Remove title to prevent default tooltip
        element.removeAttribute('title');
        
        // Add tooltip to DOM
        element.appendChild(tooltip);
        
        // Show/hide tooltip on hover/focus
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('focus', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
        element.addEventListener('blur', hideTooltip);
    });
    
    function showTooltip(e) {
        const tooltip = this.querySelector('.tooltip');
        if (!tooltip) return;
        
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '1';
    }
    
    function hideTooltip(e) {
        const tooltip = this.querySelector('.tooltip');
        if (!tooltip) return;
        
        tooltip.style.visibility = 'hidden';
        tooltip.style.opacity = '0';
    }
}

// Export functions for use in other modules
window.SpurMountEnhancements = {
    initDarkMode,
    initScrollAnimations,
    initProductCardHover,
    enhanceForms,
    initLoadingStates,
    initTooltips
};
