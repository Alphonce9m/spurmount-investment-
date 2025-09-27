// update-nav.js - Script to update navigation in all HTML files
const fs = require('fs');
const path = require('path');

// Directory containing HTML files
const htmlDir = __dirname;

// Get all HTML files in the directory
const htmlFiles = fs.readdirSync(htmlDir).filter(file => file.endsWith('.html'));

// Function to update navigation in a file
function updateNavigation(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Define the navigation menu structure with Price Alerts
    const navHtml = `
                        <li><a href="index.html" class="${filePath.endsWith('index.html') ? 'active' : ''}">Home</a></li>
                        <li class="dropdown">
                            <a href="products.html">Products <i class="fas fa-chevron-down"></i></a>
                            <ul class="dropdown-menu">
                                <li><a href="products.html?category=electronics">Electronics</a></li>
                                <li><a href="products.html?category=groceries">Groceries</a></li>
                                <li><a href="products.html?category=beverages">Beverages</a></li>
                                <li><a href="products.html?category=household">Household</a></li>
                                <li><a href="products.html?category=personal-care">Personal Care</a></li>
                            </ul>
                        </li>
                        <li><a href="how-to-order.html" class="${filePath.endsWith('how-to-order.html') ? 'active' : ''}">How to Order</a></li>
                        <li><a href="price-alerts.html" class="price-alerts-link ${filePath.endsWith('price-alerts.html') ? 'active' : ''}">
                            <i class="fas fa-bell"></i> Price Alerts
                            <span class="alert-count" id="price-alert-count"></span>
                        </a></li>
                        <li><a href="payment.html" class="${filePath.endsWith('payment.html') ? 'active' : ''}">Payment</a></li>
                        <li><a href="delivery.html" class="${filePath.endsWith('delivery.html') ? 'active' : ''}">Delivery</a></li>
                        <li><a href="about.html" class="${filePath.endsWith('about.html') ? 'active' : ''}">About Us</a></li>
                        <li><a href="contact.html" class="${filePath.endsWith('contact.html') ? 'active' : ''}">Contact</a></li>`;

    // Check if navigation exists in the file
    if (content.includes('class="nav-links"')) {
        // Replace the navigation menu content
        const navRegex = /<ul class="nav-links">[\s\S]*?<\/ul>/;
        if (navRegex.test(content)) {
            content = content.replace(navRegex, `<ul class="nav-links">${navHtml}\n                    </ul>`);
            
            // Save the updated content
            fs.writeFileSync(filePath, content, 'utf8');
            return true;
        }
    }
    return false;
}

// Update each HTML file
htmlFiles.forEach(file => {
    // Skip price-alerts.html to avoid duplicate links
    if (file === 'price-alerts.html') return;
    
    const filePath = path.join(htmlDir, file);
    try {
        if (updateNavigation(filePath)) {
            console.log(`✅ Updated navigation in ${file}`);
        } else {
            console.log(`⚠️  Skipped ${file} - no navigation found or already up to date`);
        }
    } catch (error) {
        console.error(`❌ Error updating ${file}:`, error.message);
    }
});

console.log('\nNavigation update complete!');
