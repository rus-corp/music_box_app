import * as FileSystem from 'expo-file-system'


export const createFolder = async(baseName) => {
  const correctName = baseName.replace(/[^a-zA-Z0-9]/g, '_')
  const folderUri = `${FileSystem.documentDirectory}${correctName}/`
  console.log('folderUri', folderUri)
  const folderInfo = await FileSystem.getInfoAsync(folderUri)
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