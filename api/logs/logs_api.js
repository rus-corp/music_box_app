import { authBackend, getAccessToken, updateAccessToken } from "../_variables";
import { appLogFileUri, trackLogFileUri } from "../_variables";



export const sendTrackLogs = async () => {
  const updateToken = await updateAccessToken()
  const formData = new FormData()
  formData.append('track_logs', {
    uri: trackLogFileUri,
    name: 'track_logs.txt',
    type: 'text/plain',
  })
  try {
    const response = await authBackend.post(
      '/app_routers/client_tracks_logs/',
      formData,
      {headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${await getAccessToken()}`}
      }
    )
    return response
  } catch (error) {
    return error.response.status
  }
}



export const sendAppLogs = async () => {
  const updateToken = await updateAccessToken()
  const formData = new FormData()
  formData.append('file', {
    uri: appLogFileUri,
    name: 'app_logs.txt',
    type: 'text/plain',
  })
  try {
    const response = await authBackend.post(
      '/app_logs/',
      formData,
      {headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${await getAccessToken()}`
      }}
    )
    return response
  } catch (error) {
    return error.response.status
  }
}