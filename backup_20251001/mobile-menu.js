// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const dropdownToggles = document.querySelectorAll('.dropdown > a');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    // Toggle mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const isExpanded = this.getAttribute('aria-expanded') === 'true' || false;
            this.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // Update hamburger icon
            const icon = this.querySelector('i');
            if (icon) {
                icon.className = isExpanded ? 'fas fa-bars' : 'fas fa-times';
            }
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileMenu.contains(e.target) && !e.target.closest('.nav-links') && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
            const menuBtn = document.querySelector('.mobile-menu-btn');
            if (menuBtn) {
                menuBtn.setAttribute('aria-expanded', 'false');
                const icon = menuBtn.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            }
        }
    });
    
    // Handle dropdown menus on mobile and desktop
    dropdownToggles.forEach(toggle => {
        // Add arrow icon
        const arrow = document.createElement('i');
        arrow.className = 'fas fa-chevron-down dropdown-arrow';
        toggle.appendChild(arrow);
        
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 991) { // Only for mobile
                e.preventDefault();
                const dropdown = this.parentElement;
                const menu = this.nextElementSibling;
                const isExpanded = this.getAttribute('aria-expanded') === 'true' || false;
                
                // Toggle current dropdown
                this.setAttribute('aria-expanded', !isExpanded);
                dropdown.classList.toggle('active');
                
                // Close other open dropdowns
                document.querySelectorAll('.dropdown').forEach(item => {
                    if (item !== dropdown) {
                        item.classList.remove('active');
                        const otherToggle = item.querySelector('a');
                        if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
                    }
                });
                
                // Toggle current dropdown
                dropdown.classList.toggle('active');
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-links') && !e.target.closest('.mobile-menu')) {
            navLinks.classList.remove('active');
            document.querySelector('.mobile-menu')?.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 991) {
                navLinks.classList.remove('active');
                document.querySelector('.mobile-menu')?.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 991) {
            navLinks.classList.remove('active');
            document.querySelector('.mobile-menu')?.classList.remove('active');
            document.body.classList.remove('menu-open');
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
});
