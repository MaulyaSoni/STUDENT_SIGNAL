'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faChartLine, 
  faRobot, 
  faCircleNotch,
  faCheckCircle,
  faExclamationTriangle,
  faLightbulb,
  faChartBar
} from '@fortawesome/free-solid-svg-icons'
import { Navigation } from '@/components/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { predictDropout, getTreeVisualization, getFeatureImportance } from '@/services/api'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function PredictPage() {
  const [formData, setFormData] = useState({
    attendance: 75,
    internal_marks: 75,
    backlogs: 0,
    study_hours: 4,
    previous_failures: 0,
  })

  const [prediction, setPrediction] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [treeViz, setTreeViz] = useState<any>(null)
  const [featureImp, setFeatureImp] = useState<any>(null)
  const [vizLoading, setVizLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: parseFloat(value) || 0,
    }))
  }

  const handlePredict = async () => {
    setLoading(true)
    try {
      const result = await predictDropout(formData)
      setPrediction(result)
    } catch (error) {
      console.error('Prediction error:', error)
      alert('Failed to get prediction. Please check if the backend is running.')
    }
    setLoading(false)
  }

  const handleLoadVisualization = async () => {
    setVizLoading(true)
    try {
      const [tree, features] = await Promise.all([
        getTreeVisualization(4),
        getFeatureImportance()
      ])
      setTreeViz(tree)
      setFeatureImp(features)
    } catch (error) {
      console.error('Visualization error:', error)
      alert('Failed to load visualization. Please check if the backend is running.')
    }
    setVizLoading(false)
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-500/10 border-red-500'
      case 'medium': return 'bg-yellow-500/10 border-yellow-500'
      case 'low': return 'bg-green-500/10 border-green-500'
      default: return 'bg-gray-500/10 border-gray-500'
    }
  }

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
            <h1 className="text-5xl font-bold tracking-tight font-heading text-shiny flex items-center gap-3">
              <FontAwesomeIcon icon={faRobot} className="text-primary" />
              ML Prediction System
            </h1>
            <p className="text-glow-yellow mt-2 text-lg font-medium">
              AI-powered dropout prediction and risk analysis
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Prediction Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle className="font-heading flex items-center gap-2">
                    <FontAwesomeIcon icon={faChartLine} className="text-primary" />
                    Student Risk Prediction
                  </CardTitle>
                  <CardDescription>
                    Enter student data to predict dropout probability
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="attendance">Attendance (%)</Label>
                    <Input
                      id="attendance"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.attendance}
                      onChange={(e) => handleInputChange('attendance', e.target.value)}
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="internal_marks">Internal Marks (0-100)</Label>
                    <Input
                      id="internal_marks"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.internal_marks}
                      onChange={(e) => handleInputChange('internal_marks', e.target.value)}
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backlogs">Number of Backlogs</Label>
                    <Input
                      id="backlogs"
                      type="number"
                      min="0"
                      value={formData.backlogs}
                      onChange={(e) => handleInputChange('backlogs', e.target.value)}
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="study_hours">Daily Study Hours</Label>
                    <Input
                      id="study_hours"
                      type="number"
                      min="0"
                      max="24"
                      step="0.5"
                      value={formData.study_hours}
                      onChange={(e) => handleInputChange('study_hours', e.target.value)}
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="previous_failures">Previous Failures</Label>
                    <Input
                      id="previous_failures"
                      type="number"
                      min="0"
                      value={formData.previous_failures}
                      onChange={(e) => handleInputChange('previous_failures', e.target.value)}
                      className="bg-background/50"
                    />
                  </div>

                  <Button 
                    onClick={handlePredict} 
                    className="w-full hover-lift"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <FontAwesomeIcon icon={faCircleNotch} className="mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faRobot} className="mr-2" />
                        Predict Risk
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Prediction Results */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className={`hover-lift ${prediction ? getRiskBgColor(prediction.risk_level) : ''} border-2`}>
                <CardHeader>
                  <CardTitle className="font-heading flex items-center gap-2">
                    {prediction ? (
                      prediction.risk_level === 'high' ? (
                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />
                      ) : (
                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                      )
                    ) : (
                      <FontAwesomeIcon icon={faChartLine} className="text-primary" />
                    )}
                    Prediction Results
                  </CardTitle>
                  <CardDescription>
                    {prediction ? 'AI analysis complete' : 'Results will appear here'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {prediction ? (
                    <div className="space-y-6">
                      {/* Risk Level */}
                      <div className="text-center p-6 bg-background/30 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-2">Risk Level</div>
                        <div className={`text-4xl font-bold ${getRiskColor(prediction.risk_level)} uppercase`}>
                          {prediction.risk_level}
                        </div>
                        <div className="text-sm text-muted-foreground mt-2">
                          Confidence: {prediction.confidence}
                        </div>
                      </div>

                      {/* Dropout Probability */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Dropout Probability</span>
                          <span className="font-bold">{(prediction.dropout_probability * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                          <motion.div
                            className={`h-3 rounded-full ${
                              prediction.risk_level === 'high' ? 'bg-red-500' :
                              prediction.risk_level === 'medium' ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${prediction.dropout_probability * 100}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                      </div>

                      {/* Risk Factors */}
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500" />
                          Risk Factors
                        </h3>
                        <div className="space-y-2">
                          {prediction.risk_factors.map((factor: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-2 text-sm">
                              <span className="text-yellow-500">•</span>
                              <span>{factor}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <FontAwesomeIcon icon={faLightbulb} className="text-primary" />
                          Recommendations
                        </h3>
                        <div className="space-y-2">
                          {prediction.recommendations.map((rec: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-2 text-sm bg-background/30 p-2 rounded">
                              <span className="text-primary">→</span>
                              <span>{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <FontAwesomeIcon icon={faChartLine} className="text-6xl mb-4 opacity-20" />
                      <p>Enter student data and click "Predict Risk" to see results</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Model Visualization Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="hover-lift">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-heading flex items-center gap-2">
                      <FontAwesomeIcon icon={faChartBar} className="text-primary" />
                      ML Model Insights
                    </CardTitle>
                    <CardDescription>
                      Decision tree structure and feature importance
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={handleLoadVisualization} 
                    disabled={vizLoading}
                    variant="outline"
                    className="hover-lift"
                  >
                    {vizLoading ? (
                      <>
                        <FontAwesomeIcon icon={faCircleNotch} className="mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Load Visualization'
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {treeViz || featureImp ? (
                  <div className="space-y-6">
                    {/* Decision Tree */}
                    {treeViz && treeViz.image && (
                      <div>
                        <h3 className="font-semibold mb-4">Decision Tree Visualization</h3>
                        <div className="bg-white p-4 rounded-lg overflow-auto">
                          <img 
                            src={treeViz.image} 
                            alt="Decision Tree" 
                            className="w-full h-auto"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Model Type: {treeViz.model_type} | Features: {treeViz.num_features}
                        </p>
                      </div>
                    )}

                    {/* Feature Importance */}
                    {featureImp && featureImp.image && (
                      <div>
                        <h3 className="font-semibold mb-4">Feature Importance</h3>
                        <div className="bg-white p-4 rounded-lg">
                          <img 
                            src={featureImp.image} 
                            alt="Feature Importance" 
                            className="w-full h-auto"
                          />
                        </div>
                        {featureImp.importances && (
                          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
                            {Object.entries(featureImp.importances).map(([feature, importance]: [string, any]) => (
                              <div key={feature} className="bg-background/30 p-2 rounded">
                                <div className="text-xs text-muted-foreground">{feature}</div>
                                <div className="font-semibold">{(importance * 100).toFixed(1)}%</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <FontAwesomeIcon icon={faChartBar} className="text-6xl mb-4 opacity-20" />
                    <p>Click "Load Visualization" to see the ML model structure</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </>
  )
}
