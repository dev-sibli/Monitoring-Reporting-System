'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { User } from '@/types/types'

type FormData = Omit<User, 'id'>

type Props = {
  onSubmit: (data: FormData) => void
  onCancel: () => void
}

export default function CreateUserForm({ onSubmit, onCancel }: Props) {
  const { register, handleSubmit, setValue } = useForm<FormData>()

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 bg-white p-4 rounded-lg shadow">
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
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Create User</Button>
      </div>
    </form>
  )
}

