import * as FileSystem from 'expo-file-system'
import { getBaseTracks } from "../../../api"

import { createFolder } from "./base_utils"



export const checkFolderDownloadTracks = async(clientCollectionData, onProgres) => {
  let totalCollectionTracks = clientCollectionData.reduce((acc, collection) => acc + collection.track_count, 0)
  console.log('totalCollectionTracks', totalCollectionTracks)
  let downloadedTracks = 0
  for (const collection of clientCollectionData) {
    console.log('collection', collection)
    const collectionTrackCount = collection.track_count
    console.log('collectionTrackCount', collectionTrackCount)
    for (const base of collection.base_collection_association) {
      console.log('base', base)
      const baseName = base.base_collection.name
      const baseId = base.base_collection.id
      const folderUri = await createFolder(baseName)
      let trackCount = 0
      let offset = 0
      console.log('folderUri', folderUri)
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
          offset += 50
        }
      }
    }
  }
  return true
}



const saveFileToFolder = async(folderUri, filesList) => {
  const dirInfo = await FileSystem.getInfoAsync(folderUri)
  let downloadTrackCount = 0
  let errorDownloadTrackCount = 0
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(folderUri, { intermediates: true })
  }
  for (const file of filesList) {
    console.log('file', file)
    const {title, id } = file
    const fileUri = `${folderUri}${title}.mp3`
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


