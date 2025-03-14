import * as FileSystem from 'expo-file-system'


export const createFolder = async(baseName) => {
  const correctName = baseName.replace(/[^a-zA-Z0-9]/g, '_')
  const folderUri = `${FileSystem.documentDirectory}bases/${correctName}/`
  const folderInfo = await FileSystem.getInfoAsync(folderUri)
  if (!folderInfo.exists) {
    try {
      await FileSystem.makeDirectoryAsync(folderUri, { intermediates: true })
      console.log('createdFolderUri', folderUri)
    } catch (error) {
      сonsole.error(error)
    }
    return folderUri
  } else {
    return folderInfo.uri
  }
}


export const updateBasesTracks = async () => {}