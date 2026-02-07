'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faRotateRight, faUsers } from '@fortawesome/free-solid-svg-icons'
import { Navigation } from '@/components/Navigation'
import { StudentTable } from '@/components/StudentTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getStudents } from '@/services/api'
import { mockStudents } from '@/lib/mock-data'
import { motion } from 'framer-motion'

interface Student {
  id: string
  name: string
  student_id: string
  department: string
  semester: number
  gpa: number
  attendance: number
  risk_level: 'low' | 'medium' | 'high'
  dropout_probability: number
}

const departments = ['All Departments', 'CSE', 'IT', 'CE', 'DCSE', 'DIT','DCE']
const semesters = ['All Semesters', '1', '2', '3', '4', '5', '6', '7', '8']
const riskLevels = ['All Risk Levels', 'low', 'medium', 'high']

export default function StudentsList() {
  const searchParams = useSearchParams()
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState({
    department: searchParams.get('department') || 'All Departments',
    semester: searchParams.get('semester') || 'All Semesters',
    risk_level: searchParams.get('risk_level') || 'All Risk Levels',
  })

  useEffect(() => {
    async function loadStudents() {
      try {
        setLoading(true)
        const data = await getStudents()
        setStudents(data)
      } catch (error) {
        console.error('[v0] Error loading students:', error)
        setStudents(mockStudents)
      } finally {
        setLoading(false)
      }
    }
    loadStudents()
  }, [])

  useEffect(() => {
    let result = [...students]

    if (filters.department !== 'All Departments') {
      result = result.filter((s) => s.department === filters.department)
    }

    if (filters.semester !== 'All Semesters') {
      result = result.filter((s) => s.semester === parseInt(filters.semester))
    }

    if (filters.risk_level !== 'All Risk Levels') {
      result = result.filter((s) => s.risk_level === filters.risk_level)
    }

    setFilteredStudents(result)
  }, [students, filters])

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  const handleReset = () => {
    setFilters({
      department: 'All Departments',
      semester: 'All Semesters',
      risk_level: 'All Risk Levels',
    })
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
              <FontAwesomeIcon icon={faUsers} className="text-primary" />
              Students
            </h1>
            <p className="text-glow-yellow mt-2 text-lg font-medium">
              Browse and filter students to identify intervention opportunities
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="mb-8 hover-lift">
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2">
                  <FontAwesomeIcon icon={faFilter} className="text-primary" />
                  Filter Students
                </CardTitle>
                <CardDescription>Use filters to focus on specific student groups</CardDescription>
              </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department</label>
                  <Select value={filters.department} onValueChange={(value) => handleFilterChange('department', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Semester</label>
                  <Select value={filters.semester} onValueChange={(value) => handleFilterChange('semester', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {semesters.map((sem) => (
                        <SelectItem key={sem} value={sem}>
                          {sem === 'All Semesters' ? sem : `Semester ${sem}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Risk Level</label>
                  <Select value={filters.risk_level} onValueChange={(value) => handleFilterChange('risk_level', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {riskLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level === 'All Risk Levels' ? level : level.charAt(0).toUpperCase() + level.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button variant="outline" onClick={handleReset} className="w-full bg-transparent hover-lift">
                    <FontAwesomeIcon icon={faRotateRight} className="mr-2" />
                    Reset Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          </motion.div>

          {/* Student Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="font-heading">
                  {filteredStudents.length} Student{filteredStudents.length !== 1 ? 's' : ''} Found
                </CardTitle>
                <CardDescription>Detailed view of all students matching your criteria</CardDescription>
              </CardHeader>
              <CardContent>
                <StudentTable students={filteredStudents} isLoading={loading} />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </>
  )
}
