import { createStyles } from '@mantine/core'

export default createStyles((theme) => ({
   header: {
      padding: theme.spacing.md,
      width: '100%',
      paddingTop: 0,
      marginLeft: -theme.spacing.md,
      marginRight: -theme.spacing.md,
      color: theme.black,
      borderBottom: `1px solid ${theme.colors.gray[3]}`,
   },
}))
