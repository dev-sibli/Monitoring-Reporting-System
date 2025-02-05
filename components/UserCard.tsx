import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, CommissionEntry, MerchantRegistration } from "@/types/types"

type UserCardProps = {
  user: User
  entries: CommissionEntry[]
  merchantRegistrations: MerchantRegistration[]
}

export function UserCard({ user, entries, merchantRegistrations }: UserCardProps) {
  const userEntries = entries.filter(entry => entry.collectionOfficer === user.name)
  const userMerchantRegistrations = merchantRegistrations.filter(reg => reg.userId === user.id)

  const totalCollection = userEntries.reduce((sum, entry) => sum + entry.collectedAmount, 0)

  const merchantRegistrationCount = userMerchantRegistrations.length
  const discountMerchantCount = userMerchantRegistrations.filter(reg => reg.type === 'discount').length
  const emiMerchantCount = userMerchantRegistrations.filter(reg => reg.type === 'emi').length
  const bogoMerchantCount = userMerchantRegistrations.filter(reg => reg.type === 'bogo').length

  const cardCollection = userEntries.reduce((acc, entry) => {
    const cardCollection = entry.cardCollection || { creditCard: 0, prepaidCard: 0, hajjCard: 0, medicalCard: 0 }
    acc.creditCard += parseInt(cardCollection.creditCard.toString()) || 0
    acc.prepaidCard += parseInt(cardCollection.prepaidCard.toString()) || 0
    acc.hajjCard += parseInt(cardCollection.hajjCard.toString()) || 0
    acc.medicalCard += parseInt(cardCollection.medicalCard.toString()) || 0
    return acc
  }, { creditCard: 0, prepaidCard: 0, hajjCard: 0, medicalCard: 0 })

  const totalCardsCollected = Object.values(cardCollection).reduce((sum, count) => sum + count, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p><strong>Region:</strong> {user.region}</p>
          <p><strong>Total Collection:</strong> ৳{totalCollection.toLocaleString()}</p>
          <div>
            <p><strong>Merchant Registrations:</strong> {merchantRegistrationCount}</p>
            <ul className="list-disc list-inside pl-4">
              <li>Discount: {discountMerchantCount}</li>
              <li>EMI: {emiMerchantCount}</li>
              <li>BOGO: {bogoMerchantCount}</li>
            </ul>
          </div>
          <div>
            <p><strong>Card Collections:</strong> {totalCardsCollected}</p>
            <ul className="list-disc list-inside pl-4">
              <li>Credit: {cardCollection.creditCard}</li>
              <li>Prepaid: {cardCollection.prepaidCard}</li>
              <li>Hajj: {cardCollection.hajjCard}</li>
              <li>Medical: {cardCollection.medicalCard}</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

