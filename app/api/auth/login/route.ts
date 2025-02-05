import { NextResponse } from 'next/server'
import store from '@/lib/store'

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()
    const user = store.getUserByUsername(username)

    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const { password: _, ...userWithoutPassword } = user

    // Ensure dates are strings before sending
    const userToSend = {
      ...userWithoutPassword,
      createdAt: userWithoutPassword.createdAt?.toISOString(),
      updatedAt: userWithoutPassword.updatedAt?.toISOString(),
    }

    return NextResponse.json(userToSend)
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}

