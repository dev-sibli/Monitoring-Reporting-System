"use client"

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { jsPDF } from "jspdf"
import "jspdf-autotable"

type Target = {
  id: number
  name: string
  quantity: number
  rewardPercentage: number
  progress: number
}

type Employee = {
  id: number
  name: string
}

type PerformanceReportModalProps = {
  isOpen: boolean
  onClose: () => void
  employee: Employee
}

export default function PerformanceReportModal({ isOpen, onClose, employee }: PerformanceReportModalProps) {
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString().padStart(2, "0"))
  const [targets, setTargets] = useState<Target[]>([])
  const [adminMark, setAdminMark] = useState<number>(0)
  const [isEditingAdminMark, setIsEditingAdminMark] = useState<boolean>(false)

  const fetchData = useCallback((year: string, month: string) => {
    // Simulating API call with random data generation
    const newTargets: Target[] = [
      {
        id: 1,
        name: "Discount Companies",
        quantity: 10,
        rewardPercentage: 10,
        progress: Math.floor(Math.random() * 11),
      },
      { id: 2, name: "EMI Merchants", quantity: 5, rewardPercentage: 10, progress: Math.floor(Math.random() * 6) },
      { id: 3, name: "Shop Visits", quantity: 10, rewardPercentage: 10, progress: Math.floor(Math.random() * 11) },
      {
        id: 4,
        name: "Deposit Collection",
        quantity: 50000,
        rewardPercentage: 10,
        progress: Math.floor(Math.random() * 50001),
      },
      { id: 5, name: "Credit Card Sales", quantity: 3, rewardPercentage: 10, progress: Math.floor(Math.random() * 4) },
      {
        id: 6,
        name: "Revenue Collection",
        quantity: 500000,
        rewardPercentage: 20,
        progress: Math.floor(Math.random() * 500001),
      },
    ]
    setTargets(newTargets)
    setAdminMark(0) // Reset admin mark when data changes
    setIsEditingAdminMark(false)
    console.log(`Fetched data for ${year}-${month}`)
  }, [])

  useEffect(() => {
    fetchData(selectedYear, selectedMonth)
  }, [selectedYear, selectedMonth, fetchData])

  const calculateScore = useCallback((target: Target) => {
    if (target.quantity === 0 && target.rewardPercentage === 0) return 0
    const progressPercentage = Math.min((target.progress / target.quantity) * 100, 100)
    return (progressPercentage / 100) * target.rewardPercentage
  }, [])

  const totalTargetScore = targets.reduce((sum, target) => sum + calculateScore(target), 0)
  const maxAdminMark = Math.max(0, 100 - totalTargetScore)
  const totalScore = Math.min(totalTargetScore + adminMark, 100)

  const savePerformanceReport = () => {
    // Here you would typically send the performance report to your backend API
    console.log("Saving performance report for employee:", employee.name, {
      year: selectedYear,
      month: selectedMonth,
      targets,
      adminMark,
      totalScore,
    })
    onClose()
  }

  const downloadPDF = () => {
    const doc = new jsPDF()
    doc.text(`Performance Report for ${employee.name}`, 14, 15)
    doc.text(`Period: ${selectedMonth}/${selectedYear}`, 14, 25)

    const tableData = targets.map((target) => [
      target.name,
      target.quantity,
      target.progress,
      `${calculateScore(target).toFixed(2)}%`,
    ])

    // Add the admin mark row
    tableData.push(["Admin Mark", "", "", `${adminMark.toFixed(2)}%`])

    doc.autoTable({
      head: [["Target", "Quantity", "Progress", "Score"]],
      body: tableData,
      startY: 35,
    })

    const finalY = (doc as any).lastAutoTable.finalY || 35
    doc.text(`Total Score: ${totalScore.toFixed(2)}%`, 14, finalY + 10)

    doc.save(`${employee.name}_performance_report_${selectedYear}_${selectedMonth}.pdf`)
  }

  const handleSetAdminMark = () => {
    setIsEditingAdminMark(true)
  }

  const handleSaveAdminMark = () => {
    setIsEditingAdminMark(false)
    // Here you would typically send the updated admin mark to your backend API
    console.log("Saving admin mark:", adminMark)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Performance Report for {employee.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(5)].map((_, i) => {
                  const year = new Date().getFullYear() - i
                  return (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(12)].map((_, i) => {
                  const month = (i + 1).toString().padStart(2, "0")
                  return (
                    <SelectItem key={month} value={month}>
                      {new Date(2000, i).toLocaleString("default", { month: "long" })}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Target</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {targets.map((target) => (
                <TableRow key={target.id}>
                  <TableCell>{target.name}</TableCell>
                  <TableCell>{target.quantity}</TableCell>
                  <TableCell>{target.progress}</TableCell>
                  <TableCell>{calculateScore(target).toFixed(2)}%</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} className="font-bold">
                  Admin Mark
                </TableCell>
                <TableCell>{adminMark.toFixed(2)}%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="flex items-center space-x-2">
            <div className="font-bold">User's Target Percentage: {totalTargetScore.toFixed(2)}%</div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="font-bold">Maximum Admin Mark: {maxAdminMark.toFixed(2)}%</div>
          </div>
          <div className="flex items-center space-x-2">
            {isEditingAdminMark ? (
              <>
                <label htmlFor="adminMark" className="font-bold">
                  Admin Mark:
                </label>
                <Input
                  id="adminMark"
                  type="number"
                  value={adminMark}
                  onChange={(e) => setAdminMark(Math.min(Number(e.target.value), maxAdminMark))}
                  className="w-24"
                />
                <Button onClick={handleSaveAdminMark}>Save</Button>
              </>
            ) : (
              <>
                <div className="font-bold">Admin Mark: {adminMark.toFixed(2)}%</div>
                <Button onClick={handleSetAdminMark}>Edit</Button>
              </>
            )}
          </div>
          <div className="font-bold">Total Score: {totalScore.toFixed(2)}%</div>
          <div className="flex space-x-2">
            <Button onClick={savePerformanceReport}>Save Report</Button>
            <Button onClick={downloadPDF}>Download PDF</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

