'use client'

import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding, faChartLine, faCalendarCheck, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RiskBadge } from './RiskBadge'
import { motion } from 'framer-motion'

interface RiskCardProps {
  id: string
  name: string
  studentId: string
  department: string
  gpa: number
  riskLevel: 'low' | 'medium' | 'high'
  dropoutProbability: number
  attendance: number
  delay?: number
}

export function RiskCard({
  id,
  name,
  studentId,
  department,
  gpa,
  riskLevel,
  dropoutProbability,
  attendance,
  delay = 0,
}: RiskCardProps) {
  const borderColorMap = {
    low: 'border-risk-low/30 hover:border-risk-low/60',
    medium: 'border-risk-medium/30 hover:border-risk-medium/60',
    high: 'border-risk-high/30 hover:border-risk-high/60',
  }

  return (
    <Link href={`/students/${id}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay }}
        whileHover={{ y: -6, scale: 1.02 }}
      >
        <Card className={`cursor-pointer border-2 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/30 hover-glow ${borderColorMap[riskLevel]} bg-card/50 backdrop-blur-sm`}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg font-heading text-shiny">{name}</CardTitle>
                <CardDescription className="text-glow-yellow">ID: {studentId}</CardDescription>
              </div>
              <RiskBadge level={riskLevel} size="sm" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <FontAwesomeIcon icon={faBuilding} className="text-primary mt-1 text-sm" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Department</p>
                  <p className="text-sm font-medium text-foreground">{department}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FontAwesomeIcon icon={faChartLine} className="text-primary mt-1 text-sm" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">GPA</p>
                  <p className="text-sm font-medium text-foreground">{gpa.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FontAwesomeIcon icon={faCalendarCheck} className="text-primary mt-1 text-sm" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Attendance</p>
                  <p className="text-sm font-medium text-foreground">{attendance}%</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-primary mt-1 text-sm" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Dropout Risk</p>
                  <p className="text-sm font-medium text-foreground">{(dropoutProbability * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  )
}
