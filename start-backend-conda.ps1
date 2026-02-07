# Backend Server Startup Script
# Run this to start the FastAPI backend server

Write-Host "Starting EarlySignal.AI Backend Server..." -ForegroundColor Green
Write-Host ""

# Navigate to backend directory
Set-Location backend

# Check if dependencies are installed
Write-Host "Checking dependencies..." -ForegroundColor Yellow
$packagesNeeded = @("fastapi", "uvicorn", "pymongo", "pandas", "scikit-learn")
$packagesInstalled = $true

foreach ($package in $packagesNeeded) {
    $installed = pip show $package 2>$null
    if (-not $installed) {
        Write-Host "  ✗ Missing: $package" -ForegroundColor Red
        $packagesInstalled = $false
    } else {
        Write-Host "  ✓ Installed: $package" -ForegroundColor Green
    }
}

Write-Host ""

if (-not $packagesInstalled) {
    Write-Host "Installing missing dependencies..." -ForegroundColor Yellow
    pip install -r requirements.txt
    Write-Host ""
}

# Check MongoDB connection
Write-Host "Checking MongoDB connection..." -ForegroundColor Yellow
$mongoRunning = Get-Process -Name mongod -ErrorAction SilentlyContinue
if ($mongoRunning) {
    Write-Host "  ✓ MongoDB is running" -ForegroundColor Green
} else {
    Write-Host "  ⚠ MongoDB is not running!" -ForegroundColor Red
    Write-Host "  Please start MongoDB server or use MongoDB Atlas (cloud)" -ForegroundColor Yellow
    Write-Host "  Backend will start but database operations will fail." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Starting FastAPI server on http://localhost:8000" -ForegroundColor Cyan
Write-Host "API Documentation: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host ""

# Start the server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
