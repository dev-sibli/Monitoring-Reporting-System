"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import SetTargetModal from "./SetTargetModal"
import PerformanceReportModal from "./PerformanceReportModal"


type Employee = {
  id: number
  name: string
}

type Target = {
  id: number
  name: string
  quantity: number
  rewardPercentage: number
  progress: number
}

type Performance = {
  totalPerformance: number
  todayPerformance: number
  monthlyPerformance: number
  yearlyPerformance: number
  targets: Target[]
}

// Generate mock employees
const mockEmployees: Employee[] = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Alice Johnson" },
  { id: 4, name: "Bob Williams" },
  { id: 5, name: "Charlie Brown" },
]

// Mock data generator function
const generateMockData = (year: number, month: number): Performance => {
  const randomPerformance = () => Math.random() * 100
  const randomProgress = (max: number) => Math.floor(Math.random() * (max + 1))

  return {
    totalPerformance: randomPerformance(),
    todayPerformance: randomPerformance(),
    monthlyPerformance: randomPerformance(),
    yearlyPerformance: randomPerformance(),
    targets: [
      { id: 1, name: "Discount Companies", quantity: 10, rewardPercentage: 10, progress: randomProgress(10) },
      { id: 2, name: "EMI Merchants", quantity: 5, rewardPercentage: 10, progress: randomProgress(5) },
      { id: 3, name: "Shop Visits", quantity: 10, rewardPercentage: 10, progress: randomProgress(10) },
      { id: 4, name: "Deposit Collection", quantity: 50000, rewardPercentage: 10, progress: randomProgress(50000) },
      { id: 5, name: "Credit Card Sales", quantity: 3, rewardPercentage: 10, progress: randomProgress(3) },
      { id: 6, name: "Commission Collection", quantity: 500000, rewardPercentage: 20, progress: randomProgress(500000) },
    ],
  }
}

// Generate bulk mock data for 3 years
const bulkMockData: Record<number, Record<number, Record<number, Performance>>> = {}
const currentYear = new Date().getFullYear()
for (let year = currentYear - 2; year <= currentYear; year++) {
  bulkMockData[year] = {}
  for (let month = 1; month <= 12; month++) {
    bulkMockData[year][month] = {}
    for (let employeeId = 1; employeeId <= mockEmployees.length; employeeId++) {
      bulkMockData[year][month][employeeId] = generateMockData(year, month)
    }
  }
}

export default function UserPerformance() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString())
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString().padStart(2, "0"))
  const [isSetTargetModalOpen, setIsSetTargetModalOpen] = useState(false)
  const [isPerformanceReportModalOpen, setIsPerformanceReportModalOpen] = useState(false)

  const performance = useMemo(() => {
    if (selectedEmployee && selectedYear && selectedMonth) {
      return bulkMockData[Number.parseInt(selectedYear)][Number.parseInt(selectedMonth)][selectedEmployee.id]
    }
    return null
  }, [selectedEmployee, selectedYear, selectedMonth])

  const allUsersPerformance = useMemo(() => {
    if (selectedYear && selectedMonth) {
      const yearData = bulkMockData[Number.parseInt(selectedYear)]
      const monthData = yearData[Number.parseInt(selectedMonth)]
      return Object.values(monthData).reduce((acc, curr) => {
        curr.targets.forEach((target, index) => {
          if (!acc[index]) {
            acc[index] = { ...target, progress: 0 }
          } else {
            acc[index].progress += target.progress
          }
        })
        return acc
      }, [] as Target[])
    }
    return []
  }, [selectedYear, selectedMonth])

  const calculateScore = (target: Target) => {
    const progressPercentage = Math.min((target.progress / target.quantity) * 100, 100)
    return (progressPercentage / 100) * target.rewardPercentage
  }

  return (
    <div className="space-y-6">
    
          <div className="flex space-x-2 mb-4">
            <Select
              onValueChange={(value) =>
                setSelectedEmployee(
                  value === "all" ? null : mockEmployees.find((e) => e.id.toString() === value) || null,
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {mockEmployees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id.toString()}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(bulkMockData).map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Select Month" />
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
          {selectedEmployee && performance ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{performance.totalPerformance.toFixed(2)}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Today's Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{performance.todayPerformance.toFixed(2)}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{performance.monthlyPerformance.toFixed(2)}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Yearly Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{performance.yearlyPerformance.toFixed(2)}%</div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {performance.targets.map((target) => {
                  const progressPercentage = (target.progress / target.quantity) * 100
                  const isCompleted = progressPercentage >= 100
                  return (
                    <Card key={target.id}>
                      <CardHeader>
                        <CardTitle>{target.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="h-4 w-full bg-red-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${progressPercentage >= 100 ? "bg-green-700" : "bg-green-700"}`}
                              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                            />
                          </div>
                          <p>
                            Progress: {target.progress}/{target.quantity} ({progressPercentage.toFixed(2)}% Complete)
                          </p>
                          <p>Score Earned: {calculateScore(target).toFixed(2)}%</p>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allUsersPerformance.map((target) => (
                <Card key={target.id}>
                  <CardHeader>
                    <CardTitle>{target.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p>Total Progress: {target.progress}</p>
                      <p>Average per Employee: {(target.progress / mockEmployees.length).toFixed(2)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        
     
      {selectedEmployee && (
        <div className="flex space-x-2">
          <Button onClick={() => setIsSetTargetModalOpen(true)}>Set Target</Button>
          <Button onClick={() => setIsPerformanceReportModalOpen(true)}>Create Performance Report</Button>
        </div>
      )}
      {selectedEmployee && (
        <>
          <SetTargetModal
            isOpen={isSetTargetModalOpen}
            onClose={() => setIsSetTargetModalOpen(false)}
            employee={selectedEmployee}
          />
          <PerformanceReportModal
            isOpen={isPerformanceReportModalOpen}
            onClose={() => setIsPerformanceReportModalOpen(false)}
            employee={selectedEmployee}
          />
        </>
      )}
    </div>
  )
}

