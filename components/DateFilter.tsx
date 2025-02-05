import React from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

type DateFilterProps = {
  onDateChange: (year: string | null, month: string | null) => void
}

export function DateFilter({ onDateChange }: DateFilterProps) {
  const [year, setYear] = React.useState<string>("all")
  const [month, setMonth] = React.useState<string>("all")

  const years = ["all", ...Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - i).toString())]
  const months = [
    { value: "all", label: "All" },
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ]

  const handleDateChange = () => {
    onDateChange(year === "all" ? null : year, month === "all" ? null : month)
  }

  const handleReset = () => {
    setYear("all")
    setMonth("all")
    onDateChange(null, null)
  }

  return (
    <div className="flex items-center space-x-2">
      <Select value={year} onValueChange={setYear}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={y}>{y === "all" ? "All Years" : y}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={month} onValueChange={setMonth}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          {months.map((m) => (
            <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={handleDateChange} variant="outline">
        Filter
      </Button>
      <Button onClick={handleReset} variant="outline">
        Reset
      </Button>
    </div>
  )
}

