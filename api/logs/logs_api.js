import { backend } from "../_variables";



export const sendTrackLogs = async (logsData) => {
  try {
    const response = await backend.post(
      '/app_routers/client_tracks_logs/',
      logsData
    )
    return response
  } catch (error) {
    console.log(error)
  }
}