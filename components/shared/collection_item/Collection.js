import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from './styles'
import { useNavigation } from '@react-navigation/native';
import { checkFolder, deleteFolder, getStartTrackList, getBasesTracks, getCollectionFiles } from '../helpers';


export default function Collection({
  collectionTitle,
  image,
  trackCount,
  collectionId,
  startPlay,
  collectionDownload,
}) {
  const imageSource = 'https://music-sol.ru/api' + image
  const navigation = useNavigation()
  const handlePress = () => {
    navigation.navigate('CollectionDetails', { title: collectionTitle, image: image })
  }

  // const handleCheckCollectionDownloadTrack = async (collectionName) => {
  //   const tracks = await getCollectionFiles(collectionName)
  //   console.log('tracks len', tracks.length)
  //   return tracks.length
  // }

  // const downloadTrackCount = handleCheckCollectionDownloadTrack(collectionTitle)
  // const handleCreateDir = async() => {
  // }

  // const handleStartPlay = async () => {
  //   if (!trackGeneratorRef.current) return
  //   const { value, done } = trackGeneratorRef.current.next()
  //   if (value) {
  //     startPlay(value)
  //   }
  //   return value
  // }

  // const handleDeleteFolder = async() => {
  //   const folder = await deleteFolder(collectionTitle)
  //   setFolderExsist(folder)
  // }

  // React.useEffect(() => {
  //   const handleCheckCollectionDownloadTrack = async (collectionName) => {
  //     const tracks = await getCollectionFiles(collectionName)
  //     console.log('tracks len', tracks.length)
  //     setDownloadedTracks(tracks.length)
  //     return tracks.length
  //   }
  //   handleCheckCollectionDownloadTrack(collectionTitle)
  // }, [collectionTitle, collectionDownload])

  return(
    <TouchableOpacity style={{ width: '16%', height: 250 }} onPress={handlePress}>
      <View style={styles.collectionItem}>
        <Image style={styles.image} source={{uri: imageSource}}/>
        <View style={styles.content}>
          <Text style={styles.title}>{collectionTitle}</Text>
          <Text style={styles.desc}>{trackCount} треков</Text>
          {/* <Text style={styles.desc}>{downloadTrackCount} Загружено треков</Text> */}
        </View>
      </View>
    </TouchableOpacity>
  );
}