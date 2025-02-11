'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger 
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog"
import { Pencil, Trash2, X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockMerchants } from '@/utils/mockData'
import banks from '@/utils/banks.json'
import branches from '@/utils/branches.json'

export default function MerchantBankManagement() {
  const [merchants, setMerchants] = useState(mockMerchants)
  const [banksList, setBanksList] = useState(banks)
  const [branchesList, setBranchesList] = useState(branches)
  const [editingItem, setEditingItem] = useState<{ id: string; name: string; type: string } | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [newItemName, setNewItemName] = useState('')
  const [addType, setAddType] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const searchRef = useRef<HTMLInputElement>(null)

  const handleUpdate = (type: string, oldItem: { id: string; name: string }, newName: string) => {
    switch (type) {
      case 'merchant':
        setMerchants(merchants.map(m => m === oldItem.name ? newName : m))
        break
      case 'bank':
        setBanksList(banksList.map(b => b.id === oldItem.id ? { ...b, name: newName } : b))
        break
      case 'branch':
        setBranchesList(branchesList.map(b => b.id === oldItem.id ? { ...b, name: newName } : b))
        break
    }
    setEditDialogOpen(false)
    setEditingItem(null)
  }

  const handleDelete = (type: string, id: string) => {
    switch (type) {
      case 'merchant':
        setMerchants(merchants.filter(m => m !== id))
        break
      case 'bank':
        setBanksList(banksList.filter(b => b.id !== id))
        break
      case 'branch':
        setBranchesList(branchesList.filter(b => b.id !== id))
        break
    }
  }

  const handleAdd = () => {
    if (!newItemName.trim() || !addType) return

    switch (addType) {
      case 'merchant':
        setMerchants([...merchants, newItemName])
        break
      case 'bank':
        setBanksList([...banksList, { id: Date.now().toString(), name: newItemName }])
        break
      case 'branch':
        setBranchesList([...branchesList, { id: Date.now().toString(), name: newItemName }])
        break
    }
    setNewItemName('')
    setAddDialogOpen(false)
    setAddType(null)
  }

  const filterData = (data: any[]) => {
    return data.filter((item) => {
      const searchTerm = search.toLowerCase()
      const itemName = typeof item === 'string' ? item.toLowerCase() : item.name.toLowerCase()
      return itemName.includes(searchTerm)
    })
  }

  const generatePaginationButtons = (totalItems: number) => {
    const totalPages = Math.ceil(totalItems / entriesPerPage)
    const maxVisiblePages = 3
    const pages = []

    if (totalPages <= maxVisiblePages + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      if (currentPage <= maxVisiblePages) {
        for (let i = 2; i <= maxVisiblePages + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage > totalPages - maxVisiblePages) {
        pages.push('...')
        for (let i = totalPages - maxVisiblePages; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return (
      <div className="flex justify-center space-x-2 mt-4">
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
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          {'<'}
        </Button>
        {pages.map((page, index) => (
          <Button
            key={index}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => typeof page === 'number' && setCurrentPage(page)}
            disabled={typeof page !== 'number'}
          >
            {page}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.min(Math.ceil(totalItems / entriesPerPage), prev + 1))}
          disabled={currentPage === Math.ceil(totalItems / entriesPerPage)}
        >
          {'>'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(Math.ceil(totalItems / entriesPerPage))}
          disabled={currentPage === Math.ceil(totalItems / entriesPerPage)}
        >
          {'>>'}
        </Button>
      </div>
    )
  }

  const TableComponent = ({ type, data, title }: { type: string, data: any[], title: string }) => {
    const filteredData = filterData(data)
    const start = (currentPage - 1) * entriesPerPage
    const paginatedData = filteredData.slice(start, start + entriesPerPage)

    const handleClearSearch = () => {
      setSearch('')
      setCurrentPage(1)
      searchRef.current?.focus()
    }

    return (
      <div className="space-y-4">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Select
              value={entriesPerPage.toString()}
              onValueChange={(value) => {
                setEntriesPerPage(Number(value))
                setCurrentPage(1)
              }}
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

            <div className="flex flex-col items-end gap-4 w-full sm:w-auto">
              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => setAddType(type)}
                    className="w-full sm:w-auto"
                  >
                    Add {title}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New {title}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder={`Enter ${title.toLowerCase()} name`}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {
                      setNewItemName('')
                      setAddType(null)
                      setAddDialogOpen(false)
                    }}>Cancel</Button>
                    <Button onClick={handleAdd}>Add</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <div className="relative w-full sm:w-[300px]">
                <Input
                  ref={searchRef}
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pr-8"
                />
                {search && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                    onClick={handleClearSearch}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item) => (
                <TableRow key={type === 'merchant' ? item : item.id}>
                  <TableCell>{type === 'merchant' ? item : item.name}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setEditingItem({ 
                          id: type === 'merchant' ? item : item.id, 
                          name: type === 'merchant' ? item : item.name,
                          type 
                        })
                        setEditDialogOpen(true)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this {title.toLowerCase()}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(type, type === 'merchant' ? item : item.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {generatePaginationButtons(filteredData.length)}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Merchant & Bank Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Edit {editingItem?.type.charAt(0).toUpperCase() + editingItem?.type.slice(1)}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={editingItem?.name || ''}
                  onChange={(e) => setEditingItem(prev => prev ? { ...prev, name: e.target.value } : null)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setEditDialogOpen(false)
                setEditingItem(null)
              }}>Cancel</Button>
              <Button onClick={() => editingItem && handleUpdate(editingItem.type, editingItem, editingItem.name)}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Tabs defaultValue="merchants" className="space-y-4">
          <TabsList>
            <TabsTrigger value="merchants">Merchants</TabsTrigger>
            <TabsTrigger value="banks">Banks</TabsTrigger>
            <TabsTrigger value="branches">Clearing Branches</TabsTrigger>
          </TabsList>

          <TabsContent value="merchants">
            <TableComponent type="merchant" data={merchants} title="Merchants" />
          </TabsContent>

          <TabsContent value="banks">
            <TableComponent type="bank" data={banksList} title="Banks" />
          </TabsContent>

          <TabsContent value="branches">
            <TableComponent type="branch" data={branchesList} title="Clearing Branches" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}