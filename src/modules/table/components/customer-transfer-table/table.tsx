import {
   Badge,
   Box,
   Button,
   Flex,
   Loader,
   Pagination,
   ScrollArea,
   Select,
   Table,
   Text,
   TextInput,
} from '@mantine/core'
import { DateRangePicker, DateRangePickerValue } from '@mantine/dates'
import { useDebouncedState } from '@mantine/hooks'
import { IconPackage, IconSearch } from '@tabler/icons-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GetAllCustomerTransfersData } from '../../../../api/customerTransfer/queries/getTransfersByDate'
import { GetAllTransfersData, TransferType } from '../../../../api/transfer/queries/getTransfersByDate'
import useStyles from './styles'

export type Item = Partial<GetAllCustomerTransfersData[0]>

export const CustomerTransferTypeBadges = {
   out: 'blue',
   in: 'teal',
}

export type Badge = keyof typeof CustomerTransferTypeBadges

interface TableProps {
   data: Item[]
   loading: boolean
   title: string
   excludeFields: string[]
   dateValue: DateRangePickerValue
   setDate: React.Dispatch<React.SetStateAction<DateRangePickerValue>>
}

const PosTable: React.FC<TableProps> = ({ data, loading, title, excludeFields, dateValue, setDate }) => {
   const { classes, cx } = useStyles()
   const [activePage, setActivePage] = useState(1)
   const [q, setQ] = useDebouncedState('', 200)
   const query = q.toLowerCase().trim()
   const [typeFilter, setTypeFilter] = useState<string | null>(null)

   const searchedData = data
      .filter((transfer) => transfer.customer?.toLowerCase().includes(query))
      .filter((transfer) => (typeFilter ? transfer.type === typeFilter : transfer))

   const navigate = useNavigate()
   const rowsPerPage = 10
   const endOffset = rowsPerPage * activePage
   const startOffset = endOffset - rowsPerPage
   const paginatedData = searchedData.slice(startOffset, endOffset)

   const total = data.length > 0 ? Math.ceil(data.length / rowsPerPage) : 0

   const columns = ['Customer Transfer Id', 'Type', 'Customer', 'Salesman']
   const transferTypes = Object.values(TransferType).map((type) => ({ label: type, value: type }))

   const rows = paginatedData.map((item) => {
      return (
         <tr key={item.customerTransferId}>
            {Object.entries(item).map(([key, value]) => {
               if (excludeFields.find((field) => field === key)) {
                  return null
               }

               if (
                  key === 'customerType' &&
                  typeof value === 'string' &&
                  value in CustomerTransferTypeBadges
               ) {
                  return (
                     <td key={key}>
                        <Text>
                           <Flex align="center" gap="xs">
                              {CustomerTransferTypeBadges?.[value as Badge]}
                              {value}
                           </Flex>
                        </Text>
                     </td>
                  )
               }

               if (key === 'amount') {
                  return <td key={key} style={{ textAlign: 'right' }}>{`${value.toLocaleString()} Ks`}</td>
               }

               if (value === '') return <td key={key}>-</td>
               return <td key={key}>{`${value}`}</td>
            })}

            <td />
         </tr>
      )
   })

   if (loading)
      return (
         <Flex p="xl" justify="center" align="center" style={{ width: '100%' }}>
            <Loader />
         </Flex>
      )

   return (
      <Box p={{ base: 'sm', sm: 'xl' }}>
         <Box py={{ base: 'xs', xs: 'md' }}>
            <Text fw="bold" fz="xl" className={classes.title}>
               {title}
            </Text>
            <Flex
               className={cx(classes.tableActions, { [classes.borderBottom]: paginatedData.length === 0 })}
               p="lg"
               direction={{ base: 'column', xl: 'row' }}
               gap={{ md: 'sm', base: 'md' }}
            >
               <Flex gap="sm" direction={{ base: 'column', xs: 'row' }} w="100%" sx={{ flex: 1 }}>
                  <DateRangePicker
                     placeholder="Pick dates range"
                     value={dateValue}
                     maxDate={new Date()}
                     sx={{ flex: 1 }}
                     onChange={setDate}
                     size="md"
                  />

                  <Select
                     data={transferTypes}
                     sx={{ flex: 1 / 2 }}
                     size="md"
                     value={typeFilter}
                     onChange={setTypeFilter}
                     allowDeselect
                     classNames={{ label: classes.label, item: classes.label, input: classes.label }}
                  />
               </Flex>

               <Flex
                  direction={{ base: 'column', xs: 'row' }}
                  align={{ xs: 'center' }}
                  gap="sm"
                  w="100%"
                  sx={{ flex: 3 / 4 }}
               >
                  <TextInput
                     icon={<IconSearch size={20} stroke={1.5} />}
                     className={classes.input}
                     placeholder="Search By Customer Name"
                     defaultValue={q}
                     onChange={(e) => setQ(e.currentTarget.value)}
                     radius="md"
                     size="md"
                  />
                  <Button
                     onClick={() => {
                        navigate('/customer/transfers/add')
                     }}
                     h={40}
                     className={classes.addButton}
                  >{`Add ${title}`}</Button>
               </Flex>
            </Flex>
            {paginatedData.length > 0 ? (
               <ScrollArea>
                  <Table miw={1000} fontSize="sm" withBorder verticalSpacing="md" className={classes.table}>
                     <thead key="head">
                        <tr>
                           {columns.map((columnName) => {
                              if (excludeFields.find((field) => field === columnName)) {
                                 return null
                              }
                              if (columnName === 'Amount') {
                                 return (
                                    <th key={columnName} style={{ textAlign: 'right' }}>
                                       {columnName}
                                    </th>
                                 )
                              }
                              return <th key={columnName}>{columnName}</th>
                           })}
                           <th />
                        </tr>
                     </thead>
                     <tbody>{rows}</tbody>
                  </Table>
               </ScrollArea>
            ) : (
               <Flex direction="column" justify="center" align="center" className={classes.empty}>
                  <IconPackage size={56} stroke={1.5} />
                  <Text fz="md">No Data Found</Text>
               </Flex>
            )}
            {total > 1 && (
               <Flex justify="flex-end" align="center" p="lg" className={classes.paginationWrapper}>
                  <Pagination total={total} page={activePage} onChange={setActivePage} />
               </Flex>
            )}
         </Box>
      </Box>
   )
}

