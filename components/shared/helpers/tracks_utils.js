import * as FileSystem from 'expo-file-system'
import { getBaseTracks } from "../../../api"

import { createFolder } from "./base_utils"



export const checkFolderDownloadTracks = async(clientCollectionData, onProgres) => {
  let totalCollectionTracks = clientCollectionData.reduce((acc, collection) => acc + collection.track_count, 0)
  let downloadedTracks = 0
  for (const collection of clientCollectionData) {
    const collectionTrackCount = collection.track_count
    for (const base of collection.base_collection_association) {
      const baseName = base.base_collection.name
      const baseId = base.base_collection.id
      const folderUri = await createFolder(baseName)
      let trackCount = 0
      let offset = 0
      while (trackCount < collectionTrackCount) {
        const baseTracks = await getBaseTracks(baseId, offset)
        console.log('baseTracks', baseTracks)
        if (baseTracks.status === 200) {
          let tracks = baseTracks.data.tracks
          if (tracks.length === 0) {
            break
          }
          const savedFiles = await saveFileToFolder(folderUri, tracks)
          console.log('tracks saved', savedFiles)
          trackCount += tracks.length
          downloadedTracks += tracks.length
          if (onProgres) {
            onProgres(downloadedTracks, totalCollectionTracks)
          }
          offset += tracks.length
        }
      }
    }
  }
  return true
}



export const saveFileToFolder = async(folderUri, filesList) => {
  const dirInfo = await FileSystem.getInfoAsync(folderUri)
  console.log('save file to folder', folderUri)
  let downloadTrackCount = 0
  let errorDownloadTrackCount = 0
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(folderUri, { intermediates: true })
  }
  for (const file of filesList) {
    console.log('file', file)
    const {title, id } = file
    const fileUri = `${folderUri}${title}.mp3`
    console.log(fileUri)
    try {
      console.log('track download', title)
      const result = await FileSystem.downloadAsync(
        `https://music-sol.ru/api/app_routers/download_file/${id}`,
        fileUri
      )
      downloadTrackCount += 1
    } catch (e) {
      console.error(e)
      errorDownloadTrackCount += 1
    }
  }
  return {
    'downloadTrackCount': downloadTrackCount,
    'errorDownloadTrackCount': errorDownloadTrackCount
  }
}


export const saveFileByName = async (folderUri, filesList) => {
  console.log('save file to folder by name', folderUri)
  let downloadTrackCount = 0
  let errorDownloadTrackCount = 0
  for (const file of filesList) {
    console.log('file', file)
    const fileUri = `${folderUri}${file}`
    console.log('fileUri', fileUri)
    try {
      console.log('track download', file)
      const fileData = file.split('.')
      console.log(fileData)
      const result = await FileSystem.downloadAsync(
        `https://music-sol.ru/api/app_routers/download_track_by_name/${fileData[0]}`,
        fileUri
      )
      downloadTrackCount += 1
    } catch (e) {
      console.error(e)
      errorDownloadTrackCount += 1
    }
  }
  return {
    'downloadTrackCount': downloadTrackCount,
    'errorDownloadTrackCount': errorDownloadTrackCount
  }
}

