import AsyncStorage from "@react-native-async-storage/async-storage"
import { createFolder, saveFileToFolder } from '../../shared/helpers/utils'
import { getBaseTracks } from "../../../api"


export const saveCollections = async (collectionNames) => {
  try {
    const value = await AsyncStorage.getItem('clientCollections')
    let collections = value ? JSON.parse(value) : []
    for (const collectionName of collectionNames) {
      collections.push(collectionName)
      await AsyncStorage.setItem('clientCollections', JSON.stringify(collections))
    }
  } catch (error) {
    console.log(error)
  }
}


export const getSavedCollections = async () => {
  try {
    const value = await AsyncStorage.getItem('clientCollections')
    return value ? JSON.parse(value) : []
  } catch (error) {
    console.log(error)
  }
}



export const checkFolderDownloadTracks = async(clientCollectionData) => {
  for (const collection of clientCollectionData) {
    const collectionTrackCount = collection.track_count
    console.log('collectionTrackCount', collectionTrackCount)
    for (const base of collection.base_collection_association) {
      const baseName = base.base_collection.name
      const baseId = base.base_collection.id
      const folderUri = await createFolder(baseName)
      console.log('folderUri', folderUri)
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
          console.log('47 tracks', tracks)
          const savedFiles = await saveFileToFolder(folderUri, tracks)
          console.log('tracks saved', savedFiles)
          trackCount += tracks.length
          console.log('trackCount', trackCount)
          offset += 50
        }
      }
      console.log('baseFolder', folderUri)
    }
  }
  return true
}