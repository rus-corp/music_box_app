import * as FileSystem from 'expo-file-system'

import { getCollectionBases } from './collection_utils'
import { getBaseTracksByName } from '../../../api'

import { saveFileByName } from './tracks_utils'


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
  const collectionBases = await getCollectionBases()
  console.log('collectionBases', collectionBases)
  const bases = collectionBases.flatMap((collection) => Object.values(collection).flat())
  console.log('bases', bases)
  for (const base of bases) {
    const basePathName = base.replace(/[^a-zA-Z0-9]/g, '_')
    const basePath = `${FileSystem.documentDirectory}bases/${basePathName}/`
    console.log('basePath', basePath)
    const localFiles = await FileSystem.readDirectoryAsync(basePath)
    console.log('localFiles', localFiles)
    const response = await getBaseTracksByName(base)
    console.log('response', response.data)
    const serverTracksTitle = response.data.map((track) => `${track.title}.mp3`)
    console.log('serverTracksTitle', serverTracksTitle)
    const needDownloadTracks = checkFileToDownload(localFiles, serverTracksTitle) 
    const needRemoveTracks = checkFileToRemove(localFiles, serverTracksTitle)
    console.log('needDownloadTracks', needDownloadTracks)
    console.log('needRemoveTracks', needRemoveTracks)
    if (needRemoveTracks.length > 0) {
      const removeFiles = await removeExtraFiles(basePath, needRemoveTracks)
    }
    if (needDownloadTracks.length > 0) {
      const downloadFiles = await uploadMissingFiles(basePath, needDownloadTracks)
    }
  }
  return { 'downloadTracks': needDownloadTracks, 'deletedTracks': needRemoveTracks }
}




const checkFileToRemove = (localTracks, serverTracks) => {
  let tracks = []
  for (const track of localTracks) {
    // если на сервере трека нет, а локально есть то мы его удаляем
    if (!serverTracks.includes(track)) {
      tracks.push(track)
    }
  }
  return tracks
}

const checkFileToDownload = (localTracks, serverTracks) => {
  let tracks = []
  for (const track of serverTracks) {
    // если файл есть на сервере, но нет локально то качаем
    if (!localTracks.includes(track)) {
      tracks.push(track)
    }
  }
  return tracks
}


const uploadMissingFiles = async (basePath, trackList) => {
  console.log('download file func')
  const savedFiles = await saveFileByName(basePath, trackList)
  return savedFiles
}



const removeExtraFiles = async (basePath, trackList) => {
  console.log('remove file func')
  for (const track of trackList) {
    const filePath = `${basePath}${track}`
    await FileSystem.deleteAsync(filePath, { idempotent: true })
    console.log('file deleted', filePath)
  }
}