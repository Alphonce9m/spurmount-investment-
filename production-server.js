require('dotenv').config();
const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const serveStatic = require('serve-static');
const enforce = require('express-sslify');

// Initialize express app
const app = express();

// Environment variables
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'production';
const PUBLIC_DIR = path.join(__dirname, 'dist');

// Security middleware
app.use(helmet());

// Enable compression
app.use(compression());

// Logging
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  // Log to a file in production
  const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags: 'a' }
  );
  app.use(morgan('combined', { stream: accessLogStream }));
}

// Force HTTPS in production
if (NODE_ENV === 'production') {
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

// Serve static files
app.use(serveStatic(PUBLIC_DIR, {
  maxAge: '1y',
  setHeaders: (res, path) => {
    // Cache static assets for 1 year
    if (serveStatic.mime.lookup(path) === 'text/html') {
      res.setHeader('Cache-Control', 'public, max-age=0');
    }
  }
}));

// Handle SPA routing - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running in ${NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;
