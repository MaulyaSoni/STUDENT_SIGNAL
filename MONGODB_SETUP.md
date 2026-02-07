# MongoDB Setup Guide for Student Signal

## Step 1: Install MongoDB Community Edition

### Option A: Using Chocolatey (Recommended - Quick)
1. Open PowerShell as Administrator
2. Run:
```powershell
choco install mongodb -y
```

### Option B: Manual Installation
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
   - Select: Windows x64
   - Version: Latest (7.0 or higher)
2. Run the installer (.msi file)
3. Choose "Complete" installation
4. ✅ Check "Install MongoDB as a Service"
5. ✅ Check "Install MongoDB Compass" (GUI tool)
6. Complete the installation

## Step 2: Start MongoDB Service

### If installed as a service:
```powershell
# Check status
Get-Service MongoDB

# Start MongoDB (if not running)
Start-Service MongoDB

# Set to start automatically
Set-Service MongoDB -StartupType Automatic
```

### If NOT installed as a service:
```powershell
# Create data directory
New-Item -ItemType Directory -Force -Path C:\data\db

# Start MongoDB manually
& "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath "C:\data\db"
```

## Step 3: Connect MongoDB Compass

### Your Connection Details:
- **Connection String:** `mongodb://localhost:27017`
- **Database Name:** `Student_db`
- **Collections:**
  - `students` - Student records with risk analysis
  - `alerts` - Alert notifications

### Steps to Connect:
1. Open **MongoDB Compass**
2. In the connection string field, paste:
   ```
   mongodb://localhost:27017
   ```
3. Click **Connect**
4. You should see your databases on the left sidebar
5. Look for `Student_db` - this is your application database

## Step 4: Verify Connection

After connecting in Compass, you can:
- Browse the `Student_db` database
- View the `students` collection
- View the `alerts` collection
- Run queries to explore your data

## Step 5: Test from Your Application

Start your backend server:
```powershell
cd backend
python -m uvicorn app.main:app --reload
```

If MongoDB is connected correctly, you should see:
```
✅ MongoDB connected
```

## Troubleshooting

### MongoDB won't start:
```powershell
# Check if port 27017 is already in use
Get-NetTCPConnection -LocalPort 27017 -ErrorAction SilentlyContinue
```

### Connection refused in Compass:
1. Verify MongoDB service is running:
   ```powershell
   Get-Service MongoDB
   ```
2. Check firewall settings
3. Try connecting to `127.0.0.1:27017` instead of `localhost`

### Data directory error:
```powershell
# Ensure data directory exists and has proper permissions
New-Item -ItemType Directory -Force -Path C:\data\db
```

## Alternative: Use MongoDB Atlas (Cloud)

If you prefer a cloud database:
1. Visit: https://www.mongodb.com/cloud/atlas/register
2. Create a free cluster
3. Get your connection string
4. Update `backend\.env`:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/Student_db?retryWrites=true&w=majority
   ```
5. In MongoDB Compass, use the same connection string

## Your Current Configuration

Your `.env` file is already configured for localhost:
```
MONGO_URI=mongodb://localhost:27017/Student_db
DB_NAME=Student_db
```

This will work once MongoDB is installed and running!
