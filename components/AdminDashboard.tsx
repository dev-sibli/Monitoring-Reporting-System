'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CommissionEntry, User, EditLog } from "@/types/types"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import CreateUserForm from './CreateUserForm'
import UserManagement from './UserManagement'
import ReportGenerator from './ReportGenerator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockCommissionEntries, mockUsers } from '@/utils/mockData'
import { formatTime } from '@/utils/dateUtils'
import { useAuth } from '@/hooks/useAuth'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Overview } from "@/components/overview"
import { RecentSales } from "@/components/recent-sales"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Download } from 'lucide-react'
import { AdminDashboardOverview } from './AdminDashboardOverview'
import { MerchantRegistrationEntries } from './MerchantRegistrationEntries'
import { DateFilter } from './DateFilter'
import { UserCard } from './UserCard'
import MerchantBankManagement from './merchant-bank-management'
import CardDetails from './CardDetails'

type MerchantRegistration = {
  id: string
  merchantName: string
  type: 'discount' | 'emi' | 'bogo'
  registrationDate: string
  userId: string
}

const mockMerchantRegistrations: MerchantRegistration[] = [
  { id: '1', merchantName: 'Gadget World', type: 'discount', registrationDate: '2023-06-01', userId: '1' },
  { id: '2', merchantName: 'Fashion Hub', type: 'emi', registrationDate: '2023-06-05', userId: '2' },
  { id: '3', merchantName: 'Tech Solutions', type: 'bogo', registrationDate: '2023-06-10', userId: '1' },
  { id: '4', merchantName: 'Home Decor', type: 'discount', registrationDate: '2023-06-15', userId: '3' },
  { id: '5', merchantName: 'Fitness First', type: 'emi', registrationDate: '2023-06-20', userId: '2' },
]

