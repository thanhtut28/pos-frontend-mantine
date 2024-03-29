import {
   ActionIcon,
   Box,
   Button,
   Flex,
   Group,
   Loader,
   Pagination,
   ScrollArea,
   Table,
   Text,
   TextInput,
} from '@mantine/core'
import { useDebouncedState } from '@mantine/hooks'
import { closeModal, openModal } from '@mantine/modals'
import { IconCoin, IconPackage, IconPencil, IconSearch } from '@tabler/icons-react'
import { useCallback, useEffect, useState } from 'react'
import { GetAllCategoriesResponse } from '../../../../api/category/queries/getAllCategories'
import { GetAllItemsData } from '../../../../api/item/queries/getAllItems'
import { toSentenceCase } from '../../../../helpers/conver-title'
import FormModal from './form-modal'
import PriceFormModal from './price-form-modal'
import useStyles from './styles'
import { CSVLink } from 'react-csv'

export type Item = Partial<GetAllItemsData[0]>

interface TableProps {
   data: Item[]
   loading: boolean
   formSubmitting: boolean
   updatingPrice: boolean
   title: string
   categoriesData: GetAllCategoriesResponse | undefined
   //    forms: {
   //       [key: string]: {
   //          title?: string
   //          value: string | number | Date | { label: string; value: string }[]
   //          addRequired: boolean
   //          updateRequired: boolean
   //       }
   //    }
   excludeFields: string[]
   updateRow: (values: { [key: string]: unknown }) => Promise<void>
   updatePrice: (values: { [key: string]: unknown }) => Promise<void>
   addRow: (values: { [key: string]: unknown }) => Promise<void>
   refetch: () => Promise<void>
}

