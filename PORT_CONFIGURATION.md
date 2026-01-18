# SupplyMe Port Configuration Guide

## Architecture Overview

The SupplyMe application consists of two separate servers:

### 1. **NestJS Backend** (Port 3000)
- **Location:** `supplymecorp_Backend/`
- **Purpose:** Main API for products, flipbooks, and Counterpoint integration
- **Configured in:** `supplymecorp_Backend/.env` → `PORT=3000`
- **Start command:** `cd supplymecorp_Backend && pnpm run start:dev`

### 2. **Next.js Frontend** (Port 3001)
- **Location:** `supplymecorp/`
- **Purpose:** User interface, authentication, and customer-facing features
- **Configured in:** `supplymecorp/.env.local` → `PORT=3001`
- **Start command:** `cd supplymecorp && npm run dev`

## URL Configuration

### Environment Variables

#### Frontend (`supplymecorp/.env.local`)
```env
# Port this Next.js app runs on
PORT=3001

# Frontend URL (where Next.js is accessible)
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3001

# Backend API URL (NestJS backend)
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE=http://localhost:3000

# API Credentials
CUSTOMERS_API_KEY=aj88R3KMh9f588H7N4CF0XUhqsvqZrWIN9iIYXkp
CUSTOMERS_AUTH=Basic V0VCVEVTVC5JUlRJWkE6V2ViUHJvamVjdDIwMjUk
COUNTERPOINT_API_URL=https://utility.rrgeneralsupply.com
```

#### Backend (`supplymecorp_Backend/.env`)
```env
# Port this NestJS app runs on
PORT=3000

# Database configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=orgill
DB_USER=postgres
DB_PASS=global321

# Counterpoint API
COUNTERPOINT_API_KEY=aj88R3KMh9f588H7N4CF0XUhqsvqZrWIN9iIYXkp
COUNTERPOINT_AUTH_BASIC=Basic V0VCVEVTVC5pcnRpemE6V2ViUHJvamVjdDIwMjUk
```

## API Route Types

### 1. Next.js API Routes (Port 3001)
These are serverless functions that run within the Next.js app:
- `/api/customers` - Customer authentication proxy
- Accessed via **relative URLs** in code: `fetch('/api/customers')`
- Automatically run on the same port as the frontend

### 2. NestJS Backend Routes (Port 3000)
These are REST API endpoints from the backend:
- `/api/products` - Product catalog
- `/api/flipbooks` - Flipbook data
- `/api/items` - Counterpoint items
- Accessed via **NEXT_PUBLIC_API_URL**: `${process.env.NEXT_PUBLIC_API_URL}/api/products`

## Common Issues & Solutions

### Issue: "Failed to fetch customers"
**Cause:** Accessing the app on the wrong port

**Solution:** Make sure you access the frontend at:
```
http://localhost:3001
```
NOT `http://localhost:3000` (that's the backend API)

### Issue: Backend API not responding
**Cause:** NestJS backend is not running

**Solution:**
```bash
cd supplymecorp_Backend
pnpm run start:dev
```

### Issue: Environment variables not loading
**Cause:** Server wasn't restarted after changing `.env` files

**Solution:**
1. Stop the development server (Ctrl+C)
2. Restart: `npm run dev` or `pnpm run start:dev`

### Issue: Port already in use
**Cause:** Another process is using the port

**Solution:**
```powershell
# Find process using port 3001
netstat -ano | Select-String ":3001.*LISTENING"

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

## Starting Both Servers

### Option 1: Separate Terminals
```bash
# Terminal 1 - Backend
cd d:\supplyme\supplymecorp_Backend
pnpm run start:dev

# Terminal 2 - Frontend
cd d:\supplyme\supplymecorp
npm run dev
```

### Option 2: PowerShell Script
Create `start-servers.ps1`:
```powershell
# Start Backend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd d:\supplyme\supplymecorp_Backend; pnpm run start:dev"

# Wait for backend to start
Start-Sleep -Seconds 5

# Start Frontend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd d:\supplyme\supplymecorp; npm run dev"
```

## Production Configuration

For production, update environment variables to use production URLs:

### Frontend Production (.env.production)
```env
NEXT_PUBLIC_FRONTEND_URL=https://www.supplymecorp.com
NEXT_PUBLIC_API_URL=https://api.supplymecorp.com
NEXT_PUBLIC_API_BASE=https://api.supplymecorp.com
```

### Backend Production (.env.production)
```env
PORT=3000
DB_HOST=production-db-host
NODE_ENV=production
```

## Testing Endpoints

### Test Backend API
```powershell
curl http://localhost:3000/api/products
```

### Test Frontend Next.js API
```powershell
curl http://localhost:3001/api/customers
```

### Test Frontend UI
Open browser to:
```
http://localhost:3001
```

## Code Reference

Use the centralized configuration in `src/lib/config.js`:

```javascript
import { getNextApiUrl, getBackendApiUrl } from '@/lib/config';

// For Next.js API routes (runs on frontend port)
const customers = await fetch(getNextApiUrl('/api/customers'));

// For Backend API routes (runs on backend port)
const products = await fetch(getBackendApiUrl('/api/products'));
```
