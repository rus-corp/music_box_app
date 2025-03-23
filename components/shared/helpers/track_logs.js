import AsyncStorage from "@react-native-async-storage/async-storage"


const getTrackLogs = async () => {
  const value = await AsyncStorage.getItem('trackLogs')
  return value ? JSON.parse(value) : []
}


const removeTrackLogs = async () => {
  await AsyncStorage.removeItem('trackLogs')
}



export const saveTrackLogsToStorage = async (trackName, baseName) => {
  const trackLogs = await getTrackLogs()
  newValue = [
    ...trackLogs,
    {
      'track_name': trackName,
      'base_name': baseName,
      'log_time': new Date()
    }
  ]
  try {
    await AsyncStorage.setItem('trackLogs', JSON.stringify(newValue))
    return true
  } catch (error) {
    console.log('не удалось сохранить логи трека')
  }
}