import {
   ActionIcon,
   Badge,
   Box,
   Button,
   Flex,
   Group,
   Loader,
   Pagination,
   ScrollArea,
   Table,
   Text,
} from '@mantine/core'
import { openModal, closeModal } from '@mantine/modals'
import { IconPencil, IconTrash } from '@tabler/icons-react'
import { useCallback, useEffect, useState } from 'react'
import { CustomerType } from '../../../../api/customer/queries/getAllCustomers'
import { toSentenceCase } from '../../../../helpers/conver-title'
import FormModal from '../form-modal'
import useStyles from './styles'

export type Badge = { isBadge: boolean; color: string; value: CustomerType }

export type Item = {
   [key: string]: string | number | Date | Badge
}

interface TableProps {
   data?: Item[]
   loading: boolean
   formSubmitting: boolean
   title: string
   action: { update?: boolean; delete?: boolean }
   forms: {
      [key: string]: {
         title?: string
         value: string | number | Date | { label: string; value: string }[]
         addRequired: boolean
         updateRequired: boolean
      }
   }
   excludeFields: string[]
   updateRow: (values: { [key: string]: unknown }) => void
   addRow: (values: { [key: string]: unknown }) => void
   refetch: () => void
}

const PosTable: React.FC<TableProps> = ({
   data,
   loading,
   formSubmitting,
   title,
   action,
   forms,
   excludeFields,
   updateRow,
   addRow,
   refetch,
}) => {
   const { classes } = useStyles()
   const [isEditing, setIsEditing] = useState(false)
   const [openActionForm, setOpenActionForm] = useState(false)
   const [item, setItem] = useState<Item | null>(null)
   const [activePage, setActivePage] = useState(1)
   const rowsPerPage = 3
   const endOffset = rowsPerPage * activePage
   const startOffset = endOffset - rowsPerPage
   const total = data && data.length > 0 ? Math.ceil(data.length / rowsPerPage) : 0

   const paginatedData = data?.slice(startOffset, endOffset)

   const openUpdateFormModal = (item: Item) => {
      setOpenActionForm(true)
      setIsEditing(true)
      setItem(item)
   }

   const closeFormModal = useCallback(() => {
      setIsEditing(false)
      setItem(null)
      closeModal(title)
   }, [title])

   const handleAdd = useCallback(
      async <T extends { [key: string]: unknown }>(values: T) => {
         addRow(values)
         closeFormModal()
         refetch()
      },
      [addRow, closeFormModal, refetch]
   )

   const handleUpdate = useCallback(
      async <T extends { [key: string]: unknown }>(values: T) => {
         updateRow(values)
         closeFormModal()
         refetch()
      },
      [closeFormModal, refetch, updateRow]
   )

   useEffect(() => {
      if (openActionForm) {
         if (isEditing && item) {
            openModal({
               title: `${isEditing ? 'Update' : 'Add'} ${title}`,
               modalId: title,
               children: (
                  <FormModal
                     forms={forms}
                     item={item}
                     isEditing={isEditing}
                     loading={formSubmitting}
                     updateRow={handleUpdate}
                     addRow={() => {}}
                  />
               ),
               centered: true,
               size: 'sm',

               onClose: () => {
                  setOpenActionForm(false)
                  setIsEditing(false)
                  setItem(null)
               },
            })
            return
         }

         openModal({
            title: `${isEditing ? 'Update' : 'Add'} ${title}`,
            modalId: title,
            children: (
               <FormModal
                  forms={forms}
                  item={null}
                  isEditing={isEditing}
                  loading={formSubmitting}
                  updateRow={() => {}}
                  addRow={handleAdd}
               />
            ),
            centered: true,
            size: 'sm',
            overflow: 'inside',
            onClose: () => {
               setOpenActionForm(false)
            },
         })
      }
   }, [
      isEditing,
      item,
      forms,
      handleUpdate,
      title,
      closeFormModal,
      openActionForm,
      handleAdd,
      formSubmitting,
   ])

   const columns = Object.keys(data?.[0] || {})

   const rows = paginatedData?.map((item) => {
      return (
         <tr key={Math.random().toString()}>
            {Object.entries(item).map(([key, value]) => {
               if (excludeFields.find((field) => field === key)) {
                  return null
               }
               if (typeof value === 'object' && 'isBadge' in value && value.isBadge) {
                  return (
                     <td key={value.value}>
                        <Badge color={value.color}>{value.value}</Badge>
                     </td>
                  )
               }
               if (value === '') return <td key={key}>-</td>
               return <td key={key}>{`${value}`}</td>
            })}

            <td>
               <Group spacing={0} position="right">
                  {action?.update && (
                     <ActionIcon onClick={() => openUpdateFormModal(item)}>
                        <IconPencil size={16} stroke={1.5} />
                     </ActionIcon>
                  )}

                  {action?.delete && (
                     <ActionIcon color="red">
                        <IconTrash size={16} stroke={1.5} />
                     </ActionIcon>
                  )}
               </Group>
            </td>
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
      <>
         <ScrollArea sx={{ width: '100%' }}>
            <Box p="md">
               <Text fw="bold" fz="md" className={classes.title}>
                  {title}
               </Text>
               <Flex style={{ width: '100%' }} py="lg" justify="flex-end" align="center">
                  <Button onClick={() => setOpenActionForm(true)}>{`Add ${title}`}</Button>
               </Flex>
               {data && data.length > 0 ? (
                  <Table sx={{ minWidth: 600 }} striped fontSize="sm" verticalSpacing="sm">
                     <thead key="head">
                        <tr>
                           {columns.map((columnName) => {
                              if (excludeFields.find((field) => field === columnName)) {
                                 return null
                              }
                              return <th key={columnName}>{toSentenceCase(columnName)}</th>
                           })}
                           <th />
                        </tr>
                     </thead>
                     <tbody>{rows}</tbody>
                  </Table>
               ) : (
                  <Text>No Data found</Text>
               )}
            </Box>
            {total > 1 && (
               <Flex justify="flex-end" align="center" p="lg">
                  <Pagination total={total} page={activePage} onChange={setActivePage} />
               </Flex>
            )}
         </ScrollArea>
      </>
   )
}

export default PosTable
