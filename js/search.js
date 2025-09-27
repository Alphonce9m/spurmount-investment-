// Search functionality with autocomplete
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    
    if (!searchInput) return;
    
    // Sample product data - in a real app, this would come from your backend
    const products = [
        { id: 1, name: 'Tusker Lager Beer Crate', category: 'Beverages' },
        { id: 2, name: 'Dettol Hand Sanitizer 500ml', category: 'Health & Beauty' },
        { id: 3, name: 'Blue Band Margarine 500g', category: 'Dairy' },
        { id: 4, name: 'Colgate Toothpaste 200g', category: 'Personal Care' },
        { id: 5, name: 'Dettol Antiseptic Liquid 200ml', category: 'Health & Beauty' },
        { id: 6, name: 'Omo Detergent 5kg', category: 'Household' },
        { id: 7, name: 'Dairy Milk Chocolate 200g', category: 'Confectionery' },
        { id: 8, name: 'Coca Cola 2L', category: 'Beverages' },
        { id: 9, name: 'Sunlight Washing Powder 5kg', category: 'Household' },
        { id: 10, name: 'Royco Mchuzi Mix 100g', category: 'Food' },
    ];

    // Function to filter products based on search input
    function searchProducts(query) {
        if (!query) return [];
        const lowerCaseQuery = query.toLowerCase();
        return products.filter(product => 
            product.name.toLowerCase().includes(lowerCaseQuery) ||
            product.category.toLowerCase().includes(lowerCaseQuery)
        );
    }

    // Function to display search results
    function displayResults(results) {
        searchResults.innerHTML = '';
        
        if (results.length === 0) {
            searchResults.style.display = 'none';
            return;
        }
        
        const resultsList = document.createElement('ul');
        resultsList.className = 'search-results-list';
        
        results.forEach(product => {
            const listItem = document.createElement('li');
            listItem.className = 'search-result-item';
            listItem.innerHTML = `
                <a href="product-details.html?id=${product.id}" class="search-result-link">
                    <span class="product-name">${product.name}</span>
                    <span class="product-category">${product.category}</span>
                </a>
            `;
            resultsList.appendChild(listItem);
        });
        
        searchResults.appendChild(resultsList);
        searchResults.style.display = 'block';
    }

    // Event listener for search input
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.trim();
        if (query.length < 2) {
            searchResults.style.display = 'none';
            return;
        }
        
        const results = searchProducts(query);
        displayResults(results);
    });

    // Close search results when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });

    // Handle keyboard navigation
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            searchResults.style.display = 'none';
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            const items = searchResults.querySelectorAll('.search-result-item');
            if (items.length === 0) return;
            
            let currentIndex = -1;
            items.forEach((item, index) => {
                if (item.classList.contains('active')) {
                    item.classList.remove('active');
                    currentIndex = index;
                }
            });
            
            if (e.key === 'ArrowDown') {
                currentIndex = (currentIndex + 1) % items.length;
            } else {
                currentIndex = (currentIndex - 1 + items.length) % items.length;
            }
            
            items[currentIndex].classList.add('active');
            items[currentIndex].scrollIntoView({ block: 'nearest' });
            searchInput.value = items[currentIndex].querySelector('.product-name').textContent;
        } else if (e.key === 'Enter') {
            const activeItem = searchResults.querySelector('.search-result-item.active');
            if (activeItem) {
                window.location.href = activeItem.querySelector('a').href;
            }
        }
    });
});
