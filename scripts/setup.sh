#!/bin/bash

# Simple setup helper script
echo "🚀 Starting DevSync Setup..."

# Check for .env
if [ ! -f .env ]; then
  echo "📄 Creating .env template..."
  echo "DATABASE_URL=mysql://root:password@localhost:3306/devsync" > .env
  echo "JWT_SECRET=$(openssl rand -base64 32)" >> .env
  echo "NEXT_PUBLIC_APP_URL=http://localhost:3000" >> .env
  echo "✅ Created .env. Please update it with your MySQL credentials."
else
  echo "✅ .env already exists."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "✨ Setup complete! Please initialize your MySQL database using the scripts in /scripts."
