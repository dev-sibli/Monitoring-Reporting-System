'use client'

import { useState } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Plus, Trash2 } from 'lucide-react'
import { format, isFriday, isSaturday, addDays } from 'date-fns'
import { cn } from '@/lib/utils'
import { mockMerchants } from '@/utils/mockData'

type MerchantType = 'discount' | 'emi' | 'bogo'

type Merchant = {
  type: MerchantType
  name: string
  area: string
}

type UserVisit = {
  merchantName: string
  visitDate: Date
  area: string
}

type CardCollection = {
  cardholderName: string;
  creditCard: string;
  prepaidCard: string;
  hajjCard: string;
  medicalCard: string;
};

type FormData = {
  discountMerchants: Merchant[]
  emiMerchants: Merchant[]
  bogoMerchants: Merchant[]
  userVisits: UserVisit[]
  checkCollection: string
  creditCards: Array<{ cardholderName: string }>;
  prepaidCards: Array<{ cardholderName: string }>;
  hajjCards: Array<{ cardholderName: string }>;
  medicalCards: Array<{ cardholderName: string }>;
}

function isHoliday(date: Date): boolean {
  // This is a placeholder function. In a real application, you would implement
  // logic to check against a list of Bangladesh Bank holidays.
  return false
}

function getNextValidDate(date: Date): Date {
  let nextDate = date
  while (isFriday(nextDate) || isSaturday(nextDate) || isHoliday(nextDate)) {
    nextDate = addDays(nextDate, 1)
  }
  return nextDate
}

