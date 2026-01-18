#!/usr/bin/env pwsh
# Performance test for Customer API optimizations

Write-Host "`n=== Customer API Performance Test ===`n" -ForegroundColor Cyan

# Test 1: Initial fetch (will populate cache)
Write-Host "[Test 1] Initial fetch (cache miss)" -ForegroundColor Yellow
$start = Get-Date
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/customers" -UseBasicParsing -ErrorAction Stop
    $duration = [math]::Round(((Get-Date) - $start).TotalMilliseconds)
    $data = $response.Content | ConvertFrom-Json
    Write-Host "  Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "  Time: $($duration)ms" -ForegroundColor $(if ($duration -lt 1000) { 'Green' } else { 'Yellow' })
    Write-Host "  Customers: $($data.Customers.Count)" -ForegroundColor Gray
} catch {
    Write-Host "  FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Second fetch (should hit cache)
Write-Host "`n[Test 2] Second fetch (cache hit expected)" -ForegroundColor Yellow
$start = Get-Date
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/customers" -UseBasicParsing -ErrorAction Stop
    $duration = [math]::Round(((Get-Date) - $start).TotalMilliseconds)
    $data = $response.Content | ConvertFrom-Json
    Write-Host "  Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "  Time: $($duration)ms" -ForegroundColor $(if ($duration -lt 100) { 'Green' } else { 'Yellow' })
    Write-Host "  Customers: $($data.Customers.Count)" -ForegroundColor Gray
    if ($duration -lt 100) {
        Write-Host "  ✓ CACHE HIT! (fast response)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "  FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Query by email (should also hit cache, but return single customer)
Write-Host "`n[Test 3] Query by email (optimized login)" -ForegroundColor Yellow
$testEmails = @(
    "test@notfound.com",
    "john.doe@example.com"
)

foreach ($email in $testEmails) {
    $start = Get-Date
    try {
        $uri = "http://localhost:3001/api/customers?email=$([uri]::EscapeDataString($email))"
        $response = Invoke-WebRequest -Uri $uri -UseBasicParsing -ErrorAction Stop
        $duration = [math]::Round(((Get-Date) - $start).TotalMilliseconds)
        $data = $response.Content | ConvertFrom-Json
        Write-Host "  ✓ Found: $email" -ForegroundColor Green
        Write-Host "    Time: $($duration)ms" -ForegroundColor $(if ($duration -lt 100) { 'Green' } else { 'Yellow' })
        Write-Host "    Customer: $($data.Customers[0].NAM)" -ForegroundColor Gray
    } catch {
        $duration = [math]::Round(((Get-Date) - $start).TotalMilliseconds)
        if ($_.Exception.Response.StatusCode -eq 404) {
            Write-Host "  ✓ Not found: $email (expected)" -ForegroundColor Yellow
            Write-Host "    Time: $($duration)ms" -ForegroundColor Gray
        } else {
            Write-Host "  ✗ Error: $email" -ForegroundColor Red
            Write-Host "    $($_.Exception.Message)" -ForegroundColor Gray
        }
    }
}

# Summary
Write-Host "`n=== Performance Summary ===`n" -ForegroundColor Cyan
Write-Host "Optimizations Applied:" -ForegroundColor White
Write-Host "  ✓ In-memory caching (5 minute TTL)" -ForegroundColor Green
Write-Host "  ✓ Email query parameter (single customer fetch)" -ForegroundColor Green
Write-Host "  ✓ Optimistic cart updates (instant UI feedback)" -ForegroundColor Green
Write-Host "  ✓ Cache-Control headers for browser caching" -ForegroundColor Green
Write-Host ""
Write-Host "Expected Login Speed: under 100ms (cached)" -ForegroundColor Cyan
Write-Host "Expected Cart Update: under 50ms (optimistic)" -ForegroundColor Cyan
Write-Host ""
