// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    let overlay = document.querySelector('.overlay');
    
    // Create overlay if it doesn't exist
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'overlay';
        document.body.appendChild(overlay);
    }

    function toggleMobileMenu() {
        if (!mobileMenu || !overlay) return;
        
        mobileMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        
        if (mobileMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        } else {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }
    }

    // Event Listeners for Mobile Menu
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', toggleMobileMenu);
    }

    if (overlay) {
        overlay.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu when clicking on a link
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a, .nav-links a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu) mobileMenu.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        });
    });
});

// Sticky Header
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScroll = 0;
    const headerHeight = header.offsetHeight;
    
    // Add scrolled class on page load if scrolled
    if (window.pageYOffset > headerHeight) {
        header.classList.add('scrolled');
    }
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Always show header when at top of page
        if (currentScroll <= 10) {
            header.classList.remove('scrolled', 'scroll-down');
            return;
        }
        
        // Add scrolled class when scrolling down
        if (currentScroll > headerHeight) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll direction
        if (currentScroll > lastScroll && currentScroll > headerHeight) {
            // Scrolling down
            header.classList.add('scroll-down');
            header.classList.remove('scroll-up');
        } else if (currentScroll < lastScroll) {
            // Scrolling up
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        
        lastScroll = currentScroll;
    });
});

// Product Filtering
document.addEventListener('DOMContentLoaded', function() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    if (categoryButtons.length === 0 || productCards.length === 0) return;
    
    // Initialize all products as visible
    productCards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        card.style.transition = 'all 0.3s ease';
    });
    
    // Set first button as active by default if none is active
    if (!document.querySelector('.category-btn.active') && categoryButtons.length > 0) {
        categoryButtons[0].classList.add('active');
    }
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Don't do anything if clicking the already active button
            if (button.classList.contains('active')) return;
            
            // Update active state
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-category');
            
            // Filter products
            productCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                const shouldShow = filter === 'all' || cardCategory === filter;
                
                if (shouldShow) {
                    // Show card with animation
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    // Hide card with animation
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 200);
                }
            });
            
            // Scroll to top of products section
            const productsSection = document.querySelector('.products-section');
            if (productsSection) {
                window.scrollTo({
                    top: productsSection.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Smooth Scrolling for Anchor Links
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            // Don't prevent default for empty hashes or external links
            if (targetId === '#' || targetId.startsWith('http')) {
                return;
            }
            
            e.preventDefault();
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 100; // Adjust this value based on your header height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                mobileMenu?.classList.remove('active');
                overlay?.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
});

// Initialize animations on scroll
document.addEventListener('DOMContentLoaded', function() {
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        if (elements.length === 0) return;
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('animated');
            }
        });
    };

    // Initial check on load
    animateOnScroll();
    
    // Then check on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Also check when images are loaded (for lazy-loaded content)
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.complete) {
            animateOnScroll();
        } else {
            img.addEventListener('load', animateOnScroll);
        }
    });
});

// Click & Collect Counter
const clickCollectCounter = document.getElementById('click-collect-counter');
if (clickCollectCounter) {
    let count = 12;
    
    setInterval(() => {
        count = Math.max(12, Math.floor(count * (1 + Math.random() * 0.1)));
        clickCollectCounter.textContent = `${count} orders`;
    }, 10000);
}

// Add to Cart Animation
const addToCartButtons = document.querySelectorAll('.add-to-cart');
let cartItems = 0;

addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        cartItems++;
        
        // Update cart count
        const cartCount = document.querySelector('.cart-count') || document.createElement('span');
        cartCount.className = 'cart-count';
        cartCount.textContent = cartItems;
        
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon && !cartIcon.querySelector('.cart-count')) {
            cartIcon.appendChild(cartCount);
        }
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Added to cart!';
        successMessage.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #28a745;
            color: white;
            padding: 10px 20px;
            border-radius: 50px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            opacity: 0;
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(successMessage);
        
        setTimeout(() => {
            successMessage.style.opacity = '1';
            successMessage.style.bottom = '40px';
        }, 10);
        
        setTimeout(() => {
            successMessage.style.opacity = '0';
            successMessage.style.bottom = '20px';
            setTimeout(() => {
                successMessage.remove();
            }, 300);
        }, 2000);
    });
});

// Lazy Loading Images
const lazyImages = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// Form Validation
const forms = document.querySelectorAll('form');

forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
                
                if (!input.nextElementSibling?.classList.contains('error-message')) {
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message';
                    errorMessage.textContent = 'This field is required';
                    input.parentNode.insertBefore(errorMessage, input.nextSibling);
                }
            } else {
                input.classList.remove('error');
                const errorMessage = input.nextElementSibling;
                if (errorMessage?.classList.contains('error-message')) {
                    errorMessage.remove();
                }
            }
        });
        
        if (!isValid) {
            e.preventDefault();
        }
    });
});

// Initialize tooltips
const tooltipElements = document.querySelectorAll('[data-tooltip]');

tooltipElements.forEach(element => {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = element.getAttribute('data-tooltip');
    document.body.appendChild(tooltip);
    
    const updateTooltip = (e) => {
        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 10}px`;
        tooltip.style.transform = 'translate(-50%, -100%)';
    };
    
    element.addEventListener('mouseenter', () => {
        tooltip.classList.add('active');
        updateTooltip();
    });
    
    element.addEventListener('mousemove', updateTooltip);
    
    element.addEventListener('mouseleave', () => {
        tooltip.classList.remove('active');
    });
});

// Initialize scroll to top button
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
