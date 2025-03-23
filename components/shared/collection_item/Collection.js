import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from './styles'
import { baseUrl, getCollectionTracks, getCollectionBases } from '../../../api';
import { useNavigation } from '@react-navigation/native';
import { checkFolder, deleteFolder, getStartTrackList, getBasesTracks } from '../helpers';
import { trackListGenerator } from '../helpers/play_utils';


export default function Collection({
  collectionTitle,
  image,
  trackCount,
  collectionId,
  startPlay,
  collectionDownload,
  // onRegisterStartPlay
}) {
  const imageSource = 'https://music-sol.ru/api' + image
  const navigation = useNavigation()
  const [folderExsist, setFolderExsist] = React.useState(true)
  // const trackGeneratorRef = React.useRef(null)
  const handlePress = () => {
    navigation.navigate('CollectionDetails', { title: collectionTitle, image: image })
  }
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

  React.useEffect(() => {
    const handleCheckFolder = async () => {
      const exsist = await checkFolder(collectionTitle)
      setFolderExsist(exsist)
    }
    handleCheckFolder()
    // if (onRegisterStartPlay) {
    //   onRegisterStartPlay(handleStartPlay)
    // }
  }, [collectionTitle, collectionDownload])

  return(
    <TouchableOpacity style={{ width: '16%', height: 250 }} onPress={handlePress}>
      <View style={styles.collectionItem}>
        <Image style={styles.image} source={{uri: imageSource}}/>
        <View style={styles.content}>
          <Text style={styles.title}>{collectionTitle}</Text>
          <Text style={styles.desc}>{trackCount} треков</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}