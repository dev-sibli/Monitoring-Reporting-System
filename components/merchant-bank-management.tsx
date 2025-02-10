'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle2, XCircle } from "lucide-react"
import { mockMerchants } from '@/utils/mockData'
import banks from '@/utils/banks.json'
import branches from '@/utils/branches.json'

export default function MerchantBankManagement() {
  // State for form inputs
  const [merchantName, setMerchantName] = useState('')
  const [bankName, setBankName] = useState('')
  const [branchName, setBranchName] = useState('')

  // State for table data
  const [merchants, setMerchants] = useState(mockMerchants)
  const [banksList, setBanksList] = useState(banks)
  const [branchesList, setBranchesList] = useState(branches)

  // State for search
  const [search, setSearch] = useState('')

  // State for pagination
  const [entriesPerPage, setEntriesPerPage] = useState(25)
  const [currentPage, setCurrentPage] = useState(1)

  // Add dialog open states
  const [merchantDialogOpen, setMerchantDialogOpen] = useState(false)
  const [bankDialogOpen, setBankDialogOpen] = useState(false)
  const [branchDialogOpen, setBranchDialogOpen] = useState(false)

  // Add message states
  const [showMessage, setShowMessage] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const { toast } = useToast()

  // Handle form submissions with notifications
  const handleMerchantSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (merchantName.trim()) {
        setMerchants([...merchants, merchantName])
        setMerchantName('')
        setMerchantDialogOpen(false)
        setMessage({
          type: 'success',
          text: 'Merchant Name Added Successfully'
        })
        setShowMessage(true)
        setTimeout(() => setShowMessage(false), 3000) // Hide after 3 seconds
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to Add Merchant'
      })
      setShowMessage(true)
      setTimeout(() => setShowMessage(false), 3000)
    }
  }

  const handleBankSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (bankName.trim()) {
        setBanksList([...banksList, bankName])
        setBankName('')
        setBankDialogOpen(false)
        setMessage({
          type: 'success',
          text: 'Bank Name Added Successfully'
        })
        setShowMessage(true)
        setTimeout(() => setShowMessage(false), 3000)
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to Add Bank'
      })
      setShowMessage(true)
      setTimeout(() => setShowMessage(false), 3000)
    }
  }

  const handleBranchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (branchName.trim()) {
        setBranchesList([...branchesList, branchName])
        setBranchName('')
        setBranchDialogOpen(false)
        setMessage({
          type: 'success',
          text: 'Clearing Branch Added Successfully'
        })
        setShowMessage(true)
        setTimeout(() => setShowMessage(false), 3000)
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to Add Clearing Branch'
      })
      setShowMessage(true)
      setTimeout(() => setShowMessage(false), 3000)
    }
  }

  // Filter function
  const filterData = (search: string) => {
    const maxLength = Math.max(merchants.length, banksList.length, branchesList.length)
    const rows = []

    for (let i = 0; i < maxLength; i++) {
      const merchant = merchants[i] || ''
      const bank = banksList[i] || ''
      const branch = branchesList[i] || ''

      if (
        search === '' ||
        merchant.toLowerCase().includes(search.toLowerCase()) ||
        bank.toLowerCase().includes(search.toLowerCase()) ||
        branch.toLowerCase().includes(search.toLowerCase())
      ) {
        rows.push({ merchant, bank, branch })
      }
    }
    return rows
  }

  // Pagination function
  const paginateData = (data: any[], page: number) => {
    const start = (page - 1) * entriesPerPage
    const end = start + entriesPerPage
    return data.slice(start, end)
  }

  // Get paginated and filtered data
  const getTableData = () => {
    const filtered = filterData(search)
    return paginateData(filtered, currentPage)
  }

  // Generate pagination buttons with ellipsis
  const generatePaginationButtons = (totalItems: number) => {
    const totalPages = Math.ceil(totalItems / entriesPerPage)
    const maxVisiblePages = 3 // Number of pages to show before ellipsis
    const pages = []

    if (totalPages <= maxVisiblePages + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage <= maxVisiblePages) {
        // Near the start
        for (let i = 2; i <= maxVisiblePages + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage > totalPages - maxVisiblePages) {
        // Near the end
        pages.push('...')
        for (let i = totalPages - maxVisiblePages; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // Middle - show current page and neighbors
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return (
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        >
          {'<<'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {'<'}
        </Button>
        {pages.map((page, index) => (
          <Button
            key={index}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => typeof page === 'number' && setCurrentPage(page)}
            disabled={page === '...'}
            className={page === '...' ? 'cursor-default' : ''}
          >
            {page}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          {'>'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          {'>>'}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Message Box */}
      {showMessage && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`p-4 rounded-lg shadow-lg bg-white border ${
            message.type === 'success' ? 'border-green-500' : 'border-red-500'
          }`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className={`text-sm font-medium ${
                message.type === 'success' ? 'text-green-700' : 'text-red-700'
              }`}>
                {message.text}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Merchant Dialog */}
        <Dialog open={merchantDialogOpen} onOpenChange={setMerchantDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Add Merchant</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Merchant</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleMerchantSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="merchantName">Merchant Name</Label>
                  <Input
                    id="merchantName"
                    value={merchantName}
                    onChange={(e) => setMerchantName(e.target.value)}
                    placeholder="Enter merchant name"
                  />
                </div>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Bank Dialog */}
        <Dialog open={bankDialogOpen} onOpenChange={setBankDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Add Bank</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Bank</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleBankSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="Enter bank name"
                  />
                </div>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Clearing Branch Dialog */}
        <Dialog open={branchDialogOpen} onOpenChange={setBranchDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Add Clearing Branch</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Clearing Branch</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleBranchSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="branchName">Clearing Branch Name</Label>
                  <Input
                    id="branchName"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    placeholder="Enter clearing branch name"
                  />
                </div>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Combined Table section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Select
            value={entriesPerPage.toString()}
            onValueChange={(value) => setEntriesPerPage(Number(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Show entries" />
            </SelectTrigger>
            <SelectContent>
              {[10, 25, 50, 100].map((value) => (
                <SelectItem key={value} value={value.toString()}>
                  Show {value} entries
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-[300px]"
          />
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Merchant Name</TableHead>
                <TableHead>Bank Name</TableHead>
                <TableHead>Clearing Branch</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getTableData().map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="whitespace-nowrap">{row.merchant}</TableCell>
                  <TableCell className="whitespace-nowrap">{row.bank}</TableCell>
                  <TableCell className="whitespace-nowrap">{row.branch}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {generatePaginationButtons(filterData(search).length)}
      </div>
    </div>
  )
}