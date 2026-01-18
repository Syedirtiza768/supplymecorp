# Customer Login Error - Troubleshooting Guide

## Error: "Customer API error: 500 {}"

This error occurs when the customer API endpoint fails to respond properly.

## Quick Fixes (Try in order)

### 1. Hard Refresh Browser
The most common cause is cached failed API responses.

**Chrome/Edge:**
- Press `Ctrl + Shift + R` (Windows)
- Or `Ctrl + F5`

**Firefox:**
- Press `Ctrl + Shift + R`

### 2. Clear Browser Cache
1. Open DevTools (`F12`)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Click **Clear storage** or **Clear site data**
4. Refresh the page

### 3. Restart Development Server
The server may have stale environment variables.

```powershell
cd d:\supplyme\supplymecorp
.\restart-dev.ps1
```

Or manually:
```powershell
# Find and kill the process
Get-Process node | Where-Object {(Get-NetTCPConnection -OwningProcess $_.Id -ErrorAction SilentlyContinue).LocalPort -eq 3001} | Stop-Process -Force

# Restart
npm run dev
```

### 4. Check Server Logs
Open the terminal where Next.js is running and look for:
- ❌ Missing API credentials
- ❌ Counterpoint API error
- ❌ Proxy error

### 5. Test API Directly
```powershell
# Test the customer API
curl http://localhost:3001/api/customers -UseBasicParsing

# Should return: Status 200 with customer data
```

### 6. Verify Environment Variables
```powershell
# Check debug endpoint
curl http://localhost:3001/api/debug-env -UseBasicParsing | ConvertFrom-Json

# Should show:
# CUSTOMERS_API_KEY: "SET (length: 40)"
# CUSTOMERS_AUTH: "SET (length: 46)"
```

## Detailed Diagnostics

### Check Server Status
```powershell
cd d:\supplyme\supplymecorp
.\test-config.ps1
```

Expected output:
- ✓ Backend running on port 3000
- ✓ Frontend running on port 3001
- ✓ Customer API responding

### Browser Console Debugging
1. Open DevTools (`F12`)
2. Go to **Console** tab
3. Try logging in
4. Look for detailed error messages:
   ```
   🔍 Fetching customers from API...
   📡 API Response status: 500 ✗
   ❌ Customer API error: {...}
   ```

### Network Tab Debugging
1. Open DevTools (`F12`)
2. Go to **Network** tab
3. Try logging in
4. Click on the `/api/customers` request
5. Check:
   - **Status**: Should be 200
   - **Response**: Should have `Customers` array
   - **Headers**: Check `Cache-Control`

## Common Causes

### 1. Server Started Before Environment Changes
**Symptom:** API works in PowerShell but fails in browser

**Fix:** Restart the dev server
```powershell
.\restart-dev.ps1
```

### 2. Browser Cached Failed Response
**Symptom:** Works in new browser/incognito

**Fix:** Hard refresh (`Ctrl + Shift + R`) or clear cache

### 3. External API Down
**Symptom:** Test endpoint `/api/test-customers` shows API error

**Fix:** Wait for Counterpoint API to recover, or check network

### 4. Missing Environment Variables
**Symptom:** `/api/debug-env` shows "MISSING"

**Fix:** Verify `.env.local` exists and restart server

### 5. CORS or Network Issue
**Symptom:** Browser shows network error, PowerShell works

**Fix:** Check browser console for CORS errors

## Environment Configuration

### Required Files
- `d:\supplyme\supplymecorp\.env.local`

### Required Variables
```env
CUSTOMERS_API_KEY=aj88R3KMh9f588H7N4CF0XUhqsvqZrWIN9iIYXkp
CUSTOMERS_AUTH=Basic V0VCVEVTVC5JUlRJWkE6V2ViUHJvamVjdDIwMjUk
```

## Verification Steps

1. **Environment loaded?**
   ```powershell
   curl http://localhost:3001/api/debug-env
   ```

2. **API working?**
   ```powershell
   curl http://localhost:3001/api/test-customers
   ```

3. **Full customer API?**
   ```powershell
   curl http://localhost:3001/api/customers
   ```

All should return HTTP 200.

## Still Not Working?

### Check External API
The customer API relies on an external Counterpoint API:
```
https://utility.rrgeneralsupply.com/customers
```

Test if it's accessible:
```powershell
curl https://utility.rrgeneralsupply.com/customers -Headers @{
    "APIKey"="aj88R3KMh9f588H7N4CF0XUhqsvqZrWIN9iIYXkp"
    "Authorization"="Basic V0VCVEVTVC5JUlRJWkE6V2ViUHJvamVjdDIwMjUk"
}
```

### Review Server Logs
Detailed logging has been added. Check the dev server console for:
- 🔍 Fetching customers from API...
- 📡 API Response status
- ✅ Success messages
- ❌ Error details

### Contact Support
If all else fails, provide:
1. Browser console logs
2. Network tab screenshot
3. Server console output
4. Output of `.\test-config.ps1`
