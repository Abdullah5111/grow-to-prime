#!/bin/bash

echo "🚀 Preparing frontend for Vercel deployment..."

# Create .env.local file
echo "📝 Creating .env.local file..."
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=https://django-backend-6216752961.us-central1.run.app
EOF

echo "✅ .env.local created with backend URL"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

echo "✅ Frontend is ready for deployment!"
echo ""
echo "📋 Next steps:"
echo "1. Create a GitHub repository named 'grow-to-prime'"
echo "2. Push this code to GitHub:"
echo "   git init"
echo "   git add ."
echo "   git commit -m 'Initial commit'"
echo "   git branch -M main"
echo "   git remote add origin https://github.com/YOUR_USERNAME/grow-to-prime.git"
echo "   git push -u origin main"
echo "3. Connect to Vercel and deploy"
echo ""
echo "🔗 Backend URL: https://django-backend-6216752961.us-central1.run.app"
echo "📚 See DEPLOYMENT.md for detailed instructions"