export default function AdminDashboard() {
  const [entries, setEntries] = useState<CommissionEntry[]>(mockCommissionEntries)
  const [filteredEntries, setFilteredEntries] = useState<CommissionEntry[]>(mockCommissionEntries)
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [filter, setFilter] = useState('')
  const [showCreateUserForm, setShowCreateUserForm] = useState(false)
  const [showReportGenerator, setShowReportGenerator] = useState(false)
  const [editingEntry, setEditingEntry] = useState<CommissionEntry | null>(null)
  const [logs, setLogs] = useState<EditLog[]>([])
  const { user } = useAuth()
  const [merchantRegistrations, setMerchantRegistrations] = useState<MerchantRegistration[]>(mockMerchantRegistrations)
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)

  const filteredEntriesByDate = useMemo(() => {
    return entries.filter(entry => {
      const entryDate = new Date(entry.collectionDate)
      return (selectedYear === null || entryDate.getFullYear().toString() === selectedYear) &&
             (selectedMonth === null || (entryDate.getMonth() + 1).toString().padStart(2, '0') === selectedMonth)
    })
  }, [entries, selectedYear, selectedMonth])

  const filteredMerchantRegistrations = useMemo(() => {
    return merchantRegistrations.filter(reg => {
      const regDate = new Date(reg.registrationDate)
      return (selectedYear === null || regDate.getFullYear().toString() === selectedYear) &&
             (selectedMonth === null || (regDate.getMonth() + 1).toString().padStart(2, '0') === selectedMonth)
    })
  }, [merchantRegistrations, selectedYear, selectedMonth])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real application, you would fetch data from your API here
        setEntries(mockCommissionEntries)
        setFilteredEntries(mockCommissionEntries)
        setUsers(mockUsers)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const lowercasedFilter = filter.toLowerCase()
    const filtered = filteredEntriesByDate.filter(entry =>
      entry.merchantName.toLowerCase().includes(lowercasedFilter) ||
      entry.collectionOfficer.toLowerCase().includes(lowercasedFilter) ||
      entry.region.toLowerCase().includes(lowercasedFilter)
    )
    setFilteredEntries(filtered)
  }, [filter, filteredEntriesByDate])

  const handleCreateUser = async (userData: Omit<User, 'id'>) => {
    try {
      // In a real app, this would be an API call
      const newUser: User = {
        id: (users.length + 1).toString(), // Simple ID generation for demo
        ...userData
      }
      setUsers(prevUsers => [...prevUsers, newUser])
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const handleEditEntry = (entry: CommissionEntry) => {
    setEditingEntry(entry)
  }

  const handleUpdateEntry = (updatedEntry: CommissionEntry, previousEntry: CommissionEntry) => {
    const updatedEntries = entries.map(entry =>
      entry.id === updatedEntry.id ? updatedEntry : entry
    )
    setEntries(updatedEntries)
    setFilteredEntries(updatedEntries)
    setEditingEntry(null)

    // Log the change
    const changes = Object.entries(updatedEntry).reduce((acc, [key, value]) => {
      if (previousEntry[key as keyof CommissionEntry] !== value) {
        acc.push(`${key}: ${previousEntry[key as keyof CommissionEntry]} -> ${value}`)
      }
      return acc
    }, [] as string[])

    const newLog: EditLog = {
      id: Date.now().toString(),
      entryId: updatedEntry.id,
      userId: user?.id || 'unknown',
      action: 'update',
      timestamp: new Date().toISOString(),
      details: `${user?.name || 'unknown user'} updated entry for ${updatedEntry.merchantName}. Changes: ${changes.join(', ')}`
    }
    setLogs([...logs, newLog])
  }

  const handleDeleteEntry = (entryId: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== entryId)
    setEntries(updatedEntries)
    setFilteredEntries(updatedEntries)

    // Log the change
    const newLog: EditLog = {
      id: Date.now().toString(),
      entryId: entryId,
      userId: user?.id || 'unknown',
      action: 'delete',
      timestamp: new Date().toISOString(),
      details: `${user?.name || 'unknown user'} deleted entry ${entryId}`
    }
    setLogs([...logs, newLog])
  }

  const generateReports = () => {
    const entriesByOfficer = filteredEntriesByDate.reduce((acc, entry) => {
      acc[entry.collectionOfficer] = (acc[entry.collectionOfficer] || 0) + entry.collectedAmount
      return acc
    }, {} as Record<string, number>)

    const entriesByRegion = filteredEntriesByDate.reduce((acc, entry) => {
      acc[entry.region] = (acc[entry.region] || 0) + entry.collectedAmount
      return acc
    }, {} as Record<string, number>)

    const entriesByYear = filteredEntriesByDate.reduce((acc, entry) => {
      const year = new Date(entry.collectionDate).getFullYear().toString()
      acc[year] = (acc[year] || 0) + entry.collectedAmount
      return acc
    }, {} as Record<string, number>)

    return {
      entriesByOfficer: Object.entries(entriesByOfficer).map(([name, value]) => ({ name, value })),
      entriesByRegion: Object.entries(entriesByRegion).map(([name, value]) => ({ name, value })),
      entriesByYear: Object.entries(entriesByYear).map(([name, value]) => ({ name, value }))
    }
  }

  const reports = generateReports()

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

  const handleDateChange = (year: string | null, month: string | null) => {
    setSelectedYear(year)
    setSelectedMonth(month)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <div className="flex items-center space-x-2">
          <DateFilter onDateChange={handleDateChange} />
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="merchant-bank-management">Merchant & Bank</TabsTrigger>
          <TabsTrigger value="entries">Entries</TabsTrigger>
          <TabsTrigger value="merchant-registrations">Registrations</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <AdminDashboardOverview entries={filteredEntriesByDate} users={users} merchantRegistrations={filteredMerchantRegistrations} todaysCollection={filteredEntriesByDate} />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {users.map(user => (
              <UserCard 
                key={user.id} 
                user={user} 
                entries={filteredEntriesByDate} 
                merchantRegistrations={filteredMerchantRegistrations} 
              />
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Year-wise Collection Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview data={reports.entriesByYear.map(entry => ({
                  name: entry.name,
                  total: entry.value
                }))} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Collections</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentSales entries={filteredEntriesByDate.slice(0, 5)} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>User Management</CardTitle>
              <CreateUserForm onSubmit={handleCreateUser} />
            </CardHeader>
            <CardContent>
              <UserManagement users={users} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="merchant-bank-management">
          <Card>
            <CardHeader>
              <CardTitle>Merchant & Bank Management</CardTitle>
            </CardHeader>
            <CardContent>
              <MerchantBankManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entries">
          <Card>
            <CardHeader>
              <CardTitle>Commission Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label htmlFor="filter">Filter entries</Label>
                <Input
                  id="filter"
                  placeholder="Filter by merchant, officer, or region"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </div>
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Merchant</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Year/Month/Bill</TableHead>
                    <TableHead>Collected Amount</TableHead>
                    <TableHead>Collection Date</TableHead>
                    <TableHead>Check Number</TableHead>
                    <TableHead>Check Submission Date</TableHead>
                    <TableHead>Officer</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.merchantName}</TableCell>
                      <TableCell>{entry.invoiceNumber}</TableCell>
                      <TableCell>
                        {entry.yearMonth.map((ym, index) => (
                          <div key={index}>{`${ym.year}/${ym.month}: ৳${ym.billAmount}`}</div>
                        ))}
                      </TableCell>
                      <TableCell>৳{entry.collectedAmount.toLocaleString()}</TableCell>
                      <TableCell>{formatTime(entry.collectionDate)}</TableCell>
                      <TableCell>{entry.checkNumber}</TableCell>
                      <TableCell>{formatTime(entry.checkSubmissionDate)}</TableCell>
                      <TableCell>{entry.collectionOfficer}</TableCell>
                      <TableCell>{entry.region}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button onClick={() => handleEditEntry(entry)} className="mr-2">Edit</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Entry</DialogTitle>
                            </DialogHeader>
                            {editingEntry && (
                              <form onSubmit={(e) => {
                                e.preventDefault()
                                handleUpdateEntry(editingEntry, {...editingEntry})
                              }}>
                                {/* Add form fields for editing entry */}
                                <Button type="submit" className="mt-4">Update Entry</Button>
                              </form>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button onClick={() => handleDeleteEntry(entry.id)} variant="destructive">Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="merchant-registrations">
          <MerchantRegistrationEntries entries={filteredMerchantRegistrations} users={users} />
        </TabsContent>

        <TabsContent value="cards">
          <CardDetails />
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Collection by Region</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={reports.entriesByRegion}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {reports.entriesByRegion.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `৳${value.toLocaleString()}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Collection by Officer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={reports.entriesByOfficer}>
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `৳${value.toLocaleString()}`} />
                        <Tooltip formatter={(value) => `৳${value.toLocaleString()}`} />
                        <Bar dataKey="value" fill="#8884d8">
                          {reports.entriesByOfficer.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Year-wise Collection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={reports.entriesByYear}>
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `৳${value.toLocaleString()}`} />
                        <Tooltip formatter={(value) => `৳${value.toLocaleString()}`} />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
              <Button onClick={() => setShowReportGenerator(true)} className="mt-4">Generate Detailed Report</Button>
              {showReportGenerator && (
                <ReportGenerator entries={filteredEntriesByDate} onClose={() => setShowReportGenerator(false)} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

