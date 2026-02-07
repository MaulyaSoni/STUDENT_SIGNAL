# QUICK START - READ THIS FIRST! 🚀

## ⚠️ IMPORTANT: You MUST run backend with Anaconda environment

## Step 1: Clean Cache (Run this first if you have errors)

```powershell
cd D:\STUDENT_Signal\frontend
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Remove-Item -Recurse -Force .next,.turbo,node_modules\.cache -ErrorAction SilentlyContinue
```

## Step 2: Start Backend (Terminal 1)

**Using Anaconda (REQUIRED):**

```powershell
cd D:\STUDENT_Signal\backend
conda activate earlysignal
$env:PYTHONPATH = "D:\STUDENT_Signal\backend"
uvicorn app.main:app --reload
```

✅ Backend will run on: http://localhost:8000
✅ API Docs: http://localhost:8000/docs

## Step 3: Start Frontend (Terminal 2)

```powershell
cd D:\STUDENT_Signal\frontend
pnpm dev
```

✅ Frontend will run on: http://localhost:3000

## ⚡ Quick Commands

### Kill all Node processes (if frontend won't start):
```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Clean frontend cache completely:
```powershell
cd D:\STUDENT_Signal\frontend
Remove-Item -Recurse -Force .next,.turbo,node_modules\.cache -ErrorAction SilentlyContinue
```

### Check if backend is running:
```powershell
curl http://localhost:8000
```

### Check if conda environment exists:
```powershell
conda env list | Select-String earlysignal
```

## 🔧 Troubleshooting

### "Unable to acquire lock" error:
```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
cd D:\STUDENT_Signal\frontend
Remove-Item -Recurse -Force .next
pnpm dev
```

### "Turbopack corrupted database" error:
```powershell
cd D:\STUDENT_Signal\frontend
Remove-Item -Recurse -Force .next,.turbo,node_modules\.cache
pnpm dev
```

### Backend "DB_NAME not found" error:
Check `D:\STUDENT_Signal\backend\.env` contains:
```
MONGO_URI=your_mongodb_uri
DB_NAME=Student_db
```

### Backend "/students/" gives Internal Server Error (500):
**This is NORMAL if your database is empty!**

The endpoint returns `[]` (empty array) when there are no students yet.

To fix:
1. **Upload data** via http://localhost:3000/upload (frontend must be running)
2. **Or** use the API directly: http://localhost:8000/docs → `/upload/` endpoint
3. **Or** add students manually in MongoDB Atlas

Test if it's working:
```powershell
curl http://localhost:8000/students/
# Should return: [] (empty array) OR a list of students
```

If you see MongoDB connection errors:
```powershell
cd D:\STUDENT_Signal\backend
conda activate earlysignal
python -c "from app.database import db; print('Database OK')"
```

### Frontend can't connect to backend:
1. Check backend is running: `curl http://localhost:8000`
2. Check `D:\STUDENT_Signal\frontend\.env.local` contains:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

## 📁 Environment Files Needed

### Backend: `D:\STUDENT_Signal\backend\.env`
```env
MONGO_URI=mongodb+srv://arjunw1224_db_user:Shrimad7jsr4@clusterthinkx.oxm4swj.mongodb.net/Student_db
DB_NAME=Student_db
SENDGRID_API_KEY=SG_xxxxxxxxx
FROM_EMAIL=alerts@studentsignal.ai
```

### Frontend: `D:\STUDENT_Signal\frontend\.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🎨 What You'll See

- Purple-blue gradient background
- Shiny white text with shimmer effects
- Yellow glowing descriptions
- Light green glowing titles
- Smooth animations and FontAwesome icons

## 🐛 Common Issues

1. **"Module not found: framer-motion"**
   - Already installed (v12.33.0), just restart frontend

2. **"Failed to fetch"**
   - Start backend first, then frontend

3. **"Conda environment not found"**
   - Create it: `conda create -n earlysignal python=3.10`
   - Install packages: `cd backend && conda activate earlysignal && pip install -r requirements.txt`

## ✨ Features

- Real-time student dropout risk prediction
- Interactive dashboard with animations
- CSV/Excel data upload
- Student filtering and search
- Risk level visualization
