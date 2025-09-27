// Products Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Category filtering
    const categoryBtns = document.querySelectorAll('.category-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    if (categoryBtns.length > 0) {
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                categoryBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const category = this.getAttribute('data-category');
                
                // Filter products
                productCards.forEach(card => {
                    if (category === 'all' || card.getAttribute('data-category') === category) {
                        card.style.display = 'block';
                        // Trigger reflow for animation
                        void card.offsetWidth;
                        card.style.animation = 'fadeIn 0.5s ease-out forwards';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Quick View Modal
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-body">
                <!-- Content will be loaded here -->
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Sample product data (in a real app, this would come from a database)
    const products = {
        'basmati-rice': {
            name: 'Premium Basmati Rice',
            category: 'Grains & Cereals',
            price: '2,499',
            originalPrice: '2,799',
            rating: 4.5,
            reviews: 128,
            description: 'Premium quality Basmati rice with long grains and aromatic flavor. Perfect for biryani, pilaf, and other rice dishes.',
            details: '• Extra long grain rice\n• Aged for enhanced flavor\n• Non-sticky texture\n• 1kg pack\n• Shelf life: 2 years',
            image: 'images/products/rice-basmati.jpg'
        },
        'green-gram': {
            name: 'Green Gram (Ndengu)',
            category: 'Pulses & Legumes',
            price: '180',
            unit: 'per kg',
            rating: 4.2,
            reviews: 89,
            description: 'High-quality green gram, rich in protein and fiber. Great for making traditional dishes, soups, and salads.',
            details: '• Rich in protein and fiber\n• No preservatives\n• 100% natural\n• High in essential nutrients\n• Perfect for sprouting',
            image: 'images/products/green-gram.jpg'
        },
        'turmeric-powder': {
            name: 'Pure Turmeric Powder',
            category: 'Spices',
            price: '350',
            unit: 'per 500g',
            rating: 4.8,
            reviews: 256,
            description: 'Pure and natural turmeric powder with vibrant color and rich flavor. Sourced from the finest turmeric roots.',
            details: '• 100% pure and natural\n• Rich golden color\n• Aromatic flavor\n• No additives or fillers\n• Rich in curcumin',
            image: 'images/products/turmeric-powder.jpg'
        },
        'cashew-nuts': {
            name: 'Premium Cashew Nuts',
            category: 'Dry Fruits & Nuts',
            price: '1,899',
            unit: 'per kg',
            rating: 4.7,
            reviews: 174,
            description: 'Premium quality cashew nuts, rich in nutrients and perfect for snacking or cooking. Grown in optimal conditions for the best taste.',
            details: '• Whole cashews\n• No artificial flavors\n• Rich in healthy fats\n• Good source of protein\n• No added salt or oil',
            image: 'images/products/cashew-nuts.jpg'
        }
    };
    
    // Quick View functionality
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-product');
            const product = products[productId];
            
            if (product) {
                const modalBody = modal.querySelector('.modal-body');
                modalBody.innerHTML = `
                    <div class="modal-product">
                        <div class="modal-product-image">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="modal-product-details">
                            <span class="product-category">${product.category}</span>
                            <h2>${product.name}</h2>
                            <div class="product-rating">
                                ${generateStarRating(product.rating)}
                                <span class="rating-count">(${product.reviews} reviews)</span>
                            </div>
                            <div class="product-price">
                                <span class="current-price">KSh ${product.price}</span>
                                ${product.originalPrice ? `<span class="original-price">KSh ${product.originalPrice}</span>` : ''}
                                ${product.unit ? `<span class="unit">${product.unit}</span>` : ''}
                            </div>
                            <p class="product-description">${product.description}</p>
                            <div class="product-details">
                                <h4>Product Details:</h4>
                                <p>${product.details.replace(/\n/g, '<br>')}</p>
                            </div>
                            <div class="product-actions">
                                <div class="quantity-selector">
                                    <button class="quantity-btn minus">-</button>
                                    <input type="number" value="1" min="1" class="quantity-input">
                                    <button class="quantity-btn plus">+</button>
                                </div>
                                <button class="add-to-cart-btn">
                                    <i class="fas fa-shopping-cart"></i> Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                
                // Show modal
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                
                // Quantity selector functionality
                const quantityInput = modal.querySelector('.quantity-input');
                const minusBtn = modal.querySelector('.quantity-btn.minus');
                const plusBtn = modal.querySelector('.quantity-btn.plus');
                
                minusBtn.addEventListener('click', () => {
                    let value = parseInt(quantityInput.value);
                    if (value > 1) {
                        quantityInput.value = value - 1;
                    }
                });
                
                plusBtn.addEventListener('click', () => {
                    let value = parseInt(quantityInput.value);
                    quantityInput.value = value + 1;
                });
                
                // Add to cart functionality
                const addToCartBtn = modal.querySelector('.add-to-cart-btn');
                addToCartBtn.addEventListener('click', () => {
                    const quantity = parseInt(quantityInput.value);
                    addToCart(productId, quantity);
                    // Close modal after adding to cart
                    closeModal();
                });
            }
        });
    });
    
    // Close modal when clicking the X
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside the content
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Helper function to close the modal
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Helper function to generate star rating HTML
    function generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i === fullStars && hasHalfStar) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        
        return stars;
    }
    
    // Add to cart functionality
    function addToCart(productId, quantity = 1) {
        // In a real application, this would add the product to a shopping cart
        console.log(`Added ${quantity} ${productId} to cart`);
        
        // Show success message
        const message = document.createElement('div');
        message.className = 'cart-message';
        message.innerHTML = `
            <div class="cart-message-content">
                <i class="fas fa-check-circle"></i>
                <span>Added to cart successfully!</span>
            </div>
        `;
        document.body.appendChild(message);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            message.classList.add('show');
            
            setTimeout(() => {
                message.classList.remove('show');
                setTimeout(() => {
                    message.remove();
                }, 300);
            }, 3000);
        }, 100);
    }
    
    // Add to cart buttons on product cards
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const card = this.closest('.product-card');
            const productId = card.querySelector('.quick-view-btn').getAttribute('data-product');
            
            if (productId) {
                addToCart(productId);
            }
        });
    });
});
