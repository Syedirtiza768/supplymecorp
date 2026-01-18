# SupplyMe Architecture - Quick Reference

## 📋 Summary

Your application uses a **dual-server architecture** with dynamic environment-based configuration.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Browser                              │
│                http://localhost:3001                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ UI Requests
                     ▼
┌─────────────────────────────────────────────────────────────┐
│          Next.js Frontend (Port 3001)                        │
│          Location: supplymecorp/                             │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Next.js API Routes (Same Port)                     │    │
│  │  • /api/customers  → Counterpoint proxy            │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  Environment: .env.local                                     │
│  • PORT=3001                                                │
│  • NEXT_PUBLIC_API_URL=http://localhost:3000               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ API Requests (Products, Flipbooks, etc.)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│          NestJS Backend (Port 3000)                          │
│          Location: supplymecorp_Backend/                     │
│                                                              │
│  • /api/products      → Product catalog                     │
│  • /api/flipbooks     → Flipbook data                       │
│  • /api/items         → Counterpoint items                  │
│                                                              │
│  Environment: .env                                           │
│  • PORT=3000                                                │
│  • DB_HOST, DB_PORT, DB_NAME (PostgreSQL)                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Database Queries
                     ▼
              ┌─────────────┐
              │ PostgreSQL  │
              │   orgill    │
              └─────────────┘
```

## 🎯 Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend UI** | http://localhost:3001 | User interface, login, shopping |
| **Backend API** | http://localhost:3000 | REST API (products, flipbooks) |
| **Customer API** | http://localhost:3001/api/customers | Customer authentication |

## 🔧 Configuration Files Updated

### ✅ Frontend Environment (`.env.local`)
```env
PORT=3001                                    # Next.js runs here
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3000   # Points to NestJS backend
CUSTOMERS_API_KEY=***                        # Counterpoint credentials
CUSTOMERS_AUTH=***
```

### ✅ Backend Environment (`.env`)
```env
PORT=3000                                    # NestJS runs here
DB_HOST=localhost
DB_NAME=orgill
COUNTERPOINT_API_KEY=***
```

### ✅ New Config Module (`src/lib/config.js`)
Centralized configuration for managing:
- Frontend vs Backend URLs
- API endpoint builders
- Authentication headers

## 🚀 Starting the Application

**You MUST run BOTH servers:**

```bash
# Terminal 1: Start Backend
cd d:\supplyme\supplymecorp_Backend
pnpm run start:dev

# Terminal 2: Start Frontend  
cd d:\supplyme\supplymecorp
npm run dev
```

Then access: **http://localhost:3001**

## ❌ Common Mistakes

| Problem | Wrong ✗ | Correct ✓ |
|---------|---------|----------|
| Accessing app | http://localhost:3000 | http://localhost:3001 |
| Customer API call | `fetch('http://localhost:3000/api/customers')` | `fetch('/api/customers')` |
| Backend API call | `fetch('/api/products')` | `fetch('${process.env.NEXT_PUBLIC_API_URL}/api/products')` |

## 🧪 Testing

```powershell
# Test Backend API (port 3000)
curl http://localhost:3000/api/products

# Test Frontend Customer API (port 3001)
curl http://localhost:3001/api/customers
```

## 📝 Code Examples

### Using the Config Module

```javascript
import { getNextApiUrl, getBackendApiUrl } from '@/lib/config';

// Next.js API route (runs on frontend)
const customers = await fetch(getNextApiUrl('/api/customers'));

// Backend API route  
const products = await fetch(getBackendApiUrl('/api/products'));
```

### Environment Variables in Code

```javascript
// ✅ Correct: Use env vars
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// ❌ Wrong: Hardcoded
const apiUrl = 'http://localhost:3000';
```

## 🔄 How the Fix Works

### Before:
- User accessed port 3000 (backend) which has no `/api/customers` route
- Error: "Failed to fetch customers"

### After:
- Environment properly configured with separate frontend/backend URLs
- Customer API uses relative URLs (works on any port)
- Config module provides helpers for URL management
- Clear documentation prevents port confusion

## 📚 Documentation

- **Detailed Guide:** [PORT_CONFIGURATION.md](PORT_CONFIGURATION.md)
- **Deployment:** [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md)

## ✨ Key Improvements

1. ✅ Separated `NEXT_PUBLIC_FRONTEND_URL` from `NEXT_PUBLIC_API_URL`
2. ✅ Added `src/lib/config.js` for centralized URL management
3. ✅ Updated `AuthContext.js` with better error handling
4. ✅ Enhanced `/api/customers` route with detailed logging
5. ✅ Created comprehensive documentation
6. ✅ All URLs now use environment variables dynamically
