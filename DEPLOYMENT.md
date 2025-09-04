# 🚀 Vercel Deployment Guide

## 📋 Prerequisites
- GitHub account
- Vercel account (free tier available)

## 🔧 Environment Setup

### 1. Create `.env.local` file
Create a `.env.local` file in the frontend root directory:

```env
NEXT_PUBLIC_API_URL=https://django-backend-6216752961.us-central1.run.app
```

### 2. Update package.json (already done)
The package name has been updated to `grow-to-prime` for Vercel free tier.

## 🚀 Deploy to Vercel

### Option 1: GitHub + Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Vercel deployment"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/grow-to-prime.git
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Framework Preset: **Next.js**
   - Project Name: **grow-to-prime**
   - Click "Deploy"

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## ⚙️ Vercel Configuration

### Build Settings
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Environment Variables
- `NEXT_PUBLIC_API_URL`: `https://django-backend-6216752961.us-central1.run.app`

## 🔗 Backend Integration

Your frontend will automatically connect to:
- **Backend URL**: https://django-backend-6216752961.us-central1.run.app
- **API Endpoints**: `/api/`
- **Admin Panel**: `/admin/`

## 📱 After Deployment

1. **Test your app** at the Vercel URL
2. **Verify API calls** are working
3. **Check all routes** are functional
4. **Monitor performance** in Vercel dashboard

## 🆘 Troubleshooting

### Common Issues:
- **API errors**: Check environment variables
- **Build failures**: Ensure all dependencies are in package.json
- **404 errors**: Verify Next.js routing

### Support:
- Check Vercel deployment logs
- Verify backend is running on Cloud Run
- Test API endpoints directly

## 🎉 Success!

Once deployed, your frontend will be live at:
`https://grow-to-prime.vercel.app` (or your custom domain)
