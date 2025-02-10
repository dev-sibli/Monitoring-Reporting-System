'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Pencil, Trash2 } from "lucide-react"

// Mock data interfaces
interface CardData {
  id: string
  name: string
  phoneNumber: string
}

// Mock data
const mockCreditCards: CardData[] = [
  { id: '1', name: 'John Doe', phoneNumber: '01711111111' },
  { id: '2', name: 'Jane Smith', phoneNumber: '01722222222' },
]

const mockPrepaidCards: CardData[] = [
  { id: '1', name: 'Alice Johnson', phoneNumber: '01733333333' },
  { id: '2', name: 'Bob Wilson', phoneNumber: '01744444444' },
]

const mockMedicalCards: CardData[] = [
  { id: '1', name: 'Carol Brown', phoneNumber: '01755555555' },
  { id: '2', name: 'David Lee', phoneNumber: '01766666666' },
]

const mockHajjCards: CardData[] = [
  { id: '1', name: 'Emma Davis', phoneNumber: '01777777777' },
  { id: '2', name: 'Frank Miller', phoneNumber: '01788888888' },
]

export default function CardDetails() {
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [editingCard, setEditingCard] = useState<CardData | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [creditCards, setCreditCards] = useState(mockCreditCards)
  const [prepaidCards, setPrepaidCards] = useState(mockPrepaidCards)
  const [medicalCards, setMedicalCards] = useState(mockMedicalCards)
  const [hajjCards, setHajjCards] = useState(mockHajjCards)

  // Function to filter data based on search
  const filterData = (data: CardData[]) => {
    return data.filter(card => 
      card.name.toLowerCase().includes(search.toLowerCase()) ||
      card.phoneNumber.includes(search)
    )
  }

  // Pagination logic
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

  // Function to handle card updates
  const handleUpdateCard = (type: string, updatedCard: CardData) => {
    const updateState = (cards: CardData[]) => 
      cards.map(card => card.id === updatedCard.id ? updatedCard : card)

    switch(type) {
      case 'credit':
        setCreditCards(updateState(creditCards))
        break
      case 'prepaid':
        setPrepaidCards(updateState(prepaidCards))
        break
      case 'medical':
        setMedicalCards(updateState(medicalCards))
        break
      case 'hajj':
        setHajjCards(updateState(hajjCards))
        break
    }
    setDialogOpen(false)
    setEditingCard(null)
  }

  // Function to handle card deletion
  const handleDeleteCard = (type: string, cardId: string) => {
    const deleteFromState = (cards: CardData[]) => 
      cards.filter(card => card.id !== cardId)

    switch(type) {
      case 'credit':
        setCreditCards(deleteFromState(creditCards))
        break
      case 'prepaid':
        setPrepaidCards(deleteFromState(prepaidCards))
        break
      case 'medical':
        setMedicalCards(deleteFromState(medicalCards))
        break
      case 'hajj':
        setHajjCards(deleteFromState(hajjCards))
        break
    }
  }

  // Table component
  const CardTable = ({ data, type }: { data: CardData[], type: string }) => {
    const filteredData = filterData(data)
    const start = (currentPage - 1) * entriesPerPage
    const paginatedData = filteredData.slice(start, start + entriesPerPage)

    return (
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
                <TableHead>Name</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((card) => (
                <TableRow key={card.id}>
                  <TableCell className="whitespace-nowrap">{card.name}</TableCell>
                  <TableCell className="whitespace-nowrap">{card.phoneNumber}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setEditingCard({...card})
                        setDialogOpen(true)
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
                            This action cannot be undone. This will permanently delete the card details for {card.name}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteCard(type, card.id)}
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
        <CardTitle>Card Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Card Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editingCard?.name}
                  onChange={(e) => setEditingCard(prev => prev ? {...prev, name: e.target.value} : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={editingCard?.phoneNumber}
                  onChange={(e) => setEditingCard(prev => prev ? {...prev, phoneNumber: e.target.value} : null)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setDialogOpen(false)
                setEditingCard(null)
              }}>
                Cancel
              </Button>
              <Button onClick={() => editingCard && handleUpdateCard(editingCard.type, editingCard)}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Tabs defaultValue="credit" className="space-y-4">
          <TabsList>
            <TabsTrigger value="credit">Credit Cards</TabsTrigger>
            <TabsTrigger value="prepaid">Prepaid Cards</TabsTrigger>
            <TabsTrigger value="medical">Medical Cards</TabsTrigger>
            <TabsTrigger value="hajj">Hajj Cards</TabsTrigger>
          </TabsList>

          <TabsContent value="credit">
            <CardTable data={creditCards} type="credit" />
          </TabsContent>

          <TabsContent value="prepaid">
            <CardTable data={prepaidCards} type="prepaid" />
          </TabsContent>

          <TabsContent value="medical">
            <CardTable data={medicalCards} type="medical" />
          </TabsContent>

          <TabsContent value="hajj">
            <CardTable data={hajjCards} type="hajj" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 