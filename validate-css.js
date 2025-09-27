const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'css', 'style.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');

// Simple check for unclosed blocks
const openBraces = (cssContent.match(/\{/g) || []).length;
const closeBraces = (cssContent.match(/\}/g) || []).length;

console.log(`Open braces: ${openBraces}, Close braces: ${closeBraces}`);

if (openBraces !== closeBraces) {
    console.error('Error: Unmatched braces in CSS file');
    process.exit(1);
} else {
    console.log('CSS validation passed: All braces are matched');
}
