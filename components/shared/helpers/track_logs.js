import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Localization from 'expo-localization'
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


const getAppCurrentTime = () => {
  const timeZone = Localization.getCalendars()[0].timeZone
  const now = new Date()
  const localTime = now.toLocaleString('ru-RU', { timeZone })
  return now.toLocaleString(
    'ru-RU',
    {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }
  )
}

export const appLogFileUri = FileSystem.documentDirectory + 'app_logs.txt'

export const trackLogFileUri = FileSystem.documentDirectory + 'track_logs.txt'

export const appLogToFile = async (message) => {
  const fileInfo = await FileSystem.getInfoAsync(appLogFileUri)
  let exsistingLog = ''
  const timestampData = getAppCurrentTime()
  const timeStamp = timestampData.split(', ')
  const timestamp = `${timeStamp[0]}T${timeStamp[1]}`
  const newLog = `APP LOG ${timestamp} - ${message}\n`
  console.log(`APP LOG ${timestamp} - ${message}`)
  if (fileInfo.exists) {
    exsistingLog = await FileSystem.readAsStringAsync(appLogFileUri, {
      encoding: FileSystem.EncodingType.UTF8
    })
  }
  const updatedLog = exsistingLog + newLog
  try {
    await FileSystem.writeAsStringAsync(appLogFileUri, updatedLog, { encoding: FileSystem.EncodingType.UTF8 })
  } catch (error) {
    console.log('не удалось записать лог приложения')
  }
}

export const trackLogToFile = async (trackName, baseName) => {
  const fileInfo = await FileSystem.getInfoAsync(trackLogFileUri)
  let exsistingLog = ''
  const formatName = trackName.split('/')
  const timestampData = getAppCurrentTime()
  const timeStamp = timestampData.split(', ')
  const timestamp = `${timeStamp[0]}T${timeStamp[1]}`
  const newLog = `${timestamp} - ${formatName[formatName.length - 1]} - ${baseName}\n`
  console.log(`TRack LOG${timestamp} - ${formatName[formatName.length - 1]} - ${baseName}`)
  if (fileInfo.exists) {
    exsistingLog = await FileSystem.readAsStringAsync(trackLogFileUri, {
      encoding: FileSystem.EncodingType.UTF8
    })
  }
  const updatedLog = exsistingLog + newLog
  try {
    await FileSystem.writeAsStringAsync(trackLogFileUri, updatedLog, { encoding: FileSystem.EncodingType.UTF8 })
  } catch (error) {
    console.log('не удалось записать лог трека')
  }
}


export const removeTrackLogFile = async () => {
  try {
    await FileSystem.deleteAsync(trackLogFileUri)
  } catch (error) {
    console.log('не удалось удалить лог трека')
  }
}

export const removeAppLogFile = async () => {
  try {
    await FileSystem.deleteAsync(appLogFileUri)
  } catch (error) {
    console.log('не удалось удалить лог приложения')
  }
}