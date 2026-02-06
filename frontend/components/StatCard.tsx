import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  color?: 'default' | 'high' | 'medium' | 'low'
  icon?: React.ReactNode
}

export function StatCard({ title, value, description, color = 'default', icon }: StatCardProps) {
  const colorMap = {
    default: 'border-border',
    high: 'border-risk-high/30 bg-risk-high/5',
    medium: 'border-risk-medium/30 bg-risk-medium/5',
    low: 'border-risk-low/30 bg-risk-low/5',
  }

  return (
    <Card className={`border ${colorMap[color]}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <CardDescription className="text-xs mt-1">{description}</CardDescription>}
      </CardContent>
    </Card>
  )
}
