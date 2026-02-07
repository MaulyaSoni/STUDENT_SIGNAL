import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  color?: 'default' | 'high' | 'medium' | 'low'
  icon?: React.ReactNode
  delay?: number
}

export function StatCard({ title, value, description, color = 'default', icon, delay = 0 }: StatCardProps) {
  const colorMap = {
    default: 'border-border hover:border-primary/50 bg-card/50',
    high: 'border-risk-high/30 bg-risk-high/10 hover:border-risk-high/60',
    medium: 'border-risk-medium/30 bg-risk-medium/10 hover:border-risk-medium/60',
    low: 'border-risk-low/30 bg-risk-low/10 hover:border-risk-low/60',
  }

  const iconColorMap = {
    default: 'text-primary',
    high: 'text-risk-high',
    medium: 'text-risk-medium',
    low: 'text-risk-low',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
    >
      <Card className={`border-2 ${colorMap[color]} transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover-glow backdrop-blur-sm`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium font-heading text-glow-yellow">{title}</CardTitle>
          {icon && (
            <motion.div 
              className={`text-2xl ${iconColorMap[color]}`}
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {icon}
            </motion.div>
          )}
        </CardHeader>
        <CardContent>
          <motion.div 
            className="text-3xl font-bold font-heading text-shiny"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: delay + 0.2 }}
          >
            {value}
          </motion.div>
          {description && <CardDescription className="text-xs mt-1 text-muted-foreground">{description}</CardDescription>}
        </CardContent>
      </Card>
    </motion.div>
  )
}
