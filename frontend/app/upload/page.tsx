'use client'

import React from "react"

import { useRef, useState } from 'react'
import { Navigation } from '@/components/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { uploadData } from '@/services/api'

export default function UploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

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
      setMessage({
        type: 'success',
        text: `Successfully processed ${result.rows_processed} student records`,
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

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Upload Data</h1>
            <p className="text-muted-foreground mt-2">
              Import student data to analyze dropout risk and enable early interventions
            </p>
          </div>

          {/* Upload Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Upload Student Data</CardTitle>
              <CardDescription>
                Drag and drop your CSV or Excel file or click to browse
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div onClick={() => fileInputRef.current?.click()} className="space-y-2">
                  <div className="text-4xl text-muted-foreground">📁</div>
                  <h3 className="text-lg font-semibold">
                    {file ? file.name : 'Drag and drop your file here'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    or click to select from your computer
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Supported formats: CSV, Excel (.xlsx)
                  </p>
                </div>
              </div>

              {/* File Info */}
              {file && (
                <div className="bg-secondary rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
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
                </div>
              )}

              {/* Messages */}
              {message && (
                <Alert className={message.type === 'success' ? 'border-risk-low/30 bg-risk-low/5' : 'border-risk-high/30 bg-risk-high/5'}>
                  <AlertDescription className={message.type === 'success' ? 'text-risk-low' : 'text-risk-high'}>
                    {message.text}
                  </AlertDescription>
                </Alert>
              )}

              {/* Upload Button */}
              <Button
                onClick={handleUpload}
                disabled={!file || loading}
                size="lg"
                className="w-full"
              >
                {loading ? 'Uploading...' : 'Upload File'}
              </Button>
            </CardContent>
          </Card>

          {/* File Format Guide */}
          <Card>
            <CardHeader>
              <CardTitle>File Format Requirements</CardTitle>
              <CardDescription>
                Ensure your file includes the following columns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Required Columns:</h4>
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
                  <h4 className="font-semibold mb-2">Optional Columns:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Recent Exam Scores</li>
                    <li>Assignment Completion Rate</li>
                    <li>Course Engagement Metrics</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
