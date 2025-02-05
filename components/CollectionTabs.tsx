'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CollectionForm from './CollectionForm'
import MerchantRegistrationForm from './MerchantRegistrationForm'
import { CommissionEntry } from '@/types/types'

type CollectionTabsProps = {
  onSubmit: (data: Omit<CommissionEntry, 'id' | 'createdAt' | 'updatedAt'>) => void
}

export default function CollectionTabs({ onSubmit }: CollectionTabsProps) {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 pb-2">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="tracking-tight text-sm font-medium">Discount Merchant</div>
            <div className="tracking-tight text-sm font-small">Accomplished</div>
          </div>
          <div className="p-6 pt-0 flex flex-row items-center justify-between space-y-0">
            <div className="text-xl font-bold">10</div>
            <div className="text-xl font-bold">5</div>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="tracking-tight text-sm font-medium">EMI Merchant Onboarding</div>
            <div className="tracking-tight text-sm font-small">Accomplished</div>
          </div>
          <div className="p-6 pt-0 flex flex-row items-center justify-between space-y-0">
            <div className="text-xl font-bold">10</div>
            <div className="text-xl font-bold">5</div>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="tracking-tight text-sm font-medium">Market Visit</div>
            <div className="tracking-tight text-sm font-small">Accomplished</div>
          </div>
          <div className="p-6 pt-0 flex flex-row items-center justify-between space-y-0">
            <div className="text-xl font-bold">10</div>
            <div className="text-xl font-bold">5</div>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="tracking-tight text-sm font-medium">EMI Commission - Per Month</div>
            <div className="tracking-tight text-sm font-small">Accomplished</div>
          </div>
          <div className="p-6 pt-0 flex flex-row items-center justify-between space-y-0">
            <div className="text-xl font-bold">500,000</div>
            <div className="text-xl font-bold">250,000</div>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="tracking-tight text-sm font-medium">Credit Card Execution</div>
            <div className="tracking-tight text-sm font-small">Accomplished</div>
          </div>
          <div className="p-6 pt-0 flex flex-row items-center justify-between space-y-0">
            <div className="text-xl font-bold">3</div>
            <div className="text-xl font-bold">1</div>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="tracking-tight text-sm font-medium">Deposit Collection</div>
            <div className="tracking-tight text-sm font-small">Accomplished</div>
          </div>
          <div className="p-6 pt-0 flex flex-row items-center justify-between space-y-0">
            <div className="text-xl font-bold">50,000</div>
            <div className="text-xl font-bold">25,000</div>
          </div>
        </div>

      </div>
      <Tabs defaultValue="collection" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="collection">Collection Form</TabsTrigger>
          <TabsTrigger value="registration">Merchant Registration</TabsTrigger>
        </TabsList>
        <TabsContent value="collection">
          <CollectionForm onSubmit={onSubmit} />
        </TabsContent>
        <TabsContent value="registration">
          <MerchantRegistrationForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}

