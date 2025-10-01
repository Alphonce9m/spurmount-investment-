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

// The header include HTML
const headerInclude = `    <!-- Header will be inserted here by JavaScript -->
    <div id="header-container">
        <!-- Loading indicator that will be replaced -->
        <div class="header-loading">Loading navigation...</div>
    </div>`;

// Script tags to add before </body>
const scriptsToAdd = `    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="js/include-header.js"></script>
    <script src="js/header.js"></script>`;

// Function to update a single file
function updateFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Skip if already updated
        if (content.includes('id="header-container"')) {
            console.log(`Skipping ${filePath} - already updated`);
            return;
        }
        
        // Replace header include
        if (content.includes('<!--#include')) {
            content = content.replace(/<!--#include[\s\S]*?-->\s*/g, headerInclude);
        } else {
            // Find the first <body> tag and insert after it
            const bodyTag = content.indexOf('<body>');
            if (bodyTag !== -1) {
                const insertPos = bodyTag + 6; // length of <body>
                content = content.slice(0, insertPos) + '\n' + headerInclude + content.slice(insertPos);
            }
        }
        
        // Add scripts before </body> if not already there
        if (!content.includes('js/include-header.js')) {
            content = content.replace('</body>', scriptsToAdd + '\n</body>');
        }
        
        // Write the updated content back to the file
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
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
