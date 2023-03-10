import apiClient from '../../instance'

export interface Args {
   code: string
   name: string
   categoryId: string
}

export async function addItemMutation(
   url: string,
   { arg: { code, name, categoryId } }: Readonly<{ arg: Args }>
) {
   console.log(code, name, categoryId)
   return await apiClient.post(url, {
      code,
      name,
      categoryId,
   })
}
