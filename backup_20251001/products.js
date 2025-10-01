// Products Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const searchInput = document.getElementById('search-input');
    const productCards = Array.from(document.querySelectorAll('.product-card'));
    const noResults = document.createElement('div');
    noResults.className = 'no-results';
    noResults.style.display = 'none';
    noResults.textContent = 'No products found matching your search.';
    document.querySelector('.products-grid').appendChild(noResults);

    // Filter Elements
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    const categoryFilters = document.querySelectorAll('.category-filter');
    const inStockOnly = document.getElementById('in-stock-only');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const sortSelect = document.getElementById('sort-by');

    // Debounce function for search input
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Get all filter values
    function getFilters() {
        const minPrice = parseFloat(minPriceInput.value) || 0;
        const maxPrice = parseFloat(maxPriceInput.value) || Infinity;
        const selectedCategories = Array.from(categoryFilters)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
        
        return {
            searchTerm: (searchInput.value || '').toLowerCase().trim(),
            minPrice,
            maxPrice: isFinite(maxPrice) ? maxPrice : Infinity,
            categories: selectedCategories,
            inStockOnly: inStockOnly.checked
        };
    }

    // Filter products based on current filters
    function filterProducts() {
        const { searchTerm, minPrice, maxPrice, categories, inStockOnly } = getFilters();
        let visibleCount = 0;
        
        productCards.forEach(card => {
            const title = card.querySelector('.product-title').textContent.toLowerCase();
            const description = card.querySelector('.product-desc').textContent.toLowerCase();
            const category = card.getAttribute('data-category') || '';
            const price = parseFloat(card.getAttribute('data-price') || '0');
            const stock = card.getAttribute('data-stock') !== '0';
            
            // Check search term match
            const matchesSearch = !searchTerm || 
                title.includes(searchTerm) || 
                description.includes(searchTerm) ||
                category.includes(searchTerm);
            
            // Check price range
            const matchesPrice = price >= minPrice && price <= maxPrice;
            
            // Check category
            const matchesCategory = categories.length === 0 || categories.includes(category);
            
            // Check stock status
            const matchesStock = !inStockOnly || stock;
            
            // Show/hide card based on all filters
            if (matchesSearch && matchesPrice && matchesCategory && matchesStock) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show/hide no results message
        noResults.style.display = visibleCount > 0 ? 'none' : 'block';
        updateProductCount(visibleCount);
        
        // Update URL with current filters
        updateUrlFilters();
    }
    
    // Update product count display
    function updateProductCount(visibleCount) {
        const showingCount = document.getElementById('showing-count');
        const totalCount = document.getElementById('total-count');
        
        if (showingCount && totalCount) {
            showingCount.textContent = visibleCount || '0';
            totalCount.textContent = productCards.length;
        }
    }
    
    // Update URL with current filters
    function updateUrlFilters() {
        const filters = getFilters();
        const params = new URLSearchParams();
        
        if (filters.searchTerm) params.set('q', filters.searchTerm);
        if (filters.minPrice > 0) params.set('min_price', filters.minPrice);
        if (filters.maxPrice < Infinity) params.set('max_price', filters.maxPrice);
        if (filters.categories.length > 0) params.set('categories', filters.categories.join(','));
        if (filters.inStockOnly) params.set('in_stock', '1');
        
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, '', newUrl);
    }
    
    // Initialize filters from URL
    function initFiltersFromUrl() {
        const params = new URLSearchParams(window.location.search);
        
        if (params.has('q')) searchInput.value = params.get('q');
        if (params.has('min_price')) minPriceInput.value = params.get('min_price');
        if (params.has('max_price')) maxPriceInput.value = params.get('max_price');
        if (params.has('categories')) {
            const urlCategories = params.get('categories').split(',');
            categoryFilters.forEach(checkbox => {
                checkbox.checked = urlCategories.includes(checkbox.value);
            });
        }
        inStockOnly.checked = params.has('in_stock');
        
        // Apply filters
        filterProducts();
    }

    // Initialize price slider
    function initPriceSlider() {
        // Find min and max prices from products
        const prices = productCards.map(card => parseFloat(card.getAttribute('data-price') || '0'));
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        
        // Set default values
        if (!minPriceInput.value) minPriceInput.value = Math.floor(minPrice);
        if (!maxPriceInput.value) maxPriceInput.value = Math.ceil(maxPrice);
        
        // Initialize slider if noUiSlider is available
        if (typeof noUiSlider !== 'undefined') {
            const slider = document.getElementById('price-slider');
            if (slider) {
                noUiSlider.create(slider, {
                    start: [minPrice, maxPrice],
                    connect: true,
                    range: {
                        'min': minPrice,
                        'max': maxPrice
                    },
                    step: 1
                });
                
                slider.noUiSlider.on('update', function(values) {
                    const [min, max] = values;
                    minPriceInput.value = Math.round(min);
                    maxPriceInput.value = Math.round(max);
                    filterProducts();
                });
            }
        }
    }

    // Reset all filters
    function resetFilters() {
        searchInput.value = '';
        minPriceInput.value = '';
        maxPriceInput.value = '';
        categoryFilters.forEach(checkbox => {
            checkbox.checked = true;
        });
        inStockOnly.checked = false;
        
        // Reinitialize price range
        initPriceSlider();
        
        // Apply filters
        filterProducts();
    }

    // Sort products
    function sortProducts() {
        const sortBy = sortSelect.value;
        const container = document.querySelector('.products-grid');
        const items = Array.from(container.children).filter(el => el.style.display !== 'none');
        
        items.sort((a, b) => {
            const aPrice = parseFloat(a.getAttribute('data-price') || '0');
            const bPrice = parseFloat(b.getAttribute('data-price') || '0');
            const aName = a.querySelector('.product-title').textContent.toLowerCase();
            const bName = b.querySelector('.product-title').textContent.toLowerCase();
            
            switch(sortBy) {
                case 'price-low':
                    return aPrice - bPrice;
                case 'price-high':
                    return bPrice - aPrice;
                case 'name-asc':
                    return aName.localeCompare(bName);
                case 'name-desc':
                    return bName.localeCompare(aName);
                default:
                    return 0;
            }
        });
        
        // Re-append sorted items
        items.forEach(item => container.appendChild(item));
    }

    // Event Listeners
    searchInput.addEventListener('input', debounce(filterProducts, 300));
    minPriceInput.addEventListener('change', filterProducts);
    maxPriceInput.addEventListener('change', filterProducts);
    categoryFilters.forEach(checkbox => {
        checkbox.addEventListener('change', filterProducts);
    });
    inStockOnly.addEventListener('change', filterProducts);
    resetFiltersBtn.addEventListener('click', resetFilters);
    sortSelect.addEventListener('change', sortProducts);
    
    // Initialize
    initPriceSlider();
    initFiltersFromUrl();
    sortProducts();
    
    // Make filterProducts available globally for debugging
    window.filterProducts = filterProducts;
    
    // Update product count function
    function updateProductCount() {
        const visibleProducts = document.querySelectorAll('.product-card[style="display: block"], .product-card:not([style])');
        const showingCount = document.getElementById('showing-count');
        const totalCount = document.getElementById('total-count');
        
        if (showingCount && totalCount && visibleProducts.length > 0) {
            showingCount.textContent = `1-${visibleProducts.length}`;
        } else if (showingCount) {
            showingCount.textContent = '0';
        }
    }
    
    // Pagination
    const itemsPerPage = 8; // Number of items per page
    let currentPage = 1;
    
    function updatePagination() {
        const visibleProducts = document.querySelectorAll('.product-card:not([style*="display: none"])');
        const totalPages = Math.ceil(visibleProducts.length / itemsPerPage);
        const pagination = document.querySelector('.pagination');
        
        if (!pagination) return;
        
        // Clear existing pagination
        pagination.innerHTML = '';
        
        if (totalPages <= 1) {
            pagination.style.display = 'none';
            return;
        }
        
        pagination.style.display = 'flex';
        
        // Previous button
        const prevBtn = document.createElement('a');
        prevBtn.href = '#';
        prevBtn.className = `page-link ${currentPage === 1 ? 'disabled' : ''}`;
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i> Previous';
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage > 1) {
                currentPage--;
                showPage(currentPage);
            }
        });
        pagination.appendChild(prevBtn);
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageLink = document.createElement('a');
            pageLink.href = '#';
            pageLink.className = `page-link ${i === currentPage ? 'active' : ''}`;
            pageLink.textContent = i;
            pageLink.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = i;
                showPage(currentPage);
            });
            pagination.appendChild(pageLink);
        }
        
        // Next button
        const nextBtn = document.createElement('a');
        nextBtn.href = '#';
        nextBtn.className = `page-link ${currentPage === totalPages ? 'disabled' : ''}`;
        nextBtn.innerHTML = 'Next <i class="fas fa-chevron-right"></i>';
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage < totalPages) {
                currentPage++;
                showPage(currentPage);
            }
        });
        pagination.appendChild(nextBtn);
    }
    
    function showPage(page) {
        const visibleProducts = document.querySelectorAll('.product-card:not([style*="display: none"])');
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        visibleProducts.forEach((product, index) => {
            if (index >= startIndex && index < endIndex) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
        
        updatePagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Initial count update and pagination
    updateProductCount();
    updatePagination();
    showPage(1);
    
    // Category filtering
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    // Apply sorting
    function applySorting() {
        const sortBy = sortSelect ? sortSelect.value : 'featured';
        sortProducts(sortBy);
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', applySorting);
    }
    
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
                    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
                    const title = card.querySelector('.product-title').textContent.toLowerCase();
                    const description = card.querySelector('.product-desc').textContent.toLowerCase();
                    const cardCategory = card.getAttribute('data-category') || '';
                    
                    const matchesCategory = category === 'all' || cardCategory === category;
                    const matchesSearch = !searchTerm || 
                                       title.includes(searchTerm) || 
                                       description.includes(searchTerm) ||
                                       cardCategory.includes(searchTerm);
                    
                    if (matchesCategory && matchesSearch) {
                        card.style.display = 'block';
                        // Trigger reflow for animation
                        void card.offsetWidth;
                        card.style.animation = 'fadeIn 0.5s ease-out forwards';
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                updateProductCount();
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
