import { Box, Flex, Text } from '@mantine/core'
import { useHotkeys } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { IconArrowNarrowLeft, IconCheck } from '@tabler/icons-react'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import useSWRMutation from 'swr/mutation'
import { provideSupplyMutation } from '../../../../../api/supply/mutations/provideSupply'
import { UserRole } from '../../../../../api/user/mutations/createUser'
import { useAuth } from '../../../../../lib/contexts/auth-context'
import CustomerForm, { FormValues } from './customer-form'
import InvoiceForm from './invoice-form'
import useStyles from './styles'
import PosTable from './table'

export type Item = {
   no: number
   itemId: string
   code: string
   name: string
   qty: number
   price?: number
   netAmount?: number
}

const AddSupply: React.FC = () => {
   const navigate = useNavigate()
   const { classes } = useStyles()
   const { user } = useAuth()
   const [items, setItems] = useState<Item[]>([])
   const [selectedItem, setSelectedItem] = useState<Item | null>(null)
   const [isEditing, setIsEditing] = useState(false)
   const { trigger: provideSupply, isMutating: providingProvideSupply } = useSWRMutation(
      '/supply',
      provideSupplyMutation
   )

   const backButton = (
      <Box pl="xl">
         <NavLink to="/supplies" className={classes.backLink}>
            <Text>
               <Flex align="center" gap="xs">
                  <IconArrowNarrowLeft size={14} />
                  Back to all supplies
               </Flex>
            </Text>
         </NavLink>
      </Box>
   )

   const handleAddRow = (item: Item) => {
      const existingItemIndex = items.findIndex((it) => it.itemId === item.itemId)

      if (existingItemIndex !== -1) {
         setItems((prev) =>
            prev.map((itm, i) => {
               if (i === existingItemIndex) {
                  const newQty = itm.qty + item.qty
                  const newNetAmount = itm.netAmount! + item.netAmount!

                  return {
                     ...itm,
                     ...(user?.role === UserRole.ADMIN ? { qty: newQty, netAmount: newNetAmount } : {}),
                  }
               }
               return itm
            })
         )
         return
      }
      setItems((prev) => [...prev, item])
   }

   const handleUpdateRow = (item: Item) => {
      const newItems = items.map((it) => {
         if (it.no === item.no) {
            return item
         }
         return it
      })
      setItems(newItems)
      setIsEditing(false)
      setSelectedItem(null)
   }

   const handleSelectItem = (item: Item) => {
      setSelectedItem(item)
      setIsEditing(true)
   }

   const handleDeleteItem = (item: Item) => {
      setItems((prev) => prev.filter((it) => it.no !== item.no))
      if (item.no === selectedItem?.no) {
         setSelectedItem(null)
         setIsEditing(false)
      }
   }

   const cancelUpdate = () => {
      setSelectedItem(null)
      setIsEditing(false)
   }

   const handleCreateInvoice = async (values: FormValues) => {
      const mappedItems = items.map((item) => ({ itemId: item.itemId, qty: item.qty }))
      await provideSupply(
         { ...values, items: mappedItems },
         {
            onSuccess: (data) => {
               showNotification({
                  message: data.data.message,
                  icon: <IconCheck />,
                  color: 'teal',
               })
               const supplyId = data?.data?.data?.supplyId
               navigate(`/supplies/view/${supplyId}`)
            },
         }
      )
   }

   useHotkeys([
      ['ctrl+Enter', () => console.log('saved')],
      ['alt+D', () => console.log('discard')],
   ])

   return (
      <Box p={{ base: 'xs', md: 'xl' }} className={classes.container}>
         {backButton}
         <Flex direction={{ base: 'column-reverse', md: 'column' }}>
            <CustomerForm submitForm={handleCreateInvoice} disabledSaveButton={items.length === 0} />

            <Flex
               direction={{ base: 'column', md: 'row' }}
               align={{ base: 'center', md: 'normal' }}
               gap="xl"
               p="xl"
               w="100%"
            >
               <InvoiceForm
                  addRow={handleAddRow}
                  isEditing={isEditing}
                  item={selectedItem}
                  loading={false}
                  updateRow={handleUpdateRow}
                  newId={items.length > 0 ? items[items.length - 1].no + 1 : 1}
                  cancelUpdate={cancelUpdate}
               />
               <PosTable
                  data={items}
                  loading={false}
                  title="Items"
                  updateRow={handleSelectItem}
                  deleteRow={handleDeleteItem}
                  excludeFields={['itemId']}
               />
            </Flex>
         </Flex>
      </Box>
   )
}

export default AddSupply
