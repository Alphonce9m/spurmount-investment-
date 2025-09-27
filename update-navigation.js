// update-navigation.js - Script to update navigation menus across all HTML files
const fs = require('fs');
const path = require('path');

// Directory containing HTML files
const htmlDir = __dirname;

// Get all HTML files in the directory
const htmlFiles = fs.readdirSync(htmlDir).filter(file => file.endsWith('.html'));

// Navigation menu items
const locationsItem = '<li><a href="locations.html">Locations</a></li>';

// Process each HTML file
htmlFiles.forEach(file => {
    // Skip the locations.html file itself
    if (file === 'locations.html') {
        console.log(`Skipped ${file} (locations page)`);
        return;
    }

    const filePath = path.join(htmlDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Find the navigation menu
    const navRegex = /(<ul[^>]*class=["']nav-links["'][^>]*>)([\s\S]*?)(<\/ul>)/i;
    const match = content.match(navRegex);
    
    if (match) {
        const [fullMatch, openingTag, menuContent, closingTag] = match;
        
        // Check if Locations link already exists
        if (!menuContent.includes('locations.html')) {
            // Insert Locations link after Delivery and before About Us
            let updatedMenuContent = menuContent.replace(
                /(<li><a[^>]*href=["']delivery\.html["'][^>]*>Delivery<\/a><\/li>\s*<li><a[^>]*href=["']about\.html["'][^>]*>About Us<\/a><\/li>)/i,
                `$1\n                        <li><a href="locations.html" class="${file === 'locations.html' ? 'active' : ''}">Locations</a></li>`
            );
            
            // If the specific replacement didn't work, try a more general approach
            if (updatedMenuContent === menuContent) {
                updatedMenuContent = menuContent.replace(
                    /(<li><a[^>]*href=["']delivery\.html["'][^>]*>Delivery<\/a><\/li>)/i,
                    `$1\n                        <li><a href="locations.html" class="${file === 'locations.html' ? 'active' : ''}">Locations</a></li>`
                );
            }
            
            // If still no match, just add before the closing ul
            if (updatedMenuContent === menuContent) {
                updatedMenuContent = menuContent.replace(
                    /(<\/ul>)/i,
                    `\n                        <li><a href="locations.html" class="${file === 'locations.html' ? 'active' : ''}">Locations</a></li>$1`
                );
            }
            
            // Replace the old menu with the updated one
            const updatedContent = content.replace(
                navRegex, 
                `$1${updatedMenuContent}$3`
            );
            
            // Save the updated file
            fs.writeFileSync(filePath, updatedContent, 'utf8');
            console.log(`✅ Updated navigation in ${file}`);
        } else {
            console.log(`ℹ️  Skipped ${file} (already has Locations link)`);
        }
    } else {
        console.log(`Skipped ${file} (no navigation menu found)`);
    }
});

console.log('Navigation update complete!');
