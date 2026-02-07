# Machine Learning Integration Documentation

## Overview
The Student Dropout Prediction system is now fully integrated with ML capabilities. The system uses a trained Decision Tree/Random Forest model to predict student dropout probability.

## Architecture

### ML Pipeline
```
Student Data → Feature Extraction → Model Prediction → Risk Classification → Recommendations
```

### Key Components

#### 1. Model Files (`backend/app/ml/models/`)
- `dropout_model.pkl` - Trained ML model (Decision Tree/Random Forest)
- `scaler.pkl` - Feature scaler for normalization
- `feature_order.json` - Ensures correct feature order: 
  - attendance
  - internal_marks
  - backlogs
  - study_hours
  - previous_failures

#### 2. ML Modules (`backend/app/ml/`)
- `load_model.py` - Model loading and caching
- `predict.py` - Prediction logic and risk calculation
- `visualize.py` - Decision tree visualization

#### 3. API Endpoints

##### Prediction Endpoints (`/predict`)
- `POST /predict/` - Single student prediction
- `POST /predict/batch` - Batch predictions

**Example Request:**
```json
POST /predict/
{
  "attendance": 65.5,
  "internal_marks": 55,
  "backlogs": 2,
  "study_hours": 3,
  "previous_failures": 1
}
```

**Example Response:**
```json
{
  "dropout_probability": 0.7234,
  "risk_level": "high",
  "prediction": 1,
  "risk_factors": [
    "Low attendance (65.5%)",
    "Low internal marks (55)",
    "2 backlog(s)"
  ],
  "confidence": "high",
  "recommendations": [
    "🚨 Critical: Schedule immediate counseling session",
    "📚 Assign peer tutor for academic support",
    "..."
  ]
}
```

##### Risk Analysis Endpoints (`/risk`)
- `POST /risk/analyze-all` - Analyze all students in database
- `GET /risk/visualize/tree?max_depth=4` - Get decision tree visualization
- `GET /risk/feature-importance` - Get feature importance chart
- `GET /risk/stats` - Get overall risk statistics

##### Student Endpoints (`/students`)
- `GET /students/` - List all students (with filters)
- `GET /students/dashboard-stats` - Dashboard statistics
- `GET /students/{student_id}` - Get student details
- `POST /students/{student_id}/analyze` - Analyze specific student

##### Upload Endpoint (`/upload`)
- `POST /upload/` - Upload CSV with automatic analysis

##### Alerts Endpoint (`/alerts`)
- `POST /alerts/send?risk_level=high` - Send alerts
- `GET /alerts/` - Get high-risk students

## Risk Classification

### Risk Levels
- **High Risk**: probability > 0.7 OR attendance < 60 OR backlogs >= 3
- **Medium Risk**: probability > 0.4 OR attendance < 75 OR backlogs >= 1
- **Low Risk**: All other cases

### Risk Factors Identified
- Low attendance (< 75%)
- Low internal marks (< 50%)
- Backlogs
- Insufficient study hours (< 3h/day)
- Previous failures

## CSV Upload Format

### Required Columns
- `student_id` - Unique identifier
- `name` - Student name
- `attendance` - Attendance percentage (0-100)
- `internal_marks` - Internal marks (0-100)

### Optional Columns
- `backlogs` - Number of backlogs (default: 0)
- `study_hours` - Daily study hours (default: 4)
- `previous_failures` - Previous failures count (default: 0)
- `department` - Department name
- `semester` - Current semester
- `gpa` - GPA (0-4)
- `email` - Email address

### Example CSV
```csv
student_id,name,attendance,internal_marks,backlogs,study_hours,previous_failures,department,semester
S001,John Doe,85.5,75,0,5,0,Computer Science,3
S002,Jane Smith,62.0,48,2,2,1,Engineering,4
S003,Bob Johnson,92.0,88,0,6,0,Computer Science,2
```

## Workflow

### 1. Upload Student Data
```bash
curl -X POST "http://localhost:8000/upload/" \\
  -F "file=@students.csv"
```

### 2. Analyze All Students
```bash
curl -X POST "http://localhost:8000/risk/analyze-all"
```

### 3. Get Dashboard Stats
```bash
curl http://localhost:8000/students/dashboard-stats
```

### 4. View Decision Tree
```bash
curl http://localhost:8000/risk/visualize/tree?max_depth=4
```

### 5. Get High-Risk Students
```bash
curl http://localhost:8000/students/?risk_level=high
```

### 6. Send Alerts
```bash
curl -X POST "http://localhost:8000/alerts/send?risk_level=high"
```

## Testing the Integration

### Test Single Prediction
```python
import requests

data = {
    "attendance": 65,
    "internal_marks": 55,
    "backlogs": 2,
    "study_hours": 3,
    "previous_failures": 1
}

response = requests.post("http://localhost:8000/predict/", json=data)
print(response.json())
```

### Test with Frontend
The frontend will automatically call these endpoints:
- `/students/dashboard-stats` - For dashboard
- `/students/` - For student list
- `/students/{id}` - For student details
- `/upload/` - For CSV upload

## Environment Setup

1. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

2. Configure `.env`:
```env
MONGO_URI=mongodb://localhost:27017/Student_db
DB_NAME=Student_db
SENDGRID_API_KEY=your_key_here  # Optional for email alerts
FROM_EMAIL=alerts@studentsignal.ai
```

3. Start server:
```bash
uvicorn app.main:app --reload
```

4. Access API docs:
```
http://localhost:8000/docs
```

## Model Information

### Features Used
1. **Attendance** (0-100%) - Most important factor
2. **Internal Marks** (0-100) - Academic performance
3. **Backlogs** (count) - Failed subjects
4. **Study Hours** (hours/day) - Study habits
5. **Previous Failures** (count) - Historical performance

### Model Performance
- Check feature importance: `GET /risk/feature-importance`
- View decision rules: `GET /risk/visualize/tree`

## Troubleshooting

### Model Not Loading
- Ensure `dropout_model.pkl` exists in `backend/app/ml/models/`
- Check file permissions
- View logs for specific error

### Predictions Fail
- Verify feature order matches training
- Check for NaN values in input
- Ensure features are in correct range

### Visualization Errors
- Install matplotlib: `pip install matplotlib`
- Check model type (must be tree-based)

## Next Steps

1. ✅ ML model integrated
2. ✅ All endpoints working
3. ✅ Risk analysis automated
4. ✅ Visualization ready
5. 🔄 Connect frontend
6. 🔄 Test with real data
7. 🔄 Deploy to production

## Frontend Integration

The frontend services/api.ts will automatically use these endpoints. No additional configuration needed if backend runs on `http://localhost:8000`.

### Frontend API Calls
- Dashboard: Calls `/students/dashboard-stats`
- Student List: Calls `/students/?risk_level=high`
- Student Detail: Calls `/students/{id}`
- Upload: Calls `/upload/` with file

All predictions happen automatically during data upload!
