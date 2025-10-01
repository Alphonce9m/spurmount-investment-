/**
 * Enhanced Search Functionality for SpurMount Wholesale
 * Features:
 * - Real-time search with debounce
 * - Product images in results
 * - Price display
 * - Keyboard navigation
 * - Mobile responsive
 * - Multiple search instances support
 */

document.addEventListener('DOMContentLoaded', function() {
    // Desktop search elements
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    // Mobile search elements
    const mobileSearchForm = document.getElementById('mobileSearchForm');
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    const mobileSearchResults = document.getElementById('mobileSearchResults');
    const mobileSearchFormMenu = document.getElementById('mobileSearchFormMenu');
    const mobileSearchInputMenu = document.getElementById('mobileSearchInputMenu');
    const mobileSearchOverlay = document.querySelector('.mobile-search-overlay');
    const mobileSearchToggle = document.querySelector('.search-toggle-btn');
    const mobileSearchClose = document.querySelector('.mobile-search-close');
    
    // Initialize search functionality for all search inputs
    if (searchInput && searchResults) {
        initSearch(searchInput, searchResults);
    }
    
    if (mobileSearchInput && mobileSearchResults) {
        initSearch(mobileSearchInput, mobileSearchResults);
    }
    
    // Handle menu search form submission
    if (mobileSearchInputMenu && mobileSearchFormMenu) {
        // Redirect to search page on form submission for the menu search
        mobileSearchFormMenu.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = mobileSearchInputMenu.value.trim();
            if (query) {
                window.location.href = `products.html?search=${encodeURIComponent(query)}`;
            }
        });
        
        // Also initialize search functionality for menu search
        const menuSearchResults = document.createElement('div');
        menuSearchResults.className = 'search-results';
        mobileSearchFormMenu.parentNode.insertBefore(menuSearchResults, mobileSearchFormMenu.nextSibling);
        
        initSearch(mobileSearchInputMenu, menuSearchResults);
    }
    
    // Mobile search toggle functionality
    if (mobileSearchToggle && mobileSearchOverlay) {
        mobileSearchToggle.addEventListener('click', function(e) {
            e.preventDefault();
            document.body.classList.add('search-open');
            mobileSearchOverlay.classList.add('active');
            setTimeout(() => {
                if (mobileSearchInput) mobileSearchInput.focus();
            }, 300);
        });
    }
    
    if (mobileSearchClose && mobileSearchOverlay) {
        mobileSearchClose.addEventListener('click', function() {
            document.body.classList.remove('search-open');
            mobileSearchOverlay.classList.remove('active');
            
            // Clear search results when closing
            if (mobileSearchResults) {
                mobileSearchResults.innerHTML = '';
                mobileSearchResults.classList.remove('active');
            }
            
            // Clear search input
            if (mobileSearchInput) {
                mobileSearchInput.value = '';
            }
        });
    }
    
    // Close search when clicking outside
    document.addEventListener('click', function(e) {
        // For desktop search
        if (searchResults && searchForm && !searchForm.contains(e.target)) {
            searchResults.classList.remove('active');
        }
        
        // For mobile search overlay
        if (mobileSearchResults && mobileSearchForm && !mobileSearchForm.contains(e.target)) {
            mobileSearchResults.classList.remove('active');
        }
    });
    
    // Close mobile search when pressing escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileSearchOverlay && mobileSearchOverlay.classList.contains('active')) {
            document.body.classList.remove('search-open');
            mobileSearchOverlay.classList.remove('active');
            
            if (mobileSearchResults) {
                mobileSearchResults.innerHTML = '';
                mobileSearchResults.classList.remove('active');
            }
            
            if (mobileSearchInput) {
                mobileSearchInput.value = '';
            }
        }
    });
    
    // Show loading state
    function showLoading(container) {
        container.innerHTML = `
            <div class="search-loading">
                <div class="spinner"></div>
                <p>Searching products...</p>
            </div>`;
        container.classList.add('active');
    }

    // Show error state
    function showError(container, message) {
        container.innerHTML = `
            <div class="search-error">
                <i class="fas fa-exclamation-circle"></i>
                <p>${message || 'An error occurred while searching'}</p>
            </div>`;
        container.classList.add('active');
    }

    // Initialize search functionality for a given input and results container
    function initSearch(inputElement, resultsContainer) {
    
        // Sample product data - in a real app, this would come from your backend API
        const products = [
        { 
            id: 1, 
            name: 'Tusker Lager Beer Crate (24 x 500ml)', 
            category: 'Beverages',
            price: 2500,
            image: 'images/products/tusker.jpg',
            stock: 15
        },
        { 
            id: 2, 
            name: 'Dettol Hand Sanitizer 500ml', 
            category: 'Health & Beauty',
            price: 450,
            image: 'images/products/dettol-sanitizer.jpg',
            stock: 8
        },
        { 
            id: 3, 
            name: 'Blue Band Margarine 500g', 
            category: 'Dairy',
            price: 180,
            image: 'images/products/blue-band.jpg',
            stock: 22
        },
        { 
            id: 4, 
            name: 'Colgate Toothpaste 200g', 
            category: 'Personal Care',
            price: 320,
            image: 'images/products/colgate.jpg',
            stock: 14
        },
        { 
            id: 5, 
            name: 'Dettol Antiseptic Liquid 200ml', 
            category: 'Health & Beauty',
            price: 280,
            image: 'images/products/dettol-liquid.jpg',
            stock: 17
        },
        { 
            id: 6, 
            name: 'Omo Detergent 5kg', 
            category: 'Household',
            price: 1250,
            image: 'images/products/omo.jpg',
            stock: 9
        },
        { 
            id: 7, 
            name: 'Dairy Milk Chocolate 200g', 
            category: 'Confectionery',
            price: 350,
            image: 'images/products/dairy-milk.jpg',
            stock: 31
        },
        { 
            id: 8, 
            name: 'Coca Cola 2L', 
            category: 'Beverages',
            price: 220,
            image: 'images/products/coke.jpg',
            stock: 42
        },
        { 
            id: 9, 
            name: 'Sunlight Washing Powder 5kg', 
            category: 'Household',
            price: 1350,
            image: 'images/products/sunlight.jpg',
            stock: 7
        },
        { 
            id: 10, 
            name: 'Royco Mchuzi Mix 100g', 
            category: 'Food',
            price: 85,
            image: 'images/products/royco.jpg',
            stock: 26
        },
    ];

        // Debounce function to limit how often the search runs
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

        // Function to filter products based on search input
        function searchProducts(query) {
        if (!query || query.length < 2) return [];
        
        const lowerCaseQuery = query.toLowerCase().trim();
        const searchTerms = lowerCaseQuery.split(' ');
        
        return products.filter(product => {
            const productText = `${product.name} ${product.category}`.toLowerCase();
            return searchTerms.every(term => productText.includes(term));
        });
    }

        // Function to display search results
        function displayResults(results, container) {
            container.innerHTML = '';
        
            if (results.length === 0) {
                if (inputElement.value.trim() !== '') {
                    container.innerHTML = `
                        <div class="search-no-results">
                            <i class="fas fa-search"></i>
                            <p>No products found for "${inputElement.value}"</p>
                            <p class="small">Try different keywords or check our <a href="products.html">products page</a></p>
                        </div>`;
                    container.classList.add('active');
                } else {
                    container.classList.remove('active');
                }
                return;
            }
        
            const resultsList = document.createElement('div');
            resultsList.className = 'search-results-list';
        
            // Show top 5 results initially
            const topResults = results.slice(0, 5);
            
            topResults.forEach(product => {
                const resultItem = document.createElement('a');
                resultItem.href = `product-detail.html?id=${product.id}`;
                resultItem.className = 'search-result-item';
                resultItem.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'">
                    <div class="search-result-info">
                        <h4>${product.name}</h4>
                        <div class="search-result-price">KSh ${product.price.toLocaleString()}</div>
                        ${product.stock > 0 ? 
                            `<span class="stock in-stock">In Stock (${product.stock})</span>` : 
                            '<span class="stock out-of-stock">Out of Stock</span>'}
                    </div>`;
                resultsList.appendChild(resultItem);
            });
            
            // Add view all results link if there are more than 5 results
            if (results.length > 5) {
                const viewAllLink = document.createElement('a');
                viewAllLink.href = `products.html?search=${encodeURIComponent(inputElement.value)}`;
                viewAllLink.className = 'view-all-results';
                viewAllLink.textContent = `View all ${results.length} results`;
                resultsList.appendChild(viewAllLink);
            }
            
            container.appendChild(resultsList);
            container.classList.add('active');
    }
        // Event listeners for search functionality
        inputElement.addEventListener('input', debounce(async function() {
            const query = this.value.trim();
            
            if (query.length < 2) {
                container.classList.remove('active');
                return;
            }
            
            try {
                showLoading(container);
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 300));
                const results = searchProducts(query);
                displayResults(results, container);
            } catch (error) {
                console.error('Search error:', error);
                showError(container, 'Failed to load search results. Please try again.');
            }
        }, 300));
        
        // Handle form submission
        const form = inputElement.closest('form');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const query = inputElement.value.trim();
                if (query) {
                    window.location.href = `products.html?search=${encodeURIComponent(query)}`;
                }
            });
        }
        
        // Keyboard navigation in search results
        let selectedIndex = -1;
        
        inputElement.addEventListener('keydown', function(e) {
            const results = container.querySelectorAll('.search-result-item');
            
            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
                    updateSelectedResult(results);
                    break;
                    
                case 'ArrowUp':
                    e.preventDefault();
                    selectedIndex = Math.max(selectedIndex - 1, -1);
                    updateSelectedResult(results);
                    break;
                    
                case 'Enter':
                    e.preventDefault();
                    if (selectedIndex >= 0 && results[selectedIndex]) {
                        window.location.href = results[selectedIndex].href;
                    } else if (inputElement.value.trim() && form) {
                        form.dispatchEvent(new Event('submit'));
                    }
                    break;
                    
                case 'Escape':
                    container.classList.remove('active');
                    break;
            }
        });
        
        function updateSelectedResult(results) {
            results.forEach((result, index) => {
                if (index === selectedIndex) {
                    result.classList.add('selected');
                    result.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                } else {
                    result.classList.remove('selected');
                }
            });
        }
    }
    // Remove any duplicate event listeners that might have been added
    if (searchInput) {
        const newSearchInput = searchInput.cloneNode(true);
        searchInput.parentNode.replaceChild(newSearchInput, searchInput);
        searchInput = newSearchInput;
    }
});
