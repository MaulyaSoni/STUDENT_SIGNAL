# Emergency Cleanup and Restart Script
# Use this when Next.js cache becomes corrupted

Write-Host "=" * 70 -ForegroundColor Red
Write-Host "Emergency Cleanup Script for EarlySignal.AI" -ForegroundColor Yellow
Write-Host "=" * 70 -ForegroundColor Red
Write-Host ""

# Step 1: Kill all Node.js processes
Write-Host "[1/5] Terminating all Node.js processes..." -ForegroundColor Cyan
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Stop-Process -Name node -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 3
    Write-Host "  ✓ Node.js processes terminated" -ForegroundColor Green
} else {
    Write-Host "  ✓ No Node.js processes running" -ForegroundColor Green
}

# Step 2: Remove all cache directories
Write-Host "`n[2/5] Removing corrupted cache directories..." -ForegroundColor Cyan
Set-Location -Path "D:\\STUDENT_Signal\\frontend"

$cacheDirs = @(
    '.next',
    'node_modules\.cache',
    '.turbo',
    '.swc'
)

foreach ($dir in $cacheDirs) {
    if (Test-Path $dir) {
        Write-Host "  Removing $dir..." -ForegroundColor Gray
        Remove-Item -Recurse -Force $dir -ErrorAction SilentlyContinue
        Write-Host "  ✓ $dir removed" -ForegroundColor Green
    } else {
        Write-Host "  - $dir not found (OK)" -ForegroundColor DarkGray
    }
}

# Step 3: Clean pnpm cache
Write-Host "`n[3/5] Cleaning pnpm cache..." -ForegroundColor Cyan
pnpm store prune 2>$null
Write-Host "  ✓ pnpm cache cleaned" -ForegroundColor Green

# Step 4: Verify environment files
Write-Host "`n[4/5] Verifying environment configuration..." -ForegroundColor Cyan

# Frontend .env.local
if (Test-Path ".env.local") {
    Write-Host "  ✓ Frontend .env.local exists" -ForegroundColor Green
} else {
    Write-Host "  ! Creating .env.local..." -ForegroundColor Yellow
    "NEXT_PUBLIC_API_URL=http://localhost:8000" | Out-File -FilePath ".env.local" -Encoding utf8
    Write-Host "  ✓ Frontend .env.local created" -ForegroundColor Green
}

# Backend .env
Set-Location -Path "D:\\STUDENT_Signal\\backend"
if (Test-Path ".env") {
    Write-Host "  ✓ Backend .env exists" -ForegroundColor Green
} else {
    Write-Host "  ✗ Backend .env missing! Please create it." -ForegroundColor Red
}

# Step 5: Summary
Write-Host "`n[5/5] Cleanup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "=" * 70 -ForegroundColor Green
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "=" * 70 -ForegroundColor Green
Write-Host ""
Write-Host "Open TWO separate PowerShell terminals:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Terminal 1 (Backend):" -ForegroundColor Yellow
Write-Host "    cd D:\\STUDENT_Signal" -ForegroundColor White
Write-Host "    .\\start-backend.ps1" -ForegroundColor White
Write-Host ""
Write-Host "  Terminal 2 (Frontend):" -ForegroundColor Yellow  
Write-Host "    cd D:\\STUDENT_Signal" -ForegroundColor White
Write-Host "    .\\start-frontend.ps1" -ForegroundColor White
Write-Host ""
Write-Host "Then open: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "=" * 70 -ForegroundColor Green

Set-Location -Path "D:\\STUDENT_Signal"
