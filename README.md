# SpurMount Wholesale

Premium dry food wholesaler in Kenya - E-commerce website

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd spurmount-wholesale
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

To run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

To create a production build:
```bash
npm run build
```

### Deployment

#### Heroku

1. Create a new Heroku app:
   ```bash
   heroku create spurmount-wholesale
   ```

2. Deploy to Heroku:
   ```bash
   git push heroku main
   ```

#### Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=3000
NODE_ENV=development
```

## License

ISC
