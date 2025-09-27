// price-alerts.js - Handles price drop alerts functionality

// Price simulation function (for demo purposes only)
function getSimulatedPrice(alert) {
    // Generate a random price between 70% and 130% of the current price
    const min = Math.floor(alert.currentPrice * 0.7);
    const max = Math.ceil(alert.currentPrice * 1.3);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Format date to readable string
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize modals and UI
    initModals();
    initSortButtons();
    
    // Load and display saved alerts
    let savedAlerts = JSON.parse(localStorage.getItem('priceAlerts')) || [];
    const alertList = document.getElementById('price-alert-list');
    const noAlertsMessage = document.getElementById('no-alerts-message');
    
    // Initialize the alerts list
    updateAlertsList();
    
    // Handle price alert buttons
    document.addEventListener('click', function(e) {
        const priceAlertBtn = e.target.closest('.price-alert-btn');
        if (priceAlertBtn) {
            e.preventDefault();
            const productId = priceAlertBtn.dataset.productId;
            const productName = priceAlertBtn.dataset.productName;
            const currentPrice = parseFloat(priceAlertBtn.dataset.currentPrice);
            const image = priceAlertBtn.dataset.image;
            
            showPriceAlertModal({
                productId,
                productName,
                currentPrice,
                image
            });
        }
        
        // Handle remove alert button
        if (e.target.classList.contains('btn-remove-alert') || e.target.closest('.btn-remove-alert')) {
            e.preventDefault();
            const alertId = e.target.dataset.alertId || e.target.closest('.btn-remove-alert').dataset.alertId;
            removeAlert(alertId);
        }
        
        // Handle edit alert button
        if (e.target.classList.contains('btn-edit-alert') || e.target.closest('.btn-edit-alert')) {
            e.preventDefault();
            const alertId = e.target.dataset.alertId || e.target.closest('.btn-edit-alert').dataset.alertId;
            editAlert(alertId);
        }
    });
    
    // Handle form submissions
    document.addEventListener('submit', function(e) {
        if (e.target.classList.contains('price-alert-form')) {
            e.preventDefault();
            handlePriceAlertFormSubmit(e.target);
        }
    });
    
    // Check for price drops every minute
    setInterval(checkForPriceDrops, 60000);
    
    // Initialize the alerts list
    function initAlerts() {
        if (!alertList) return;
        
        // Clear existing list items
        alertList.innerHTML = '';
        
        if (savedAlerts.length === 0) {
            alertList.innerHTML = '<div class="no-alerts">You have no active price alerts.</div>';
            return;
        }
        
        // Add each alert to the list
        savedAlerts.forEach((alert, index) => {
            const alertItem = createAlertElement(alert, index);
            alertList.appendChild(alertItem);
        });
    }
    
    // Create alert list item element
    function createAlertElement(alert, index) {
        const alertItem = document.createElement('div');
        alertItem.className = 'alert-item';
        alertItem.dataset.index = index;
        
        const currentPrice = alert.currentPrice || alert.desiredPrice * 1.1; // If no current price, show 10% higher
        const discount = Math.round(((currentPrice - alert.desiredPrice) / currentPrice) * 100);
        
        alertItem.innerHTML = `
            <div class="alert-product">
                <img src="${alert.image || 'https://via.placeholder.com/60'}" alt="${alert.productName}" class="alert-product-image">
                <div class="alert-product-info">
                    <h4>${alert.productName}</h4>
                    <div class="alert-prices">
                        <span class="current-price">Ksh ${currentPrice.toLocaleString()}</span>
                        <span class="desired-price">Alert at: Ksh ${alert.desiredPrice.toLocaleString()}</span>
                        <span class="discount-badge">${discount}% off</span>
                    </div>
                </div>
            </div>
            <div class="alert-actions">
                <button class="btn-remove-alert" data-index="${index}" aria-label="Remove alert">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        return alertItem;
    }
    
    // Handle price alert form submission
    if (priceAlertForms.length > 0) {
        priceAlertForms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const productName = form.dataset.productName || 'Selected Product';
                const currentPrice = parseFloat(form.dataset.currentPrice) || 0;
                const desiredPrice = parseFloat(form.querySelector('.desired-price-input').value);
                const email = form.querySelector('.alert-email-input') ? 
                    form.querySelector('.alert-email-input').value.trim() : '';
                
                if (isNaN(desiredPrice) || desiredPrice <= 0) {
                    showAlert('Please enter a valid price.', 'error');
                    return;
                }
                
                if (email && !isValidEmail(email)) {
                    showAlert('Please enter a valid email address.', 'error');
                    return;
                }
                
                const newAlert = {
                    productName,
                    currentPrice,
                    desiredPrice,
                    email,
                    date: new Date().toISOString(),
                    productId: form.dataset.productId || '',
                    image: form.dataset.productImage || ''
                };
                
                // Add to saved alerts
                savedAlerts.push(newAlert);
                localStorage.setItem('priceAlerts', JSON.stringify(savedAlerts));
                
                // Update the UI
                if (alertList) {
                    initAlerts();
                }
                
                // Show success message
                showAlert(`Price alert set for ${productName} at Ksh ${desiredPrice.toLocaleString()}!`, 'success');
                
                // Reset form
                form.reset();
                
                // Close modal if exists
                const modal = form.closest('.modal');
                if (modal) {
                    closeModal(modal.id);
                }
            });
        });
    }
    
    // Handle remove alert button clicks
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-remove-alert')) {
            const button = e.target.closest('.btn-remove-alert');
            const index = button.dataset.index;
            
            // Remove alert from array
            savedAlerts.splice(index, 1);
            localStorage.setItem('priceAlerts', JSON.stringify(savedAlerts));
            
            // Update UI
            initAlerts();
            
            showAlert('Price alert removed.', 'info');
        }
    });
    
    // Show price alert modal
    function showPriceAlertModal(product, options = {}) {
        const isEdit = options.isEdit || false;
        const alertId = options.alertId || null;
        // Create modal if it doesn't exist
        let modal = document.getElementById('price-alert-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'price-alert-modal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">Set Price Alert</h3>
                        <button type="button" class="btn-close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="product-info">
                            <img src="${product.image || 'https://via.placeholder.com/100'}" alt="${product.productName}" class="product-thumb">
                            <div>
                                <h4>${product.productName}</h4>
                                <p class="current-price">Current Price: Ksh ${product.currentPrice.toLocaleString()}</p>
                            </div>
                        </div>
                        <form class="price-alert-form" data-product-id="${product.productId}" data-product-name="${product.productName}" data-current-price="${product.currentPrice}" ${isEdit ? `data-alert-id="${alertId}"` : ''}>
                            <div class="form-group">
                                <label for="alert-price">Notify me when price is below:</label>
                                <div class="input-group">
                                    <span class="input-prefix">Ksh</span>
                                    <input type="number" id="alert-price" class="form-control" 
                                           placeholder="Enter your desired price" 
                                           step="0.01" 
                                           min="0.01" 
                                           max="${product.currentPrice}" 
                                           value="${isEdit ? product.desiredPrice : ''}"
                                           required>
                                </div>
                                <small class="form-text text-muted">
                                    ${isEdit ? 
                                        `Current price: Ksh ${product.currentPrice.toLocaleString()}` : 
                                        `We'll notify you when the price drops below this amount (max: Ksh ${product.currentPrice.toLocaleString()})`
                                    }
                                </small>
                            </div>
                            <div class="form-group">
                                <label for="alert-email">Email address (optional):</label>
                                <input type="email" id="alert-email" class="form-control" 
                                       placeholder="Enter your email for notifications"
                                       value="${isEdit && product.email ? product.email : ''}">
                                <small class="form-text text-muted">We'll also notify you via email when the price drops</small>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block">
                                ${isEdit ? 'Update Price Alert' : 'Set Price Alert'}
                            </button>
                        </form>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            
            // Close modal when clicking outside or on close button
            modal.addEventListener('click', function(e) {
                if (e.target === modal || e.target.classList.contains('btn-close-modal')) {
                    closeModal('price-alert-modal');
                }
            });
        }
        
        // Update product info
        const productInfo = modal.querySelector('.product-info');
        if (productInfo) {
            productInfo.querySelector('img').src = product.image || 'https://via.placeholder.com/100';
            productInfo.querySelector('h4').textContent = product.productName;
            productInfo.querySelector('.current-price').textContent = `Current Price: Ksh ${product.currentPrice.toLocaleString()}`;
        }
        
        // Update form data
        const form = modal.querySelector('.price-alert-form');
        if (form) {
            form.dataset.productId = product.productId;
            form.dataset.productName = product.productName;
            form.dataset.currentPrice = product.currentPrice;
            form.dataset.image = product.image;
            form.reset();
            
            // Set max price to current price
            const priceInput = form.querySelector('input[type="number"]');
            if (priceInput) {
                priceInput.max = product.currentPrice;
                priceInput.placeholder = `Max: Ksh ${product.currentPrice.toLocaleString()}`;
            }
        }
        
        // Show modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    // Initialize modals
    function initModals() {
        // Close modals when clicking outside
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        
        // Close modals with ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const modals = document.querySelectorAll('.modal');
                modals.forEach(modal => {
                    if (modal.style.display === 'flex') {
                        modal.style.display = 'none';
                        document.body.style.overflow = 'auto';
                    }
                });
            }
        });
    }
    
    // Close modal by ID
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    // Handle price alert form submission
    function handlePriceAlertFormSubmit(form) {
        const productId = form.dataset.productId;
        const productName = form.dataset.productName;
        const currentPrice = parseFloat(form.dataset.currentPrice);
        const image = form.dataset.image;
        const desiredPrice = parseFloat(form.querySelector('input[type="number"]').value);
        const email = form.querySelector('input[type="email"]')?.value || '';
        
        if (isNaN(desiredPrice) || desiredPrice <= 0) {
            showAlert('Please enter a valid price.', 'error');
            return;
        }
        
        if (email && !isValidEmail(email)) {
            showAlert('Please enter a valid email address.', 'error');
            return;
        }
        
        // Create new alert
        const newAlert = {
            id: Date.now().toString(),
            productId,
            productName,
            currentPrice,
            desiredPrice,
            email,
            image,
            date: new Date().toISOString(),
            active: true
        };
        
        // Save to localStorage
        const savedAlerts = JSON.parse(localStorage.getItem('priceAlerts') || '[]');
        savedAlerts.push(newAlert);
        localStorage.setItem('priceAlerts', JSON.stringify(savedAlerts));
        
        // Show success message
        showAlert(`Price alert set for ${productName} at Ksh ${desiredPrice.toLocaleString()}!`, 'success');
        
        // Close modal
        closeModal('price-alert-modal');
        
        // Update alerts list if on price alerts page
        if (window.location.pathname.includes('price-alerts.html')) {
            initAlerts();
        }
    }
    
    // Check for price drops (simulated)
    function checkForPriceDrops() {
        savedAlerts.forEach((alert, index) => {
            // Simulate price changes (in a real app, this would come from your backend)
            const currentPrice = getSimulatedPrice(alert);
            
            if (currentPrice <= alert.desiredPrice) {
                // Price dropped below or reached desired price
                showPriceDropNotification(alert, currentPrice);
                
                // Remove the alert after notifying (or keep it for future drops)
                // savedAlerts.splice(index, 1);
                // localStorage.setItem('priceAlerts', JSON.stringify(savedAlerts));
            }
        });
    }
    
    // Simulate price changes (for demo purposes)
    function getSimulatedPrice(alert) {
        // In a real app, this would be an API call to get current price
        const basePrice = alert.currentPrice || alert.desiredPrice * 1.1;
        const randomFactor = 0.9 + (Math.random() * 0.3); // Between 0.9 and 1.2
        return Math.round(basePrice * randomFactor * 10) / 10;
    }
    
    // Show price drop notification
    function showPriceDropNotification(alert, currentPrice) {
        const notification = document.createElement('div');
        notification.className = 'price-drop-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-tag"></i>
                <div class="notification-text">
                    <strong>Price Drop!</strong> ${alert.productName} is now Ksh ${currentPrice.toLocaleString()}
                </div>
                <button class="btn-close-notification">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => notification.remove(), 300);
        }, 10000);
        
        // Close button
        notification.querySelector('.btn-close-notification').addEventListener('click', () => {
            notification.classList.add('hide');
            setTimeout(() => notification.remove(), 300);
        });
    }
    
    // Helper functions
    function showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        
        // Add to page (you might want to customize this based on your layout)
        const container = document.querySelector('.alerts-container') || document.body;
        container.insertBefore(alertDiv, container.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            alertDiv.classList.add('fade-out');
            setTimeout(() => alertDiv.remove(), 300);
        }, 5000);
    }
    
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    // Initialize the alerts list
    initAlerts();
    
    // Check for price drops every minute (in a real app, this would be server-side)
    setInterval(checkForPriceDrops, 60000);
});
