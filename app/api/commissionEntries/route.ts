import { NextResponse } from 'next/server'
import store from '@/lib/store'
import { CommissionEntry } from '@/types/types'

export async function GET() {
  const entries = store.getCommissionEntries()
  return NextResponse.json(entries)
}

export async function POST(req: Request) {
  const data = await req.json()
  const newEntry: CommissionEntry = {
    id: Date.now().toString(),
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  store.addCommissionEntry(newEntry)
  return NextResponse.json(newEntry)
}

