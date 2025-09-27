// Modern Features for SpurMount Wholesale

document.addEventListener('DOMContentLoaded', function() {
    // Initialize modern features
    initLazyLoading();
    initProductHoverEffects();
    initQuickView();
    initCartNotification();
    initSmoothScrolling();
    initQuantitySelectors();
    initProductFiltering();
    initMobileMenuEnhancements();
    initHeaderScroll();
    initDropdownMenus();
});

// Header scroll behavior
function initHeaderScroll() {
    const header = document.querySelector('.header-container');
    let lastScroll = 0;
    const scrollThreshold = 100; // Pixels to scroll before header hides
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class for shadow effect
        if (currentScroll > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
            // Scrolling down
            header.classList.add('hide');
        } else {
            // Scrolling up or at top
            header.classList.remove('hide');
        }
        
        // If at top of page, ensure header is visible
        if (currentScroll <= 0) {
            header.classList.remove('hide');
        }
        
        lastScroll = currentScroll;
    });
}

// Initialize dropdown menus with better accessibility
function initDropdownMenus() {
    const dropdownToggles = document.querySelectorAll('.dropdown > a');
    
    dropdownToggles.forEach(toggle => {
        // Add aria attributes
        toggle.setAttribute('aria-haspopup', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        
        // Add click event for better mobile experience
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 991) { // Only for mobile
                e.preventDefault();
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !isExpanded);
                
                // Toggle the dropdown menu
                const dropdown = this.parentElement;
                dropdown.classList.toggle('active');
                
                // Close other dropdowns
                document.querySelectorAll('.dropdown').forEach(item => {
                    if (item !== dropdown) {
                        item.classList.remove('active');
                        const otherToggle = item.querySelector('a[aria-haspopup="true"]');
                        if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
                    }
                });
            }
        });
        
        // Keyboard navigation
        toggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            } else if (e.key === 'Escape') {
                this.setAttribute('aria-expanded', 'false');
                this.parentElement.classList.remove('active');
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
                const toggle = dropdown.querySelector('a[aria-haspopup="true"]');
                if (toggle) toggle.setAttribute('aria-expanded', 'false');
            });
        }
    });
}

// Lazy Loading for images
function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support loading="lazy"
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }
}

// Enhanced product hover effects
function initProductHoverEffects() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const image = card.querySelector('.product-image');
        const quickViewBtn = card.querySelector('.quick-view-btn');
        
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
            if (quickViewBtn) quickViewBtn.style.opacity = '1';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
            if (quickViewBtn) quickViewBtn.style.opacity = '0';
        });
    });
}

// Quick View Modal
function initQuickView() {
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = btn.dataset.product;
            showQuickView(productId);
        });
    });
    
    // Close modal when clicking outside content
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('quick-view-modal')) {
            closeQuickView();
        }
    });
    
    // Close modal with escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeQuickView();
        }
    });
}

function showQuickView(productId) {
    // In a real app, this would fetch product data from an API
    const product = getProductData(productId);
    if (!product) return;
    
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
        <div class="quick-view-content">
            <button class="close-quick-view">&times;</button>
            <div class="quick-view-body">
                <div class="quick-view-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="quick-view-details">
                    <h3>${product.name}</h3>
                    <div class="product-rating">
                        ${generateStarRating(product.rating)}
                        <span class="rating-count">(${product.reviewCount} reviews)</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">KSh ${product.price.toLocaleString()}</span>
                        ${product.originalPrice ? `<span class="original-price">KSh ${product.originalPrice.toLocaleString()}</span>` : ''}
                        ${product.discount ? `<span class="discount">Save ${product.discount}%</span>` : ''}
                    </div>
                    <p class="product-description">${product.description}</p>
                    
                    <div class="product-actions">
                        <div class="quantity-selector">
                            <button class="quantity-btn minus">-</button>
                            <input type="number" value="1" min="1" class="quantity-input">
                            <button class="quantity-btn plus">+</button>
                        </div>
                        <button class="add-to-cart-btn" data-product-id="${productId}">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                    </div>
                    
                    <div class="product-meta">
                        <div class="meta-item">
                            <i class="fas fa-truck"></i>
                            <span>Free delivery on orders over KSh 5,000</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-undo"></i>
                            <span>Easy returns within 7 days</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Add event listeners
    modal.querySelector('.close-quick-view').addEventListener('click', closeQuickView);
    modal.querySelector('.add-to-cart-btn').addEventListener('click', addToCartFromQuickView);
    
    // Quantity selector functionality
    const quantityInput = modal.querySelector('.quantity-input');
    modal.querySelector('.quantity-btn.plus').addEventListener('click', () => {
        quantityInput.value = parseInt(quantityInput.value) + 1;
    });
    
    modal.querySelector('.quantity-btn.minus').addEventListener('click', () => {
        if (parseInt(quantityInput.value) > 1) {
            quantityInput.value = parseInt(quantityInput.value) - 1;
        }
    });
}

function closeQuickView() {
    const modal = document.querySelector('.quick-view-modal');
    if (modal) {
        document.body.style.overflow = '';
        modal.remove();
    }
}

