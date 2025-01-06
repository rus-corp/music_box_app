import { backend } from "../_variables";


export const downloadAudio = async (trackId) => {
  try {
    const response = await backend.get(
      `/app_routers/download_file/${trackId}`
    )
    return response
  } catch (error) {
    console.error(error)
  }
}