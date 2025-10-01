document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu elements
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const body = document.body;
    
    // Search elements
    const searchToggle = document.querySelector('.search-toggle');
    const searchContainer = document.querySelector('.search-container');
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');
    
    // Create menu overlay
    const menuOverlay = document.createElement('div');
    menuOverlay.className = 'menu-overlay';
    document.body.appendChild(menuOverlay);
    
    // Toggle mobile menu
    function toggleMobileMenu() {
        if (!mobileMenu) return;
        
        body.classList.toggle('menu-open');
        mobileMenu.classList.toggle('active');
        menuOverlay.classList.toggle('visible');
        
        if (mobileMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    // Close mobile menu
    function closeMobileMenu() {
        if (!mobileMenu) return;
        
        body.classList.remove('menu-open');
        mobileMenu.classList.remove('active');
        menuOverlay.classList.remove('visible');
        document.body.style.overflow = '';
    }
    
    // Toggle search
    function toggleSearch(e) {
        if (e) e.preventDefault();
        if (!searchContainer) return;
        
        searchContainer.classList.toggle('visible');
        
        if (searchContainer.classList.contains('visible') && searchInput) {
            searchInput.focus();
        }
    }
    
    // Close search when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchContainer) return;
        
        if (!e.target.closest('.search-container') && !e.target.closest('.search-toggle')) {
            searchContainer.classList.remove('visible');
        }
    });
    
    // Close menu when clicking on overlay
    menuOverlay.addEventListener('click', function() {
        closeMobileMenu();
    });
    
    // Close search when pressing Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchContainer) {
            searchContainer.classList.remove('visible');
        }
    });
    
    // Set active menu item based on current page
    function setActiveMenuItem() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const menuItems = document.querySelectorAll('.nav-menu .menu-item, .mobile-menu-links li');
        
        menuItems.forEach(item => {
            const link = item.querySelector('a');
            if (link) {
                const href = link.getAttribute('href');
                if (currentPage === href || 
                    (currentPage === '' && href === 'index.html') ||
                    (currentPage.includes(href.replace('.html', '')) && href !== 'index.html')) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            }
        });
    }
    
    // Initialize event listeners
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleMobileMenu();
        });
    }
    
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', function(e) {
            e.preventDefault();
            closeMobileMenu();
        });
    }
    
    if (searchToggle) {
        searchToggle.addEventListener('click', toggleSearch);
    }
    
    // Initialize active menu item
    setActiveMenuItem();
});
