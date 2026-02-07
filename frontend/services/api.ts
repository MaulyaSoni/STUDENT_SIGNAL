// API service layer for EarlySignal.AI
// This file handles all communication with the backend API

// Mock data for development/demo when backend is unavailable
import { mockStudents } from '@/lib/mock-data'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Student {
  id: string
  name: string
  email: string
  student_id: string
  department: string
  semester: number
  gpa: number
  attendance: number
  internal_marks?: number
  backlogs?: number
  study_hours?: number
  previous_failures?: number
  risk_level: 'low' | 'medium' | 'high'
  dropout_probability: number
  risk_factors?: string[]
}

interface StudentDetail extends Student {
  attendance_trend: Array<{ week: number; percentage: number }>
  score_trend: Array<{ exam: string; score: number }>
  risk_factors: string[]
  recommendations: string[]
}

interface UploadResponse {
  message: string
  rows_processed: number
  rows_analyzed?: number
}

interface PredictionRequest {
  attendance: number
  internal_marks?: number
  backlogs?: number
  study_hours?: number
  previous_failures?: number
}

interface PredictionResponse {
  dropout_probability: number
  risk_level: 'low' | 'medium' | 'high'
  prediction: number
  risk_factors: string[]
  confidence: string
  recommendations: string[]
}

interface AnalysisResponse {
  student_id: string
  name: string
  risk_level: 'low' | 'medium' | 'high'
  dropout_probability: number
  risk_factors: string[]
}

interface DashboardStats {
  total_students: number
  high_risk_count: number
  medium_risk_count: number
  low_risk_count: number
  avg_dropout_probability: number
}

// Get all students with optional filters
export async function getStudents(filters?: {
  department?: string
  semester?: number
  risk_level?: string
}): Promise<Student[]> {
  const params = new URLSearchParams()
  if (filters?.department) params.append('department', filters.department)
  if (filters?.semester) params.append('semester', filters.semester.toString())
  if (filters?.risk_level) params.append('risk_level', filters.risk_level)

  try {
    const response = await fetch(`${API_BASE_URL}/students?${params}`)
    if (!response.ok) throw new Error(`Failed to fetch students: ${response.statusText}`)
    const students = await response.json()
    
    // Backend now returns data in correct format
    return students.map((student: any) => ({
      id: student.id || student.student_id,
      name: student.name,
      email: student.email || `${student.name.toLowerCase().replace(' ', '.')}@university.edu`,
      student_id: student.student_id,
      department: student.department,
      semester: student.semester || 1,
      gpa: student.gpa || 3.0,
      attendance: student.attendance,
      internal_marks: student.internal_marks,
      backlogs: student.backlogs,
      study_hours: student.study_hours,
      previous_failures: student.previous_failures,
      risk_level: student.risk_level || 'low',
      dropout_probability: student.dropout_probability || 0.0,
      risk_factors: student.risk_factors || [],
    }))
  } catch (error) {
    console.error('Error fetching students:', error)
    // Fallback to mock data
    return mockStudents.filter((student) => {
      if (filters?.department && student.department !== filters.department) return false
      if (filters?.semester && student.semester !== filters.semester) return false
      if (filters?.risk_level && student.risk_level !== filters.risk_level) return false
      return true
    })
  }
}

