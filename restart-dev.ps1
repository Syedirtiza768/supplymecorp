#!/usr/bin/env pwsh
# Restart Next.js development server with fresh environment

Write-Host "`n🔄 Restarting Next.js Development Server" -ForegroundColor Cyan
Write-Host "=" * 60

# Find and stop the current process
$nodeProcs = Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object {
    $port = (Get-NetTCPConnection -OwningProcess $_.Id -ErrorAction SilentlyContinue | Where-Object {$_.LocalPort -eq 3001}).LocalPort
    $port -eq 3001
}

if ($nodeProcs) {
    Write-Host "`n📍 Found Next.js server on port 3001 (PID: $($nodeProcs.Id))" -ForegroundColor Yellow
    Write-Host "   Stopping process..." -NoNewline
    Stop-Process -Id $nodeProcs.Id -Force
    Start-Sleep -Seconds 2
    Write-Host " ✓ Stopped" -ForegroundColor Green
} else {
    Write-Host "`n✓ No existing server found on port 3001" -ForegroundColor Green
}

# Check environment file
Write-Host "`n📄 Checking environment configuration..."
$envFile = "d:\supplyme\supplymecorp\.env.local"
if (Test-Path $envFile) {
    $lastModified = (Get-Item $envFile).LastWriteTime
    Write-Host "   .env.local exists (modified: $lastModified)" -ForegroundColor Green
} else {
    Write-Host "   ⚠️ Warning: .env.local not found!" -ForegroundColor Yellow
}

# Start the server
Write-Host "`n🚀 Starting Next.js development server..."
Write-Host "   Location: d:\supplyme\supplymecorp"
Write-Host "   Port: 3001"
Write-Host "`n" -NoNewline

Set-Location "d:\supplyme\supplymecorp"

# Start in a new window
Write-Host "Starting in new window..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd d:\supplyme\supplymecorp; Write-Host '🚀 Next.js Development Server' -ForegroundColor Cyan; Write-Host 'Port: 3001' -ForegroundColor Green; Write-Host ''; npm run dev"

Start-Sleep -Seconds 3

# Verify it started
$newProc = Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object {
    $port = (Get-NetTCPConnection -OwningProcess $_.Id -ErrorAction SilentlyContinue | Where-Object {$_.LocalPort -eq 3001}).LocalPort
    $port -eq 3001
}

if ($newProc) {
    Write-Host "`n✅ Server started successfully!" -ForegroundColor Green
    Write-Host "   PID: $($newProc.Id)"
    Write-Host "   Access at: http://localhost:3001" -ForegroundColor Cyan
} else {
    Write-Host "`n⏳ Server is starting (may take a few seconds)..." -ForegroundColor Yellow
    Write-Host "   Check the new window for startup logs"
    Write-Host "   Access at: http://localhost:3001" -ForegroundColor Cyan
}

Write-Host "`n💡 Tip: Clear your browser cache (Ctrl+Shift+R) to ensure fresh data`n" -ForegroundColor Yellow