function addToCartFromQuickView(e) {
    const productId = e.target.dataset.productId;
    const quantity = parseInt(document.querySelector('.quick-view-modal .quantity-input').value);
    addToCart(productId, quantity);
    showCartNotification('Product added to cart!');
    closeQuickView();
}

// Cart notification
function initCartNotification() {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    document.body.appendChild(notification);
}

function showCartNotification(message) {
    const notification = document.querySelector('.cart-notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    // Update cart count
    updateCartCount();
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function updateCartCount() {
    // In a real app, this would get the actual count from the cart
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const currentCount = parseInt(cartCount.textContent) || 0;
        cartCount.textContent = currentCount + 1;
        cartCount.classList.add('pulse');
        
        setTimeout(() => {
            cartCount.classList.remove('pulse');
        }, 500);
    }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Quantity selectors
function initQuantitySelectors() {
    document.querySelectorAll('.quantity-selector').forEach(selector => {
        const input = selector.querySelector('.quantity-input');
        const minusBtn = selector.querySelector('.minus');
        const plusBtn = selector.querySelector('.plus');
        
        if (minusBtn) {
            minusBtn.addEventListener('click', () => {
                if (parseInt(input.value) > 1) {
                    input.value = parseInt(input.value) - 1;
                }
            });
        }
        
        if (plusBtn) {
            plusBtn.addEventListener('click', () => {
                input.value = parseInt(input.value) + 1;
            });
        }
        
        // Ensure value doesn't go below 1
        input.addEventListener('change', () => {
            if (parseInt(input.value) < 1) {
                input.value = 1;
            }
        });
    });
}

// Product filtering
function initProductFiltering() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.dataset.filter || 'all';
            
            // Filter products
            productCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    // Trigger reflow for animation
                    void card.offsetWidth;
                    card.style.animation = 'fadeIn 0.3s ease-out forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Mobile menu enhancements
function initMobileMenuEnhancements() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.setAttribute('aria-label', 'Toggle menu');
        
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // Update hamburger icon
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.className = isExpanded ? 'fas fa-bars' : 'fas fa-times';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
                
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            }
        });
        
        // Close menu on window resize if it becomes desktop view
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 991) {
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    navLinks.classList.remove('active');
                    document.body.classList.remove('menu-open');
                    
                    const icon = mobileMenuBtn.querySelector('i');
                    if (icon) icon.className = 'fas fa-bars';
                }
            }, 250);
        });
    }
    
    // Add focus styles for keyboard navigation
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const modal = document.querySelector('.quick-view-modal');
    
    if (modal) {
        const focusableContent = modal.querySelectorAll(focusableElements);
        const firstFocusableElement = focusableContent[0];
        const lastFocusableElement = focusableContent[focusableContent.length - 1];
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
}

// Helper function to generate star rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    // Half star
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Mock function to get product data (replace with actual API call)
function getProductData(productId) {
    const products = {
        'basmati-rice': {
            name: 'Premium Basmati Rice',
            category: 'Grains & Cereals',
            image: 'images/products/rice-basmati.jpg',
            price: 2499,
            originalPrice: 2799,
            discount: 11,
            rating: 4.5,
            reviewCount: 128,
            description: 'Premium quality Basmati rice with long grains and aromatic flavor. Perfect for biryanis, pilafs, and other rice dishes. Grown in the foothills of the Himalayas, our Basmati rice is aged for at least one year to enhance its flavor and texture.',
            inStock: true
        },
        'green-gram': {
            name: 'Green Gram (Ndengu)',
            category: 'Pulses & Legumes',
            image: 'images/products/green-gram.jpg',
            price: 199,
            rating: 4.2,
            reviewCount: 87,
            description: 'High-protein green gram, also known as mung beans or ndengu. Rich in protein, fiber, and essential nutrients. Perfect for making dals, soups, and traditional African dishes.',
            inStock: true
        },
        'cardamom': {
            name: 'Cardamom (Elichi)',
            category: 'Spices & Seasonings',
            image: 'images/products/cardamom.jpg',
            price: 899,
            rating: 4.7,
            reviewCount: 156,
            description: 'Premium quality green cardamom pods with a strong, aromatic flavor. Known as the "Queen of Spices," cardamom adds a unique flavor to both sweet and savory dishes, as well as teas and coffees.',
            inStock: true
        },
        'cashew-nuts': {
            name: 'Cashew Nuts',
            category: 'Dry Fruits & Nuts',
            image: 'images/products/cashew-nuts.jpg',
            price: 1299,
            rating: 4.8,
            reviewCount: 214,
            description: 'Premium grade cashew nuts, rich in healthy fats, protein, and essential minerals. Perfect for snacking, baking, or adding to your favorite dishes. Our cashews are carefully selected and packed to ensure maximum freshness.',
            inStock: true
        }
    };
    
    return products[productId] || null;
}

// Add to cart function (simplified - would connect to your cart system)
function addToCart(productId, quantity = 1) {
    // In a real app, this would add the product to a shopping cart
    console.log(`Added ${quantity} of product ${productId} to cart`);
    
    // Update cart count in the UI
    updateCartCount();
}
