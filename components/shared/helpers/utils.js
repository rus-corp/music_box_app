import * as FileSystem from 'expo-file-system'
import { getCollectionBases, getBaseTracks, downloadAudio } from '../../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const checkUser = async () => {
  const user = await AsyncStorage.getItem('access_token')
  return user
}

export const checkFolder = async (collectionName) => {
  try {
    const clientCollections = await AsyncStorage.getItem('clientCollections')
    if (!clientCollections) return false
    const clientCollectionsParse = JSON.parse(clientCollections)
    const collection = clientCollectionsParse.find(item => item.name === collectionName)
    if (!collection) return false
    const folderCheck = await Promise.all(
      collection.base_collection_association.map(async (base) => {
        const baseName = base.base_collection.name
        const correctName = baseName.replace(/[^a-zA-Z0-9]/g, '_')
        const folderUri = `${FileSystem.documentDirectory}${correctName}/`
        const folderInfo = await FileSystem.getInfoAsync(folderUri)
        return folderInfo.exists
      })
    )
    const allFolderExists = folderCheck.every(exists => exists)
    return allFolderExists;
  } catch (error) {
    console.log(error)
    return false
  }
  // const cleintCollections = await AsyncStorage.getItem('clientCollections')
  // const clientCollectionsParse = JSON.parse(cleintCollections)
  // console.log('clientCollectionsParse', clientCollectionsParse)
  // let collectionBases = []
  // for (const collection of clientCollectionsParse) {
  //   if (collection.name === collectionName) {
  //     for (const collectionBase of collection.base_collection_association) {
  //       const baseName = collectionBase.base_collection.name
  //       const correctName = baseName.replace(/[^a-zA-Z0-9]/g, '_')
  //       const folderUri = `${FileSystem.documentDirectory}${correctName}/`
  //       const folderInfo = await FileSystem.getInfoAsync(folderUri)
  //       if (folderInfo.exists) {
  //       }
  //       collectionBases.push({
  //         mainBaseName: correctName,
  //         exsist: folderInfo.exists,
  //       })
  //       console.log('collectionBases', collectionBases)
  //     }
  //   }
  // }
}

export const createFolder = async(baseName) => {
  console.log('baseName', baseName)
  const correctName = baseName.replace(/[^a-zA-Z0-9]/g, '_')
  console.log('correctName', correctName)
  const folderUri = `${FileSystem.documentDirectory}${correctName}/`
  console.log('folderUri', folderUri)
  const folderInfo = await FileSystem.getInfoAsync(folderUri)
  console.log('folderInfo', folderInfo)
  if (!folderInfo.exists) {
    try {
      await FileSystem.makeDirectoryAsync(folderUri, { intermediates: true })
      console.log('createdFolderUri',)
    } catch (error) {
      сonsole.error(error)
    }
    return folderUri
  } else {
    return folderInfo.uri
  }
}



export const deleteFolder = async(folderTitle) => {
  console.log('delete folderTitle', folderTitle)
  const baseDir = FileSystem.documentDirectory;
  const findDir = `${baseDir}${folderTitle}/`
  const dirInfo = await FileSystem.getInfoAsync(findDir)
  if (dirInfo.exists) {
    await FileSystem.deleteAsync(findDir, { idempotent: true })
    return false
  }
  console.log('deleted folder: ', await FileSystem.readDirectoryAsync(`${baseDir}music_box/`))
  return true
}



export const saveFileToFolder = async(folderUri, filesList) => {
  // const collectionDir = `${FileSystem.documentDirectory}music_box/${folderName}/`
  const dirInfo = await FileSystem.getInfoAsync(folderUri)
  let downloadTrackCount = 0
  let errorDownloadTrackCount = 0
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(folderUri, { intermediates: true })
  }
  for (const file of filesList) {
    console.log('file', file)
    const {title, id } = file
    console.log('title', title)
    const fileUri = `${folderUri}/${title}.mp3`
    console.log('fileUri', fileUri)
    try {
      console.log('track download', title)
      const result = await FileSystem.downloadAsync(
        `https://music-sol.ru/api/app_routers/download_file/${id}`,
        fileUri
      )
      downloadTrackCount += 1
    } catch (e) {
      console.error(e)
      errorDownloadTrackCount += 1
    }
  }
  return {
    'downloadTrackCount': downloadTrackCount,
    'errorDownloadTrackCount': errorDownloadTrackCount
  }
}


export const getCollectionFiles = async (collectionTitle) => {
  const clientCollectionsJson = await AsyncStorage.getItem('clientCollections')
  const clientCollectionParse = JSON.parse(clientCollectionsJson)
  let tracks = []
  for (const collection of clientCollectionParse) {
    if (collection.name === collectionTitle) {
      for (const base of collection.base_collection_association) {
        const baseName = base.base_collection.name
        const correctName = baseName.replace(/[^a-zA-Z0-9]/g, '_')
        const baseDir = `${FileSystem.documentDirectory}${correctName}/`
        const baseTracks = await FileSystem.readDirectoryAsync(baseDir)
        tracks = [...tracks, ...baseTracks]
      } 
      return tracks
    }
  }
}


export const getRandomTrack = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min
}


export const getNextTrackUri = async (trackUri) => {
  const fileInfo = await FileSystem.getInfoAsync(trackUri)
  return fileInfo
}




export const getStartTrackList = async() => {
  const clientCollectionsJson = await AsyncStorage.getItem('clientCollections')
  const clientCollectionParse = JSON.parse(clientCollectionsJson)
  let tracks = []
  for (const collection of clientCollectionParse) {
    for (const base of collection.base_collection_association) {
      console.log('base', base.base_collection.name)
      console.log('track quantity', base.track_quantity)
      const baseName = base.base_collection.name
      const correctName = baseName.replace(/[^a-zA-Z0-9]/g, '_')
      const baseDir = `${FileSystem.documentDirectory}${correctName}/`
      const baseTracks = await FileSystem.readDirectoryAsync(baseDir)
      tracks = [...tracks, ...baseTracks]
    }
  }
  return tracks
}