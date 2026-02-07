# Start Backend Server Script for EarlySignal.AI
# This script starts the FastAPI backend using Anaconda environment

Write-Host "="*60 -ForegroundColor Cyan
Write-Host "Starting EarlySignal Backend Server" -ForegroundColor Green
Write-Host "="*60 -ForegroundColor Cyan

# Navigate to backend directory
Set-Location -Path "D:\STUDENT_Signal\backend"

# Display environment info
Write-Host "`nChecking Anaconda environment..." -ForegroundColor Yellow

# Check if conda is available
try {
    $condaPath = (Get-Command conda -ErrorAction Stop).Source
    Write-Host "✓ Conda found at: $condaPath" -ForegroundColor Green
} catch {
    Write-Host "✗ Conda not found. Please install Anaconda/Miniconda" -ForegroundColor Red
    exit 1
}

# Check if earlysignal environment exists
$envExists = conda env list | Select-String -Pattern "earlysignal"
if (-not $envExists) {
    Write-Host "✗ Conda environment 'earlysignal' not found" -ForegroundColor Red
    Write-Host "  Create it with: conda create -n earlysignal python=3.10" -ForegroundColor Yellow
    exit 1
}
Write-Host "✓ Environment 'earlysignal' found" -ForegroundColor Green

# Check .env file
if (-not (Test-Path ".env")) {
    Write-Host "✗ .env file not found in backend directory" -ForegroundColor Red
    Write-Host "  Please create .env with MONGO_URI and DB_NAME" -ForegroundColor Yellow
    exit 1
}
Write-Host "✓ .env file found" -ForegroundColor Green

Write-Host "`n" -NoNewline
Write-Host "Starting server on http://localhost:8000" -ForegroundColor Cyan
Write-Host "API Docs available at http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "`nPress Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "="*60 -ForegroundColor Cyan
Write-Host ""

# Set Python path and start uvicorn using conda run
$env:PYTHONPATH = "D:\STUDENT_Signal\backend"
conda run -n earlysignal uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
