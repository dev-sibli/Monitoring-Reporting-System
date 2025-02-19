// 'use client'

// import { useState } from 'react'
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { User } from "@/types/types"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// type Props = {
//   users: User[]
// }

// export default function UserManagement({ users }: Props) {
//   const [editingUser, setEditingUser] = useState<User | null>(null)

//   const handleEditUser = (user: User) => {
//     setEditingUser(user)
//   }

//   const handleUpdateUser = (updatedUser: User) => {
//     // Here you would typically make an API call to update the user
//     console.log('Updating user:', updatedUser)
//     setEditingUser(null)
//   }

//   const handleSuspendUser = (userId: string) => {
//     // Here you would typically make an API call to suspend the user
//     console.log('Suspending user:', userId)
//   }

//   const handleDeleteUser = (userId: string) => {
//     // Here you would typically make an API call to delete the user
//     console.log('Deleting user:', userId)
//   }

//   return (
//     <div>
//       {/* <h3 className="text-lg font-semibold mb-2">Merchant & Bank Management</h3> */}
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Name</TableHead>
//             <TableHead>Username</TableHead>
//             <TableHead>Role</TableHead>
//             <TableHead>Region</TableHead>
//             <TableHead>Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {users.map((user) => (
//             <TableRow key={user.id}>
//               <TableCell>{user.name}</TableCell>
//               <TableCell>{user.username}</TableCell>
//               <TableCell>{user.role}</TableCell>
//               <TableCell>{user.region}</TableCell>
//               <TableCell>
//                 <Dialog>
//                   <DialogTrigger asChild>
//                     <Button onClick={() => handleEditUser(user)} className="mr-2">Edit</Button>
//                   </DialogTrigger>
//                   <DialogContent>
//                     <DialogHeader>
//                       <DialogTitle>Edit User</DialogTitle>
//                     </DialogHeader>
//                     {editingUser && (
//                       <form onSubmit={(e) => {
//                         e.preventDefault()
//                         handleUpdateUser(editingUser)
//                       }}>
//                         <div className="space-y-4">
//                           <div>
//                             <Label htmlFor="name">Name</Label>
//                             <Input
//                               id="name"
//                               value={editingUser.name}
//                               onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
//                             />
//                           </div>
//                           <div>
//                             <Label htmlFor="role">Role</Label>
//                             <Select
//                               value={editingUser.role}
//                               onValueChange={(value) => setEditingUser({ ...editingUser, role: value as 'admin' | 'user' })}
//                             >
//                               <SelectTrigger>
//                                 <SelectValue placeholder="Select role" />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 <SelectItem value="admin">Admin</SelectItem>
//                                 <SelectItem value="user">User</SelectItem>
//                               </SelectContent>
//                             </Select>
//                           </div>
//                           <div>
//                             <Label htmlFor="region">Region</Label>
//                             <Select
//                               value={editingUser.region}
//                               onValueChange={(value) => setEditingUser({ ...editingUser, region: value })}
//                             >
//                               <SelectTrigger>
//                                 <SelectValue placeholder="Select region" />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 <SelectItem value="Dhaka">Dhaka</SelectItem>
//                                 <SelectItem value="Chattogram">Chattogram</SelectItem>
//                                 <SelectItem value="Sylhet">Sylhet</SelectItem>
//                               </SelectContent>
//                             </Select>
//                           </div>
//                           <div>
//                             <Label htmlFor="password">New Password</Label>
//                             <Input
//                               id="password"
//                               type="password"
//                               onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
//                             />
//                           </div>
//                         </div>
//                         <Button type="submit" className="mt-4">Update User</Button>
//                       </form>
//                     )}
//                   </DialogContent>
//                 </Dialog>
//                 <Button onClick={() => handleSuspendUser(user.id)} className="mr-2" variant="outline">Suspend</Button>
//                 <Button onClick={() => handleDeleteUser(user.id)} variant="destructive">Delete</Button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   )
// }

// 

// 'use client'

