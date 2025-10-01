# Deployment Guide for Spurmount Wholesale Platform

This guide will help you deploy the Spurmount Wholesale Platform to a production environment.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

## Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Alphonce9m/spurmount-wholesale.git
   cd spurmount-wholesale
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env` as needed for your environment

## Building for Production

To create a production build:

```bash
npm run build
```

This will create an optimized build in the `dist` directory.

## Running the Production Server

### Option 1: Using PM2 (Recommended for Production)

1. Install PM2 globally:
   ```bash
   npm install -g pm2
   ```

2. Start the server:
   ```bash
   pm2 start server.js --name "spurmount-wholesale"
   ```

3. Set up PM2 to start on system boot:
   ```bash
   pm2 startup
   pm2 save
   ```

### Option 2: Using Node.js Directly

```bash
NODE_ENV=production node server.js
```

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| PORT | Port to run the server on | 3000 | No |
| NODE_ENV | Environment (development/production) | development | No |

## Advanced Configuration

### Using Nginx as a Reverse Proxy (Recommended for Production)

1. Install Nginx
2. Create a new configuration file at `/etc/nginx/sites-available/spurmount-wholesale`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. Enable the site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/spurmount-wholesale /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

### Setting Up SSL with Let's Encrypt

1. Install Certbot:
```bash
sudo apt install certbot python3-certbot-nginx
```

2. Run Certbot:
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

3. Follow the prompts to complete the setup.

## Monitoring

To monitor the application in production:

```bash
# View logs
pm2 logs spurmount-wholesale

# Monitor resources
pm2 monit
```
## Troubleshooting

- If you encounter port conflicts, make sure no other application is using the specified PORT
- Check logs using `pm2 logs` or in the terminal output
- Ensure all environment variables are properly set in production

## Support

For support, please open an issue on GitHub or contact the development team.
