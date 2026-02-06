import { Badge } from '@/components/ui/badge'

interface RiskBadgeProps {
  level: 'low' | 'medium' | 'high'
  probability?: number
  size?: 'sm' | 'md' | 'lg'
}

export function RiskBadge({ level, probability, size = 'md' }: RiskBadgeProps) {
  const colorMap = {
    low: 'bg-risk-low text-black',
    medium: 'bg-risk-medium text-black',
    high: 'bg-risk-high text-white',
  }

  const labelMap = {
    low: 'Low Risk',
    medium: 'Medium Risk',
    high: 'High Risk',
  }

  const sizeMap = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-2',
  }

  return (
    <div className="flex items-center gap-2">
      <Badge className={`${colorMap[level]} ${sizeMap[size]} font-semibold`}>
        {labelMap[level]}
      </Badge>
      {probability !== undefined && (
        <span className="text-muted-foreground text-sm">
          {(probability * 100).toFixed(1)}% probability
        </span>
      )}
    </div>
  )
}