// import { useState } from 'react'
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { User } from "@/types/types"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { SetTargetModal } from "@/components/SetTargetModal"
// import { PerformanceReportModal } from "@/components/PerformanceReportModal"

// type Props = {
//   users: User[]
// }

// export default function AdminDashboard({ users }: Props) {
//   const [editingUser, setEditingUser] = useState<User | null>(null)
//   const [isSetTargetModalOpen, setIsSetTargetModalOpen] = useState(false)
//   const [isPerformanceReportModalOpen, setIsPerformanceReportModalOpen] = useState(false)
//   const [selectedUser, setSelectedUser] = useState<User | null>(null)
//   const [newUser, setNewUser] = useState("")

//   const handleEditUser = (user: User) => {
//     setEditingUser(user)
//   }

//   const handleUpdateUser = (updatedUser: User) => {
//     console.log('Updating user:', updatedUser)
//     setEditingUser(null)
//   }

//   const handleSuspendUser = (userId: string) => {
//     console.log('Suspending user:', userId)
//   }

//   const handleDeleteUser = (userId: string) => {
//     console.log('Deleting user:', userId)
//   }

//   const addUser = () => {
//     if (newUser.trim() !== "") {
//       console.log('Adding user:', newUser)
//       setNewUser("")
//     }
//   }

//   const openSetTargetModal = (user: User) => {
//     setSelectedUser(user)
//     setIsSetTargetModalOpen(true)
//   }

//   const openPerformanceReportModal = (user: User) => {
//     setSelectedUser(user)
//     setIsPerformanceReportModalOpen(true)
//   }

//   return (
//     <div className="space-y-6">
//       {/* <Dialog>
//         <DialogTrigger asChild>
//           <Button>Add New User</Button>
//         </DialogTrigger>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Add New User</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             <Label htmlFor="username">Username</Label>
//             <Input id="username" placeholder="Enter username" value={newUser} onChange={(e) => setNewUser(e.target.value)} />
//             <Button onClick={addUser}>Add User</Button>
//           </div>
//         </DialogContent>
//       </Dialog> */}

//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Name</TableHead>
//             <TableHead>Username</TableHead>
//             <TableHead>Role</TableHead>
//             <TableHead>Region</TableHead>
//             <TableHead>Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {users.map((user) => (
//             <TableRow key={user.id}>
//               <TableCell>{user.name}</TableCell>
//               <TableCell>{user.username}</TableCell>
//               <TableCell>{user.role}</TableCell>
//               <TableCell>{user.region}</TableCell>
//               <TableCell>
//                 <Dialog>
//                   <DialogTrigger asChild>
//                     <Button onClick={() => handleEditUser(user)} className="mr-2">Edit</Button>
//                   </DialogTrigger>
//                   <DialogContent>
//                     <DialogHeader>
//                       <DialogTitle>Edit User</DialogTitle>
//                     </DialogHeader>
//                     {editingUser && (
//                       <form onSubmit={(e) => {
//                         e.preventDefault()
//                         handleUpdateUser(editingUser)
//                       }}>
//                         <div className="space-y-4">
//                           <Label htmlFor="name">Name</Label>
//                           <Input id="name" value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} />
//                           <Label htmlFor="role">Role</Label>
//                           <Select value={editingUser.role} onValueChange={(value) => setEditingUser({ ...editingUser, role: value as 'admin' | 'user' })}>
//                             <SelectTrigger>
//                               <SelectValue placeholder="Select role" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="admin">Admin</SelectItem>
//                               <SelectItem value="user">User</SelectItem>
//                             </SelectContent>
//                           </Select>
//                           <Label htmlFor="region">Region</Label>
//                           <Select value={editingUser.region} onValueChange={(value) => setEditingUser({ ...editingUser, region: value })}>
//                             <SelectTrigger>
//                               <SelectValue placeholder="Select region" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="Dhaka">Dhaka</SelectItem>
//                               <SelectItem value="Chattogram">Chattogram</SelectItem>
//                               <SelectItem value="Sylhet">Sylhet</SelectItem>
//                             </SelectContent>
//                           </Select>
//                           <Button type="submit" className="mt-4">Update User</Button>
//                         </div>
//                       </form>
//                     )}
//                   </DialogContent>
//                 </Dialog>
//                 <Button onClick={() => openSetTargetModal(user)} className="mr-2">Set Target</Button>
//                 <Button onClick={() => openPerformanceReportModal(user)}>Performance Report</Button>
//                 <Button onClick={() => handleSuspendUser(user.id)} className="mr-2" variant="outline">Suspend</Button>
//                 <Button onClick={() => handleDeleteUser(user.id)} variant="destructive">Delete</Button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       {selectedUser && (
//         <>
//           <SetTargetModal isOpen={isSetTargetModalOpen} onClose={() => setIsSetTargetModalOpen(false)} employee={selectedUser} />
//           <PerformanceReportModal isOpen={isPerformanceReportModalOpen} onClose={() => setIsPerformanceReportModalOpen(false)} employee={selectedUser} />
//         </>
//       )}
//     </div>
//   )
// }
'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User } from "@/types/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import SetTargetModal from "./SetTargetModal"
import  PerformanceReportModal from "./PerformanceReportModal"