const PosTable: React.FC<TableProps> = ({
   data,
   loading,
   categoriesData,
   formSubmitting,
   title,
   excludeFields,
   updateRow,
   updatePrice,
   updatingPrice,
   addRow,
   refetch,
}) => {
   const { classes, cx } = useStyles()
   const [isEditing, setIsEditing] = useState(false)
   const [openEditForm, setOpenEditForm] = useState(false)
   const [openEditPriceForm, setOpenEditPriceForm] = useState(false)
   const [item, setItem] = useState<Item | null>(null)
   const [activePage, setActivePage] = useState(1)
   const [q, setQ] = useDebouncedState('', 200)

   const rowsPerPage = 8
   const endOffset = rowsPerPage * activePage
   const startOffset = endOffset - rowsPerPage
   const query = q.toLowerCase().trim()
   const searchedData = data.filter((item) => item.name?.toLowerCase().includes(query))
   const paginatedData = searchedData.slice(startOffset, endOffset)
   const total = searchedData.length > 0 ? Math.ceil(searchedData.length / rowsPerPage) : 0

   const currencyRows = ['purchasingPrice', 'retailPrice', 'wholesalesPrice']
   const numberRows = [...currencyRows]

   const columns = Object.keys(data[0] || {})

   const rows = paginatedData?.map((item) => {
      return (
         <tr key={Math.random().toString()}>
            {Object.entries(item).map(([key, value]) => {
               if (excludeFields.find((field) => field === key)) {
                  return null
               }

               if (value === '') return <td key={key}>-</td>
               return (
                  <td
                     key={key}
                     className={cx({
                        [classes.number]: numberRows.includes(key),
                     })}
                  >{`${currencyRows.includes(key) ? `${value.toLocaleString()} Ks` : `${value}`}`}</td>
               )
            })}

            <td>
               <Group spacing={10} position="right">
                  <ActionIcon onClick={() => openUpdateFormModal(item)}>
                     <IconPencil size={16} stroke={1.5} />
                  </ActionIcon>

                  <ActionIcon onClick={() => openUpdatePriceFormModal(item)}>
                     <IconCoin size={16} stroke={1.5} />
                  </ActionIcon>
               </Group>
            </td>
         </tr>
      )
   })

   const openUpdateFormModal = (item: Item) => {
      setOpenEditForm(true)
      setIsEditing(true)
      setItem(item)
   }

   const openUpdatePriceFormModal = (item: Item) => {
      setOpenEditPriceForm(true)
      setIsEditing(true)
      setItem(item)
   }

   const handleAdd = useCallback(
      async <T extends { [key: string]: unknown }>(values: T) => {
         await addRow(values)
         await refetch()
         closeModal(title)
      },
      [addRow, refetch, title]
   )

   const handleUpdate = useCallback(
      async <T extends { [key: string]: unknown }>(values: T) => {
         await updateRow(values)
         await refetch()
         closeModal(title)
      },
      [refetch, title, updateRow]
   )

   const handleUpdatePrice = useCallback(
      async <T extends { [key: string]: unknown }>(values: T) => {
         await updatePrice(values)
         await refetch()
         closeModal(`${title}-price`)
      },
      [refetch, title, updatePrice]
   )

   useEffect(() => {
      if (openEditForm) {
         if (isEditing && item) {
            openModal({
               title: `${isEditing ? 'Update' : 'Add'} ${title}`,
               modalId: title,
               children: (
                  <FormModal
                     item={item}
                     categoriesData={categoriesData}
                     isEditing={isEditing}
                     loading={formSubmitting}
                     updateRow={handleUpdate}
                     addRow={async () => {}}
                  />
               ),
               centered: true,
               size: 'sm',

               onClose: () => {
                  setOpenEditForm(false)
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
                  item={null}
                  categoriesData={categoriesData}
                  isEditing={isEditing}
                  loading={formSubmitting}
                  updateRow={async () => {}}
                  addRow={handleAdd}
               />
            ),
            centered: true,
            size: 'sm',
            overflow: 'inside',
            onClose: () => {
               setOpenEditForm(false)
            },
         })
      }
   }, [isEditing, item, handleUpdate, title, openEditForm, handleAdd, formSubmitting, categoriesData])

   useEffect(() => {
      if (openEditPriceForm && item) {
         openModal({
            title: 'Update Price',
            modalId: `${title}-price`,
            children: <PriceFormModal item={item} loading={updatingPrice} updatePrice={handleUpdatePrice} />,
            centered: true,
            size: 'sm',

            onClose: () => {
               setOpenEditPriceForm(false)
               setIsEditing(false)
               setItem(null)
            },
         })
      }
   }, [handleUpdatePrice, item, openEditPriceForm, title, updatingPrice])

   if (loading)
      return (
         <Flex p="xl" justify="center" align="center" style={{ width: '100%' }}>
            <Loader />
         </Flex>
      )

   return (
      <Box p={{ base: 'sm', sm: 'xl' }}>
         <Box pt={{ base: 'xs', xs: 'md' }}>
            <Flex justify="space-between" align="center">
               <Text fw="bold" fz="xl" className={classes.title}>
                  {title}
               </Text>
               <Button variant="outline" disabled={searchedData.length === 0}>
                  <CSVLink
                     data={searchedData}
                     style={{ textDecoration: 'none', color: 'inherit' }}
                     filename={`items-table.csv`}
                  >
                     Export
                  </CSVLink>
               </Button>
            </Flex>

            <Flex
               className={cx(classes.tableActions, { [classes.borderBottom]: paginatedData.length === 0 })}
               p="lg"
               justify="flex-end"
               align={{ xs: 'stretch', base: 'flex-start' }}
               direction={{ xs: 'row', base: 'column-reverse' }}
               gap={{ xs: 0, base: 'md' }}
            >
               <TextInput
                  icon={<IconSearch size={20} stroke={1.5} />}
                  mx={{ base: 0, xs: 'md' }}
                  className={classes.input}
                  placeholder="Search By Item Name"
                  defaultValue={q}
                  onChange={(e) => setQ(e.currentTarget.value)}
                  size="md"
                  radius="md"
               />
               <Button h={40} onClick={() => setOpenEditForm(true)}>{`Add ${title}`}</Button>
            </Flex>
            {paginatedData.length > 0 ? (
               <ScrollArea>
                  <Table miw={800} fontSize="sm" withBorder verticalSpacing="md" className={classes.table}>
                     <thead key="head">
                        <tr>
                           {columns.map((columnName) => {
                              if (excludeFields.find((field) => field === columnName)) {
                                 return null
                              }
                              return (
                                 <th
                                    key={columnName}
                                    {...(numberRows.includes(columnName)
                                       ? { style: { textAlign: 'right' } }
                                       : {})}
                                 >
                                    {toSentenceCase(columnName)}
                                 </th>
                              )
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
         </Box>
         {total > 1 && (
            <Flex justify="flex-end" align="center" p="lg" className={classes.paginationWrapper}>
               <Pagination total={total} page={activePage} onChange={setActivePage} />
            </Flex>
         )}
      </Box>
   )
}

export default PosTable
