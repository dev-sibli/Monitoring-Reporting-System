import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CommissionEntry, User } from '@/types/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type MerchantRegistration = {
  id: string
  merchantName: string
  type: 'discount' | 'emi' | 'bogo'
  registrationDate: string
}

type AdminDashboardOverviewProps = {
  entries: CommissionEntry[]
  users: User[]
  merchantRegistrations: MerchantRegistration[]
  todaysCollection: CommissionEntry[]
}

export function AdminDashboardOverview({ entries, users, merchantRegistrations, todaysCollection }: AdminDashboardOverviewProps) {
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'today' | 'thisWeek' | 'thisMonth'>('all')

  const filterData = (data: any[], dateField: string) => {
    const today = new Date()
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    return data.filter(item => {
      const itemDate = new Date(item[dateField])
      switch (filterPeriod) {
        case 'today':
          return itemDate.toDateString() === today.toDateString()
        case 'thisWeek':
          return itemDate >= oneWeekAgo
        case 'thisMonth':
          return itemDate >= firstDayOfMonth
        default:
          return true
      }
    })
  }

  const filteredEntries = filterData(entries, 'collectionDate')
  const filteredMerchantRegistrations = filterData(merchantRegistrations, 'registrationDate')

  const totalCollection = entries.reduce((sum, entry) => sum + entry.collectedAmount, 0)
  const todaysTotalCollection = todaysCollection.reduce((sum, entry) => sum + entry.collectedAmount, 0)

  const entriesByUser = filteredEntries.reduce((acc, entry) => {
    acc[entry.collectionOfficer] = (acc[entry.collectionOfficer] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const merchantRegistrationCount = merchantRegistrations.length
  const discountMerchantCount = merchantRegistrations.filter(reg => reg.type === 'discount').length
  const emiMerchantCount = merchantRegistrations.filter(reg => reg.type === 'emi').length
  const bogoMerchantCount = merchantRegistrations.filter(reg => reg.type === 'bogo').length

  const merchantVisitCount = filteredEntries.filter(entry => entry.userVisits && entry.userVisits.length > 0).length

  const cardCollection = entries.reduce((acc, entry) => {
    const cardCollection = entry.cardCollection || { creditCard: 0, prepaidCard: 0, hajjCard: 0, medicalCard: 0 }
    acc.creditCard += parseInt(cardCollection.creditCard.toString()) || 0
    acc.prepaidCard += parseInt(cardCollection.prepaidCard.toString()) || 0
    acc.hajjCard += parseInt(cardCollection.hajjCard.toString()) || 0
    acc.medicalCard += parseInt(cardCollection.medicalCard.toString()) || 0
    return acc
  }, { creditCard: 0, prepaidCard: 0, hajjCard: 0, medicalCard: 0 })
  const totalCardsCollected = Object.values(cardCollection).reduce((sum, count) => sum + count, 0)

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <Select onValueChange={(value) => setFilterPeriod(value as 'all' | 'today' | 'thisWeek' | 'thisMonth')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="thisWeek">This Week</SelectItem>
            <SelectItem value="thisMonth">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Collection Metrics</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">৳{totalCollection.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">৳{todaysTotalCollection.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Merchant Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{merchantRegistrationCount}</div>
              <div className="text-xs text-muted-foreground">
                Discount: {discountMerchantCount}, EMI: {emiMerchantCount}, BOGO: {bogoMerchantCount}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Merchant Visits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{merchantVisitCount}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Card Collection Metrics</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCardsCollected}</div>
              <div className="text-sm mt-2">
                <p>Credit: {cardCollection.creditCard}</p>
                <p>Prepaid: {cardCollection.prepaidCard}</p>
                <p>Hajj: {cardCollection.hajjCard}</p>
                <p>Medical: {cardCollection.medicalCard}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credit Cards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cardCollection.creditCard}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prepaid Cards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cardCollection.prepaidCard}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hajj Cards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cardCollection.hajjCard}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Medical Cards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cardCollection.medicalCard}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

