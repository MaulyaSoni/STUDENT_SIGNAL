# EarlySignal.AI

A student dropout prediction and counseling dashboard that visualizes risk indicators and supports early intervention by educators.

## Overview

EarlySignal.AI is a Next.js-based frontend application designed to connect with a Python FastAPI backend. It provides educators with a comprehensive dashboard to:

- **Monitor Risk Levels**: Visualize student risk indicators with color-coded classifications (Low/Medium/High)
- **Track Performance**: View attendance trends, score patterns, and academic metrics
- **Enable Interventions**: Access actionable recommendations for student support
- **Manage Data**: Upload and process student data for analysis

## Tech Stack

- **Frontend**: Next.js 16+ (App Router)
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Charts**: Recharts
- **API Communication**: Fetch API
- **Backend**: External Python FastAPI (not included)

## Project Structure

```
├── app/
│   ├── page.tsx                    # Dashboard
│   ├── students/
│   │   ├── page.tsx                # Students list with filters
│   │   └── [id]/page.tsx           # Student detail view
│   ├── upload/
│   │   └── page.tsx                # Data upload page
│   ├── api/
│   │   └── proxy/route.ts          # API proxy template
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Global styles & design tokens
├── components/
│   ├── Navigation.tsx              # Header navigation
│   ├── Dashboard*.tsx              # Page-specific components
│   ├── RiskBadge.tsx              # Risk level indicator
│   ├── RiskCard.tsx               # Student card component
│   ├── StudentTable.tsx           # Student data table
│   ├── StatCard.tsx               # Statistics card
│   └── ui/                        # shadcn/ui components
├── services/
│   └── api.ts                     # API service layer
├── lib/
│   ├── utils.ts                   # Utility functions
│   └── mock-data.ts               # Mock data for development
└── .env.example                   # Environment variables template
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- Environment variables configured

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and set your API endpoint:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

## Features

### 1. Dashboard (`/`)
- Overview of all students and risk distribution
- Key statistics (total students, risk counts, avg dropout probability)
- High-risk student cards for quick intervention access
- Visual risk distribution breakdown

### 2. Students List (`/students`)
- Browse all students in a detailed table
- Filter by:
  - Department
  - Semester
  - Risk level
- Quick action buttons to view student details

### 3. Student Detail (`/students/[id]`)
- Comprehensive student profile
- Academic metrics (GPA, attendance, department, semester)
- Visual charts:
  - Attendance trend (line chart, last 8 weeks)
  - Score trend (bar chart, recent exams)
- Risk factors identified by backend analysis
- Recommended interventions

### 4. Data Upload (`/upload`)
- Drag-and-drop file upload interface
- Support for CSV and Excel formats
- File format requirements guide
- Success/error feedback

## API Integration

### Expected Backend Endpoints

The application expects the following endpoints from your FastAPI backend:

```
GET /api/students - Get all students (with optional filters)
GET /api/students/{id} - Get student details
POST /api/upload-data - Upload CSV/Excel file
POST /api/analyze-risk - Analyze student risk
POST /api/send-alerts - Send alerts to educators
GET /api/dashboard-stats - Get dashboard statistics
```

### Query Parameters

**GET /api/students**
```
?department=Computer%20Science
?semester=3
?risk_level=high
```

### Response Format

**Student Object**:
```json
{
  "id": "1",
  "name": "Sarah Johnson",
  "email": "sarah.johnson@university.edu",
  "student_id": "STU001",
  "department": "Computer Science",
  "semester": 4,
  "gpa": 2.8,
  "attendance": 72,
  "risk_level": "high",
  "dropout_probability": 0.68
}
```

**Student Detail Object**:
```json
{
  ...student fields above,
  "attendance_trend": [
    { "week": 1, "percentage": 92 },
    ...
  ],
  "score_trend": [
    { "exam": "Midterm 1", "score": 68 },
    ...
  ],
  "risk_factors": [
    "Declining attendance pattern",
    ...
  ],
  "recommendations": [
    "Schedule one-on-one meeting",
    ...
  ]
}
```

## Development

### Mock Data

The application includes mock data in `lib/mock-data.ts`. When API calls fail, it automatically falls back to mock data, allowing you to develop without a backend.

### Styling

The application uses a professional dark theme with:
- Primary color: Blue (#3b82f6)
- Risk colors:
  - High: Red (#ef4444)
  - Medium: Amber (#f59e0b)
  - Low: Green (#22c55e)

Customize colors in `app/globals.css` by updating CSS variables in the `:root` selector.

### Adding New Pages

1. Create a new route in `app/[route]/page.tsx`
2. Import and use the `Navigation` component
3. Follow the existing structure for API calls with error handling
4. Add links to the Navigation component if needed

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Set environment variables in project settings:
   - `NEXT_PUBLIC_API_URL`: Your FastAPI backend URL
4. Deploy

### Other Platforms

Ensure you set the `NEXT_PUBLIC_API_URL` environment variable to your backend's API URL.

## Error Handling

The application gracefully handles API errors by:
1. Logging errors to the console
2. Displaying user-friendly error messages
3. Falling back to mock data in development
4. Retrying failed requests where appropriate

## Performance Optimizations

- **Image Optimization**: Uses Next.js Image component where applicable
- **Code Splitting**: Routes are automatically code-split
- **Memoization**: Client components use appropriate memoization
- **Data Fetching**: Implements proper loading states and error boundaries

## Accessibility

- Semantic HTML elements
- ARIA labels and roles where needed
- Keyboard navigation support
- Color contrast compliance
- Screen reader friendly

## Future Enhancements

- Authentication system
- Real-time notifications for high-risk students
- Export functionality for reports
- Bulk action tools
- Advanced filtering and search
- User preferences and customization
- Email integration for alerts

## Support

For issues or questions about the frontend implementation, refer to the [Next.js documentation](https://nextjs.org/docs) and [shadcn/ui documentation](https://ui.shadcn.com/).

For backend integration questions, consult your FastAPI backend documentation.

## License

This project is part of the EarlySignal.AI initiative for supporting student success.
