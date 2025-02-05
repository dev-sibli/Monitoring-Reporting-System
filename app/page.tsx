'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import CommissionCollectionApp from '@/components/CollectionTabs'
import LoginForm from '@/components/LoginForm'
import AdminDashboard from '@/components/AdminDashboard'
import { useAuth } from '@/hooks/useAuth'
import { AuthProvider } from '@/contexts/AuthContext'

function Home() {
  const { user, logout, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto p-4">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-4 rounded-lg shadow">
          <Image src="https://card.easystepbd.com/wp-content/uploads/2024/09/ologo.png" alt="ONE Bank Logo" width={200} height={62} />
          <h2 className="text-xl font-semibold text-blue-800 mt-4 md:mt-0">Strategic Alliance - ONE Bank Card</h2>
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-blue-600">Welcome, {user.name}</span>
              <Button onClick={logout} className="mt-4 md:mt-0">Log Out</Button>
            </div>
          )}
        </header>
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-900">Strategic Alliance Monitoring & Reporting System</h1>
        {user ? (
          user.role === 'admin' ? <AdminDashboard /> : <CommissionCollectionApp />
        ) : (
          <LoginForm />
        )}
      </div>
    </main>
  )
}

export default function WrappedHome() {
  return (
    <AuthProvider>
      <Home />
    </AuthProvider>
  )
}

