# Start Frontend Server Script for EarlySignal.AI
# This script starts the Next.js frontend with proper cleanup

Write-Host "="*60 -ForegroundColor Cyan
Write-Host "Starting EarlySignal Frontend Server" -ForegroundColor Green
Write-Host "="*60 -ForegroundColor Cyan

# Navigate to frontend directory
Set-Location -Path "D:\STUDENT_Signal\frontend"

# Kill any existing Node.js processes
Write-Host "`nChecking for existing Node.js processes..." -ForegroundColor Yellow
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "Found running Node.js processes, terminating..." -ForegroundColor Yellow
    Stop-Process -Name node -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "✓ Node.js processes terminated" -ForegroundColor Green
} else {
    Write-Host "✓ No existing Node.js processes found" -ForegroundColor Green
}

# Clean corrupted cache files
Write-Host "`nCleaning cache directories..." -ForegroundColor Yellow
$cacheDirs = @('.next', 'node_modules\.cache', '.turbo')
foreach ($dir in $cacheDirs) {
    if (Test-Path $dir) {
        Write-Host "  Removing $dir..." -ForegroundColor Gray
        Remove-Item -Recurse -Force $dir -ErrorAction SilentlyContinue
    }
}
Write-Host "✓ Cache cleaned" -ForegroundColor Green

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "`n⚠ .env.local not found, creating..." -ForegroundColor Yellow
    "NEXT_PUBLIC_API_URL=http://localhost:8000" | Out-File -FilePath ".env.local" -Encoding utf8
    Write-Host "✓ .env.local created" -ForegroundColor Green
}

# Check if pnpm is available
try {
    $pnpmVersion = pnpm --version
    Write-Host "✓ pnpm $pnpmVersion found" -ForegroundColor Green
} catch {
    Write-Host "✗ pnpm not found. Please install with: npm install -g pnpm" -ForegroundColor Red
    exit 1
}

Write-Host "`n" -NoNewline
Write-Host "Starting server on http://localhost:3000" -ForegroundColor Cyan
Write-Host "Network access at http://10.50.167.33:3000" -ForegroundColor Cyan
Write-Host "`nPress Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "="*60 -ForegroundColor Cyan
Write-Host ""

# Start Next.js development server
pnpm dev
