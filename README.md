# Grow to Prime - Frontend

This is the frontend application for the AI Generated Leader project, built with Next.js and designed to work with the Django backend deployed on Google Cloud Run.

## 🚀 Quick Deploy to Vercel

### Option 1: Deploy with Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Option 2: Deploy via GitHub
1. Push this code to a GitHub repository
2. Connect your GitHub repo to Vercel
3. Vercel will automatically deploy

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=https://django-backend-6216752961.us-central1.run.app
```

## 📱 Backend API

- **Base URL**: `https://django-backend-6216752961.us-central1.run.app`
- **API Endpoints**: `/api/`
- **Admin Panel**: `/admin/`

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🌐 Available Routes

- **Homepage**: `/`
- **About**: `/about`
- **Contact**: `/contact`
- **Blogs**: `/blogs`
- **Products**: `/products`
- **Use Cases**: `/usecases`

## 🎨 Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI + Heroicons
- **HTTP Client**: Axios

## 📦 Project Structure

```
src/
├── app/                 # Next.js app router
├── components/          # Reusable components
└── lib/                # Utilities and API client
```

## 🔗 Backend Integration

The frontend is configured to work with the Django backend deployed on Google Cloud Run. All API calls are routed through the configured backend URL.

## 🚀 Vercel Deployment

1. **Repository Name**: Use `grow-to-prime` for free tier
2. **Framework Preset**: Next.js
3. **Build Command**: `npm run build`
4. **Output Directory**: `.next`
5. **Install Command**: `npm install`

## 📝 Notes

- Backend is deployed on Google Cloud Run
- Uses environment variables for configuration
- Optimized for Vercel's free tier
- Includes TypeScript types for all API responses
- Graceful fallbacks when backend data is unavailable