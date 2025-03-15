import * as FileSystem from 'expo-file-system'

import { getCollectionBases } from './collection_utils'
import { getBaseTracksByName } from '../../../api'

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


export const updateBasesTracks = async () => {
  let offset = 0;
  const limit = 50
  const collectionBases = await getCollectionBases()
  const bases = collectionBases.flatMap((collection) => Object.values(collection).flat())
  for (const base of bases) {
    const basePathName = base.replace(/[^a-zA-Z0-9]/g, '_')
    const basePath = `${FileSystem.documentDirectory}bases/${basePathName}`
    console.log('basePath', basePath)
    const localFiles = await FileSystem.readDirectoryAsync(basePath)
    console.log('localFiles', localFiles)
    while (true) {
      const response = await getBaseTracksByName(base, limit, offset)
      if (response.status === 200) {
        const serverFiles = response.data
        if (serverFiles.length === 0) break
        const serverFileList = serverFiles.map((file) => file.title)
        const deleteExtraFiles = await removeExtraFiles(basePath, localFiles, serverFileList)
        // const downloadMissingFiles = await uploadMissingFiles(basePath, localFiles, serverFileList)
        offset += limit
      } else {
        throw new Error(`Ошибка запроса: ${response.status}`)
      }


    }
    console.log('localFiles', localFiles)
    console.log('serverFiles', serverFiles.data)
  }
  return { 'success': true }
}




const uploadMissingFiles = async (basePath, localTracks, serverTracks) => {
  for (const file of serverTracks) {
    if(!localTracks.includes(file)) {
      'downloading file'
    }
  }
}

const removeExtraFiles = async (basePath, localTracks, serverTracks) => {
  for (const file of localTracks) {
    if (!serverTracks.includes(file)) {
      const filePath = `${basePath}/${file}`
      console.log('filePath', filePath)
      await FileSystem.deleteAsync(filePath, { idempotent: true })
      console.log('file deleted', filePath)
    }
  }
}