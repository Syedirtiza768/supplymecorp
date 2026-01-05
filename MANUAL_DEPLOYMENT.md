# Manual Deployment Steps for Frontend (supplymecorp)

## Changes Made:
- Fixed CSS visibility issue - product cards and flipbook arrows now visible
- Enhanced ProductItem2 component styling (borders, shadows, spacing)
- Added price display support (backend provides price field from NCR API)
- Improved homepage product grid layout with better gaps
- Fixed flipbook CSS to only hide react-pageflip Shadow elements

## Deployment Steps:

### 1. SSH into your production server:
```bash
ssh root@your-server-ip
# or whatever your server credentials are
```

### 2. Navigate to frontend directory:
```bash
cd /var/www/supplymecorp
```

### 3. Pull latest changes:
```bash
git pull origin main
```

### 4. Install dependencies (if needed):
```bash
pnpm install
# or npm install
```

### 5. Build the Next.js application:
```bash
pnpm run build
# or npm run build
```

### 6. Restart the frontend service:

**If using PM2:**
```bash
pm2 restart supplyme-frontend
# or if not configured yet:
pm2 start npm --name supplyme-frontend -- start
pm2 save
```

**If using systemd:**
```bash
sudo systemctl restart supplyme-frontend
```

**If running manually:**
```bash
# Stop old process
pkill -f "next start"
# Start new process
nohup npm start > frontend.log 2>&1 &
```

### 7. Verify deployment:
```bash
# Check if frontend is running
pm2 status

# Check logs
pm2 logs supplyme-frontend --lines 50

# Test the frontend
curl http://localhost:3001
```

## Expected Results:

After deployment, your frontend should:
- ✅ Display product cards on homepage (Most Viewed, New, Featured sections)
- ✅ Show prices for products (e.g., $106.08)
- ✅ Display flipbook navigation arrows in bottom corners
- ✅ Have proper shadows and borders on product cards
- ✅ Show consistent card sizing with min-height constraints

## Environment Variables:

Make sure your production `.env.local` or `.env.production` has:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
# or your production backend URL:
# NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Troubleshooting:

**If product cards are invisible:**
- Clear browser cache and hard refresh (Ctrl+Shift+R)
- Check that flipbook.css is being loaded
- Verify globals.css imports flipbook.css

**If prices are showing as "undefined":**
- Backend must be updated first (see backend MANUAL_DEPLOYMENT.md)
- Check API response: `curl http://localhost:3000/api/products/most-viewed?limit=2`
- Verify backend returns `price` field in product objects

**If build fails:**
- Check Node.js version (should be 18.x or later)
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules pnpm-lock.yaml && pnpm install`

**If frontend won't start:**
- Check logs: `pm2 logs supplyme-frontend`
- Verify port 3001 is not in use: `netstat -tlnp | grep 3001`
- Check that `.next` folder exists after build

## Complete Deployment Flow:

1. Deploy backend first (see backend MANUAL_DEPLOYMENT.md)
2. Wait for backend to restart and verify it's working
3. Then deploy frontend with the steps above
4. Test the complete flow: Homepage → Product cards should show with prices