export default PosTable

// return (
//    <>
//       <ScrollArea sx={{ width: '100%' }}>
//          <Box p="md">
//             <Text fw="bold" fz="xl" className={classes.title}>
//                {title}
//             </Text>
//             <Flex style={{ width: '100%' }} py="lg" justify="flex-end" align="end">
//                <DateRangePicker
//                   label="Book hotel"
//                   placeholder="Pick dates range"
//                   value={dateValue}
//                   mx="md"
//                   sx={{ width: 300 }}
//                   onChange={setDate}
//                />

//                <Button
//                   onClick={() => {
//                      navigate('/invoices/add')
//                   }}
//                >{`Add ${title}`}</Button>
//             </Flex>
//             {paginatedData.length > 0 ? (
//                <Table sx={{ minWidth: 600 }} striped fontSize="sm" verticalSpacing="sm">
//                   <thead key="head">
//                      <tr>
//                         {columns.map((columnName) => {
//                            if (excludeFields.find((field) => field === columnName)) {
//                               return null
//                            }
//                            return <th key={columnName}>{toSentenceCase(columnName)}</th>
//                         })}
//                         <th />
//                      </tr>
//                   </thead>
//                   <tbody>{rows}</tbody>
//                </Table>
//             ) : (
//                <Flex direction="column" justify="center" align="center" className={classes.empty}>
//                   <IconPackage size={56} stroke={1.5} />
//                   <Text fz="md">No Data Found</Text>
//                </Flex>
//             )}
//          </Box>
//          {total > 1 && (
//             <Flex justify="flex-end" align="center" p="lg">
//                <Pagination total={total} page={activePage} onChange={setActivePage} />
//             </Flex>
//          )}
//       </ScrollArea>
//    </>
// )
