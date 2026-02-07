# EarlySignal.AI - Student Dropout Prediction System

## 🚀 Quick Start Guide

### Prerequisites
- Anaconda/Miniconda with `earlysignal` environment
- Node.js and pnpm installed
- MongoDB Atlas connection configured

### Environment Variables

#### Backend (.env file in `backend/` directory)
```
MONGO_URI=mongodb+srv://arjunw1224_db_user:Shrimad7jsr4@clusterthinkx.oxm4swj.mongodb.net/?appName=ClusterThinkX
DB_NAME=earlysignal
SENDGRID_API_KEY=SG_xxxxxxxxxxxxxxxxx
FROM_EMAIL=alerts@studentsignal.ai
```

#### Frontend (.env.local file in `frontend/` directory)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Starting the Application

#### Option 1: Using PowerShell Scripts (Recommended)

**Terminal 1 - Backend:**
```powershell
.\start-backend.ps1
```

**Terminal 2 - Frontend:**
```powershell
.\start-frontend.ps1
```

#### Option 2: Manual Start

**Terminal 1 - Backend:**
```powershell
cd backend
conda activate earlysignal
uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
pnpm dev
```

### Accessing the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🎨 Features

### Design Highlights
- ✨ Purple-blue gradient background
- 💫 Shiny white text with shimmer effects
- 🌟 Yellow and light green glowing text
- 🎭 FontAwesome icons throughout
- 🎬 Framer Motion animations
- 💨 Smooth hover and scroll effects

### Functional Features
- 📊 Real-time dashboard with risk analytics
- 👥 Student management and filtering
- 📤 CSV/Excel data upload
- 🚨 Risk level visualization
- 📈 Trend analysis and predictions

## 🛠️ Troubleshooting

### Backend Issues

**Database Connection Error:**
```
TypeError: name must be an instance of str, not <class 'NoneType'>
```
**Solution:** Ensure `DB_NAME` is set in `backend/.env` file

**Import Error:**
```
ModuleNotFoundError: No module named 'app.routers'
```
**Solution:** Make sure you're in the backend directory and PYTHONPATH is set

### Frontend Issues

**Failed to Fetch Error:**
```
TypeError: Failed to fetch
```
**Solution:** 
1. Ensure backend is running on port 8000
2. Check `.env.local` has correct API URL
3. Clear Next.js cache: `Remove-Item -Recurse -Force .next`

**Framer Motion Import Error:**
```
Module not found: Can't resolve 'framer-motion'
```
**Solution:**
```powershell
cd frontend
pnpm install framer-motion
```

**JSX Parsing Error:**
```
Expected '</', got 'jsx text'
```
**Solution:** Already fixed - ensure you have the latest code

### Cache Issues

If you encounter corrupted cache errors:
```powershell
cd frontend
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules\.cache
pnpm dev
```

## 📁 Project Structure

```
STUDENT_Signal/
├── backend/
│   ├── app/
│   │   ├── routers/      # API endpoints
│   │   ├── services/     # Business logic
│   │   ├── database.py   # MongoDB connection
│   │   ├── main.py       # FastAPI app
│   │   └── models.py     # Data models
│   ├── .env              # Backend environment variables
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── app/              # Next.js pages
│   ├── components/       # React components
│   ├── services/         # API client
│   ├── .env.local        # Frontend environment variables
│   └── package.json      # NPM dependencies
├── start-backend.ps1     # Backend startup script
└── start-frontend.ps1    # Frontend startup script
```

## 🎯 Next Steps

1. Start both servers using the scripts above
2. Navigate to http://localhost:3000
3. Upload student data via the Upload page
4. View analytics on the Dashboard
5. Browse students and filter by risk level

## 💡 Tips

- Keep both terminals open while developing
- Backend hot-reloads on code changes
- Frontend hot-reloads on code changes
- Check browser console for client-side errors
- Check terminal for server-side errors

## 🐛 Known Issues

All major issues have been resolved:
- ✅ JSX parsing errors fixed
- ✅ Database configuration validated
- ✅ All routers properly imported
- ✅ CORS configured for local development
- ✅ Framer Motion properly installed
- ✅ Color scheme updated to purple-blue gradient

## 📧 Support

For issues or questions, check the error logs in:
- Backend: Terminal running uvicorn
- Frontend: Browser console (F12)
- Next.js: Terminal running pnpm dev
