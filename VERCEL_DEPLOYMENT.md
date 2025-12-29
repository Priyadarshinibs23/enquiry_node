# Vercel + Neon DB Deployment Guide

## Prerequisites
- Vercel Account (vercel.com)
- Neon Database (neon.tech)
- Git repository on GitHub

## Steps to Deploy

### 1. **Set Up Neon Database**
   - Go to neon.tech and create an account
   - Create a new project/database
   - Copy the connection string (it will look like: `postgresql://user:password@host/dbname?sslmode=require`)

### 2. **Connect GitHub Repository to Vercel**
   - Go to vercel.com and sign up/login
   - Click "New Project"
   - Connect your GitHub repository
   - Select your `enquiry_node` repository

### 3. **Configure Environment Variables in Vercel**
   - In Vercel dashboard, go to Project Settings → Environment Variables
   - Add the following variables:
   
   ```
   DATABASE_URL = your_neon_connection_string
   PORT = 3000
   JWT_SECRET = your_secret_key
   JWT_EXPIRES_IN = 1d
   NODE_ENV = production
   CLIENT_URL = your_frontend_url
   ```

### 4. **Deploy**
   - Vercel will automatically detect `vercel.json` and deploy
   - Your app will be available at: `https://your-project-name.vercel.app`

### 5. **Run Migrations (Optional)**
   If you need to run migrations on Neon:
   
   ```bash
   # Locally with Neon connection
   DATABASE_URL="postgresql://..." npm run migrate
   
   # Or using Vercel CLI
   vercel env pull  # pulls env vars from Vercel
   npm run migrate
   ```

## Local Development with Neon

### Option 1: Use Neon for Local Dev (Recommended)
```bash
# Install dependencies
npm install

# Set DATABASE_URL in .env to your Neon connection string
echo 'DATABASE_URL="postgresql://..."' > .env

# Run migrations
npm run migrate

# Start dev server
npm run dev
```

### Option 2: Use Local PostgreSQL for Local Dev
```bash
# Modify .env to use local PostgreSQL
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=enquiry_form
DB_HOST=127.0.0.1
DB_PORT=5432

# The database.js config will automatically use these if DATABASE_URL is not set
npm run dev
```

## Important Notes

1. **SSL Required**: Neon requires SSL connections. Our database config handles this automatically.

2. **Connection Pooling**: Vercel has limits on concurrent connections. We use a connection pool with max 2 connections for serverless compatibility.

3. **Cold Starts**: The connection timeout is set to 30 seconds to handle Vercel's cold starts.

4. **Environment Variables**:
   - Keep `.env` in `.gitignore` (already configured)
   - Use `.env.example` as a template
   - Add environment variables in Vercel dashboard

5. **Database Migrations**:
   - Migrations should be run before deployment or as part of the build process
   - Ensure all migration files are committed to git

6. **API Routes**:
   - All routes are prefixed with `/api`
   - Example: `https://your-project.vercel.app/api/health`

## Troubleshooting

### SSL Connection Error
- Ensure `sslmode=require` is in your DATABASE_URL
- Check Neon connection string is correct

### Connection Timeout
- Verify Neon database is running
- Check your internet connection
- Ensure firewall allows connections to Neon's IP

### Build Fails
- Check `npm run build` passes locally
- Verify all environment variables are set in Vercel

## Useful Commands

```bash
# Test local connection
npm run dev

# Run migrations
npm run migrate

# Check Neon connection (while running)
curl https://your-project.vercel.app/api/health
```

## Resources
- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs
- Sequelize Docs: https://sequelize.org/docs/v6/
