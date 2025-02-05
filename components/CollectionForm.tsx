'use client'

import { useState, useEffect, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Plus, X, Upload } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { CollectionData, YearMonth } from '@/types/types'
import { mockMerchants } from '@/utils/mockData'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuth } from '@/hooks/useAuth'
import { formatTime } from '@/utils/dateUtils'
import { Textarea } from '@/components/ui/textarea'
import { searchBanks, searchBranches } from '@/utils/searchUtils'
import { addDays, isFriday, isSaturday } from 'date-fns'

type Props = {
  onSubmit: (data: CollectionData) => void
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

export default function CollectionForm({ onSubmit }: Props) {
  const { user } = useAuth()
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const currentYear = new Date().getFullYear()
  const [yearMonths, setYearMonths] = useState<YearMonth[]>([{ year: currentYear.toString(), month: '', billAmount: '' }])
  const [filteredMerchants, setFilteredMerchants] = useState<string[]>([])
  const [filteredBanks, setFilteredBanks] = useState<string[]>([])
  const [filteredBranches, setFilteredBranches] = useState<string[]>([])
  const [collectedAmount, setCollectedAmount] = useState(0)
  const [file, setFile] = useState<File | null>(null)
  const { register, handleSubmit, control, reset, setValue, watch } = useForm<CollectionData>({
    defaultValues: {
      collectionDate: new Date(),
      checkSubmissionDate: new Date(),
      collectionOfficer: user?.name || '',
      region: user?.region || '',
      bankName: '',
      clearingBranch: '',
      memo: '',
      //userVisitDay: getNextValidDate(new Date()),
      checkCollection: '',
      cardCollection: {
        creditCard: '',
        prepaidCard: '',
        hajjCard: '',
        medicalCard: ''
      }
    },
  })

  const merchantName = watch('merchantName')
  const bankName = watch('bankName')
  const clearingBranch = watch('clearingBranch')

  const years = Array.from({ length: currentYear - 2013 + 1 }, (_, i) => (currentYear - i).toString())
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  //const regions = ['Dhaka', 'Chattogram', 'Sylhet']

  useEffect(() => {
    const totalAmount = yearMonths.reduce((sum, ym) => sum + (parseFloat(ym.billAmount) || 0), 0)
    setCollectedAmount(totalAmount)
  }, [yearMonths])

  const handleFormSubmit = async (data: CollectionData) => {
    let fileUrl = ''
    if (file) {
      // In a real application, you would upload the file to a server here
      // and get back a URL. For this example, we'll just use a placeholder.
      fileUrl = URL.createObjectURL(file)
    }

    onSubmit({
      ...data,
      collectionDate: data.collectionDate.toISOString(),
      checkSubmissionDate: data.checkSubmissionDate.toISOString(),
      yearMonth: yearMonths.filter(ym => ym.year && ym.month && ym.billAmount),
      collectedAmount,
      checkNumber: data.checkNumber,
      collectionOfficer: user?.name || '',
      region: user?.region || '',
      fileAttachment: fileUrl,
      //userVisitDay: data.userVisitDay.toISOString()
    })
    setShowSuccessModal(true)
    reset()
    setYearMonths([{ year: currentYear.toString(), month: '', billAmount: '' }])
    setFilteredMerchants([])
    setFilteredBanks([])
    setFilteredBranches([])
    setCollectedAmount(0)
    setFile(null)
  }

  const addYearMonth = () => {
    setYearMonths([...yearMonths, { year: '', month: '', billAmount: '' }])
  }

  const removeYearMonth = (index: number) => {
    setYearMonths(yearMonths.filter((_, i) => i !== index))
  }

  const updateYearMonth = (index: number, field: keyof YearMonth, value: string) => {
    const updatedYearMonths = [...yearMonths]
    updatedYearMonths[index][field] = value
    setYearMonths(updatedYearMonths)
  }

  const handleMerchantSearch = (searchTerm: string) => {
    if (searchTerm.length >= 2) {
      const filtered = mockMerchants.filter(m => 
        m.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredMerchants(filtered)
    } else {
      setFilteredMerchants([])
    }
  }

  const handleBankSearch = useCallback(async (searchTerm: string) => {
    if (searchTerm.length >= 2) {
      const results = await searchBanks(searchTerm)
      setFilteredBanks(results)
    } else {
      setFilteredBanks([])
    }
  }, [])

  const handleBranchSearch = useCallback(async (searchTerm: string) => {
    if (searchTerm.length >= 2) {
      const results = await searchBranches(searchTerm)
      setFilteredBranches(results)
    } else {
      setFilteredBranches([])
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 bg-white p-4 rounded-lg shadow max-w-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="merchantSearch">Search Merchant</Label>
          <Input
            id="merchantSearch"
            placeholder="Type to search merchants..."
            onChange={(e) => handleMerchantSearch(e.target.value)}
          />
          {filteredMerchants.length > 0 && (
            <ul className="mt-1 max-h-40 overflow-auto border border-gray-200 rounded-md">
              {filteredMerchants.map((merchant, index) => (
                <li
                  key={index}
                  className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setValue('merchantName', merchant)
                    setFilteredMerchants([])
                  }}
                >
                  {merchant}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <Label htmlFor="merchantName">Merchant Name</Label>
          <Input id="merchantName" {...register('merchantName', { required: true })} />
        </div>
      </div>

      <div>
        <Label htmlFor="invoiceNumber">Invoice Number</Label>
        <Input id="invoiceNumber" {...register('invoiceNumber', { required: true })} />
      </div>

      <div className="space-y-2">
        <Label>Year and Month</Label>
        {yearMonths.map((ym, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Select value={ym.year} onValueChange={(value) => updateYearMonth(index, 'year', value)}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select 
              value={ym.month} 
              onValueChange={(value) => updateYearMonth(index, 'month', value)}
              disabled={!ym.year}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Bill Amount (৳)"
              value={ym.billAmount}
              onChange={(e) => updateYearMonth(index, 'billAmount', e.target.value)}
              className="w-[120px]"
              disabled={!ym.year || !ym.month}
            />
            {index > 0 && (
              <Button type="button" onClick={() => removeYearMonth(index)} size="icon" variant="ghost">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button type="button" onClick={addYearMonth} size="sm" className="mt-2">
          <Plus className="h-4 w-4 mr-2" /> Add More
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="collectionDate">Collection Date</Label>
          <Controller
            name="collectionDate"
            control={control}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        </div>
        <div>
          <Label htmlFor="collectedAmount">Collected Amount (৳)</Label>
          <Input id="collectedAmount" type="number" value={collectedAmount} readOnly />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="bankName">Bank Name</Label>
          <Input
            id="bankName"
            {...register('bankName', { required: true })}
            onChange={(e) => {
              register('bankName').onChange(e)
              handleBankSearch(e.target.value)
            }}
          />
          {filteredBanks.length > 0 && (
            <ul className="mt-1 max-h-40 overflow-auto border border-gray-200 rounded-md">
              {filteredBanks.map((bank, index) => (
                <li
                  key={index}
                  className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setValue('bankName', bank)
                    setFilteredBanks([])
                  }}
                >
                  {bank}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <Label htmlFor="checkNumber">Check Number</Label>
          <Input id="checkNumber" {...register('checkNumber')} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="clearingBranch">Clearing Branch</Label>
          <Input
            id="clearingBranch"
            {...register('clearingBranch', { required: true })}
            onChange={(e) => {
              register('clearingBranch').onChange(e)
              handleBranchSearch(e.target.value)
            }}
          />
          {filteredBranches.length > 0 && (
            <ul className="mt-1 max-h-40 overflow-auto border border-gray-200 rounded-md">
              {filteredBranches.map((branch, index) => (
                <li
                  key={index}
                  className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setValue('clearingBranch', branch)
                    setFilteredBranches([])
                  }}
                >
                  {branch}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <Label htmlFor="checkSubmissionDate">Check Submission Date</Label>
          <Controller
            name="checkSubmissionDate"
            control={control}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="collectionOfficer">Collection Officer</Label>
        <Input
          id="collectionOfficer"
          value={watch('collectionOfficer')}
          readOnly
          disabled
        />
      </div>

      <div>
        <Label htmlFor="region">Region</Label>
        <Input
          id="region"
          value={watch('region')}
          readOnly
          disabled
        />
      </div>

      <div>
        <Label htmlFor="memo">Memo</Label>
        <Textarea
          id="memo"
          {...register('memo')}
          placeholder="Enter any additional notes or details here"
        />
      </div>

      <div>
        <Label htmlFor="fileAttachment">File Attachment</Label>
        <Input
          id="fileAttachment"
          type="file"
          onChange={handleFileChange}
          accept=".jpg,.jpeg,.png,.pdf"
        />
      </div>


      <Button type="submit" className="w-full">Submit</Button>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
          </DialogHeader>
          <p>Hey, {user?.name}. Your Data submitted successfully!</p>
        </DialogContent>
      </Dialog>
    </form>
  )
}

