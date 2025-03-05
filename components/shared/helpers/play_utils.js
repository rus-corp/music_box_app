import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system'



export const getStartTrackList = async() => {
  const clientCollectionsJson = await AsyncStorage.getItem('clientCollections')
  const clientCollectionParse = JSON.parse(clientCollectionsJson)
  let baseTracksPath = {}
  let baseTrackCount = {}
  for (collection of clientCollectionParse) {
    console.log('12 collection', collection)
    for (base of collection.base_collection_association) {
      console.log('14 base', base)
      const baseName = base.base_collection.name.replace(/[^a-zA-Z0-9]/g, '_')
      baseTracksPath['base_name'] = baseName
      baseTracksPath['trackCount'] = base.track_quantity
      const baseDir = `${FileSystem.documentDirectory}${baseName}`
      const baseTracks = await FileSystem.readDirectoryAsync(baseDir)
      const trackPath = baseTracks.map((track) => `${baseDir}/${track}`)
      baseTracksPath['tracks'] = trackPath
    }
  }
  // console.log('baseTracksPath', baseTracksPath)
  // const tracks = createTrackList(baseTracksPath, baseTrackCount)
  // const tracks = trackListGenerator(baseTracksPath)
  // console.log('tracks',tracks.next().value)
  // playerTracks = [...playerTracks, tracks]
  return baseTracksPath
}


export const getBasesTracks = async() => {
  let bases = []
  const clientCollectionsJson = await AsyncStorage.getItem('clientCollections')
  const clientCollectionParse = JSON.parse(clientCollectionsJson)
  for (collection of clientCollectionParse) {
    for (const base of collection.base_collection_association) {
      const baseName = base.base_collection.name.replace(/[^a-zA-Z0-9]/g, '_')
      const baseDir = `${FileSystem.documentDirectory}${baseName}`
      try {
        const baseTracks = await FileSystem.readDirectoryAsync(baseDir)
        const trackPath = baseTracks.map((track) => `${baseDir}/${track}`)
        bases.push({
          name: baseName,
          trackQuantity: base.track_quantity,
          tracks: trackPath
        })
      } catch (error) {
        console.log(error)
      }
    }
  }
  return bases
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


export function* trackListGenerator(bases, batchSize=20) {
  while (true) {
    let allTracks = []
    while (allTracks.length < batchSize) {
      for (const base of bases) {
        if (allTracks.length >= batchSize) break

        if (base.tracks.length === 0) continue

        const selectedTracks = base.tracks.splice(0, base.trackQuantity)
        allTracks.push(...selectedTracks)
      }
      if (allTracks.length === 0) return
    }
    yield allTracks.flat()
  }
}
  // let currentIndx = 0
  // let currentCount = 0
  // let sizeCount = 3
  // if (batchSize <= 2) {
  //   sizeCount = 10
  // } else if (batchSize >= 3 && batchSize <= 5) {
  //   sizeCount = 5
  // }
  // while (currentIndx < trackList.length && currentCount < sizeCount) {
  //   yield trackList.slice(currentIndx, currentIndx + batchSize)
  //   currentIndx += batchSize
  //   currentCount += 1
  // }
