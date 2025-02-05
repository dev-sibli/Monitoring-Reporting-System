'use client'

import { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CollectionData } from "@/types/types"
import * as XLSX from 'xlsx'
import "jspdf-autotable"
import { jsPDF } from "jspdf"
import { formatTime } from '@/utils/dateUtils'

type Props = {
  data: CollectionData[]
}

export default function DataTable({ data }: Props) {
  const [filters, setFilters] = useState({
    merchantName: '',
    collectionOfficer: '',
    year: 'all',
  })

  const years = useMemo(() => {
    const uniqueYears = new Set<string>()
    data.forEach(item => {
      item.yearMonth?.forEach(ym => uniqueYears.add(ym.year))
    })
    return Array.from(uniqueYears).sort()
  }, [data])

  const filteredData = data.filter(item =>
    item.merchantName.toLowerCase().includes(filters.merchantName.toLowerCase()) &&
    item.collectionOfficer.toLowerCase().includes(filters.collectionOfficer.toLowerCase()) &&
    (filters.year === 'all' || item.yearMonth?.some(ym => ym.year === filters.year))
  )

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const formatDate = (date: string) => formatTime(date);

  const exportToPDF = () => {
    const doc = new jsPDF()
    doc.autoTable({
      head: [['Merchant', 'Invoice', 'Year/Month/Bill', 'Collected Amount', 'Collection Date', 'Bank Name', 'Check Number', 'Clearing Branch', 'Check Submission Date', 'Officer', 'Memo', 'File Attachment']],
      body: filteredData.map(item => [
        item.merchantName,
        item.invoiceNumber,
        item.yearMonth?.map(ym => `${ym.year}-${ym.month}: ৳${ym.billAmount}`).join('\n'),
        `৳${item.collectedAmount}`,
        formatDate(item.collectionDate),
        item.bankName,
        item.checkNumber,
        item.clearingBranch,
        formatDate(item.checkSubmissionDate),
        item.collectionOfficer,
        item.memo,
        item.fileAttachment ? 'Yes' : 'No',
      ]),
    })
    doc.save('commission_data.pdf')
  }

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData.map(item => ({
      Merchant: item.merchantName,
      Invoice: item.invoiceNumber,
      'Year/Month/Bill': item.yearMonth?.map(ym => `${ym.year}-${ym.month}: ৳${ym.billAmount}`).join('\n'),
      'Collected Amount': `৳${item.collectedAmount}`,
      'Collection Date': formatDate(item.collectionDate),
      'Bank Name': item.bankName,
      'Check Number': item.checkNumber,
      'Clearing Branch': item.clearingBranch,
      'Check Submission Date': formatDate(item.checkSubmissionDate),
      Officer: item.collectionOfficer,
      Region: item.region,
      Memo: item.memo,
      'File Attachment': item.fileAttachment ? 'Yes' : 'No',
    })))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Commission Data')
    XLSX.writeFile(wb, 'commission_data.xlsx')
  }

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg shadow">
      <div className="flex flex-wrap gap-4">
        <Input
          placeholder="Filter by Merchant"
          value={filters.merchantName}
          onChange={(e) => handleFilterChange('merchantName', e.target.value)}
          className="max-w-xs"
        />
        <Input
          placeholder="Filter by Officer"
          value={filters.collectionOfficer}
          onChange={(e) => handleFilterChange('collectionOfficer', e.target.value)}
          className="max-w-xs"
        />
        <Select value={filters.year} onValueChange={(value) => handleFilterChange('year', value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={year}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <Button onClick={exportToExcel}>Export to Excel</Button>
        <Button onClick={exportToPDF}>Export to PDF</Button>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Merchant</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Year/Month/Bill</TableHead>
              <TableHead>Collected Amount</TableHead>
              <TableHead>Collection Date</TableHead>
              <TableHead>Bank Name</TableHead>
              <TableHead>Check Number</TableHead>
              <TableHead>Clearing Branch</TableHead>
              <TableHead>Check Submission Date</TableHead>
              <TableHead>Officer</TableHead>
              <TableHead>Memo</TableHead>
              <TableHead>File Attachment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.merchantName}</TableCell>
                <TableCell>{item.invoiceNumber}</TableCell>
                <TableCell>
                  {item.yearMonth?.map((ym, i) => (
                    <div key={i}>{`${ym.year}-${ym.month}: ৳${ym.billAmount}`}</div>
                  ))}
                </TableCell>
                <TableCell>৳{item.collectedAmount}</TableCell>
                <TableCell>{formatDate(item.collectionDate)}</TableCell>
                <TableCell>{item.bankName}</TableCell>
                <TableCell>{item.checkNumber}</TableCell>
                <TableCell>{item.clearingBranch}</TableCell>
                <TableCell>{formatDate(item.checkSubmissionDate)}</TableCell>
                <TableCell>{item.collectionOfficer}</TableCell>
                <TableCell>{item.memo}</TableCell>
                <TableCell>{item.fileAttachment ? 'Yes' : 'No'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

