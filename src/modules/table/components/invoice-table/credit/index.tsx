import { DateRangePickerValue } from '@mantine/dates'
import { showNotification } from '@mantine/notifications'
import { IconCheck } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { updateInvoiceMutation } from '../../../../../api/invoice/mutations/updateInvoice'
import {
   GetAllCreditInvoicesData,
   GetAllCreditInvoicesResponse,
   getCreditInvoicesByDate,
} from '../../../../../api/invoice/queries/getCreditInvoiceByDate'
import PosTable from './table'

const CreditInvoiceTable: React.FC = () => {
   const [tblData, setTblData] = useState<GetAllCreditInvoicesData>([])
   const [value, setValue] = useState<DateRangePickerValue>([new Date(), new Date()])
   const dates: any = value.map((value) => value?.toLocaleDateString('en-US'))

   const shouldRefetch = dates.every((d: any) => d !== undefined)
   const unselectedDate = dates.every((d: any) => d === undefined)

   const {
      data,
      isLoading,
      mutate: refetch,
   } = useSWR<GetAllCreditInvoicesResponse>(
      shouldRefetch ? ['/invoice/credit', ...dates] : null,
      ([url, from, to]: string[]) => getCreditInvoicesByDate(url, from, to)
   )

   const { trigger: updateInvoice, isMutating: updatingInvoice } = useSWRMutation(
      '/invoice/status',
      updateInvoiceMutation
   )

   useEffect(() => {
      const tableData =
         data?.data && data?.data.length > 0
            ? data?.data.map((d) => ({
                 invoiceId: d.invoiceId,
                 customer: d.customer,
                 status: d.status,
                 createdBy: d.createdBy,
                 createdAt: d.createdAt,
                 receivedBy: d.receivedBy,
                 receivedAt: d.receivedAt,
                 amount: d.amount,
              }))
            : []
      if (unselectedDate || shouldRefetch) {
         setTblData(tableData)
      }
   }, [data?.data, shouldRefetch, unselectedDate])

   const handleUpdateInvoice = async (invoiceId: string) => {
      await updateInvoice(
         { invoiceId },
         {
            onSuccess: (data) => {
               showNotification({
                  message: data.data.message,
                  icon: <IconCheck />,
                  color: 'teal',
               })
               refetch()
            },
         }
      )
   }

   return (
      <PosTable
         data={tblData}
         loading={isLoading || updatingInvoice}
         dateValue={value}
         setDate={setValue}
         title="Credit Invoices"
         excludeFields={[]}
         updateInvoice={handleUpdateInvoice}
      />
   )
}

export default CreditInvoiceTable
