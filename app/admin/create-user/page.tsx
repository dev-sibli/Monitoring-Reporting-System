'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type FormData = {
  name: string
  phoneNumber: string
  region: string
  username: string
  password: string
  role: 'admin' | 'user'
}

export default function CreateUser() {
  const [error, setError] = useState('')
  const { register, handleSubmit, setValue } = useForm<FormData>()
  const router = useRouter()

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        router.push('/admin')
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'An error occurred')
      }
    } catch (err) {
      setError('An error occurred')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register('name', { required: true })} />
      </div>
      <div>
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input id="phoneNumber" {...register('phoneNumber', { required: true })} />
      </div>
      <div>
        <Label htmlFor="region">Region</Label>
        <Select onValueChange={(value) => setValue('region', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Dhaka">Dhaka</SelectItem>
            <SelectItem value="Chattogram">Chattogram</SelectItem>
            <SelectItem value="Sylhet">Sylhet</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="username">Username</Label>
        <Input id="username" {...register('username', { required: true })} />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...register('password', { required: true })} />
      </div>
      <div>
        <Label htmlFor="role">Role</Label>
        <Select onValueChange={(value) => setValue('role', value as 'admin' | 'user')}>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit" className="w-full">Create User</Button>
    </form>
  )
}

