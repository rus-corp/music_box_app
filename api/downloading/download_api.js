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


export const getBaseTracksByName = async (baseName) => {
  let responseData = {
    'base_name': baseName,
  }
  try {
    const response = await backend.post(
      '/app_routers/get_base_files_by_base_name/',
      responseData
    )
    return response
  } catch (error) {
    console.error(error)
  }
}