require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');

// Environment variables
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const PUBLIC_DIR = path.join(__dirname, 'public');
const CSS_DIR = path.join(__dirname, 'css');
const JS_DIR = path.join(__dirname, 'js');
const IMAGES_DIR = path.join(__dirname, 'images');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'application/font-woff',
  '.woff2': 'font/woff2',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm',
  '.webp': 'image/webp'
};

// Helper function to serve static files
function serveStaticFile(res, filePath, contentType, responseCode = 200) {
  const extname = path.extname(filePath);
  const mimeType = MIME_TYPES[extname] || 'application/octet-stream';
  
  // Set security headers
  const headers = {
    'Content-Type': mimeType,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:;"
  };

  // Add caching headers for production
  if (NODE_ENV === 'production' && !filePath.includes('index.html')) {
    headers['Cache-Control'] = 'public, max-age=31536000, immutable';
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // File not found
        if (contentType === 'text/html') {
          // Serve 404 page for HTML files
          fs.readFile(path.join(PUBLIC_DIR, '404.html'), (error, content) => {
            if (error) {
              console.error('404 page not found:', error);
              res.writeHead(404, { 'Content-Type': 'text/plain' });
              res.end('404 Not Found');
              return;
            }
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
          });
        } else {
          // For non-HTML files, just return 404
          console.error('File not found:', error);
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('File not found');
        }
      } else {
        // Server error
        console.error('Server error:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server Error: ' + error.code);
      }
    } else {
      // Success - serve the file with appropriate headers
      console.log(`Serving file: ${filePath}`);
      res.writeHead(responseCode, headers);
      res.end(content, 'utf-8');
    }
  });
}

// Create the server
const server = http.createServer((req, res) => {
  console.log(`Request for ${req.url}`);
  
  // Parse URL
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = parsedUrl.pathname;
  
  // Default to index.html if the path is a directory
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }
  
  // Determine the correct directory based on the file type
  let baseDir = PUBLIC_DIR;
  if (pathname.startsWith('/css/')) {
    baseDir = CSS_DIR;
  } else if (pathname.startsWith('/js/')) {
    baseDir = JS_DIR;
  } else if (pathname.startsWith('/images/') || pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp)$/i)) {
    baseDir = IMAGES_DIR;
  }
  
  // Construct the file path
  let filePath = path.join(baseDir, pathname);
  
  // Get the file extension and set content type
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // If the file doesn't exist but the request is for a route, serve index.html
      if (extname === '' || !extname) {
        filePath = path.join(PUBLIC_DIR, 'index.html');
        serveStaticFile(res, filePath, 'text/html');
      } else {
        // File not found
        console.error(`File not found: ${filePath}`);
        res.writeHead(404);
        res.end('File not found');
      }
    } else {
      serveStaticFile(res, filePath, contentType);
    }
  });
});

// Start the server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`Serving files from ${PUBLIC_DIR}`);
  console.log('Press Ctrl+C to stop the server');
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please close the other application or use a different port.`);
  } else {
    console.error('Server error:', error);
  }
  process.exit(1);
});
