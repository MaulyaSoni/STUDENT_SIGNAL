'use client'

import { useState } from 'react'
import { Sidebar, MainContent } from '@/components/Sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  Settings,
  Bell,
  Shield,
  Database,
  Brain,
  Mail,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    highRiskImmediate: true,
    dailyDigest: true,
    weeklyReport: true,
  })

  // Risk thresholds
  const [thresholds, setThresholds] = useState({
    attendanceThreshold: 75,
    consecutiveAbsences: 5,
    gpaThreshold: 2.5,
    highRiskProbability: 70,
    mediumRiskProbability: 40,
  })

  // ML settings
  const [mlSettings, setMlSettings] = useState({
    autoAnalysis: true,
    analysisFrequency: 'daily',
    includeAttendance: true,
    includeGPA: true,
    includeAbsences: true,
    includeFeePayment: true,
  })

  const handleSave = async () => {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    toast.success('Settings Saved', {
      description: 'Your preferences have been updated successfully.',
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
                  <Settings className="w-6 h-6 text-primary" />
                </div>
                Settings
              </h1>
              <p className="text-muted-foreground mt-1">
                Configure system preferences and alert thresholds
              </p>
            </div>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>

          <Tabs defaultValue="notifications" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="thresholds" className="gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="hidden sm:inline">Risk Thresholds</span>
              </TabsTrigger>
              <TabsTrigger value="ml" className="gap-2">
                <Brain className="w-4 h-4" />
                <span className="hidden sm:inline">ML Configuration</span>
              </TabsTrigger>
              <TabsTrigger value="system" className="gap-2">
                <Database className="w-4 h-4" />
                <span className="hidden sm:inline">System</span>
              </TabsTrigger>
            </TabsList>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Configure how and when you receive alerts about at-risk students
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Email Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive risk alerts via email
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailAlerts}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, emailAlerts: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Immediate High-Risk Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified immediately when a student is flagged as high risk
                      </p>
                    </div>
                    <Switch
                      checked={notifications.highRiskImmediate}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, highRiskImmediate: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Daily Digest</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive a daily summary of risk changes
                      </p>
                    </div>
                    <Switch
                      checked={notifications.dailyDigest}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, dailyDigest: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Weekly Report</Label>
                      <p className="text-sm text-muted-foreground">
                        Automated weekly summary sent to mentors
                      </p>
                    </div>
                    <Switch
                      checked={notifications.weeklyReport}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, weeklyReport: checked})
                      }
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <Label className="text-base">Email Recipients</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Add email addresses to receive notifications
                    </p>
                    <div className="flex gap-2">
                      <Input placeholder="Enter email address" className="flex-1" />
                      <Button variant="outline">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="secondary" className="gap-1">
                        mentor@university.edu
                        <button className="ml-1 hover:text-destructive">&times;</button>
                      </Badge>
                      <Badge variant="secondary" className="gap-1">
                        admin@university.edu
                        <button className="ml-1 hover:text-destructive">&times;</button>
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Risk Thresholds Tab */}
            <TabsContent value="thresholds">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Risk Thresholds
                  </CardTitle>
                  <CardDescription>
                    Define the rules for identifying at-risk students
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label className="text-base">Attendance Threshold</Label>
                      <span className="text-sm font-medium">{thresholds.attendanceThreshold}%</span>
                    </div>
                    <Slider
                      value={[thresholds.attendanceThreshold]}
                      onValueChange={([value]) => 
                        setThresholds({...thresholds, attendanceThreshold: value})
                      }
                      min={50}
                      max={90}
                      step={5}
                    />
                    <p className="text-sm text-muted-foreground">
                      Students with attendance below this threshold will be flagged
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label className="text-base">Consecutive Absences</Label>
                      <span className="text-sm font-medium">{thresholds.consecutiveAbsences} days</span>
                    </div>
                    <Slider
                      value={[thresholds.consecutiveAbsences]}
                      onValueChange={([value]) => 
                        setThresholds({...thresholds, consecutiveAbsences: value})
                      }
                      min={3}
                      max={10}
                      step={1}
                    />
                    <p className="text-sm text-muted-foreground">
                      Flag students with this many consecutive absences
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label className="text-base">GPA Threshold</Label>
                      <span className="text-sm font-medium">{thresholds.gpaThreshold.toFixed(1)}</span>
                    </div>
                    <Slider
                      value={[thresholds.gpaThreshold * 10]}
                      onValueChange={([value]) => 
                        setThresholds({...thresholds, gpaThreshold: value / 10})
                      }
                      min={15}
                      max={35}
                      step={1}
                    />
                    <p className="text-sm text-muted-foreground">
                      Students with GPA below this value are considered at risk
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label className="text-base">High Risk ML Probability</Label>
                      <span className="text-sm font-medium text-red-500">{thresholds.highRiskProbability}%</span>
                    </div>
                    <Slider
                      value={[thresholds.highRiskProbability]}
                      onValueChange={([value]) => 
                        setThresholds({...thresholds, highRiskProbability: value})
                      }
                      min={50}
                      max={90}
                      step={5}
                      className="[&_[role=slider]]:bg-red-500"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label className="text-base">Medium Risk ML Probability</Label>
                      <span className="text-sm font-medium text-yellow-500">{thresholds.mediumRiskProbability}%</span>
                    </div>
                    <Slider
                      value={[thresholds.mediumRiskProbability]}
                      onValueChange={([value]) => 
                        setThresholds({...thresholds, mediumRiskProbability: value})
                      }
                      min={20}
                      max={60}
                      step={5}
                      className="[&_[role=slider]]:bg-yellow-500"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ML Configuration Tab */}
            <TabsContent value="ml">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    ML Model Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure the machine learning model parameters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Automatic Analysis</Label>
                      <p className="text-sm text-muted-foreground">
                        Run ML predictions automatically
                      </p>
                    </div>
                    <Switch
                      checked={mlSettings.autoAnalysis}
                      onCheckedChange={(checked) => 
                        setMlSettings({...mlSettings, autoAnalysis: checked})
                      }
                    />
                  </div>

                  {mlSettings.autoAnalysis && (
                    <div className="space-y-2">
                      <Label>Analysis Frequency</Label>
                      <Select 
                        value={mlSettings.analysisFrequency} 
                        onValueChange={(v) => setMlSettings({...mlSettings, analysisFrequency: v})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Every Hour</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <Label className="text-base mb-4 block">Features for ML Model</Label>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Attendance Data</span>
                        </div>
                        <Switch
                          checked={mlSettings.includeAttendance}
                          onCheckedChange={(checked) => 
                            setMlSettings({...mlSettings, includeAttendance: checked})
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>GPA & Academic Performance</span>
                        </div>
                        <Switch
                          checked={mlSettings.includeGPA}
                          onCheckedChange={(checked) => 
                            setMlSettings({...mlSettings, includeGPA: checked})
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Consecutive Absences Pattern</span>
                        </div>
                        <Switch
                          checked={mlSettings.includeAbsences}
                          onCheckedChange={(checked) => 
                            setMlSettings({...mlSettings, includeAbsences: checked})
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Fee Payment Status</span>
                        </div>
                        <Switch
                          checked={mlSettings.includeFeePayment}
                          onCheckedChange={(checked) => 
                            setMlSettings({...mlSettings, includeFeePayment: checked})
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-5 h-5 text-blue-500" />
                      <span className="font-medium">Current Model: Logistic Regression</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Model uses attendance percentage and consecutive absences as primary features. 
                      Last trained: 2 days ago. Accuracy: 87.5%
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* System Tab */}
            <TabsContent value="system">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    System Configuration
                  </CardTitle>
                  <CardDescription>
                    Database and API settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>API Endpoint</Label>
                    <Input value="http://localhost:8000" readOnly className="bg-secondary" />
                    <p className="text-sm text-muted-foreground">FastAPI backend server</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Database</Label>
                    <Input value="MongoDB Atlas" readOnly className="bg-secondary" />
                    <p className="text-sm text-muted-foreground">Primary data storage</p>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium">System Status: Healthy</p>
                        <p className="text-sm text-muted-foreground">All services operational</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Refresh
                    </Button>
                  </div>

                  <div className="pt-4 border-t">
                    <Label className="text-base mb-4 block">Data Management</Label>
                    <div className="flex gap-3">
                      <Button variant="outline" className="gap-2">
                        <Database className="w-4 h-4" />
                        Export All Data
                      </Button>
                      <Button variant="destructive" className="gap-2">
                        Clear Cache
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </MainContent>
    </>
  )
}
