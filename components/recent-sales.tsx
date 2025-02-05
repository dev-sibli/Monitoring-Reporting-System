import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatTime } from "@/utils/dateUtils"
import { CommissionEntry } from "@/types/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function RecentSales({ entries }: { entries: CommissionEntry[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Collections</CardTitle>
        <p className="text-sm text-muted-foreground">
          You made {entries.length} collections this month.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {entries.map((entry) => (
            <div key={entry.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                <AvatarFallback>{entry.collectionOfficer.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{entry.collectionOfficer}</p>
                <p className="text-sm text-muted-foreground">
                  {entry.region} - {formatTime(entry.collectionDate)}
                </p>
              </div>
              <div className="ml-auto font-medium">৳{entry.collectedAmount.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

