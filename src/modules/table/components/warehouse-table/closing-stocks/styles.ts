import { createStyles } from '@mantine/core'
export default createStyles((theme) => ({
   label: {
      textTransform: 'capitalize',
   },
   item: {
      textTransform: 'capitalize',
   },
   submitButton: {
      width: '100%',
   },
   title: {
      padding: `${theme.spacing.xl}px ${theme.spacing.xs}px`,
   },
   input: {
      width: '100%',
      maxWidth: 300,
   },
   empty: {
      paddingTop: '6rem',
      color: theme.colors.gray[4],
   },
   tableActions: {
      width: '100%',
      border: `1px solid ${theme.colors.gray[3]}`,
      borderBottom: 0,
      borderTopLeftRadius: theme.radius.lg,
      borderTopRightRadius: theme.radius.lg,
   },
   borderBottom: {
      borderBottom: `1px solid ${theme.colors.gray[3]}`,
   },
   table: {
      [' thead']: {
         background: theme.colors.gray[0],
      },
   },
   paginationWrapper: {
      border: `1px solid ${theme.colors.gray[3]}`,
      borderTop: 'none',
      borderBottomLeftRadius: theme.radius.lg,
      borderBottomRightRadius: theme.radius.lg,
   },
}))
