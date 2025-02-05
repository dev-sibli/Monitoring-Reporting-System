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
  )
}

