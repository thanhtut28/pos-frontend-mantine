import {
   Avatar,
   Badge,
   Table,
   Group,
   Text,
   ActionIcon,
   Anchor,
   ScrollArea,
   useMantineTheme,
   Box,
} from '@mantine/core'
import { IconPencil, IconTrash } from '@tabler/icons-react'

interface UsersTableProps {
   data: { avatar: string; name: string; job: string; email: string; phone: string }[]
}

const jobColors: Record<string, string> = {
   engineer: 'blue',
   manager: 'cyan',
   designer: 'pink',
}

export function UsersTable({ data }: UsersTableProps) {
   const theme = useMantineTheme()
   const rows = data.map((item) => (
      <tr key={item.name}>
         <td>
            <Group spacing="sm">
               <Avatar size={30} src={item.avatar} radius={30} />
               <Text size="sm" weight={500}>
                  {item.name}
               </Text>
            </Group>
         </td>

         <td>
            <Badge
               color={jobColors[item.job.toLowerCase()]}
               variant={theme.colorScheme === 'dark' ? 'light' : 'outline'}
            >
               {item.job}
            </Badge>
         </td>
         <td>
            <Anchor<'a'> size="sm" href="#" onClick={(event) => event.preventDefault()}>
               {item.email}
            </Anchor>
         </td>
         <td>
            <Text size="sm" color="dimmed">
               {item.phone}
            </Text>
         </td>
         <td>
            <Group spacing={0} position="right">
               <ActionIcon>
                  <IconPencil size={16} stroke={1.5} />
               </ActionIcon>
               <ActionIcon color="red">
                  <IconTrash size={16} stroke={1.5} />
               </ActionIcon>
            </Group>
         </td>
      </tr>
   ))

   return (
      <ScrollArea sx={{ width: '100%' }}>
         <Box p="md">
            <Text
               fz="lg"
               fw={600}
               sx={(theme) => ({
                  padding: theme.spacing.xs,
                  paddingBottom: theme.spacing.xl,
               })}
            >
               Users Table
            </Text>
            <Table verticalSpacing="sm" sx={{ minWidth: 600 }}>
               <thead>
                  <tr>
                     <th>Employee</th>
                     <th>Job title</th>
                     <th>Email</th>
                     <th>Phone</th>
                     <th />
                  </tr>
               </thead>
               <tbody>{rows}</tbody>
            </Table>
         </Box>
      </ScrollArea>
   )
}
