#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Test script to verify SupplyMe application configuration
    
.DESCRIPTION
    Validates that both frontend and backend servers are running
    and accessible on the correct ports with proper environment configuration.
#>

Write-Host "`n🧪 SupplyMe Application Configuration Test" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray

# Test 1: Check if servers are running
Write-Host "`n📡 Test 1: Server Status" -ForegroundColor Yellow
Write-Host "-" * 60 -ForegroundColor Gray

$backendPort = 3000
$frontendPort = 3001

try {
    $backendTest = Test-NetConnection -ComputerName localhost -Port $backendPort -WarningAction SilentlyContinue
    if ($backendTest.TcpTestSucceeded) {
        Write-Host "✅ Backend (NestJS) running on port $backendPort" -ForegroundColor Green
    } else {
        Write-Host "❌ Backend NOT running on port $backendPort" -ForegroundColor Red
        Write-Host "   Run: cd supplymecorp_Backend; pnpm run start:dev" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Cannot check backend port" -ForegroundColor Red
}

try {
    $frontendTest = Test-NetConnection -ComputerName localhost -Port $frontendPort -WarningAction SilentlyContinue
    if ($frontendTest.TcpTestSucceeded) {
        Write-Host "✅ Frontend (Next.js) running on port $frontendPort" -ForegroundColor Green
    } else {
        Write-Host "❌ Frontend NOT running on port $frontendPort" -ForegroundColor Red
        Write-Host "   Run: cd supplymecorp; npm run dev" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Cannot check frontend port" -ForegroundColor Red
}

# Test 2: Check environment files
Write-Host "`n📄 Test 2: Environment Configuration" -ForegroundColor Yellow
Write-Host "-" * 60 -ForegroundColor Gray

$frontendEnv = "d:\supplyme\supplymecorp\.env.local"
$backendEnv = "d:\supplyme\supplymecorp_Backend\.env"

if (Test-Path $frontendEnv) {
    Write-Host "✅ Frontend .env.local exists" -ForegroundColor Green
    $content = Get-Content $frontendEnv -Raw
    if ($content -match "PORT=3001") {
        Write-Host "   ✓ PORT=3001 configured" -ForegroundColor Gray
    }
    if ($content -match "NEXT_PUBLIC_API_URL=http://localhost:3000") {
        Write-Host "   ✓ NEXT_PUBLIC_API_URL points to backend (3000)" -ForegroundColor Gray
    }
    if ($content -match "CUSTOMERS_API_KEY") {
        Write-Host "   ✓ CUSTOMERS_API_KEY configured" -ForegroundColor Gray
    }
} else {
    Write-Host "❌ Frontend .env.local not found" -ForegroundColor Red
}

if (Test-Path $backendEnv) {
    Write-Host "✅ Backend .env exists" -ForegroundColor Green
    $content = Get-Content $backendEnv -Raw
    if ($content -match "PORT=3000") {
        Write-Host "   ✓ PORT=3000 configured" -ForegroundColor Gray
    }
} else {
    Write-Host "❌ Backend .env not found" -ForegroundColor Red
}

# Test 3: API Endpoints
Write-Host "`n🌐 Test 3: API Endpoints" -ForegroundColor Yellow
Write-Host "-" * 60 -ForegroundColor Gray

# Test backend
try {
    Write-Host "Testing backend API..." -NoNewline
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/products?page=1&limit=1" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host " ✅ Backend API responding" -ForegroundColor Green
    }
} catch {
    Write-Host " ❌ Backend API error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test frontend customer API
try {
    Write-Host "Testing customer API..." -NoNewline
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/customers" -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        $data = $response.Content | ConvertFrom-Json
        if ($data.Customers) {
            $count = $data.Customers.Count
            Write-Host " ✅ Customer API responding ($count customers)" -ForegroundColor Green
        } else {
            Write-Host " ⚠️ Customer API responding but unexpected format" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host " ❌ Customer API error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Message -match "404") {
        Write-Host "   Hint: Make sure you're accessing the Frontend on port 3001" -ForegroundColor Yellow
    }
}

# Test frontend UI
try {
    Write-Host "Testing frontend UI..." -NoNewline
    $response = Invoke-WebRequest -Uri "http://localhost:3001" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host " ✅ Frontend UI responding" -ForegroundColor Green
    }
} catch {
    Write-Host " ❌ Frontend UI error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Configuration module
Write-Host "`n📦 Test 4: Config Module" -ForegroundColor Yellow
Write-Host "-" * 60 -ForegroundColor Gray

$configFile = "d:\supplyme\supplymecorp\src\lib\config.js"
if (Test-Path $configFile) {
    Write-Host "✅ Config module exists at src/lib/config.js" -ForegroundColor Green
    $content = Get-Content $configFile -Raw
    if ($content -match "getNextApiUrl" -and $content -match "getBackendApiUrl") {
        Write-Host "   ✓ Helper functions available" -ForegroundColor Gray
    }
} else {
    Write-Host "❌ Config module not found" -ForegroundColor Red
}

# Summary
Write-Host "`n📊 Summary" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host ""
Write-Host "Access your application at: " -NoNewline
Write-Host "http://localhost:3001" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   • PORT_CONFIGURATION.md - Detailed port setup guide"
Write-Host "   • ARCHITECTURE_SUMMARY.md - Quick reference"
Write-Host ""
