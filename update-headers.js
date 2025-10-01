const fs = require('fs');
const path = require('path');

// List of HTML files to update
const htmlFiles = [
    'index.html',
    'products.html',
    'about.html',
    'contact.html',
    'how-to-order.html'
];

// The header partial content
const headerPartial = '<!--#include virtual="partials/header.html" -->';

// Function to update a single file
function updateFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if the file already includes the header partial
        if (content.includes(headerPartial)) {
            console.log(`Skipping ${filePath} - already includes header partial`);
            return;
        }
        
        // Find the header section to replace
        const headerStart = content.indexOf('<!-- Top Bar -->');
        const headerEnd = content.indexOf('</header>') + 9; // +9 for the length of </header>
        
        if (headerStart !== -1 && headerEnd !== -1) {
            // Replace the header section with the include
            const beforeHeader = content.substring(0, headerStart);
            const afterHeader = content.substring(headerEnd);
            const updatedContent = beforeHeader + headerPartial + '\n' + afterHeader;
            
            // Write the updated content back to the file
            fs.writeFileSync(filePath, updatedContent, 'utf8');
            console.log(`Updated ${filePath}`);
        } else {
            console.log(`Skipping ${filePath} - no header found`);
        }
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
    }
}

// Process all HTML files
htmlFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        updateFile(filePath);
    } else {
        console.log(`File not found: ${filePath}`);
    }
});

console.log('Header update complete!');
