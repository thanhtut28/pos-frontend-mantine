import { DateRangePickerValue } from '@mantine/dates'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import {
   GetAllSuppliesData,
   GetAllSuppliesResponse,
   getSuppliesByDate,
} from '../../../../api/supply/queries/getSupplyByDate'
import PosTable from './table'
import { useAuth } from '../../../../lib/contexts/auth-context'
import { UserRole } from '../../../../api/user/mutations/createUser'

const SupplyTable: React.FC = () => {
   const [tblData, setTblData] = useState<GetAllSuppliesData>([])
   const { user } = useAuth()
   const [value, setValue] = useState<DateRangePickerValue>([new Date(), new Date()])
   const dates: any = value.map((value) => value?.toLocaleDateString('en-US'))
   console.log(dates, value)

   const shouldRefetch = dates.every((d: any) => d !== undefined)
   const unselectedDate = dates.every((d: any) => d === undefined)

   const { data, isLoading } = useSWR<GetAllSuppliesResponse>(
      shouldRefetch ? ['/supply', ...dates] : null,
      ([url, from, to]: string[]) => getSuppliesByDate(url, from, to)
   )

   useEffect(() => {
      const tableData =
         data?.data && data?.data.length > 0
            ? data?.data.map((d) => ({
                 supplyId: d.supplyId,
                 supplier: d.supplier,
                 type: d.type,
                 createdBy: d.createdBy,
                 ...(user?.role === UserRole.ADMIN ? { amount: d.amount } : {}),
                 createdAt: d.createdAt,
              }))
            : []
      if (unselectedDate || shouldRefetch) {
         setTblData(tableData)
      }
   }, [data?.data, shouldRefetch, unselectedDate, user?.role])

   return (
      <PosTable
         data={tblData}
         loading={isLoading}
         dateValue={value}
         setDate={setValue}
         title="Supply"
         excludeFields={['items']}
      />
   )
}

export default SupplyTable
