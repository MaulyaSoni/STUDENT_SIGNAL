// API service layer for EarlySignal.AI
// This file handles all communication with the backend API

// Mock data for development/demo when backend is unavailable
import { mockStudents } from '@/lib/mock-data'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface Student {
  id: string
  name: string
  email: string
  student_id: string
  department: string
  semester: number
  gpa: number
  attendance: number
  risk_level: 'low' | 'medium' | 'high'
  dropout_probability: number
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
}

interface AnalysisResponse {
  student_id: string
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
    // Transform backend data to frontend format
    return students.map((student: any) => ({
      id: student.student_id,
      name: student.name,
      email: `${student.name.toLowerCase().replace(' ', '.')}@university.edu`,
      student_id: student.student_id,
      department: student.department,
      semester: student.semester || 1,
      gpa: student.gpa || 3.0,
      attendance: student.attendance,
      risk_level: student.risk?.level || 'low',
      dropout_probability: student.risk?.ml_probability || 0.1,
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
      id: student.student_id,
      name: student.name,
      email: `${student.name.toLowerCase().replace(' ', '.')}@university.edu`,
      student_id: student.student_id,
      department: student.department,
      semester: student.semester || 1,
      gpa: student.gpa || 3.0,
      attendance: student.attendance,
      risk_level: student.risk?.level || 'low',
      dropout_probability: student.risk?.ml_probability || 0.1,
      attendance_trend: [
        { week: 1, percentage: 95 },
        { week: 2, percentage: 92 },
        { week: 3, percentage: 88 },
        { week: 4, percentage: 85 },
        { week: 5, percentage: 82 },
        { week: 6, percentage: 78 },
      ],
      score_trend: [
        { exam: 'Midterm 1', score: 78 },
        { exam: 'Midterm 2', score: 72 },
        { exam: 'Quiz 1', score: 68 },
        { exam: 'Quiz 2', score: 65 },
      ],
      risk_factors: student.risk?.level === 'high' 
        ? ['Declining attendance', 'Low exam scores', 'Reduced engagement']
        : student.risk?.level === 'medium'
          ? ['Inconsistent performance', 'Occasional absences']
          : ['No significant risk factors'],
      recommendations: student.risk?.level === 'high'
        ? ['Schedule immediate meeting', 'Refer to tutoring services', 'Monitor closely']
        : ['Regular check-ins recommended', 'Provide academic support'],
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
          { week: 5, percentage: 82 },
          { week: 6, percentage: 78 },
        ],
        score_trend: [
          { exam: 'Midterm 1', score: 78 },
          { exam: 'Midterm 2', score: 72 },
          { exam: 'Quiz 1', score: 68 },
          { exam: 'Quiz 2', score: 65 },
        ],
        risk_factors: mockStudent.risk_level === 'high'
          ? ['Declining attendance', 'Low exam scores', 'Reduced engagement']
          : mockStudent.risk_level === 'medium'
            ? ['Inconsistent performance', 'Occasional absences']
            : ['No significant risk factors'],
        recommendations: mockStudent.risk_level === 'high'
          ? ['Schedule immediate meeting', 'Refer to tutoring services', 'Monitor closely']
          : ['Regular check-ins recommended', 'Provide academic support'],
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
    const response = await fetch(`${API_BASE_URL}/upload-data`, {
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

// Analyze risk for a specific student
export async function analyzeRisk(studentId: string): Promise<AnalysisResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze-risk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id: studentId }),
    })
    if (!response.ok) throw new Error(`Failed to analyze risk: ${response.statusText}`)
    return await response.json()
  } catch (error) {
    console.error('Error analyzing risk:', error)
    throw error
  }
}

// Send alerts to educators
export async function sendAlerts(alerts: Array<{ student_id: string; message: string }>) {
  try {
    const response = await fetch(`${API_BASE_URL}/send-alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alerts }),
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
    const response = await fetch(`${API_BASE_URL}/students`)
    if (!response.ok) throw new Error(`Failed to fetch dashboard stats: ${response.statusText}`)
    const students = await response.json()
    
    // Calculate stats from student data
    const total_students = students.length
    const high_risk = students.filter((s: any) => s.risk?.level === 'high').length
    const medium_risk = students.filter((s: any) => s.risk?.level === 'medium').length
    const low_risk = students.filter((s: any) => s.risk?.level === 'low').length
    const avg_dropout = students.reduce((sum: number, s: any) => sum + (s.risk?.ml_probability || 0), 0) / students.length
    
    return {
      total_students,
      high_risk_count: high_risk,
      medium_risk_count: medium_risk,
      low_risk_count: low_risk,
      avg_dropout_probability: avg_dropout,
    }
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
