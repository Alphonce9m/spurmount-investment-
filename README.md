# Spurmount Trading & Investments Wholesalers

## 🚀 Project Overview

Spurmount Trading & Investments is a premier wholesale platform specializing in dry foodstuffs, including grains, cereals, pulses, spices, and other non-perishable food items. This platform connects bulk buyers with quality suppliers in the food industry.

## 📋 Table of Contents
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Available Scripts](#-available-scripts)
- [Deployment](#-deployment)
- [Technologies Used](#-technologies-used)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- **Product Catalog**: Browse and search through a wide range of dry food products
- **Admin Dashboard**: Manage products, categories, and inventory
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Image Optimization**: Automatic image compression and lazy loading
- **Form Validation**: Robust form handling with client-side validation
- **WhatsApp Integration**: Direct ordering via WhatsApp

## 🛠 Prerequisites

- Node.js (v18 or later)
- npm (v9 or later) or Yarn (v1.22 or later)
- Supabase account (for backend services)
- Git (for version control)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Alphonce9m/spurmount-investment-.git
cd spurmount-trading-investment
```

### 2. Install Dependencies

```bash
npm install
# or
yarn
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_WHATSAPP_NUMBER=254740581156
```

### 4. Start Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

## 🔒 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | ✅ | - |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous/public key | ✅ | - |
| `VITE_WHATSAPP_NUMBER` | Business WhatsApp number for orders | ❌ | 254740581156 |

## 📁 Project Structure

```
src/
├── assets/             # Static assets (images, fonts, etc.)
├── components/         # Reusable UI components
│   ├── ui/            # Shadcn/ui components
│   └── ...
├── lib/
│   ├── supabase/      # Supabase client and utilities
│   └── utils/         # Helper functions
├── pages/             # Page components
│   ├── admin/         # Admin dashboard pages
│   └── ...
└── styles/            # Global styles and themes
```

## 📜 Available Scripts

### `npm run dev`

Runs the app in development mode. Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

### `npm run build`

Builds the app for production to the `dist` folder. The build is minified and the filenames include the hashes.

### `npm run preview`

Serves the production build from the `dist` folder. Make sure to run `npm run build` first.

### `npm run lint`

Runs ESLint to check for code quality issues.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to a GitHub repository
2. Import the repository to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

### Netlify

1. Push your code to a GitHub repository
2. Create a new site in Netlify and link your repository
3. Add your environment variables in the Netlify dashboard
4. Deploy!

## 🛠 Technologies Used

- **Frontend**
  - React 18
  - TypeScript
  - Vite
  - Tailwind CSS
  - Shadcn/ui
  - React Hook Form
  - Zod (Schema Validation)
  - Lucide Icons

- **Backend**
  - Supabase (Database & Authentication)
  - PostgreSQL
  - Storage (for product images)

- **Development Tools**
  - ESLint
  - Prettier
  - TypeScript
  - Vite

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- React Query

## Deployment

This project can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## License

This project is proprietary and confidential. All rights reserved.

## Contact

For inquiries, please contact us at info@spurmount.com
