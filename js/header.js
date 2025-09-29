// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const menuItems = document.querySelectorAll('.menu-item');
    
    // Toggle mobile menu
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Toggle submenu on mobile
    menuItems.forEach(item => {
        if (item.querySelector('.mega-menu')) {
            const link = item.querySelector('a');
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 991) {
                    e.preventDefault();
                    const megaMenu = this.nextElementSibling;
                    if (megaMenu && megaMenu.classList.contains('mega-menu')) {
                        megaMenu.style.display = megaMenu.style.display === 'block' ? 'none' : 'block';
                    }
                }
            });
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.main-navigation') && !e.target.closest('.mobile-menu-toggle')) {
            navMenu.classList.remove('active');
            if (mobileMenuToggle) {
                mobileMenuToggle.classList.remove('active');
            }
        }
    });
    
    // Update cart count (example)
    function updateCartCount() {
        // This would be replaced with actual cart count from your backend
        const cartCount = 0; // Example: Get from localStorage or API
        const cartBadges = document.querySelectorAll('.action-badge');
        
        cartBadges.forEach(badge => {
            badge.textContent = cartCount;
            badge.style.display = cartCount > 0 ? 'flex' : 'none';
        });
    }
    
    // Initialize cart count
    updateCartCount();
    
    // Handle search form submission
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchQuery = this.querySelector('input[name="q"]').value.trim();
            if (searchQuery) {
                // Here you would typically redirect to search results page
                console.log('Searching for:', searchQuery);
                // window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
            }
        });
    }
});

// Sticky header on scroll
let lastScroll = 0;
const header = document.querySelector('.main-header');
const headerHeight = header ? header.offsetHeight : 0;

if (header) {
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // Scroll Down
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // Scroll Up
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        
        lastScroll = currentScroll;
    });
}
