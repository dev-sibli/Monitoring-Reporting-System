export type User = {
  id: string
  name: string
  phoneNumber: string
  region: string
  username: string
  password: string
  role: 'admin' | 'user'
  createdAt?: Date
  updatedAt?: Date
}

export type YearMonth = {
  year: string
  month: string
  billAmount: string
}

export type CommissionEntry = {
  id: string;
  merchantName: string;
  invoiceNumber: string;
  yearMonth: YearMonth[];
  collectedAmount: number;
  collectionDate: string;
  bankName: string;
  checkNumber?: string;
  clearingBranch: string;
  checkSubmissionDate: string;
  collectionOfficer: string;
  region: string;
  memo?: string;
  fileAttachment?: string;
  createdAt: string;
  updatedAt: string;
  userVisitDay: string;
  checkCollection?: string;
  cardCollection: CardCollection;
}

export type EditLog = {
  id: string
  entryId: string
  userId: string
  action: 'create' | 'update' | 'delete'
  timestamp: string
  details: string
}

export type CardCollection = {
  creditCard: number;
  prepaidCard: number;
  hajjCard: number;
  medicalCard: number;
}

export type MerchantRegistration = {
  id: string
  merchantName: string
  type: 'discount' | 'emi' | 'bogo'
  registrationDate: string
  userId: string
}

