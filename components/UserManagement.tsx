'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User } from "@/types/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type Props = {
  users: User[]
}

export default function UserManagement({ users }: Props) {
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const handleEditUser = (user: User) => {
    setEditingUser(user)
  }

  const handleUpdateUser = (updatedUser: User) => {
    // Here you would typically make an API call to update the user
    console.log('Updating user:', updatedUser)
    setEditingUser(null)
  }

  const handleSuspendUser = (userId: string) => {
    // Here you would typically make an API call to suspend the user
    console.log('Suspending user:', userId)
  }

  const handleDeleteUser = (userId: string) => {
    // Here you would typically make an API call to delete the user
    console.log('Deleting user:', userId)
  }

  return (
    <div>
      {/* <h3 className="text-lg font-semibold mb-2">Merchant & Bank Management</h3> */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.region}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={() => handleEditUser(user)} className="mr-2">Edit</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit User</DialogTitle>
                    </DialogHeader>
                    {editingUser && (
                      <form onSubmit={(e) => {
                        e.preventDefault()
                        handleUpdateUser(editingUser)
                      }}>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                              id="name"
                              value={editingUser.name}
                              onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="role">Role</Label>
                            <Select
                              value={editingUser.role}
                              onValueChange={(value) => setEditingUser({ ...editingUser, role: value as 'admin' | 'user' })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="user">User</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="region">Region</Label>
                            <Select
                              value={editingUser.region}
                              onValueChange={(value) => setEditingUser({ ...editingUser, region: value })}
                            >
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
                            <Label htmlFor="password">New Password</Label>
                            <Input
                              id="password"
                              type="password"
                              onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                            />
                          </div>
                        </div>
                        <Button type="submit" className="mt-4">Update User</Button>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
                <Button onClick={() => handleSuspendUser(user.id)} className="mr-2" variant="outline">Suspend</Button>
                <Button onClick={() => handleDeleteUser(user.id)} variant="destructive">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

