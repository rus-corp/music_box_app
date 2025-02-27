import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system'



export const getStartTrackList = async(collectionTitle) => {
  const clientCollectionsJson = await AsyncStorage.getItem('clientCollections')
  const clientCollectionParse = JSON.parse(clientCollectionsJson)
  const collection = clientCollectionParse.find(col => col.name === collectionTitle)
  let baseTracksPath = {}
  let baseTrackCount = {}
  for (const base of collection.base_collection_association) {
    const baseName = base.base_collection.name.replace(/[^a-zA-Z0-9]/g, '_')
    const trackQuant = base.track_quantity
    baseTrackCount[baseName] = base.track_quantity
    const baseDir = `${FileSystem.documentDirectory}${baseName}`
    const baseTracks = await FileSystem.readDirectoryAsync(baseDir)
    const trackPath = baseTracks.map((track) => `${baseDir}/${track}`)
    baseTracksPath[baseName] = trackPath
  }
  const tracks = createTrackList(baseTracksPath, baseTrackCount)
  return tracks
}


const createTrackList = (baseTracksPath, baseTrackCount) => {
  let resultTracks = []
  let trackQueues = {}
  let totalTrackCount = 0

  for (const base in baseTrackCount) {
    trackQueues[base] = [...baseTracksPath[base]]
    totalTrackCount += trackQueues[base].length
  }

  while (totalTrackCount > 0) {
    for (const base in baseTrackCount) {
      const needCount = baseTrackCount[base]
      if (trackQueues[base] && trackQueues[base].length > 0) {
        const selectedTrack = trackQueues[base].splice(0, needCount)
        resultTracks.push(...selectedTrack)
        totalTrackCount -= selectedTrack.length
      }
    }
  }
  return resultTracks
}

export const getRandomTrack = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min
}


export const getNextTrackUri = async (trackUri) => {
  const fileInfo = await FileSystem.getInfoAsync(trackUri)
  return fileInfo
}


const getRandomFiles = (filesList, count) => {
  return filesList.sort(() => Math.random() - 0.5).slice(0, Math.min(count, filesList.length))
}