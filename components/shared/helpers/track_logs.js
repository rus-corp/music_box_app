import AsyncStorage from "@react-native-async-storage/async-storage"
import { sendTrackLogs } from "../../../api"
import * as FileSystem from 'expo-file-system'

export const getTrackLogs = async () => {
  // await removeTrackLogs()
  const value = await AsyncStorage.getItem('trackLogs')
  return value ? JSON.parse(value) : []
}


const removeTrackLogs = async () => {
  await AsyncStorage.removeItem('trackLogs')
}



export const saveTrackLogsToStorage = async (trackName, baseName, logTime) => {
  let newValue = []
  const formatName = (str) => str.replace(/_/g, ' ').trim()
  const trackLogs = await getTrackLogs()
  if (trackLogs.length > 5) {
    const response = await sendTrackLogs(trackLogs)
    if (response.status === 201) {
      await removeTrackLogs()
      newValue = [
        {
          'track_name': trackName,
          'base_name': formatName(baseName),
          'log_time': logTime
        }
      ]
    }
  } else {
    newValue = [
      ...trackLogs,
      {
        'track_name': trackName,
        'base_name': formatName(baseName),
        'log_time': logTime
      }
    ]
  }
  try {
    await AsyncStorage.setItem('trackLogs', JSON.stringify(newValue))
    return true
  } catch (error) {
    console.log('не удалось сохранить логи трека')
  }
}

const logFileUri = FileSystem.documentDirectory + 'app_logs.txt'

export const logToFile = async (message) => {
  const timestamp = new Date().toISOString()
  await FileSystem.writeAsStringAsync(logFileUri, `${timestamp} - ${message}\n`, { encoding: FileSystem.EncodingType.UTF8, append: true })
}