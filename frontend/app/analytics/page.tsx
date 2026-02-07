'use client'

import { useState } from 'react'
import { Sidebar, MainContent } from '@/components/Sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts'
import { Brain, TrendingUp, Users, Download, Filter, RefreshCw } from 'lucide-react'

// Mock data for analytics
const departmentRiskData = [
  { department: 'Computer Science', high: 15, medium: 25, low: 60, total: 100 },
  { department: 'Engineering', high: 8, medium: 18, low: 74, total: 100 },
  { department: 'Business', high: 12, medium: 22, low: 56, total: 90 },
  { department: 'Biology', high: 5, medium: 15, low: 50, total: 70 },
  { department: 'Mathematics', high: 10, medium: 20, low: 52, total: 82 },
]

const semesterTrendData = [
  { semester: 'Sem 1', dropoutRate: 2.5, avgAttendance: 92, avgGPA: 3.4 },
  { semester: 'Sem 2', dropoutRate: 3.2, avgAttendance: 88, avgGPA: 3.2 },
  { semester: 'Sem 3', dropoutRate: 4.8, avgAttendance: 84, avgGPA: 3.0 },
  { semester: 'Sem 4', dropoutRate: 6.1, avgAttendance: 81, avgGPA: 2.9 },
  { semester: 'Sem 5', dropoutRate: 5.2, avgAttendance: 83, avgGPA: 3.0 },
  { semester: 'Sem 6', dropoutRate: 4.0, avgAttendance: 86, avgGPA: 3.1 },
  { semester: 'Sem 7', dropoutRate: 2.8, avgAttendance: 89, avgGPA: 3.3 },
  { semester: 'Sem 8', dropoutRate: 1.5, avgAttendance: 91, avgGPA: 3.5 },
]

const riskFactorCorrelation = [
  { factor: 'Attendance', impact: 85 },
  { factor: 'GPA', impact: 72 },
  { factor: 'Consecutive Absences', impact: 78 },
  { factor: 'Exam Attempts', impact: 65 },
  { factor: 'Fee Payment', impact: 45 },
  { factor: 'Assignment Completion', impact: 58 },
]

const mlPredictionAccuracy = [
  { month: 'Jan', accuracy: 82, precision: 79, recall: 85 },
  { month: 'Feb', accuracy: 84, precision: 81, recall: 86 },
  { month: 'Mar', accuracy: 85, precision: 83, recall: 87 },
  { month: 'Apr', accuracy: 86, precision: 84, recall: 88 },
  { month: 'May', accuracy: 87, precision: 85, recall: 89 },
  { month: 'Jun', accuracy: 88, precision: 87, recall: 89 },
]

const attendanceVsRisk = [
  { attendance: 95, risk: 5, students: 50 },
  { attendance: 90, risk: 12, students: 45 },
  { attendance: 85, risk: 22, students: 40 },
  { attendance: 80, risk: 35, students: 35 },
  { attendance: 75, risk: 48, students: 30 },
  { attendance: 70, risk: 62, students: 25 },
  { attendance: 65, risk: 75, students: 20 },
  { attendance: 60, risk: 85, students: 15 },
]

const radarData = [
  { metric: 'Attendance', A: 120, B: 110, fullMark: 150 },
  { metric: 'GPA', A: 98, B: 130, fullMark: 150 },
  { metric: 'Assignment', A: 86, B: 130, fullMark: 150 },
  { metric: 'Participation', A: 99, B: 100, fullMark: 150 },
  { metric: 'Exam Scores', A: 85, B: 90, fullMark: 150 },
  { metric: 'Engagement', A: 65, B: 85, fullMark: 150 },
]

