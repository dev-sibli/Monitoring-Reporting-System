"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Target = {
  id: number
  name: string
  quantity: number
  rewardPercentage: number
}

type Employee = {
  id: number
  name: string
}

type SetTargetModalProps = {
  isOpen: boolean
  onClose: () => void
  employee: Employee
}

export default function SetTargetModal({ isOpen, onClose, employee }: SetTargetModalProps) {
  const [targets, setTargets] = useState<Target[]>([
    { id: 1, name: "Discount Companies", quantity: 10, rewardPercentage: 10 },
    { id: 2, name: "EMI Merchants", quantity: 5, rewardPercentage: 10 },
    { id: 3, name: "Shop Visits", quantity: 10, rewardPercentage: 10 },
    { id: 4, name: "Deposit Collection", quantity: 50000, rewardPercentage: 10 },
    { id: 5, name: "Credit Card Sales", quantity: 3, rewardPercentage: 10 },
    { id: 6, name: "Revenue Collection", quantity: 500000, rewardPercentage: 20 },
  ])

  const updateTarget = (targetId: number, field: keyof Target, value: string) => {
    setTargets(
      targets.map((target) => {
        if (target.id === targetId) {
          return { ...target, [field]: value === "" ? 0 : Number(value) }
        }
        return target
      }),
    )
  }

  const saveTargets = () => {
    // Here you would typically send the updated targets to your backend API
    console.log("Saving targets for employee:", employee.name, targets)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Set Targets for {employee.name}</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Target</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Reward %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {targets.map((target) => (
              <TableRow key={target.id}>
                <TableCell>{target.name}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={target.quantity}
                    onChange={(e) => updateTarget(target.id, "quantity", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={target.rewardPercentage}
                    onChange={(e) => updateTarget(target.id, "rewardPercentage", e.target.value)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button onClick={saveTargets}>Save Targets</Button>
      </DialogContent>
    </Dialog>
  )
}

