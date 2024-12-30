import { backend } from "../_variables";


export const getClientCollections = async () => {
  try {
    const response = await backend.get(
      '/app_routers/get_client_collection'
    )
    return response
  } catch (error) {
    console.error(error)
  }
}