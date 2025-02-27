import AsyncStorage from "@react-native-async-storage/async-storage"
import { deleteFolder } from "./folder_utils"
import * as FileSystem from 'expo-file-system'



export const saveCollections = async (collectionNames) => {
  try {
    const value = await AsyncStorage.getItem('clientCollections')
    let collections = value ? JSON.parse(value) : []
    for (const collectionName of collectionNames) {
      collections.push(collectionName)
      await AsyncStorage.setItem('clientCollections', JSON.stringify(collections))
    }
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


export const clearApp = async () => {
  console.log('clearApp')
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
  await AsyncStorage.removeItem('clientCollections')
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