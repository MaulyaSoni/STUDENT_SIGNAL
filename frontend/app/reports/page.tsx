'use client'

import { useState } from 'react'
import { Sidebar, MainContent } from '@/components/Sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Download, 
  Calendar, 
  Clock,
  FileSpreadsheet,
  Mail,
  AlertTriangle,
  Users,
  TrendingUp,
  CheckCircle,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'

const reportTemplates = [
  {
    id: 'at-risk',
    name: 'At-Risk Students Report',
    description: 'List of all students flagged by ML model with risk factors and recommendations',
    icon: AlertTriangle,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  {
    id: 'department',
    name: 'Department Analysis',
    description: 'Risk distribution and trends across all departments',
    icon: Users,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    id: 'intervention',
    name: 'Intervention Report',
    description: 'Students who received interventions and their progress',
    icon: TrendingUp,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    id: 'attendance',
    name: 'Attendance Summary',
    description: 'Attendance patterns and their correlation with risk levels',
    icon: Calendar,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
]

const recentReports = [
  {
    id: 1,
    name: 'Weekly High-Risk Report',
    type: 'at-risk',
    date: '2026-02-05',
    status: 'completed',
    downloadUrl: '#',
  },
  {
    id: 2,
    name: 'CS Department Analysis',
    type: 'department',
    date: '2026-02-03',
    status: 'completed',
    downloadUrl: '#',
  },
  {
    id: 3,
    name: 'Monthly Intervention Summary',
    type: 'intervention',
    date: '2026-02-01',
    status: 'completed',
    downloadUrl: '#',
  },
  {
    id: 4,
    name: 'Attendance Correlation Report',
    type: 'attendance',
    date: '2026-01-28',
    status: 'completed',
    downloadUrl: '#',
  },
]

const scheduledReports = [
  {
    id: 1,
    name: 'Weekly At-Risk Summary',
    frequency: 'Weekly',
    nextRun: '2026-02-10',
    recipients: ['mentor@university.edu', 'admin@university.edu'],
  },
  {
    id: 2,
    name: 'Monthly Department Report',
    frequency: 'Monthly',
    nextRun: '2026-03-01',
    recipients: ['dean@university.edu'],
  },
]

export default function ReportsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [reportConfig, setReportConfig] = useState({
    department: 'all',
    riskLevel: 'all',
    dateRange: '30days',
    format: 'pdf',
    includeCharts: true,
    includeRecommendations: true,
  })

  const handleGenerateReport = async () => {
    if (!selectedTemplate) {
      toast.error('Please select a report template')
      return
    }
    
    setGenerating(true)
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    setGenerating(false)
    toast.success('Report Generated', {
      description: 'Your report is ready for download.',
    })
  }

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
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                Reports
              </h1>
              <p className="text-muted-foreground mt-1">
                Generate and schedule reports for stakeholders
              </p>
            </div>
          </div>

          {/* Report Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Report Templates</CardTitle>
              <CardDescription>Select a template to generate a new report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTemplates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedTemplate === template.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${template.bgColor}`}>
                        <template.icon className={`w-5 h-5 ${template.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{template.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {template.description}
                        </p>
                      </div>
                      {selectedTemplate === template.id && (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Report Configuration */}
          {selectedTemplate && (
            <Card>
              <CardHeader>
                <CardTitle>Configure Report</CardTitle>
                <CardDescription>Customize the report parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select 
                      value={reportConfig.department} 
                      onValueChange={(v) => setReportConfig({...reportConfig, department: v})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="cs">Computer Science</SelectItem>
                        <SelectItem value="eng">Engineering</SelectItem>
                        <SelectItem value="bus">Business</SelectItem>
                        <SelectItem value="bio">Biology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Risk Level</Label>
                    <Select 
                      value={reportConfig.riskLevel} 
                      onValueChange={(v) => setReportConfig({...reportConfig, riskLevel: v})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="high">High Risk Only</SelectItem>
                        <SelectItem value="medium">Medium Risk Only</SelectItem>
                        <SelectItem value="low">Low Risk Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <Select 
                      value={reportConfig.dateRange} 
                      onValueChange={(v) => setReportConfig({...reportConfig, dateRange: v})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7days">Last 7 Days</SelectItem>
                        <SelectItem value="30days">Last 30 Days</SelectItem>
                        <SelectItem value="90days">Last 90 Days</SelectItem>
                        <SelectItem value="semester">This Semester</SelectItem>
                        <SelectItem value="year">This Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Export Format</Label>
                    <Select 
                      value={reportConfig.format} 
                      onValueChange={(v) => setReportConfig({...reportConfig, format: v})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="xlsx">Excel Spreadsheet</SelectItem>
                        <SelectItem value="csv">CSV File</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4 col-span-1 md:col-span-2">
                    <Label>Include in Report</Label>
                    <div className="flex flex-wrap gap-6">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="charts" 
                          checked={reportConfig.includeCharts}
                          onCheckedChange={(checked) => 
                            setReportConfig({...reportConfig, includeCharts: checked as boolean})
                          }
                        />
                        <label htmlFor="charts" className="text-sm">Charts & Visualizations</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="recommendations" 
                          checked={reportConfig.includeRecommendations}
                          onCheckedChange={(checked) => 
                            setReportConfig({...reportConfig, includeRecommendations: checked as boolean})
                          }
                        />
                        <label htmlFor="recommendations" className="text-sm">ML Recommendations</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button onClick={handleGenerateReport} disabled={generating} className="gap-2">
                    {generating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Generate Report
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                Recent Reports
              </CardTitle>
              <CardDescription>Previously generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <FileSpreadsheet className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{report.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Generated on {new Date(report.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                        {report.status}
                      </Badge>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Scheduled Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                Scheduled Reports
              </CardTitle>
              <CardDescription>Automatically generated and sent to stakeholders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <Mail className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">{report.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{report.frequency}</Badge>
                          <span className="text-sm text-muted-foreground">
                            Next: {new Date(report.nextRun).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm text-muted-foreground">Recipients:</p>
                        <p className="text-xs text-muted-foreground">{report.recipients.length} emails</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4 gap-2">
                  <Calendar className="w-4 h-4" />
                  Schedule New Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainContent>
    </>
  )
}
