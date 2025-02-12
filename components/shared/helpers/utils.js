import * as FileSystem from 'expo-file-system'
import { getCollectionBases, getBaseTracks, downloadAudio } from '../../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const checkUser = async () => {
  const user = await AsyncStorage.getItem('access_token')
  return user
}

export const checkFolder = async (collectionId, collectionName) => {
  const collectionBases = await getCollectionBases(collectionId);
  let collectionData = [];
  if (collectionBases.status === 200) {
    const responseData = collectionBases.data
    collectionData.push(responseData.track_count)
    for (const base of responseData.base_collection_association) {
      const folderUri = `${FileSystem.documentDirectory}music_box/${base.base_collection['name']}/`
      const folderInfo = await FileSystem.getInfoAsync(folderUri)
      if (!folderInfo.exists) {
        collectionData.push({
          mainBaseId: base['base_collection']['main_base_id'],
          mainBaseName: base['base_collection']['name'],
          exsist: false,
        })
      }
    }
    return collectionData
  }
}

const createFolder = async(baseName) => {
  const folderUri = `${FileSystem.documentDirectory}music_box/${baseName}`
  try {
    await FileSystem.makeDirectoryAsync(folderUri, { intermediates: true })
    return true
  } catch (error) {
    return false
  }
}



export const deleteFolder = async(folderTitle) => {
  const baseDir = FileSystem.documentDirectory;
  const findDir = `${baseDir}music_box/${folderTitle}/`
  const dirInfo = await FileSystem.getInfoAsync(findDir)
  if (dirInfo.exists) {
    await FileSystem.deleteAsync(findDir, { idempotent: true })
    return false
  }
  console.log('deleted folder: ', await FileSystem.readDirectoryAsync(`${baseDir}music_box/`))
  return true
}



export const saveFileToFolder = async(folderName, files) => {
  const collectionDir = `${FileSystem.documentDirectory}music_box/${folderName}/`
  const dirInfo = await FileSystem.getInfoAsync(collectionDir)
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(collectionDir, { intermediates: true })
  }
  for (const file of files) {
    const {title, id } = file
    const fileUri = `${collectionDir}${title}.mp3`
    const result = await FileSystem.downloadAsync(
      `https://music-sol.ru/api/app_routers/download_file/${id}`,
      fileUri
    )
  }
  return collectionDir
}


export const getCollectionFiles = async (collectionName) => {
  const baseDir = FileSystem.documentDirectory
  const collectionDir = `${baseDir}music_box/${collectionName}/`
  const collectionTracks = await FileSystem.readDirectoryAsync(collectionDir)
  return collectionTracks
}


export const getTrackMeta = async (trackUri) => {
  const file = await FileSystem.getInfoAsync(trackUri)
  console.log('file', file)
  return file
}


export const getRandomTrack = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min
}


export const getNextTrackUri = async (trackUri) => {
  const fileInfo = await FileSystem.getInfoAsync(track)
  return fileInfo
}


export const createForderSaveFiles = async(data) => {
  for (baseData of data) {
    if (!baseData.exsist) {
      const folder = await createFolder(baseData.mainBaseName)
      return folder
    }
  }
}



export const downloadTracks = async (baseId) => {
  let downloadedTracksCount = 0
  const baseTracks = await getBaseTracks(baseId)
  const baseTracksCount = baseTracks.data.track_count
  const downloadedTrack = await downloadAudio(track.id)
}