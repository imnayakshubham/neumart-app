# NeuMart E-commerce Store

A modern, full-featured e-commerce store built with Next.js 14, TypeScript, and Tailwind CSS. This application demonstrates a production-grade e-commerce solution with server-side rendering, client-side interactivity, and persistent data storage.

## Features

### 🛍️ Shopping Experience
- Browse products with beautiful, responsive grid layout
- Detailed product pages with images and descriptions
- Shopping cart with real-time quantity updates
- Persistent cart data across sessions
- Smooth checkout process

### 💰 Order Management
- Complete order history
- Detailed order view with items, prices, and status
- Order tracking with status indicators
- Automatic order ID generation
- Persistent order storage

### 🎯 Discount System
- Dynamic discount code generation
- Percentage-based discounts
- Automatic discount code application
- Discount tracking per order
- Admin-controlled discount thresholds

### 👨‍💼 Admin Dashboard
- Real-time order statistics
- Total revenue tracking
- Items sold monitoring
- Discount code management
- Order threshold configuration
- Recent orders overview

### 🎨 Modern UI/UX
- Clean, responsive design
- Loading states and skeletons
- Toast notifications for user feedback
- Smooth transitions and animations
- Mobile-friendly interface

### 🛠️ Technical Features
- Server-side rendering for better performance
- TypeScript for type safety
- Tailwind CSS for styling
- File-based data persistence
- Error handling and validation
- Responsive design
- SEO-friendly

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/neumart-app.git
```

2. Install dependencies:
```bash
cd neumart-app
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
neumart-store/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── cart/              # Shopping cart
│   ├── orders/            # Order management
│   └── products/          # Product pages
├── components/            # Reusable UI components
├── lib/                   # Core functionality
│   ├── actions.ts         # Server actions
│   ├── store.ts           # Data store
│   └── types.ts           # TypeScript types
└── public/                # Static assets
```