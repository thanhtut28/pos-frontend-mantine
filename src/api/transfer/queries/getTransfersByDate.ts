import apiClient from '../../instance'

export type TransferItemList = {
   itemId: string
   code: string
   name: string
   category: string
   qty: number
}[]

export enum Status {
   PAID = 'paid',
   UNPAID = 'unpaid',
}

export enum TransferType {
   FROM = 'from',
   TO = 'to',
}

export type GetAllTransfersData = {
   transferId: string
   user: string
   userId: string
   type: TransferType
   createdBy: string
   createdAt: Date
   items: TransferItemList
}[]

export type GetAllTransfersResponse = {
   status: string
   data: GetAllTransfersData
}

export async function getTransfersByDate(url: string, from: string, to: string) {
   if (!from || !to) return

   const { data } = await apiClient.get(`${url}?from=${from}&to=${to}`)
   return data
}
