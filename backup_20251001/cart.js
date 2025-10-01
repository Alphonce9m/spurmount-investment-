// Shopping Cart Module
const Cart = (function() {
    // Cart state
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // DOM Elements
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartClose = document.querySelector('.cart-close');
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total-amount');
    const cartCheckoutBtn = document.querySelector('.cart-checkout');
    
    // Initialize cart functionality
    function init() {
        // Toggle cart sidebar
        if (cartIcon) {
            cartIcon.addEventListener('click', toggleCart);
        }
        
        if (cartClose) {
            cartClose.addEventListener('click', toggleCart);
        }
        
        // Close cart when clicking outside
        document.addEventListener('click', function(e) {
            if (cartSidebar.classList.contains('active') && 
                !e.target.closest('.cart-sidebar') && 
                !e.target.closest('.cart-icon')) {
                toggleCart();
            }
        });
        
        // Initialize cart count
        updateCartCount();
    }
    
    function toggleCart() {
        if (!cartSidebar) return;
        
        cartSidebar.classList.toggle('active');
        document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : '';
        if (cartSidebar.classList.contains('active')) {
            renderCart();
        }
    }
    
    // Add item to cart
    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push(product);
        }
        updateCart();
    }
    
    // Remove item from cart
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCart();
    }
    
    // Update cart item quantity
    function updateCartItem(productId, quantity) {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            updateCart();
        }
    }
    
    // Update cart in localStorage and UI
    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCount();
        updateCartTotal();
    }
    
    // Get cart item count
    function getCartItemCount() {
        return cart.reduce((total, item) => total + item.quantity, 0);
    }
    
    // Get cart total amount
    function getCartTotal() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    // Update cart count in header
    function updateCartCount() {
        const count = getCartItemCount();
        if (cartCount) {
            cartCount.textContent = count;
            cartCount.style.display = count > 0 ? 'flex' : 'none';
        }
        return count;
    }
    
    // Render cart items
    function renderCart() {
        if (!cartItems) return;
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
            if (cartTotal) {
                cartTotal.textContent = 'Ksh 0';
            }
            return;
        }
        
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image || 'images/placeholder-product.png'}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <div class="cart-item-price">Ksh ${item.price.toLocaleString()}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" type="button">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                        <button class="quantity-btn plus" type="button">+</button>
                    </div>
                </div>
                <button class="remove-item" type="button">&times;</button>
            </div>
        `).join('');
        
        // Add event listeners for quantity changes
        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', function() {
                const itemElement = this.closest('.cart-item');
                const id = itemElement.dataset.id;
                const input = itemElement.querySelector('.quantity-input');
                let quantity = parseInt(input.value);
                
                if (this.classList.contains('plus')) {
                    quantity += 1;
                } else if (this.classList.contains('minus') && quantity > 1) {
                    quantity -= 1;
                }
                
                updateCartItem(id, quantity);
            });
        });
        
        // Add event listeners for remove buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.closest('.cart-item').dataset.id;
                removeFromCart(id);
            });
        });
        
        updateCartTotal();
    }
    
    // Update cart total
    function updateCartTotal() {
        if (!cartTotal) return;
        
        const total = getCartTotal();
        cartTotal.textContent = `Ksh ${total.toLocaleString()}`;
    }
    
    // Checkout button
    if (cartCheckoutBtn) {
        cartCheckoutBtn.addEventListener('click', function() {
            if (cart.length === 0) return;
            
            // Generate WhatsApp message
            const message = cart.map(item => 
                `${item.quantity}x ${item.name} - Ksh ${(item.price * item.quantity).toLocaleString()}`
            ).join('%0A');
            
            const total = getCartTotal();
            const whatsappUrl = `https://wa.me/254700000000?text=Order%20Details:%0A%0A${message}%0A%0ATotal:%20Ksh%20${total.toLocaleString()}`;
            
            window.open(whatsappUrl, '_blank');
        });
    }
    
    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification show';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Public API
    return {
        init,
        addToCart,
        removeFromCart,
        updateCartItem,
        getCartItemCount,
        getCartTotal,
        updateCartCount,
        showNotification
    };
})();

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    Cart.init();
});

// Expose necessary functions to the global scope
window.addToCart = Cart.addToCart;
window.removeFromCart = Cart.removeFromCart;
window.updateCartItem = Cart.updateCartItem;
window.getCartItemCount = Cart.getCartItemCount;
window.getCartTotal = Cart.getCartTotal;
window.updateCartCount = Cart.updateCartCount;
window.showNotification = Cart.showNotification;
