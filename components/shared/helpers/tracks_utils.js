import * as FileSystem from 'expo-file-system'
import { getBaseTracks } from "../../../api"

import { createFolder, getUnqiueBaseNames } from "./base_utils"
import { getAccessToken } from '../../../api/_variables'
import { logToFile } from './track_logs'



export const checkFolderDownloadTracks = async(clientCollectionData, onProgres) => {
  console.log('checkFolderDownloadTracks', clientCollectionData)
  let totalCollectionTracks = clientCollectionData.reduce((acc, collection) => acc + collection.track_count, 0)
  let downloadedTracks = 0
  let countDownloadTrack = 0
  let baseDownloadedTracks = 0 
  // const unqiueBaseNames = []
  const unqiueBaseNames = await getUnqiueBaseNames(clientCollectionData)
  console.log('unqiueBaseNames', unqiueBaseNames)
  for (const base of unqiueBaseNames) {
    console.log('base', base)
    let baseTrackCount = 5
    const baseName = base.name
    const baseId = base.id
    const folderUri = await createFolder(baseName)
    let offset = 0
    while (baseDownloadedTracks < baseTrackCount) {
      const baseTracks = await getBaseTracks(baseId, offset)
      if (baseTracks.status === 200) {
        baseTrackCount = baseTracks.data.track_count
        console.log('baseTrackCount', baseTrackCount)
        let tracks = baseTracks.data.tracks
        if (tracks.length === 0) {
          break
        }
        const savedFiles = await saveFileToFolder(folderUri, tracks)
        countDownloadTrack += tracks.length
        downloadedTracks += tracks.length
        offset += tracks.length
        if (onProgres) {
          onProgres(downloadedTracks, totalCollectionTracks)
        }
        console.log('Download Track COUNT', countDownloadTrack)
      }
    }
    // const folderUri = await createFolder(baseName)
    // console.log('folderUri', folderUri)
    // const baseTracks = await getBaseTracks(baseId, offset)
    // const baseTrackCount = baseTracks.data.tracks.track_count
    // while (baseDownloadedTracks < baseTrackCount) {
    //   const baseTracks = await getBaseTracks(baseId, offset)
    //   baseTrackCount = baseTracks.data.tracks.track_count
    //   if (baseTracks.status === 200) {
    //     let tracks = baseTracks.data.tracks
    //     // logToFile(`base Tracks server len ${tracks.length}`)
    //     if (tracks.length === 0) {
    //       break
    //     }
    //     // const savedFiles = await saveFileToFolder(folderUri, tracks)
    //     // console.log('tracks saved', savedFiles)
    //     baseDownloadedTracks += tracks.length
    //     downloadedTracks += tracks.length
    //     if (onProgres) {
    //       onProgres(downloadedTracks, totalCollectionTracks)
    //     }
    //     console.log('Download Track COUNT', countDownloadTrack)
    //     offset += tracks.length
    //   }
    // }
  }
  // console.log('totalCollectionTracks', baseDownloadedTracks)
  return true
}



export const saveFileToFolder = async(folderUri, filesList) => {
  console.log('save track count', filesList.length)
  const dirInfo = await FileSystem.getInfoAsync(folderUri)
  console.log('save file to folder', folderUri)
  logToFile(`save file to folder ${folderUri}`)
  let downloadTrackCount = 0
  let errorDownloadTrackCount = 0
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(folderUri, { intermediates: true })
  }
  for (const file of filesList) {
    console.log('file', file)
    const { file_name, id } = file
    console.log(file_name)
    const fileUri = `${folderUri}${file_name}`
    console.log(fileUri)
    try {
      console.log('track download', file_name)
      logToFile(`track download ${file_name}`)
      const result = await FileSystem.downloadAsync(
        `https://music-sol.ru/api/app_routers/download_file/${id}`,
        fileUri,
        {
          headers: {
            Authorization: `Bearer ${await getAccessToken()}`
          }
        }
      )
      logToFile(`track download result ${result}`)
      downloadTrackCount += 1
    } catch (e) {
      console.error(e)
      errorDownloadTrackCount += 1
    }
  }
  logToFile(`downloadTrackCount ${downloadTrackCount}`)
  logToFile(`errorDownloadTrackCount ${errorDownloadTrackCount}`)
  return {
    'downloadTrackCount': downloadTrackCount,
    'errorDownloadTrackCount': errorDownloadTrackCount
  }
}




