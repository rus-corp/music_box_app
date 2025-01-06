import * as FileSystem from 'expo-file-system'

export const checkFolder = async (folderName) => {
  const folderUri = `${FileSystem.documentDirectory}${folderName}/`
  const folderInfo = await FileSystem.getInfoAsync(folderUri)
  return folderInfo.exists
}


export const createFolder = async (folderName) => {
  const folderUri = `${FileSystem.documentDirectory}${folderName}/`;
  const exsist = await checkFolder(folderName)
  if (!exsist) {
    await FileSystem.makeDirectoryAsync(folderUri, { intermediates: true })
  }
  return true
}