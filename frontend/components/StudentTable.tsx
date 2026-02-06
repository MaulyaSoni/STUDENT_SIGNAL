'use client'

import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { RiskBadge } from './RiskBadge'
import { Button } from '@/components/ui/button'

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

interface StudentTableProps {
  students: Student[]
  isLoading?: boolean
}

export function StudentTable({ students, isLoading = false }: StudentTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-muted-foreground">Loading students...</p>
      </div>
    )
  }

  if (students.length === 0) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-muted-foreground">No students found</p>
      </div>
    )
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead className="text-left">Name</TableHead>
            <TableHead className="text-left">Student ID</TableHead>
            <TableHead className="text-left">Department</TableHead>
            <TableHead className="text-center">Semester</TableHead>
            <TableHead className="text-center">GPA</TableHead>
            <TableHead className="text-center">Attendance</TableHead>
            <TableHead className="text-center">Risk Level</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id} className="border-b border-border hover:bg-secondary/50">
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell className="text-muted-foreground">{student.student_id}</TableCell>
              <TableCell>{student.department}</TableCell>
              <TableCell className="text-center">{student.semester}</TableCell>
              <TableCell className="text-center">{student.gpa.toFixed(2)}</TableCell>
              <TableCell className="text-center">{student.attendance}%</TableCell>
              <TableCell className="text-center">
                <RiskBadge level={student.risk_level} size="sm" />
              </TableCell>
              <TableCell className="text-center">
                <Link href={`/students/${student.id}`}>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
