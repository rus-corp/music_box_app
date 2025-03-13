import { backend } from "../_variables";


export const getClientSheduler = async() => {
  try {
    const response = await backend.get(
      '/app_routers/get_client_sheduler'
    )
    return response
  } catch (error) {
    console.error(error)
  }
}