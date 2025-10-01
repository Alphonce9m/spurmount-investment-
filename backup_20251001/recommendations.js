// recommendations.js - Handles personalized product recommendations

document.addEventListener('DOMContentLoaded', function() {
    // Sample product data - in a real app, this would come from your backend
    const products = [
        { 
            id: 1, 
            name: 'Tusker Lager Beer Crate', 
            category: 'Beverages',
            price: 2400,
            image: 'https://via.placeholder.com/300x200',
            description: '24 x 500ml bottles of Tusker Lager'
        },
        { 
            id: 2, 
            name: 'Dettol Hand Sanitizer 500ml', 
            category: 'Health & Beauty',
            price: 450,
            image: 'https://via.placeholder.com/300x200',
            description: 'Kills 99.9% of germs and bacteria'
        },
        { 
            id: 3, 
            name: 'Blue Band Margarine 1kg', 
            category: 'Groceries',
            price: 320,
            image: 'https://via.placeholder.com/300x200',
            description: 'Perfect for baking and cooking'
        },
        { 
            id: 4, 
            name: 'Colgate Toothpaste 200g', 
            category: 'Health & Beauty',
            price: 180,
            image: 'https://via.placeholder.com/300x200',
            description: 'For strong teeth and fresh breath'
        },
        { 
            id: 5, 
            name: 'Sunlight Washing Powder 5kg', 
            category: 'Household',
            price: 1250,
            image: 'https://via.placeholder.com/300x200',
            description: 'Tough on stains, gentle on colors'
        },
        { 
            id: 6, 
            name: 'Coca Cola 2L Bottle', 
            category: 'Beverages',
            price: 180,
            image: 'https://via.placeholder.com/300x200',
            description: 'Refreshing cola drink'
        },
        { 
            id: 7, 
            name: 'Dawaat Basmati Rice 5kg', 
            category: 'Groceries',
            price: 1250,
            image: 'https://via.placeholder.com/300x200',
            description: 'Premium quality basmati rice'
        },
        { 
            id: 8, 
            name: 'Omo Detergent 1kg', 
            category: 'Household',
            price: 280,
            image: 'https://via.placeholder.com/300x200',
            description: 'Removes tough stains in one wash'
        }
    ];

    // Frequently Bought Together combinations (productId: [relatedProductIds])
    const frequentlyBoughtTogether = {
        1: [6, 2],  // Tusker + Coke + Sanitizer
        2: [4, 5],   // Sanitizer + Toothpaste + Washing Powder
        3: [7, 8],   // Blue Band + Rice + Omo
        4: [2, 5],   // Toothpaste + Sanitizer + Washing Powder
        5: [2, 4],   // Washing Powder + Sanitizer + Toothpaste
        6: [1, 2],   // Coke + Tusker + Sanitizer
        7: [3, 8],   // Rice + Blue Band + Omo
        8: [3, 7]    // Omo + Blue Band + Rice
    };

    // Customers Also Bought combinations (productId: [relatedProductIds])
    const customersAlsoBought = {
        1: [6, 2, 3, 5],
        2: [4, 5, 1, 6],
        3: [7, 8, 1, 2],
        4: [2, 5, 7, 3],
        5: [2, 4, 8, 7],
        6: [1, 2, 3, 4],
        7: [3, 8, 5, 2],
        8: [3, 7, 5, 4]
    };

    // Get URL parameters to determine current product
    function getProductIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return parseInt(urlParams.get('id')) || 1; // Default to product 1 if no ID in URL
    }

    // Create a product card HTML
    function createProductCard(product) {
        return `
            <div class="product-card" data-category="${product.category.toLowerCase()}">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <div class="product-badges">
                        ${product.id % 3 === 0 ? '<span class="product-badge badge-new">New</span>' : ''}
                        ${product.id % 5 === 0 ? '<span class="product-badge badge-sale">Sale</span>' : ''}
                    </div>
                </div>
                <div class="product-details">
                    <h3>${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">
                        <span class="current-price">Ksh ${product.price.toLocaleString()}</span>
                        ${product.id % 4 === 0 ? 
                          `<span class="original-price">Ksh ${(product.price * 1.2).toLocaleString()}</span>
                           <span class="discount-badge">-20%</span>` 
                          : ''
                        }
                    </div>
                    <a href="https://wa.me/254712345678?text=I%20would%20like%20to%20order%20${encodeURIComponent(product.name)}" 
                       class="add-to-cart">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </a>
                </div>
            </div>
        `;
    }

    // Render recommendation section
    function renderRecommendationSection(containerId, title, productIds) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const recommendedProducts = productIds.map(id => 
            products.find(p => p.id === id)
        ).filter(Boolean);

        if (recommendedProducts.length === 0) return;

        const productsHTML = recommendedProducts.map(createProductCard).join('');
        
        container.innerHTML = `
            <div class="section-header">
                <h2 class="section-title">${title}</h2>
            </div>
            <div class="products-grid recommendations-grid">
                ${productsHTML}
            </div>
        `;
    }

    // Initialize recommendations
    function initRecommendations() {
        const currentProductId = getProductIdFromUrl();
        
        // Get recommendations for the current product
        const fbtProducts = frequentlyBoughtTogether[currentProductId] || [6, 2, 3];
        const cabProducts = customersAlsoBought[currentProductId] || [4, 5, 7, 8];
        
        // Render both recommendation sections
        renderRecommendationSection('frequently-bought-together', 'Frequently Bought Together', fbtProducts);
        renderRecommendationSection('customers-also-bought', 'Customers Also Bought', cabProducts);
    }

    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRecommendations);
    } else {
        initRecommendations();
    }
});
