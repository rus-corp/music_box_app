import AsyncStorage from "@react-native-async-storage/async-storage"
import { deleteFolder } from "./folder_utils"
import { deleteSheduler } from "./sheduler_utils"
import * as FileSystem from 'expo-file-system'



const deleteClientCollections = async() => {
  const savedCollections = await AsyncStorage.getItem('clientCollections')
  if (savedCollections) {
    await AsyncStorage.removeItem('clientCollections')
    return true
  } else {
    return false
  }
}

export const saveCollections = async (collectionData) => {
  let collections = []
  try {
    for (const collectionItem of collectionData) {
      collections.push(collectionItem)
    }
    await AsyncStorage.setItem('clientCollections', JSON.stringify(collections))
    return collections
  } catch (error) {
    console.log(error)
  }
}


export const getSavedCollections = async () => {
  try {
    const value = await AsyncStorage.getItem('clientCollections')
    return value ? JSON.parse(value) : []
  } catch (error) {
    console.log(error)
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
        const baseDir = `${FileSystem.documentDirectory}bases/${correctName}/`
        const baseTracks = await FileSystem.readDirectoryAsync(baseDir)
        console.log('baseTracks', baseTracks)
        tracks = [...tracks, ...baseTracks]
      } 
      return tracks
    }
  }
}

export const clearApp = async () => {
  // console.log('clearApp')
  // const baseDir = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory)
  // await deleteFolder('bases')
  // const afterbaseDir = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory)
  // console.log('baseDir', baseDir)
  // console.log('afterbaseDir', afterbaseDir)
  const clientCollections = await AsyncStorage.getItem('clientCollections')
  const clientCollectionsParse = JSON.parse(clientCollections)
  console.log('clientCollectionsParse', clientCollectionsParse)
  for (const collection of clientCollectionsParse) {
    console.log('collection', collection)
    for (const base of collection.base_collection_association) {
      const baseName = base.base_collection.name
      const correctName = baseName.replace(/[^a-zA-Z0-9]/g, '_')
      console.log('baseName', correctName)
      await deleteFolder(correctName)
    }
  }
  const deletedCollections = await deleteClientCollections()
  const deletedSheduler = await deleteSheduler()
  console.log('deletedCollections', deletedCollections)
}