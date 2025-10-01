// Quick View Module
const QuickView = (function() {
    // Modal Elements
    let quickViewModal, quickViewOverlay, quickViewClose, quickViewBody;
    
    // Initialize quick view
    function init() {
        quickViewModal = document.querySelector('.quick-view-modal');
        quickViewOverlay = document.querySelector('.quick-view-overlay');
        quickViewClose = document.querySelector('.quick-view-close');
        quickViewBody = document.querySelector('.quick-view-body');
        
        // Close modal when clicking overlay or close button
        if (quickViewOverlay) {
            quickViewOverlay.addEventListener('click', closeQuickView);
        }
        
        if (quickViewClose) {
            quickViewClose.addEventListener('click', closeQuickView);
        }
        
        // Close modal when pressing Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && quickViewModal.classList.contains('active')) {
                closeQuickView();
            }
        });
    }
    
    // Function to open quick view
    function openQuickView(productId) {
        if (!quickViewModal || !quickViewBody) return;
        
        // Show loading state
        quickViewBody.innerHTML = `
            <div class="quick-view-loading">
                <div class="spinner"></div>
                <p>Loading product details...</p>
            </div>
        `;
        
        // Show modal
        quickViewModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Simulate API call to get product details
        // In a real application, you would fetch this from your backend
        setTimeout(() => {
            // This is a mock product - replace with actual data from your backend
            const product = getProductById(productId);
            
            if (product) {
                renderProductDetails(product);
            } else {
                showError('Product not found');
            }
        }, 500);
    }
    
    // Function to close quick view
    function closeQuickView() {
        if (quickViewModal) {
            quickViewModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // Function to render product details
    function renderProductDetails(product) {
        const { id, name, price, description, category, images, stock } = product;
        
        // Create main image HTML
        const mainImage = images && images.length > 0 ? 
            `<img src="${images[0]}" alt="${name}" class="quick-view-main-image" id="main-product-image">` : 
            '<div class="quick-view-main-image no-image">No Image Available</div>';
        
        // Create thumbnails HTML if there are multiple images
        let thumbnails = '';
        if (images && images.length > 1) {
            thumbnails = `
                <div class="quick-view-thumbnails">
                    ${images.map((img, index) => `
                        <img src="${img}" alt="${name} - Thumbnail ${index + 1}" 
                             class="quick-view-thumbnail ${index === 0 ? 'active' : ''}"
                             data-index="${index}">
                    `).join('')}
                </div>
            `;
        }
        
        // Create the complete HTML
        quickViewBody.innerHTML = `
            <div class="quick-view-product">
                <div class="quick-view-gallery">
                    ${mainImage}
                    ${thumbnails}
                </div>
                <div class="quick-view-details">
                    <h1 class="quick-view-title">${name}</h1>
                    <div class="quick-view-price">Ksh ${price.toLocaleString()}</div>
                    
                    <div class="quick-view-description">
                        <p>${description || 'No description available.'}</p>
                    </div>
                    
                    <div class="quick-view-meta">
                        <div class="quick-view-meta-item">
                            <span class="quick-view-meta-label">Category:</span>
                            <span class="quick-view-meta-value">${category || 'N/A'}</span>
                        </div>
                        <div class="quick-view-meta-item">
                            <span class="quick-view-meta-label">Availability:</span>
                            <span class="quick-view-meta-value">${stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                        </div>
                        <div class="quick-view-meta-item">
                            <span class="quick-view-meta-label">Product ID:</span>
                            <span class="quick-view-meta-value">#${id}</span>
                        </div>
                    </div>
                    
                    <div class="quick-view-actions">
                        <div class="quantity-selector">
                            <button class="quantity-btn minus" type="button">-</button>
                            <input type="number" class="quantity-input" value="1" min="1" max="${stock}" 
                                   data-product-id="${id}">
                            <button class="quantity-btn plus" type="button">+</button>
                        </div>
                        
                        <button class="btn btn-primary add-to-cart" 
                                data-product-id="${id}"
                                ${stock > 0 ? '' : 'disabled'}>
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                        
                        <button class="btn btn-outline-secondary" id="wishlist-btn">
                            <i class="far fa-heart"></i> Add to Wishlist
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners for the new elements
        setupQuickViewEvents();
    }
    
    // Function to set up event listeners for quick view
    function setupQuickViewEvents() {
        // Thumbnail click handler
        const thumbnails = document.querySelectorAll('.quick-view-thumbnail');
        const mainImage = document.getElementById('main-product-image');
        
        if (thumbnails && mainImage) {
            thumbnails.forEach(thumb => {
                thumb.addEventListener('click', function() {
                    // Update active thumbnail
                    const activeThumb = document.querySelector('.quick-view-thumbnail.active');
                    if (activeThumb) {
                        activeThumb.classList.remove('active');
                    }
                    this.classList.add('active');
                    
                    // Update main image
                    mainImage.src = this.src;
                });
            });
        }
        
        // Quantity buttons
        const minusBtn = quickViewBody.querySelector('.quantity-btn.minus');
        const plusBtn = quickViewBody.querySelector('.quantity-btn.plus');
        const quantityInput = quickViewBody.querySelector('.quantity-input');
        
        if (minusBtn && plusBtn && quantityInput) {
            minusBtn.addEventListener('click', () => {
                let value = parseInt(quantityInput.value);
                if (value > 1) {
                    quantityInput.value = value - 1;
                }
            });
            
            plusBtn.addEventListener('click', () => {
                let value = parseInt(quantityInput.value);
                const max = parseInt(quantityInput.max) || 10;
                if (value < max) {
                    quantityInput.value = value + 1;
                }
            });
            
            // Prevent manual input of invalid values
            quantityInput.addEventListener('change', function() {
                let value = parseInt(this.value);
                const max = parseInt(this.max) || 10;
                const min = parseInt(this.min) || 1;
                
                if (isNaN(value) || value < min) {
                    this.value = min;
                } else if (value > max) {
                    this.value = max;
                }
            });
        }
        
        // Add to cart button
        const addToCartBtn = quickViewBody.querySelector('.add-to-cart');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function() {
                const productCard = this.closest('.quick-view-details');
                const productId = this.getAttribute('data-product-id') || Date.now().toString();
                const productName = quickViewBody.querySelector('.quick-view-title')?.textContent || 'Product';
                const productPrice = parseFloat(quickViewBody.querySelector('.quick-view-price')?.textContent.replace(/[^0-9.]/g, '') || 0);
                const productImage = quickViewBody.querySelector('.quick-view-main-image')?.src || '';
                const quantity = parseInt(quantityInput?.value) || 1;
                
                // Add to cart
                if (typeof addToCart === 'function') {
                    addToCart({
                        id: productId,
                        name: productName,
                        price: productPrice,
                        image: productImage,
                        quantity: quantity
                    });
                    
                    // Show notification
                    showNotification(`${productName} added to cart!`);
                    
                    // Close quick view after a short delay
                    setTimeout(closeQuickView, 800);
                } else {
                    console.error('addToCart function not found');
                    showNotification('Error: Could not add to cart');
                }
            });
        }
        
        // Wishlist button
        const wishlistBtn = quickViewBody.querySelector('.wishlist-btn');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', function() {
                // Toggle wishlist state
                const isActive = this.classList.contains('active');
                const icon = this.querySelector('i');
                
                if (isActive) {
                    this.classList.remove('active');
                    icon.classList.remove('fas', 'fa-heart');
                    icon.classList.add('far', 'fa-heart');
                    this.innerHTML = '<i class="far fa-heart"></i> Add to Wishlist';
                    showNotification('Removed from wishlist');
                } else {
                    this.classList.add('active');
                    icon.classList.remove('far', 'fa-heart');
                    icon.classList.add('fas', 'fa-heart');
                    this.innerHTML = '<i class="fas fa-heart"></i> In Wishlist';
                    showNotification('Added to wishlist');
                }
            });
        }
    }
    
    // Function to show error message
    function showError(message) {
        if (!quickViewBody) return;
        
        quickViewBody.innerHTML = `
            <div class="quick-view-error" style="text-align: center; padding: 40px 20px;">
                <i class="fas fa-exclamation-circle" style="font-size: 48px; color: #e74c3c; margin-bottom: 20px;"></i>
                <h4 style="margin-bottom: 15px; color: #333;">Oops! Something went wrong</h4>
                <p style="color: #666; margin-bottom: 25px;">${message}</p>
                <button class="btn btn-primary" 
                        style="padding: 8px 25px; border-radius: 4px; cursor: pointer;"
                        onclick="QuickView.closeQuickView()">
                    Close
                </button>
            </div>
        `;
    }
    
    // Function to show notification
    function showNotification(message) {
        // Use the global notification function if available
        if (typeof window.showNotification === 'function') {
            window.showNotification(message);
            return;
        }
        
        // Fallback notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Show notification with animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification && notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Function to get product by ID - replace with actual API call
    function getProductById(productId) {
        // This is a mock product - in a real app, you would fetch this from your backend
        const products = {
            '1': {
                id: '1',
                name: 'Premium Basmati Rice (5kg)',
                price: 1250,
                description: 'Long grain basmati rice, perfect for biryani and pilaf. Imported directly from Pakistan. Each grain is aged for a minimum of one year to enhance its flavor and aroma.',
                category: 'Rice',
                stock: 50,
                images: [
                    'images/products/rice-basmati.jpg',
                    'images/products/rice-basmati-2.jpg',
                    'images/products/rice-basmati-3.jpg'
                ]
            },
            '2': {
                id: '2',
                name: 'Red Kidney Beans (1kg)',
                price: 180,
                description: 'Premium quality red kidney beans, rich in protein and fiber. Ideal for stews, salads, and chili con carne.',
                category: 'Beans',
                stock: 100,
                images: [
                    'images/products/beans-kidney.jpg',
                    'images/products/beans-kidney-2.jpg'
                ]
            },
            '3': {
                id: '3',
                name: 'Maize Flour (2kg)',
                price: 120,
                description: 'Finely ground maize flour for making ugali, a staple food in Kenya. Made from selected quality maize grains.',
                category: 'Flour',
                stock: 75,
                images: [
                    'images/products/maize-flour.jpg'
                ]
            },
            '4': {
                id: '4',
                name: 'Green Grams (1kg)',
                price: 150,
                description: 'Fresh green grams (mung beans) perfect for making ndengu. High in protein and fiber.',
                category: 'Pulses',
                stock: 60,
                images: [
                    'images/products/green-grams.jpg'
                ]
            },
            '5': {
                id: '5',
                name: 'Wheat Flour (2kg)',
                price: 140,
                description: 'Premium wheat flour for baking bread, cakes, and pastries. Finely milled for best results.',
                category: 'Flour',
                stock: 45,
                images: [
                    'images/products/wheat-flour.jpg'
                ]
            },
            '6': {
                id: '6',
                name: 'Sugar (2kg)',
                price: 250,
                description: 'Fine white sugar for all your sweetening needs. Perfect for beverages and baking.',
                category: 'Sweeteners',
                stock: 80,
                images: [
                    'images/products/sugar.jpg'
                ]
            },
            '7': {
                id: '7',
                name: 'Cooking Oil (1L)',
                price: 220,
                description: 'Pure vegetable cooking oil for all your frying and cooking needs. Cholesterol free.',
                category: 'Oils',
                stock: 65,
                images: [
                    'images/products/cooking-oil.jpg'
                ]
            }
        };
        
        // Return the product or a default product if not found
        return products[productId] || {
            id: productId,
            name: `Product ${productId}`,
            price: 0,
            description: 'Product details not available.',
            category: 'Uncategorized',
            stock: 0,
            images: ['images/placeholder-product.png']
        };
    }
    
    // Public API
    return {
        init,
        openQuickView,
        closeQuickView,
        showNotification
    };
})();

// Initialize quick view when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    QuickView.init();
});

// Expose to global scope
window.QuickView = QuickView;
