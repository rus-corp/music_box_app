import * as FileSystem from 'expo-file-system'



export const checkFolder = async (folderName) => {
  const folderUri = `${FileSystem.documentDirectory}music_box/${folderName}/`
  const folderInfo = await FileSystem.getInfoAsync(folderUri)
  return folderInfo.exists
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



