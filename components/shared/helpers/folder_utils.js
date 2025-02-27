import * as FileSystem from 'expo-file-system'
import AsyncStorage from '@react-native-async-storage/async-storage';


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
}