const COLORS = {
  high: 'hsl(0, 84%, 60%)',
  medium: 'hsl(38, 92%, 50%)',
  low: 'hsl(120, 100%, 40%)',
  primary: 'hsl(210, 100%, 50%)',
  secondary: 'hsl(270, 100%, 50%)',
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('6months')
  const [department, setDepartment] = useState('all')

  return (
    <>
      <Sidebar />
      <MainContent>
        <div className="p-6 lg:p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                Analytics & ML Insights
              </h1>
              <p className="text-muted-foreground mt-1">
                Deep dive into prediction patterns and risk factor analysis
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">Last Month</SelectItem>
                  <SelectItem value="3months">3 Months</SelectItem>
                  <SelectItem value="6months">6 Months</SelectItem>
                  <SelectItem value="1year">1 Year</SelectItem>
                </SelectContent>
              </Select>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="cs">Computer Science</SelectItem>
                  <SelectItem value="eng">Engineering</SelectItem>
                  <SelectItem value="bus">Business</SelectItem>
                  <SelectItem value="bio">Biology</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>

          {/* ML Model Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                ML Model Performance
              </CardTitle>
              <CardDescription>
                Logistic Regression model accuracy, precision, and recall over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mlPredictionAccuracy}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" domain={[70, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="accuracy" stroke={COLORS.primary} strokeWidth={2} name="Accuracy" />
                  <Line type="monotone" dataKey="precision" stroke={COLORS.secondary} strokeWidth={2} name="Precision" />
                  <Line type="monotone" dataKey="recall" stroke={COLORS.low} strokeWidth={2} name="Recall" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Risk Distribution by Department */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution by Department</CardTitle>
                <CardDescription>Student risk levels across different departments</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentRiskData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis type="number" stroke="rgba(255,255,255,0.5)" />
                    <YAxis dataKey="department" type="category" stroke="rgba(255,255,255,0.5)" width={100} fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="high" stackId="a" fill={COLORS.high} name="High Risk" />
                    <Bar dataKey="medium" stackId="a" fill={COLORS.medium} name="Medium Risk" />
                    <Bar dataKey="low" stackId="a" fill={COLORS.low} name="Low Risk" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Factor Impact Analysis</CardTitle>
                <CardDescription>Correlation between factors and dropout probability</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={riskFactorCorrelation}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="factor" stroke="rgba(255,255,255,0.5)" fontSize={11} angle={-20} textAnchor="end" height={60} />
                    <YAxis stroke="rgba(255,255,255,0.5)" domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="impact" fill={COLORS.primary} name="Impact %" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Semester Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Semester-wise Analysis
              </CardTitle>
              <CardDescription>
                Dropout rate, attendance, and GPA trends across semesters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={semesterTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="semester" stroke="rgba(255,255,255,0.5)" />
                  <YAxis yAxisId="left" stroke="rgba(255,255,255,0.5)" />
                  <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="dropoutRate" stroke={COLORS.high} strokeWidth={2} name="Dropout Rate %" />
                  <Line yAxisId="right" type="monotone" dataKey="avgAttendance" stroke={COLORS.primary} strokeWidth={2} name="Avg Attendance %" />
                  <Line yAxisId="left" type="monotone" dataKey="avgGPA" stroke={COLORS.low} strokeWidth={2} name="Avg GPA" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Scatter Plot and Radar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance vs Risk Correlation</CardTitle>
                <CardDescription>ML-identified relationship between attendance and dropout risk</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="attendance" name="Attendance %" stroke="rgba(255,255,255,0.5)" unit="%" />
                    <YAxis dataKey="risk" name="Risk Score" stroke="rgba(255,255,255,0.5)" unit="%" />
                    <ZAxis dataKey="students" range={[50, 400]} name="Students" />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Scatter data={attendanceVsRisk} fill={COLORS.primary} />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Radar: At-Risk vs Safe</CardTitle>
                <CardDescription>Comparing metrics between risk groups</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.2)" />
                    <PolarAngleAxis dataKey="metric" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                    <PolarRadiusAxis stroke="rgba(255,255,255,0.3)" />
                    <Radar name="At-Risk Students" dataKey="A" stroke={COLORS.high} fill={COLORS.high} fillOpacity={0.3} />
                    <Radar name="Safe Students" dataKey="B" stroke={COLORS.low} fill={COLORS.low} fillOpacity={0.3} />
                    <Legend />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Key Insights */}
          <Card className="bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5">
            <CardHeader>
              <CardTitle>Key ML Insights</CardTitle>
              <CardDescription>Automatically generated insights from model analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-card border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-sm font-semibold">Critical Finding</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Students with attendance below 75% have an 85% higher chance of dropping out compared to those above 90%.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-card border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span className="text-sm font-semibold">Pattern Detected</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Semester 3-4 shows highest dropout risk. Early intervention during Sem 2 shows 40% reduction in dropouts.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-card border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm font-semibold">Improvement</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Model accuracy improved by 6% this semester after incorporating consecutive absence patterns.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainContent>
    </>
  )
}
