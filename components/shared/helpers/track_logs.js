import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Localization from 'expo-localization'
import * as FileSystem from 'expo-file-system'
import { appLogFileUri, trackLogFileUri } from "../../../api"


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



export const appLogToFile = async (message) => {
  const fileInfo = await FileSystem.getInfoAsync(appLogFileUri)
  let exsistingLog = ''
  const timestampData = getAppCurrentTime()
  const timeStamp = timestampData.split(', ')
  const timestamp = `${timeStamp[0]}T${timeStamp[1]}`
  const newLog = `${timestamp} - ${message}\n`
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
  console.log('track LOG start write')
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
    console.log('track LOG writed')
  } catch (error) {
    console.log('не удалось записать лог трека')
  }
}


export const removeLogFile = async (fielUri) => {
  try {
    await FileSystem.deleteAsync(fielUri)
  } catch (error) {
    console.log('не удалось удалить log файл')
  }
}


export const readLogs = async (fileUri) => {
  const logData = await FileSystem.readAsStringAsync(fileUri, {
    encoding: FileSystem.EncodingType.UTF8
  })
  const logLines = logData.split('\n')
  console.log('logLines', logLines)
}