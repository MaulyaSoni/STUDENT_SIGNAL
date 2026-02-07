'use client'

import React from "react"

import { useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCloudArrowUp, 
  faFileArrowUp, 
  faCircleCheck, 
  faCircleExclamation,
  faRobot,
  faCircleNotch
} from '@fortawesome/free-solid-svg-icons'
import { Navigation } from '@/components/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { uploadData, analyzeAllStudents } from '@/services/api'
import { motion } from 'framer-motion'

export default function UploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [uploadResult, setUploadResult] = useState<any>(null)

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.xlsx')) {
        setFile(droppedFile)
        setMessage(null)
      } else {
        setMessage({
          type: 'error',
          text: 'Please upload a CSV or Excel file',
        })
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.xlsx')) {
        setFile(selectedFile)
        setMessage(null)
      } else {
        setMessage({
          type: 'error',
          text: 'Please upload a CSV or Excel file',
        })
      }
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setMessage({
        type: 'error',
        text: 'Please select a file first',
      })
      return
    }

    try {
      setLoading(true)
      const result = await uploadData(file)
      setUploadResult(result)
      setMessage({
        type: 'success',
        text: `Successfully uploaded! Processed ${result.rows_processed} students${result.rows_analyzed ? `, analyzed ${result.rows_analyzed}` : ''}`,
      })
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('[v0] Upload error:', error)
      setMessage({
        type: 'error',
        text: 'Failed to upload file. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyzeAll = async () => {
    try {
      setAnalyzing(true)
      const result = await analyzeAllStudents()
      setMessage({
        type: 'success',
        text: `Analysis complete! Analyzed ${result.analyzed} of ${result.total_students} students`,
      })
    } catch (error) {
      console.error('[v0] Analysis error:', error)
      setMessage({
        type: 'error',
        text: 'Failed to analyze students. Please ensure backend is running.',
      })
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold tracking-tight font-heading text-shiny flex items-center gap-3">
              <FontAwesomeIcon icon={faCloudArrowUp} className="text-primary" />
              Upload Data
            </h1>
            <p className="text-glow-yellow mt-2 text-lg font-medium">
              Import student data to analyze dropout risk and enable early interventions
            </p>
          </motion.div>

          {/* Upload Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="mb-8 hover-lift">
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2">
                  <FontAwesomeIcon icon={faFileArrowUp} className="text-primary" />
                  Upload Student Data
                </CardTitle>
                <CardDescription>
                  Drag and drop your CSV or Excel file or click to browse
                </CardDescription>
              </CardHeader>
            <CardContent className="space-y-6">
              {/* Drop Zone */}
              <motion.div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer ${
                  dragActive ? 'border-primary bg-primary/20 shadow-lg shadow-primary/30' : 'border-border hover:border-primary/50 bg-card/30'
                }`}
                whileHover={{ scale: 1.01 }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div onClick={() => fileInputRef.current?.click()} className="space-y-3">
                  <motion.div 
                    className="text-6xl"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FontAwesomeIcon icon={faFileArrowUp} className="text-primary" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-shiny">
                    {file ? file.name : 'Drag and drop your file here'}
                  </h3>
                  <p className="text-sm text-glow-yellow">
                    or click to select from your computer
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Supported formats: CSV, Excel (.xlsx)
                  </p>
                </div>
              </motion.div>

              {/* File Info */}
              {file && (
                <motion.div 
                  className="bg-secondary/50 backdrop-blur-sm rounded-lg p-4 border border-primary/30"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-primary text-xl" />
                      <div>
                        <p className="font-medium text-shiny">{file.name}</p>
                        <p className="text-sm text-glow-yellow">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover-lift"
                      onClick={() => {
                        setFile(null)
                        if (fileInputRef.current) {
                          fileInputRef.current.value = ''
                        }
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Messages */}
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert className={`border-2 ${message.type === 'success' ? 'border-risk-low/50 bg-risk-low/20' : 'border-risk-high/50 bg-risk-high/20'}`}>
                    <FontAwesomeIcon 
                      icon={message.type === 'success' ? faCircleCheck : faCircleExclamation} 
                      className={message.type === 'success' ? 'text-risk-low' : 'text-risk-high'} 
                    />
                    <AlertDescription className={`${message.type === 'success' ? 'text-risk-low' : 'text-risk-high'} font-medium`}>
                      {message.text}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {/* Upload Button */}
              <Button
                onClick={handleUpload}
                disabled={!file || loading}
                size="lg"
                className="w-full hover-lift"
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faCircleNotch} className="mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : 'Upload File'}
              </Button>

              {/* Analyze All Button */}
              {uploadResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    onClick={handleAnalyzeAll}
                    disabled={analyzing}
                    size="lg"
                    variant="outline"
                    className="w-full hover-lift border-primary"
                  >
                    {analyzing ? (
                      <>
                        <FontAwesomeIcon icon={faCircleNotch} className="mr-2 animate-spin" />
                        Analyzing All Students...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faRobot} className="mr-2" />
                        Analyze All Students with ML
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
          </motion.div>

          {/* File Format Guide */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="font-heading">File Format Requirements</CardTitle>
                <CardDescription>
                  Ensure your file includes the following columns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-glow-green">Required Columns:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Student ID</li>
                      <li>Name</li>
                      <li>Email</li>
                      <li>Department</li>
                      <li>Semester</li>
                      <li>GPA</li>
                      <li>Attendance (%)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-glow-green">Optional Columns:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Recent Exam Scores</li>
                      <li>Assignment Completion Rate</li>
                      <li>Course Engagement Metrics</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </>
  )
}
