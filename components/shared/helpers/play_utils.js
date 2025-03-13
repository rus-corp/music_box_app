import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system'



export const getStartTrackList = async(collectionName) => {
  const clientCollectionsJson = await AsyncStorage.getItem('clientCollections')
  const clientCollectionParse = JSON.parse(clientCollectionsJson)
  let baseTracksPath = {}
  let baseTrackCount = {}
  for (collection of clientCollectionParse) {
    for (base of collection.base_collection_association) {
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


export const getBasesTracks = async(collectionName) => {
  let bases = []
  const clientCollectionsJson = await AsyncStorage.getItem('clientCollections')
  const clientCollectionParse = JSON.parse(clientCollectionsJson)
  for (const collectionItem of clientCollectionParse) {
    if (collectionItem.name === collectionName) {
      for (const base of collectionItem.base_collection_association) {
        const baseName = base.base_collection.name.replace(/[^a-zA-Z0-9]/g, '_')
        const baseDir = `${FileSystem.documentDirectory}bases/${baseName}`
        try {
          const baseTracks = await FileSystem.readDirectoryAsync(baseDir)
          const trackPatch = baseTracks.map((track) => `${baseDir}/${track}`)
          bases.push({
            name: baseName,
            trackQuantity: base.track_quantity,
            tracks: trackPatch
          })
        } catch (error) {
          console.log(error)
        }
      }
    }
  }
  // for (collection of clientCollectionParse) {
  //   for (const base of collection.base_collection_association) {
  //     const baseName = base.base_collection.name.replace(/[^a-zA-Z0-9]/g, '_')
  //     const baseDir = `${FileSystem.documentDirectory}${baseName}`
  //     try {
  //       const baseTracks = await FileSystem.readDirectoryAsync(baseDir)
  //       const trackPath = baseTracks.map((track) => `${baseDir}/${track}`)
  //       bases.push({
  //         name: baseName,
  //         trackQuantity: base.track_quantity,
  //         tracks: trackPath
  //       })
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }
  // }
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
  let baseIndex = 0
  let trackIndexes = bases.map(() => 0)
  while (true) {
    const base = bases[baseIndex]
    const trackCount = base.trackQuantity
    const startIndex = trackIndexes[baseIndex]

    const selectedTracks = []

    for (let i=0; i < trackCount; i++) {
      const trackIndex = (startIndex + i) % base.tracks.length
      selectedTracks.push(base.tracks[trackIndex])
      trackIndexes[baseIndex] = (trackIndexes[baseIndex] + 1) % base.tracks.length
    }
    baseIndex = (baseIndex + 1) % bases.length
    yield selectedTracks
  }
  // console.log(bases)
  // let lastIndex = 0
  // while (true) {
  //   let allTracks = []
  //   for (const base of bases) {
  //     const trackCount = base.trackQuantity
  //     console.log('trackCount', trackCount)
  //     const selectedTracks = base.tracks.slice(lastIndex, lastIndex + trackCount)
  //     lastIndex = (lastIndex + trackCount) % base.tracks.length
  //     allTracks.push(...selectedTracks)
  //   }
    // while (allTracks.length < batchSize) {
    //   for (const base of bases) {
    //     console.log('generator base', base)
    //     if (allTracks.length >= batchSize) break

    //     if (base.tracks.length === 0) continue

    //     const selectedTracks = base.tracks.splice(0, base.trackQuantity)
    //     allTracks.push(...selectedTracks)
    //   }
    //   if (allTracks.length === 0) return
    // }
}