// Get a specific student's details
export async function getStudentDetail(studentId: string): Promise<StudentDetail> {
  try {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}`)
    if (!response.ok) throw new Error(`Failed to fetch student: ${response.statusText}`)
    const student = await response.json()
    
    // Transform backend data to frontend format
    return {
      id: student.id || student.student_id,
      name: student.name,
      email: student.email || `${student.name.toLowerCase().replace(' ', '.')}@university.edu`,
      student_id: student.student_id,
      department: student.department,
      semester: student.semester || 1,
      gpa: student.gpa || 3.0,
      attendance: student.attendance,
      internal_marks: student.internal_marks,
      backlogs: student.backlogs,
      study_hours: student.study_hours,
      previous_failures: student.previous_failures,
      risk_level: student.risk_level || 'low',
      dropout_probability: student.dropout_probability || 0.0,
      attendance_trend: student.attendance_trend || [],
      score_trend: student.score_trend || [],
      risk_factors: student.risk_factors || [],
      recommendations: student.recommendations || [],
    }
  } catch (error) {
    console.error('Error fetching student detail:', error)
    // Return mock data as fallback
    const mockStudent = mockStudents.find((s) => s.id === studentId)
    if (mockStudent) {
      return {
        ...mockStudent,
        attendance_trend: [
          { week: 1, percentage: 95 },
          { week: 2, percentage: 92 },
          { week: 3, percentage: 88 },
          { week: 4, percentage: 85 },
        ],
        score_trend: [
          { exam: 'Midterm 1', score: 78 },
          { exam: 'Midterm 2', score: 72 },
        ],
        risk_factors: mockStudent.risk_level === 'high'
          ? ['Declining attendance', 'Low exam scores']
          : ['No significant risk factors'],
        recommendations: mockStudent.risk_level === 'high'
          ? ['Schedule immediate meeting', 'Refer to tutoring services']
          : ['Regular check-ins recommended'],
      }
    }
    throw error
  }
}

// Upload CSV/Excel file for analysis
export async function uploadData(file: File): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    })
    if (!response.ok) throw new Error(`Failed to upload file: ${response.statusText}`)
    return await response.json()
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

// Predict dropout for a single student
export async function predictDropout(data: PredictionRequest): Promise<PredictionResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/predict/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error(`Failed to predict: ${response.statusText}`)
    return await response.json()
  } catch (error) {
    console.error('Error predicting dropout:', error)
    throw error
  }
}

// Analyze risk for a specific student
export async function analyzeStudent(studentId: string): Promise<AnalysisResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}/analyze`, {
      method: 'POST',
    })
    if (!response.ok) throw new Error(`Failed to analyze student: ${response.statusText}`)
    return await response.json()
  } catch (error) {
    console.error('Error analyzing student:', error)
    throw error
  }
}

// Analyze all students
export async function analyzeAllStudents(): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/risk/analyze-all`, {
      method: 'POST',
    })
    if (!response.ok) throw new Error(`Failed to analyze all students: ${response.statusText}`)
    return await response.json()
  } catch (error) {
    console.error('Error analyzing all students:', error)
    throw error
  }
}

// Get decision tree visualization
export async function getTreeVisualization(maxDepth: number = 4): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/risk/visualize/tree?max_depth=${maxDepth}`)
    if (!response.ok) throw new Error(`Failed to get tree visualization: ${response.statusText}`)
    return await response.json()
  } catch (error) {
    console.error('Error getting tree visualization:', error)
    throw error
  }
}

// Get feature importance
export async function getFeatureImportance(): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/risk/feature-importance`)
    if (!response.ok) throw new Error(`Failed to get feature importance: ${response.statusText}`)
    return await response.json()
  } catch (error) {
    console.error('Error getting feature importance:', error)
    throw error
  }
}

// Send alerts to educators
export async function sendAlerts(riskLevel: string = 'high') {
  try {
    const response = await fetch(`${API_BASE_URL}/alerts/send?risk_level=${riskLevel}`, {
      method: 'POST',
    })
    if (!response.ok) throw new Error(`Failed to send alerts: ${response.statusText}`)
    return await response.json()
  } catch (error) {
    console.error('Error sending alerts:', error)
    throw error
  }
}

// Get dashboard statistics
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const response = await fetch(`${API_BASE_URL}/students/dashboard-stats`)
    if (!response.ok) throw new Error(`Failed to fetch dashboard stats: ${response.statusText}`)
    return await response.json()
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    // Return mock data as fallback
    const high_risk = mockStudents.filter((s) => s.risk_level === 'high').length
    const medium_risk = mockStudents.filter((s) => s.risk_level === 'medium').length
    const low_risk = mockStudents.filter((s) => s.risk_level === 'low').length
    const avg_dropout =
      mockStudents.reduce((sum, s) => sum + s.dropout_probability, 0) / mockStudents.length
    return {
      total_students: mockStudents.length,
      high_risk_count: high_risk,
      medium_risk_count: medium_risk,
      low_risk_count: low_risk,
      avg_dropout_probability: avg_dropout,
    }
  }
}
