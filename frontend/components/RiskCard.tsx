'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RiskBadge } from './RiskBadge'

interface RiskCardProps {
  id: string
  name: string
  studentId: string
  department: string
  gpa: number
  riskLevel: 'low' | 'medium' | 'high'
  dropoutProbability: number
  attendance: number
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
}: RiskCardProps) {
  const borderColorMap = {
    low: 'border-risk-low/30',
    medium: 'border-risk-medium/30',
    high: 'border-risk-high/30',
  }

  return (
    <Link href={`/students/${id}`}>
      <Card className={`cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 ${borderColorMap[riskLevel]}`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{name}</CardTitle>
              <CardDescription className="text-muted-foreground">ID: {studentId}</CardDescription>
            </div>
            <RiskBadge level={riskLevel} size="sm" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Department</p>
              <p className="text-sm font-medium">{department}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">GPA</p>
              <p className="text-sm font-medium">{gpa.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Attendance</p>
              <p className="text-sm font-medium">{attendance}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Dropout Risk</p>
              <p className="text-sm font-medium">{(dropoutProbability * 100).toFixed(1)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
