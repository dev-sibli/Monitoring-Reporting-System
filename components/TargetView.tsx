"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

type Target = {
  id: number
  name: string
  quantity: number
  rewardPercentage: number
  progress: number
}

export default function TargetView() {
  const [targets, setTargets] = useState<Target[]>([
    { id: 1, name: "Discount Companies", quantity: 10, rewardPercentage: 10, progress: 8 },
    { id: 2, name: "EMI Merchants", quantity: 5, rewardPercentage: 10, progress: 5 },
    { id: 3, name: "Shop Visits", quantity: 10, rewardPercentage: 10, progress: 12 },
    { id: 4, name: "Deposit Collection", quantity: 50000, rewardPercentage: 10, progress: 40000 },
    { id: 5, name: "Credit Card Sales", quantity: 3, rewardPercentage: 10, progress: 2 },
    { id: 6, name: "Commission Collection", quantity: 500000, rewardPercentage: 20, progress: 600000 },
  ])

  const calculateScore = (target: Target) => {
    const progressPercentage = Math.min((target.progress / target.quantity) * 100, 100)
    return (progressPercentage / 100) * target.rewardPercentage
  }

  const totalScore = targets.reduce((sum, target) => sum + calculateScore(target), 0)

  return (
    // <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 pb-2">
    //   <Card>
    //     <CardHeader>
    //       <CardTitle>Total Performance Score: {totalScore.toFixed(2)}%</CardTitle>
    //     </CardHeader>
    //   </Card>

    //   {targets.map((target) => (
    //     <Card key={target.id}>
    //       <CardHeader>
    //         <CardTitle>{target.name}</CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         <div className="space-y-2">
    //           <Progress value={(target.progress / target.quantity) * 100} />
    //           <p>
    //             Progress: {target.progress}/{target.quantity} ({((target.progress / target.quantity) * 100).toFixed(2)}%
    //             Complete)
    //           </p>
    //           <p>Score Earned: {calculateScore(target).toFixed(2)}%</p>
    //         </div>
    //       </CardContent>
    //     </Card>
    //   ))}
    // </div>
    <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-2">
                {targets.map((target) => {
                  const progressPercentage = (target.progress / target.quantity) * 100
                  const isCompleted = progressPercentage >= 100
                  return (
                    <Card key={target.id}>
                      <CardHeader>
                        <CardTitle>{target.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="h-4 w-full bg-red-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${progressPercentage >= 100 ? "bg-green-700" : "bg-green-700"}`}
                              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                            />
                          </div>
                          <p>
                            Progress: {target.progress}/{target.quantity} ({progressPercentage.toFixed(2)}% Complete)
                          </p>
                          <p>Score Earned: {calculateScore(target).toFixed(2)}%</p>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
  )
}

