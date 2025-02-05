import { NextResponse } from 'next/server'
import store from '@/lib/store'
import { User } from '@/types/types'

export async function POST(req: Request) {
  const { name, phoneNumber, region, username, password, role } = await req.json()

  if (store.getUserByUsername(username)) {
    return NextResponse.json({ error: 'Username already exists' }, { status: 400 })
  }

  const newUser: User = {
    id: Date.now().toString(),
    name,
    phoneNumber,
    region,
    username,
    password,
    role: role || 'user',
  }

  store.addUser(newUser)

  const { password: _, ...userWithoutPassword } = newUser

  return NextResponse.json(userWithoutPassword)
}

