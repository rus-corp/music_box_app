import * as FileSystem from 'expo-file-system'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { appLogToFile } from './track_logs';

export const deleteFolder = async(folderTitle) => {
  console.log('delete folderTitle', folderTitle)
  const baseDir = FileSystem.documentDirectory;
  const findDir = `${baseDir}bases/${folderTitle}/`
  const dirInfo = await FileSystem.getInfoAsync(findDir)
  console.log('dirInfo', dirInfo)
  if (dirInfo.exists) {
    await FileSystem.deleteAsync(findDir, { idempotent: true })
    return false
  }
  console.log('deleted folder: ', await FileSystem.readDirectoryAsync(`${baseDir}`))
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



export const checkCollectionFolders = async () =>{
  await appLogToFile('checkCollectionFolders func')
  const folderInfoResponse = []
  const clientCollections = await AsyncStorage.getItem('clientCollections')
  const clientCollectionParse = JSON.parse(clientCollections)
  for (const collection of clientCollectionParse) {
    for (const base of collection.base_collection_association) {
      await appLogToFile(`check folder bases ${JSON.stringify(base)}`)
      const baseName = base.base_collection.name.replace(/[^a-zA-Z0-9]/g, '_')
      const baseDir = `${FileSystem.documentDirectory}bases/${baseName}/`
      const folderInfo = await FileSystem.getInfoAsync(baseDir)
      await appLogToFile(`folderInfo ${baseDir}:${JSON.stringify(folderInfo)}`)
      folderInfoResponse.push({
        'baseName': baseName,
        'folderInfo': folderInfo.exists
      })
    }
  }
  await appLogToFile(`checkCollectionFolders response ${JSON.stringify(folderInfoResponse)}`)
  return folderInfoResponse
}


