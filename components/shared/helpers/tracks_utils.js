import * as FileSystem from 'expo-file-system'
import { getBaseTracks } from "../../../api"

import { createFolder, getUnqiueBaseNames } from "./base_utils"
import { getAccessToken } from '../../../api/_variables'
import { appLogToFile } from './track_logs'



export const checkFolderDownloadTracks = async(clientCollectionData, onProgres) => {
  await appLogToFile(`download bases func ${JSON.stringify(clientCollectionData)}`)
  let totalCollectionTracks = clientCollectionData.reduce((acc, collection) => acc + collection.track_count, 0)
  let downloadedTracks = 0
  let countDownloadTrack = 0
  let baseDownloadedTracks = 0 
  const unqiueBaseNames = await getUnqiueBaseNames(clientCollectionData)
  await appLogToFile(`client unqiue bases ${JSON.stringify(unqiueBaseNames)}`)
  for (const base of unqiueBaseNames) {
    let baseTrackCount = 5
    const baseName = base.name
    const baseId = base.id
    const folderUri = await createFolder(baseName)
    await appLogToFile(`created folderUri ${folderUri}`)
    let offset = 0
    while (baseDownloadedTracks < baseTrackCount) {
      const baseTracks = await getBaseTracks(baseId, offset)
      // await appLogToFile(`baseTracks ${JSON.stringify(baseTracks.data)}`)
      if (baseTracks.status === 200) {
        baseTrackCount = baseTracks.data.track_count
        let tracks = baseTracks.data.tracks
        // await appLogToFile(`base tracks count ${baseTrackCount}`)
        // await appLogToFile(`server give tracks ${tracks.length}`)
        if (tracks.length === 0) {
          await appLogToFile(`End track from server ${baseName}`)
          break
        }
        const savedFiles = await saveFileToFolder(folderUri, tracks)
        countDownloadTrack += tracks.length
        downloadedTracks += tracks.length
        offset += tracks.length
        if (onProgres) {
          onProgres(downloadedTracks, totalCollectionTracks)
        }
        await appLogToFile(`saved files ${countDownloadTrack}`)
      }
    }
  }
  return true
}



export const saveFileToFolder = async(folderUri, filesList) => {
  await appLogToFile(`save files to folder ${folderUri}: trackCount ${filesList.length}`)
  const dirInfo = await FileSystem.getInfoAsync(folderUri)
  let downloadTrackCount = 0
  let errorDownloadTrackCount = 0
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(folderUri, { intermediates: true })
  }
  for (const file of filesList) {
    const { file_name, id } = file
    console.log('fileId', id)
    console.log('fileName', file_name)
    const fileUri = `${folderUri}${file_name}`
    await appLogToFile(`file to save ${fileUri}`)
    try {
      await appLogToFile(`track download ${file_name}`)
      const result = await FileSystem.downloadAsync(
        `https://music-sol.ru/api/app_routers/download_file/${id}`,
        fileUri,
        {
          headers: {
            Authorization: `Bearer ${await getAccessToken()}`
          }
        }
      )
      await appLogToFile(`result ${JSON.stringify(result)}`)
      if (result.status !== 200) {
        await appLogToFile(`file not downloaded ${file_name}`)
        await FileSystem.deleteAsync(fileUri)
        errorDownloadTrackCount += 1
      }
      await appLogToFile(`result ${JSON.stringify(result)}`)
      downloadTrackCount += 1
    } catch (e) {
      console.error(e)
      errorDownloadTrackCount += 1
    }
  }
  await appLogToFile(`downloadTrackCount:${downloadTrackCount} errorDownloadTrackCount:${errorDownloadTrackCount}`)
  return {
    'downloadTrackCount': downloadTrackCount,
    'errorDownloadTrackCount': errorDownloadTrackCount
  }
}




export const checkBasesTracks = async () => {
  const basesList = await FileSystem.readDirectoryAsync(`${FileSystem.documentDirectory}bases/`)
  await appLogToFile('check bases tracks')
  for (const base of basesList) {
    const folderUri = `${FileSystem.documentDirectory}bases/${base}/`
    const tracksList = await FileSystem.readDirectoryAsync(folderUri)
    for (const track of tracksList) {
      const trackUri = `${folderUri}${track}`
      const trackInfo = await FileSystem.getInfoAsync(trackUri)
      if (trackInfo.size < 1024) {
        await appLogToFile(`file {trackUri} ${trackInfo.size}`)
        await FileSystem.deleteAsync(trackUri)
      }
      if (!trackInfo.exists) {
        await appLogToFile(`file not exists ${trackUri}`)
        console.log('Track does not exists:', trackUri)
      }
    }
  }
  await appLogToFile('check bases tracks end')
  return true
}