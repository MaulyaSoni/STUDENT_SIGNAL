'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faExclamationTriangle, faExclamationCircle, faCheckCircle, faChartPie, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { Navigation } from '@/components/Navigation'
import { StatCard } from '@/components/StatCard'
import { RiskCard } from '@/components/RiskCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getDashboardStats, getStudents } from '@/services/api'
import { mockDashboardStats, mockStudents } from '@/lib/mock-data'
import { motion } from 'framer-motion'

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
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold tracking-tight font-heading text-shiny">
              Dashboard
            </h1>
            <p className="text-glow-yellow mt-2 text-lg font-medium">
              Monitor student risk indicators and identify intervention opportunities
            </p>
          </motion.div>

          {/* Key Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatCard
              title="Total Students"
              value={stats?.total_students ?? 0}
              description="Active in program"
              color="default"
              icon={<FontAwesomeIcon icon={faUsers} />}
              delay={0}
            />
            <StatCard
              title="High Risk"
              value={stats?.high_risk_count ?? 0}
              description="Immediate attention needed"
              color="high"
              icon={<FontAwesomeIcon icon={faExclamationTriangle} />}
              delay={0.1}
            />
            <StatCard
              title="Medium Risk"
              value={stats?.medium_risk_count ?? 0}
              description="Monitoring required"
              color="medium"
              icon={<FontAwesomeIcon icon={faExclamationCircle} />}
              delay={0.2}
            />
            <StatCard
              title="Low Risk"
              value={stats?.low_risk_count ?? 0}
              description="Progressing well"
              color="low"
              icon={<FontAwesomeIcon icon={faCheckCircle} />}
              delay={0.3}
            />
            <StatCard
              title="Avg. Risk Level"
              value={`${((stats?.avg_dropout_probability ?? 0) * 100).toFixed(1)}%`}
              description="Dropout probability"
              color="default"
              icon={<FontAwesomeIcon icon={faChartPie} />}
              delay={0.4}
            />
          </div>

          {/* Risk Distribution Chart */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="mb-8 hover-lift">
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2">
                  <FontAwesomeIcon icon={faChartPie} className="text-primary" />
                  Risk Distribution Overview
                </CardTitle>
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
                    <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                      <motion.div
                        className="bg-risk-low h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${stats ? (stats.low_risk_count / stats.total_students) * 100 : 0}%` 
                        }}
                        transition={{ duration: 1, delay: 0.6 }}
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
                    <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                      <motion.div
                        className="bg-risk-medium h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${stats ? (stats.medium_risk_count / stats.total_students) * 100 : 0}%` 
                        }}
                        transition={{ duration: 1, delay: 0.7 }}
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
                    <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                      <motion.div
                        className="bg-risk-high h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${stats ? (stats.high_risk_count / stats.total_students) * 100 : 0}%` 
                        }}
                        transition={{ duration: 1, delay: 0.8 }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* High Risk Students */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-3xl font-bold font-heading text-glow-green">High Risk Students</h2>
                <p className="text-muted-foreground mt-1">
                  Students requiring immediate intervention
                </p>
              </div>
              <Link href="/students?risk_level=high">
                <Button variant="outline" className="hover-lift">
                  View All
                  <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </Button>
              </Link>
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <motion.p 
                  className="text-muted-foreground"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Loading students...
                </motion.p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {highRiskStudents.length > 0 ? (
                  highRiskStudents.map((student, index) => (
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
                      delay={1 + index * 0.1}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No high-risk students found</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </>
  )
}
