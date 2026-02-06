'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { RiskBadge } from '@/components/RiskBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { getStudentDetail } from '@/services/api'
import { mockStudentDetail } from '@/lib/mock-data'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface StudentDetail {
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
  attendance_trend: Array<{ week: number; percentage: number }>
  score_trend: Array<{ exam: string; score: number }>
  risk_factors: string[]
  recommendations: string[]
}

export default function StudentDetail() {
  const params = useParams()
  const studentId = params.id as string
  const [student, setStudent] = useState<StudentDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStudent() {
      try {
        setLoading(true)
        const data = await getStudentDetail(studentId)
        setStudent(data)
      } catch (error) {
        console.error('[v0] Error loading student detail:', error)
        if (studentId === '1') {
          setStudent(mockStudentDetail)
        }
      } finally {
        setLoading(false)
      }
    }
    loadStudent()
  }, [studentId])

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <p className="text-muted-foreground">Loading student details...</p>
          </div>
        </main>
      </>
    )
  }

  if (!student) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <p className="text-muted-foreground">Student not found</p>
            <Link href="/students">
              <Button className="mt-4">Back to Students</Button>
            </Link>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Header with Back Button */}
          <Link href="/students">
            <Button variant="outline" size="sm" className="mb-6 bg-transparent">
              ← Back to Students
            </Button>
          </Link>

          {/* Student Info Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold tracking-tight">{student.name}</h1>
                <p className="text-muted-foreground mt-2">Student ID: {student.student_id}</p>
              </div>
              <RiskBadge level={student.risk_level} probability={student.dropout_probability} size="lg" />
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Department</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{student.department}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Semester</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{student.semester}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">GPA</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{student.gpa.toFixed(2)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{student.attendance}%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Email</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium truncate">{student.email}</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Attendance Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Attendance Trend</CardTitle>
                <CardDescription>Last 8 weeks of attendance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={student.attendance_trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="week" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="percentage"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                      name="Attendance %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Score Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Score Trend</CardTitle>
                <CardDescription>Recent exams and assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={student.score_trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="exam" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="score" fill="hsl(var(--primary))" name="Score" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Risk Factors and Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Risk Factors */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Factors</CardTitle>
                <CardDescription>Identified indicators of dropout risk</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {student.risk_factors.length > 0 ? (
                    student.risk_factors.map((factor, index) => (
                      <Alert key={index} className="border-risk-high/30 bg-risk-high/5">
                        <AlertDescription className="text-sm">{factor}</AlertDescription>
                      </Alert>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">No significant risk factors identified</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>Suggested interventions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {student.recommendations.length > 0 ? (
                    student.recommendations.map((rec, index) => (
                      <Alert key={index} className="border-primary/30 bg-primary/5">
                        <AlertDescription className="text-sm">{rec}</AlertDescription>
                      </Alert>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">No recommendations at this time</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  )
}
