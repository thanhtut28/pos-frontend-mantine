import { createStyles } from '@mantine/core'

export default createStyles((theme) => ({
   control: {
      fontWeight: 500,
      display: 'block',
      width: '100%',
      textDecoration: 'none',
      padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
      color: theme.colors.red[6],
      fontSize: theme.fontSizes.sm,
      borderRadius: theme.radius.sm,

      '&:hover': {
         backgroundColor: theme.colors.gray[1],
      },
   },

   link: {
      fontWeight: 500,
      display: 'block',
      textDecoration: 'none',
      padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
      paddingLeft: 31,
      marginLeft: 30,
      fontSize: theme.fontSizes.sm,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
      borderLeft: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,

      '&:hover': {
         backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
         color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      },
   },

   footer: {
      borderTop: `1px solid ${theme.colors.gray[3]}`,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.md,
   },

   logo: {
      backgroundColor: theme.colors.gray[1],
   },
}))
