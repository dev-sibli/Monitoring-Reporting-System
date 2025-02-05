import { NextResponse } from 'next/server'
import store from '@/lib/store'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')

  try {
    let data
    switch (type) {
      case 'entries':
        data = store.getCommissionEntries()
        const entriesByDate = data.reduce((acc, entry) => {
          const date = entry.collectionDate.split('T')[0]
          acc[date] = (acc[date] || 0) + 1
          return acc
        }, {} as Record<string, number>)
        return NextResponse.json({
          labels: Object.keys(entriesByDate),
          values: Object.values(entriesByDate),
        })
      case 'activities':
        // For this example, we'll just count entries per user
        data = store.getCommissionEntries()
        const entriesByUser = data.reduce((acc, entry) => {
          acc[entry.collectionOfficer] = (acc[entry.collectionOfficer] || 0) + 1
          return acc
        }, {} as Record<string, number>)
        return NextResponse.json({
          labels: Object.keys(entriesByUser),
          values: Object.values(entriesByUser),
        })
      case 'regions':
        data = store.getCommissionEntries()
        const entriesByRegion = data.reduce((acc, entry) => {
          acc[entry.region] = (acc[entry.region] || 0) + entry.collectedAmount
          return acc
        }, {} as Record<string, number>)
        return NextResponse.json({
          labels: Object.keys(entriesByRegion),
          values: Object.values(entriesByRegion),
        })
      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

