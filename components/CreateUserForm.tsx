'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckCircle2, XCircle } from "lucide-react"
import { User } from '@/types/types'

type FormData = Omit<User, 'id'>

type Props = {
  onSubmit: (data: FormData) => Promise<void>
}

export default function CreateUserForm({ onSubmit }: Props) {
  const { register, handleSubmit, setValue, reset } = useForm<FormData>()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleFormSubmit = async (data: FormData) => {
    try {
      await onSubmit(data)
      setDialogOpen(false)
      reset()
      setMessage({
        type: 'success',
        text: `User ${data.name} Created Successfully`
      })
      setShowMessage(true)
      setTimeout(() => setShowMessage(false), 3000)
    } catch (error) {
      setMessage({
        type: 'error',
        text: `Failed to Create User ${data.name}`
      })
      setShowMessage(true)
      setTimeout(() => setShowMessage(false), 3000)
    }
  }

  return (
    <>
      {/* Message Box */}
      {showMessage && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`p-4 rounded-lg shadow-lg bg-white border ${
            message.type === 'success' ? 'border-green-500' : 'border-red-500'
          }`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className={`text-sm font-medium ${
                message.type === 'success' ? 'text-green-700' : 'text-red-700'
              }`}>
                {message.text}
              </span>
            </div>
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Create New User</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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
              <Input 
                id="password" 
                type="password" 
                {...register('password', { required: true })} 
              />
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
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create User</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

