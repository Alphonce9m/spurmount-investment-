// click-collect.js - Handles the Click & Collect counter functionality

document.addEventListener('DOMContentLoaded', function() {
    // Check if the click & collect container exists
    const clickCollectContainer = document.getElementById('click-collect-counter');
    if (!clickCollectContainer) return;
    
    // Configuration
    const config = {
        updateInterval: 30000, // 30 seconds
        ordersPerHour: 12,     // Average orders per hour
        maxOrders: 24,         // Max orders to show
        minOrders: 5,          // Min orders to show
        locations: ['Nairobi CBD', 'Westlands', 'Karen', 'Runda', 'Lavington']
    };
    
    // Initialize the counter
    function initClickCollect() {
        // Generate random order data
        const currentHour = new Date().getHours();
        const orderMultiplier = getOrderMultiplier(currentHour);
        const orderCount = Math.floor(Math.random() * (config.maxOrders - config.minOrders + 1)) + config.minOrders;
        const minutesAgo = Math.floor(Math.random() * 30) + 1;
        const location = config.locations[Math.floor(Math.random() * config.locations.length)];
        
        // Update the counter
        updateCounter(clickCollectContainer, orderCount, minutesAgo, location);
        
        // Update the counter periodically
        setInterval(() => {
            const currentCount = parseInt(clickCollectContainer.querySelector('.order-count').textContent);
            const newCount = Math.max(config.minOrders, Math.min(
                currentCount + (Math.random() > 0.5 ? 1 : -1),
                config.maxOrders
            ));
            
            updateCounter(
                clickCollectContainer, 
                newCount,
                Math.floor(Math.random() * 10) + 1, // 1-10 minutes ago
                config.locations[Math.floor(Math.random() * config.locations.length)]
            );
        }, config.updateInterval);
    }
    
    // Update the counter display
    function updateCounter(container, count, minutesAgo, location) {
        const countElement = container.querySelector('.order-count') || document.createElement('span');
        const textElement = container.querySelector('.counter-text') || document.createElement('span');
        const locationElement = container.querySelector('.location') || document.createElement('span');
        const timeElement = container.querySelector('.time-ago') || document.createElement('span');
        
        countElement.className = 'order-count';
        textElement.className = 'counter-text';
        locationElement.className = 'location';
        timeElement.className = 'time-ago';
        
        countElement.textContent = count;
        textElement.textContent = count === 1 ? 'order' : 'orders';
        locationElement.textContent = `at ${location}`;
        timeElement.textContent = `${minutesAgo} ${minutesAgo === 1 ? 'minute' : 'minutes'} ago`;
        
        // Clear and update container
        container.innerHTML = '';
        container.appendChild(countElement);
        container.appendChild(document.createTextNode(' '));
        container.appendChild(textElement);
        container.appendChild(document.createElement('br'));
        container.appendChild(document.createTextNode('Picked up '));
        container.appendChild(timeElement);
        container.appendChild(document.createTextNode(' '));
        container.appendChild(locationElement);
        
        // Add animation
        container.classList.add('updated');
        setTimeout(() => container.classList.remove('updated'), 1000);
    }
    
    // Get order multiplier based on time of day
    function getOrderMultiplier(hour) {
        // Higher multiplier during business hours
        if (hour >= 9 && hour < 12) return 1.5;  // Morning rush
        if (hour >= 12 && hour < 14) return 2.0;  // Lunch time
        if (hour >= 16 && hour < 19) return 2.5;  // After work
        if (hour >= 19 && hour < 22) return 1.8;  // Evening
        return 1.0;  // Off hours
    }
    
    // Initialize the counter
    initClickCollect();
});
