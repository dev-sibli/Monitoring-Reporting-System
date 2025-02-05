'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CommissionEntry } from "@/types/types"
import { jsPDF } from "jspdf"
import "jspdf-autotable"
import * as XLSX from 'xlsx'

type Props = {
  entries: CommissionEntry[]
  onClose: () => void
}

export default function ReportGenerator({ entries, onClose }: Props) {
  const [filters, setFilters] = useState({
    officer: '',
    year: '',
    month: '',
    region: '',
  })
  const exampleOfficers = ['Syful Islam', 'Tawhid Chowdhury', 'Other']
  const [officerOptions, setOfficerOptions] = useState(exampleOfficers)

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleOfficerSearch = (searchTerm: string) => {
    const filteredOfficers = exampleOfficers.filter(officer => 
      officer.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setOfficerOptions(filteredOfficers)
  }

  const filteredEntries = entries.filter(entry => {
    const entryDate = new Date(entry.collectionDate)
    return (
      (!filters.officer || entry.collectionOfficer === filters.officer) &&
      (!filters.year || entryDate.getFullYear().toString() === filters.year) &&
      (!filters.month || entryDate.getMonth().toString() === filters.month) &&
      (!filters.region || entry.region === filters.region)
    )
  })

  const generatePDF = () => {
    const doc = new jsPDF()
    doc.text('Commission Collection Report', 14, 15)
    doc.autoTable({
      head: [['Merchant', 'Invoice', 'Collected Amount', 'Collection Date', 'Officer', 'Region']],
      body: filteredEntries.map(entry => [
        entry.merchantName,
        entry.invoiceNumber,
        entry.collectedAmount.toLocaleString(),
        new Date(entry.collectionDate).toLocaleDateString(),
        entry.collectionOfficer,
        entry.region,
      ]),
    })
    doc.save('commission_collection_report.pdf')
  }

  const generateExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredEntries)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report")
    XLSX.writeFile(workbook, "commission_collection_report.xlsx")
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Generate Report</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="officer">Collection Officer</Label>
          <Select onValueChange={(value) => handleFilterChange('officer', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select officer" />
            </SelectTrigger>
            <SelectContent>
              <Input
                placeholder="Search officers..."
                onChange={(e) => handleOfficerSearch(e.target.value)}
                className="mb-2"
              />
              {officerOptions.map((officer) => (
                <SelectItem key={officer} value={officer}>{officer}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            value={filters.year}
            onChange={(e) => handleFilterChange('year', e.target.value)}
            placeholder="Filter by year"
          />
        </div>
        <div>
          <Label htmlFor="month">Month</Label>
          <Select onValueChange={(value) => handleFilterChange('month', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="region">Region</Label>
          <Select onValueChange={(value) => handleFilterChange('region', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Dhaka">Dhaka</SelectItem>
              <SelectItem value="Chattogram">Chattogram</SelectItem>
              <SelectItem value="Sylhet">Sylhet</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-between">
        <Button onClick={generatePDF}>Generate PDF</Button>
        <Button onClick={generateExcel}>Generate Excel</Button>
        <Button onClick={onClose} variant="outline">Close</Button>
      </div>
    </div>
  )
}

