// debug.js - Debugging script for SpurMount website

document.addEventListener('DOMContentLoaded', function() {
    console.log('Debug script loaded');
    
    // Check if jQuery is loaded
    if (window.jQuery) {
        console.log('jQuery is loaded');
    } else {
        console.error('jQuery is not loaded');
    }
    
    // Check for common JavaScript errors
    try {
        // Check if mobile menu is working
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu) {
            console.log('Mobile menu element found');
            mobileMenu.addEventListener('click', function() {
                console.log('Mobile menu clicked');
            });
        } else {
            console.warn('Mobile menu element not found');
        }
        
        // Check if price alerts are working
        const priceAlertBtns = document.querySelectorAll('.price-alert-btn');
        console.log(`Found ${priceAlertBtns.length} price alert buttons`);
        
        // Check if all images have alt attributes
        const images = document.querySelectorAll('img:not([alt])');
        if (images.length > 0) {
            console.warn(`Found ${images.length} images without alt attributes`);
        }
        
        // Check for broken links
        document.querySelectorAll('a').forEach(link => {
            if (link.href === '#' || !link.href) {
                console.warn('Found empty or # link:', link);
            }
        });
        
    } catch (error) {
        console.error('Error in debug script:', error);
    }
});
