'use client'

import { useState, useEffect } from 'react'
import CollectionTabs from './CollectionTabs'
import { CommissionEntry } from '@/types/types'

export default function CommissionCollectionApp() {
  const [collectionData, setCollectionData] = useState<CommissionEntry[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/commissionEntries')
        if (response.ok) {
          const data = await response.json()
          setCollectionData(data)
        }
      } catch (error) {
        console.error('Error fetching commission entries:', error)
      }
    }

    fetchData()
  }, [])

  const handleFormSubmit = async (newData: Omit<CommissionEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/commissionEntries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      })

      if (response.ok) {
        const savedEntry = await response.json()
        setCollectionData(prevData => [...prevData, savedEntry])
      }
    } catch (error) {
      console.error('Error submitting commission entry:', error)
    }
  }

  return (
    <div className="space-y-8">
      <CollectionTabs onSubmit={handleFormSubmit} data={collectionData} />
    </div>
  )
}

