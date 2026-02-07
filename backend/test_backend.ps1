# Backend Test Script
# Run this in PowerShell to test if backend is configured correctly

Write-Host "`n==================================================`n" -ForegroundColor Cyan
Write-Host "Testing Backend Configuration" -ForegroundColor Cyan
Write-Host "`n==================================================`n" -ForegroundColor Cyan

# Test 1: Environment File
Write-Host "1. Checking .env file..." -ForegroundColor Yellow
if (Test-Path "D:\STUDENT_Signal\backend\.env") {
    Write-Host "   ✅ .env file exists" -ForegroundColor Green
    
    $envContent = Get-Content "D:\STUDENT_Signal\backend\.env"
    
    if ($envContent -match "MONGO_URI=") {
        Write-Host "   ✅ MONGO_URI found" -ForegroundColor Green
    } else {
        Write-Host "   ❌ MONGO_URI missing!" -ForegroundColor Red
    }
    
    if ($envContent -match "DB_NAME=") {
        $dbName = ($envContent | Select-String "DB_NAME=").Line -replace "DB_NAME=", ""
        Write-Host "   ✅ DB_NAME found: $dbName" -ForegroundColor Green
    } else {
        Write-Host "   ❌ DB_NAME missing!" -ForegroundColor Red
    }
} else {
    Write-Host "   ❌ .env file not found!" -ForegroundColor Red
}

# Test 2: Conda Environment
Write-Host "`n2. Checking conda environment..." -ForegroundColor Yellow
$condaEnvs = conda env list
if ($condaEnvs -match "earlysignal") {
    Write-Host "   ✅ earlysignal environment exists" -ForegroundColor Green
} else {
    Write-Host "   ❌ earlysignal environment not found!" -ForegroundColor Red
    Write-Host "      Create it with: conda create -n earlysignal python=3.10" -ForegroundColor Yellow
}

# Test 3: Python packages
Write-Host "`n3. Checking Python packages..." -ForegroundColor Yellow
$packages = @("fastapi", "uvicorn", "pymongo", "python-dotenv")
foreach ($pkg in $packages) {
    $check = conda run -n earlysignal python -c "import $($pkg.Replace('-', '_')); print('ok')" 2>&1
    if ($check -match "ok") {
        Write-Host "   ✅ $pkg installed" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $pkg not installed" -ForegroundColor Red
    }
}

# Test 4: Database Connection
Write-Host "`n4. Testing database connection..." -ForegroundColor Yellow
$dbTest = conda run -n earlysignal python -c "from app.database import db; print('Database:', db.name)" 2>&1 | Out-String
if ($dbTest -match "Database:") {
    Write-Host "   ✅ Database connected" -ForegroundColor Green
    Write-Host "      $dbTest" -ForegroundColor Gray
} else {
    Write-Host "   ❌ Database connection failed" -ForegroundColor Red
    Write-Host "      Error: $dbTest" -ForegroundColor Red
}

# Test 5: Check if backend is running
Write-Host "`n5. Checking if backend is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8000/" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
    Write-Host "   ✅ Backend is running!" -ForegroundColor Green
    Write-Host "      Response: $($response.Content)" -ForegroundColor Gray
    
    # Test students endpoint
    try {
        $students = Invoke-WebRequest -Uri "http://127.0.0.1:8000/students/" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
        Write-Host "   ✅ /students/ endpoint works!" -ForegroundColor Green
        Write-Host "      Response: $($students.Content)" -ForegroundColor Gray
    } catch {
        Write-Host "   ⚠️ /students/ endpoint returned error" -ForegroundColor Yellow
        Write-Host "      This is normal if database is empty" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ⚠️ Backend is not running" -ForegroundColor Yellow
    Write-Host "      Start it with: uvicorn app.main:app --reload" -ForegroundColor Gray
}

Write-Host "`n==================================================`n" -ForegroundColor Cyan
Write-Host "✅ Configuration Test Complete!" -ForegroundColor Green
Write-Host "`n==================================================`n" -ForegroundColor Cyan

Write-Host "📌 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Start backend:" -ForegroundColor Yellow
Write-Host "      cd D:\STUDENT_Signal\backend" -ForegroundColor Gray
Write-Host "      conda activate earlysignal" -ForegroundColor Gray
Write-Host "      uvicorn app.main:app --reload" -ForegroundColor Gray
Write-Host "`n   2. Test endpoints:" -ForegroundColor Yellow
Write-Host "      http://127.0.0.1:8000/" -ForegroundColor Gray
Write-Host "      http://127.0.0.1:8000/docs" -ForegroundColor Gray
Write-Host "      http://127.0.0.1:8000/students/" -ForegroundColor Gray

Write-Host "`n   3. Start frontend:" -ForegroundColor Yellow
Write-Host "      cd D:\STUDENT_Signal\frontend" -ForegroundColor Gray
Write-Host "      pnpm dev" -ForegroundColor Gray

Write-Host "`n"