type Props = {
  users: User[]
}

export default function AdminDashboard({ users }: Props) {
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isSetTargetModalOpen, setIsSetTargetModalOpen] = useState(false)
  const [isPerformanceReportModalOpen, setIsPerformanceReportModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState("")

  const handleEditUser = (user: User) => {
    setEditingUser(user)
  }

  const handleUpdateUser = (updatedUser: User) => {
    console.log('Updating user:', updatedUser)
    setEditingUser(null)
  }

  const handleSuspendUser = (userId: string) => {
    console.log('Suspending user:', userId)
  }

  const handleDeleteUser = (userId: string) => {
    console.log('Deleting user:', userId)
  }

  const addUser = () => {
    if (newUser.trim() !== "") {
      console.log('Adding user:', newUser)
      setNewUser("")
    }
  }

  const openSetTargetModal = (user: User) => {
    setSelectedUser(user)
    setIsSetTargetModalOpen(true)
  }

  const openPerformanceReportModal = (user: User) => {
    setSelectedUser(user)
    setIsPerformanceReportModalOpen(true)
  }

  return (
    <div className="space-y-6 p-6">

      <div className="overflow-x-auto">
        <Table className="w-full border border-gray-200 rounded-lg shadow-sm">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead>Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50">
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.region}</TableCell>
                <TableCell className="space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button onClick={() => handleEditUser(user)} variant="outline">Edit</Button>
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
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} />
                            <Label htmlFor="role">Role</Label>
                            <Select value={editingUser.role} onValueChange={(value) => setEditingUser({ ...editingUser, role: value as 'admin' | 'user' })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="user">User</SelectItem>
                              </SelectContent>
                            </Select>
                            <Label htmlFor="region">Region</Label>
                            <Select value={editingUser.region} onValueChange={(value) => setEditingUser({ ...editingUser, region: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select region" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Dhaka">Dhaka</SelectItem>
                                <SelectItem value="Chattogram">Chattogram</SelectItem>
                                <SelectItem value="Sylhet">Sylhet</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button type="submit" className="mt-4">Update User</Button>
                          </div>
                        </form>
                      )}
                    </DialogContent>
                  </Dialog>
                  {/* <Button onClick={() => openSetTargetModal(user)} variant="outline">Set Target</Button>
                  <Button onClick={() => openPerformanceReportModal(user)} variant="outline">Performance Report</Button> */}
                  <Button onClick={() => handleSuspendUser(user.id)} variant="destructive">Suspend</Button>
                  <Button onClick={() => handleDeleteUser(user.id)} variant="destructive">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedUser && (
        <>
          <SetTargetModal isOpen={isSetTargetModalOpen} onClose={() => setIsSetTargetModalOpen(false)} employee={selectedUser} />
          <PerformanceReportModal isOpen={isPerformanceReportModalOpen} onClose={() => setIsPerformanceReportModalOpen(false)} employee={selectedUser} />
        </>
      )}
    </div>
  )
}
