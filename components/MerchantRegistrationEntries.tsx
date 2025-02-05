import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatTime } from '@/utils/dateUtils'

type User = {
  id: string;
  name: string;
}

type MerchantRegistration = {
  id: string
  merchantName: string
  type: 'discount' | 'emi' | 'bogo'
  registrationDate: string
  userId: string
}

type MerchantRegistrationEntriesProps = {
  entries: MerchantRegistration[]
  users: User[]
}

export function MerchantRegistrationEntries({ entries, users }: MerchantRegistrationEntriesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Merchant Registration Entries</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Merchant Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Registration Date</TableHead>
              <TableHead>User</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.merchantName}</TableCell>
                <TableCell>{entry.type.toUpperCase()}</TableCell>
                <TableCell>{formatTime(entry.registrationDate)}</TableCell>
                <TableCell>{users.find(user => user.id === entry.userId)?.name || 'Unknown'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

