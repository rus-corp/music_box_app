import AsyncStorage from "@react-native-async-storage/async-storage"
import { getClientSheduler } from "../../../api"


const daysData = {
  0: 'Вс',
  1: 'Пн',
  2: 'Вт',
  3: 'Ср',
  4: 'Чт',
  5: 'Пт',
  6: 'Сб'
}

const isCurrentTimeInRange = (from, until, currentTime) => {
  const timeToSeconds = (timeStr) => {
      const [h, m, s] = timeStr.split(':').map(Number)
      return h * 3600 + m * 60 + s
  }
  const fromSeconds = timeToSeconds(from)
  const untilSeconds = timeToSeconds(until)
  const currentTimeSeconds = timeToSeconds(currentTime)

  return currentTimeSeconds >= fromSeconds && currentTimeSeconds <= untilSeconds
}


export const getCurrentSheduler = (shedulerData) => {
  const currentDate = new Date()
  const currentDay = currentDate.getDay()
  const currentTime = currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds()
  for (const sheduleItem of shedulerData) {
    for (const sheduleTime of sheduleItem.sheduler) {
      if (isCurrentTimeInRange(sheduleTime.from_time, sheduleTime.until_time, currentTime) && sheduleTime.week_day === daysData[currentDay]) {
        return sheduleItem.collectionName
      }
    }
  }
  return false
}


export const saveClientSheduler = async (shedulerData) => {
  const clientSheduler = []
  for (const sheduleItem of shedulerData) {
    const collectionName = sheduleItem.collection['name']
    const sheduler = sheduleItem.client_collection_sheduler
    clientSheduler.push({
      collectionName,
      sheduler
    })
  }
  await AsyncStorage.setItem('clientSheduler', JSON.stringify(clientSheduler))
  return clientSheduler
}


const getSavedSheduler = async () => {
  try {
    const value = await AsyncStorage.getItem('clientSheduler')
    return value ? JSON.parse(value) : []
  } catch (error) {
    console.log(error)
  }
}


const checkServerSheduler = (shedulerData) => {
  const isAllShedulerExsist = shedulerData.every(sheduleItem => sheduleItem.client_collection_sheduler.length > 0)
  return isAllShedulerExsist
}


export const deleteSheduler = async () => {
  await AsyncStorage.removeItem('clientSheduler')
}


export const handleCheckClientSheduler = async () => {
  const handleDeleteSheduler = await deleteSheduler()
  const sheduler = await getSavedSheduler()
  if (sheduler.length === 0) {
    const response = await getClientSheduler()
    if (response.status === 200) {
      const newSheduler = await saveClientSheduler(response.data)
      return newSheduler
      // const shedulerExsist = checkServerSheduler(response.data)
      // console.log('shedulerExsist', shedulerExsist)
      // if (!shedulerExsist) {
      //   console.log('')
      //   return false
      // } else {
      //   // await saveClientSheduler(response.data)
      //   console.log('sheduler Saved')
      //   return true
      // }
    }
  }
  return sheduler
}