export default function MerchantRegistrationForm() {
  const { register, control, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {
      discountMerchants: [{ type: 'discount', name: '', area: '' }],
      emiMerchants: [{ type: 'emi', name: '', area: '' }],
      bogoMerchants: [{ type: 'bogo', name: '', area: '' }],
      userVisits: [{ merchantName: '', visitDate: getNextValidDate(new Date()), area: '' }],
      checkCollection: '',
      creditCards: [{ cardholderName: '' }],
      prepaidCards: [{ cardholderName: '' }],
      hajjCards: [{ cardholderName: '' }],
      medicalCards: [{ cardholderName: '' }]
    }
  })
  const { fields: discountFields, append: appendDiscount, remove: removeDiscount } = useFieldArray({ control, name: "discountMerchants" })
  const { fields: emiFields, append: appendEmi, remove: removeEmi } = useFieldArray({ control, name: "emiMerchants" })
  const { fields: bogoFields, append: appendBogo, remove: removeBogo } = useFieldArray({ control, name: "bogoMerchants" })
  const { fields: userVisitFields, append: appendUserVisit, remove: removeUserVisit } = useFieldArray({ control, name: "userVisits" })

  const [filteredMerchants, setFilteredMerchants] = useState<string[]>([])

  const onSubmit = (data: FormData) => {
    console.log(data)
    // Here you would typically send this data to your backend
  }

  const handleMerchantSearch = (searchTerm: string, index: number) => {
    if (searchTerm.length >= 2) {
      const filtered = mockMerchants.filter(m =>
        m.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredMerchants(filtered)
    } else {
      setFilteredMerchants([])
    }
  }

  const renderMerchantSection = ({ title, fields, append, remove, type }: { title: string; fields: Merchant[]; append: () => void; remove: (index: number) => void; type: MerchantType }) => (
    <div key={title} className="space-y-4">
      <h3 className="font-semibold text-lg">{title}</h3>
      {fields.map((field, index) => (
        <div key={field.id} className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="flex-grow space-y-2 sm:space-y-0 sm:space-x-2 sm:flex sm:items-center w-full">
            <Input
              {...register(`${type}Merchants.${index}.name` as const)}
              placeholder="Enter name"
              className="flex-grow"
            />
            <Input
              {...register(`${type}Merchants.${index}.area` as const)}
              placeholder="Enter area"
              className="w-full sm:w-1/3"
            />
            <Input
              {...register(`${type}Merchants.${index}.phoneNumber` as const)}
              placeholder="Phone Number"
              className="w-full sm:w-1/3"
            />
          </div>
          <div className="flex space-x-2 mt-2 sm:mt-0">
            {fields.length > 1 && (
              <Button type="button" onClick={() => remove(index)} size="icon" variant="outline" className="h-10 w-10">
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            {index === fields.length - 1 && (
              <Button type="button" onClick={() => append({ type, name: '', area: '' })} size="sm" variant="outline" className="h-10">
                <Plus className="h-4 w-4 mr-2" /> Add
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4 sm:p-6">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Merchant Registration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-6">
            {[
              { title: "Discount Merchant", fields: discountFields, append: appendDiscount, remove: removeDiscount, type: 'discount' as const },
              { title: "EMI Merchant", fields: emiFields, append: appendEmi, remove: removeEmi, type: 'emi' as const },
              { title: "BOGO Merchant", fields: bogoFields, append: appendBogo, remove: removeBogo, type: 'bogo' as const }
            ].map(({ title, fields, append, remove, type }) => (
              renderMerchantSection({ title, fields, append, remove, type })
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <h3 className="font-semibold mb-4 text-lg">Fresh Merchant Visit</h3>
              {userVisitFields.map((field, index) => (
                <div key={field.id} className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
                  <div className="flex-grow space-y-2 sm:space-y-0 sm:space-x-2 sm:flex sm:items-center w-full">
                    <Input
                      {...register(`userVisits.${index}.merchantName`)}
                      placeholder="Merchant Name"
                      className="flex-grow"
                    />
                    <Input
                      {...register(`userVisits.${index}.area`)}
                      placeholder="Area"
                      className="w-full sm:w-1/3"
                    />
                    <Controller
                      name={`userVisits.${index}.visitDate`}
                      control={control}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full sm:w-[180px] justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "MMM dd, yyyy") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => field.onChange(getNextValidDate(date || new Date()))}
                              disabled={(date) =>
                                date < new Date() || isFriday(date) || isSaturday(date) || isHoliday(date)
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                  </div>
                  <div className="flex space-x-2 mt-2 sm:mt-0">
                    {userVisitFields.length > 1 && (
                      <Button type="button" onClick={() => removeUserVisit(index)} size="icon" variant="outline" className="h-10 w-10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    {index === userVisitFields.length - 1 && (
                      <Button type="button" onClick={() => appendUserVisit({ merchantName: '', visitDate: getNextValidDate(new Date()), area: '' })} size="sm" variant="outline" className="h-10">
                        <Plus className="h-4 w-4 mr-2" /> Add
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div>
              <h3 className="font-semibold mb-2">Check Collection</h3>
              <Input
                type="number"
                {...register('checkCollection')}
                placeholder="Number of checks collected"
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-lg">Card Collection</h3>
            <div className="space-y-6">
              {['Credit', 'Prepaid', 'Hajj', 'Medical'].map((cardType) => {
                const { fields, append, remove } = useFieldArray({
                  control,
                  name: `${cardType.toLowerCase()}Cards` as "creditCards" | "prepaidCards" | "hajjCards" | "medicalCards"
                });
                return (
                  <div key={cardType} className="space-y-2">
                    <h4 className="text-sm font-medium">{cardType} Card</h4>
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                        <Input
                          {...register(`${cardType.toLowerCase()}Cards.${index}.cardholderName` as const)}
                          placeholder="Cardholder Name"
                          className="flex-grow"
                        />
                        <Input
                          {...register(`${cardType.toLowerCase()}Cards.${index}.phoneNumber` as const)}
                          placeholder="Phone Number"
                          className="w-full sm:w-1/3"
                        />
                        <div className="flex space-x-2 mt-2 sm:mt-0">
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => remove(index)}
                              size="icon"
                              variant="outline"
                              className="h-10 w-10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                          {index === fields.length - 1 && (
                            <Button
                              type="button"
                              onClick={() => append({ cardholderName: '' })}
                              size="sm"
                              variant="outline"
                              className="h-10"
                            >
                              <Plus className="h-4 w-4 mr-2" /> Add
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
      <Button type="submit" className="w-full max-w-3xl mx-auto block">Submit</Button>
    </form>
  )
}

