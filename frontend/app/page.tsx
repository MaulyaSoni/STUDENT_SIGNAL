'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { StatCard } from '@/components/StatCard'
import { RiskCard } from '@/components/RiskCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getDashboardStats, getStudents } from '@/services/api'
import { mockDashboardStats, mockStudents } from '@/lib/mock-data'

interface DashboardStats {
  total_students: number
  high_risk_count: number
  medium_risk_count: number
  low_risk_count: number
  avg_dropout_probability: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [highRiskStudents, setHighRiskStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [statsData, studentsData] = await Promise.all([
          getDashboardStats(),
          getStudents({ risk_level: 'high' }),
        ])
        setStats(statsData)
        setHighRiskStudents(studentsData.slice(0, 6))
      } catch (error) {
        console.error('[v0] Error loading dashboard data:', error)
        // Use mock data on error
        setStats(mockDashboardStats)
        setHighRiskStudents(mockStudents.filter((s) => s.risk_level === 'high'))
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Monitor student risk indicators and identify intervention opportunities
            </p>
          </div>

          {/* Key Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatCard
              title="Total Students"
              value={stats?.total_students ?? 0}
              description="Active in program"
              color="default"
            />
            <StatCard
              title="High Risk"
              value={stats?.high_risk_count ?? 0}
              description="Immediate attention needed"
              color="high"
            />
            <StatCard
              title="Medium Risk"
              value={stats?.medium_risk_count ?? 0}
              description="Monitoring required"
              color="medium"
            />
            <StatCard
              title="Low Risk"
              value={stats?.low_risk_count ?? 0}
              description="Progressing well"
              color="low"
            />
            <StatCard
              title="Avg. Risk Level"
              value={`${((stats?.avg_dropout_probability ?? 0) * 100).toFixed(1)}%`}
              description="Dropout probability"
              color="default"
            />
          </div>

          {/* Risk Distribution Chart */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Risk Distribution Overview</CardTitle>
              <CardDescription>Student risk levels across the program</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Low Risk</span>
                    <span className="text-sm text-muted-foreground">
                      {stats
                        ? Math.round(
                            ((stats.low_risk_count / stats.total_students) * 100 * 100) / 100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-risk-low h-2 rounded-full"
                      style={{
                        width: `${stats ? (stats.low_risk_count / stats.total_students) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Medium Risk</span>
                    <span className="text-sm text-muted-foreground">
                      {stats
                        ? Math.round(
                            ((stats.medium_risk_count / stats.total_students) * 100 * 100) / 100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-risk-medium h-2 rounded-full"
                      style={{
                        width: `${stats ? (stats.medium_risk_count / stats.total_students) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">High Risk</span>
                    <span className="text-sm text-muted-foreground">
                      {stats
                        ? Math.round(
                            ((stats.high_risk_count / stats.total_students) * 100 * 100) / 100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-risk-high h-2 rounded-full"
                      style={{
                        width: `${stats ? (stats.high_risk_count / stats.total_students) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* High Risk Students */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">High Risk Students</h2>
                <p className="text-muted-foreground mt-1">
                  Students requiring immediate intervention
                </p>
              </div>
              <Link href="/students?risk_level=high">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <p className="text-muted-foreground">Loading students...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {highRiskStudents.length > 0 ? (
                  highRiskStudents.map((student) => (
                    <RiskCard
                      key={student.id}
                      id={student.id}
                      name={student.name}
                      studentId={student.student_id}
                      department={student.department}
                      gpa={student.gpa}
                      riskLevel={student.risk_level}
                      dropoutProbability={student.dropout_probability}
                      attendance={student.attendance}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No high-risk students found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
