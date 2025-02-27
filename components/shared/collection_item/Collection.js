import React from 'react';
import { View, Text, Image, TouchableOpacity, Pressable, Alert } from 'react-native';
import { styles } from './styles'
import { baseUrl, getCollectionTracks, getCollectionBases } from '../../../api';
import { useNavigation } from '@react-navigation/native';
import { checkFolder, deleteFolder, getStartTrackList } from '../helpers';



export default function Collection({ collectionTitle, image, trackCount, collectionId, startPlay, collectionDownload }) {
  const imageSource = 'https://music-sol.ru/api' + image
  const navigation = useNavigation()
  const [press, setPress] = React.useState(false)
  const [folderExsist, setFolderExsist] = React.useState(true)
  const handlePress = () => {
    navigation.navigate('CollectionDetails', { title: collectionTitle, image: image })
  }
  const handleCreateDir = async() => {
  }
  const handleStartPlay = async () => {
    const tracks = await getStartTrackList(collectionTitle)
    startPlay(tracks)
  }
  const handleDeleteFolder = async() => {
    const folder = await deleteFolder(collectionTitle)
    setFolderExsist(folder)
  }

  React.useEffect(() => {
    const handleCheckFolder = async () => {
      const exsist = await checkFolder(collectionTitle)
      setFolderExsist(exsist)
    }
    handleCheckFolder()
  }, [collectionTitle, collectionDownload])

  return(
    <TouchableOpacity style={{ width: '16%', height: 250 }} onPress={handlePress}>
      <View style={styles.collectionItem}>
        <Image style={styles.image} source={{uri: imageSource}}/>
        <View style={styles.content}>
          <Text style={styles.title}>{collectionTitle}</Text>
          <Text style={styles.desc}>{trackCount} треков</Text>
        </View>
        {folderExsist ? (
          <Pressable
          onPressIn={() => setPress(true)}
          onPressOut={() => setPress(false)}
          style={({ pressed }) => [
            styles.collectionBtn,
            pressed || press ? styles.btnPressed : null 
          ]}
          onPress={handleStartPlay}>
            <Text>Играть</Text>
          </Pressable>
        ): (
          <Pressable
          onPressIn={() => setPress(true)}
          onPressOut={() => setPress(false)}
          style={({ pressed }) => [
            styles.collectionBtn,
            pressed || press ? styles.btnPressed : null 
          ]}
          onPress={handleCreateDir}>
            <Text>Загрузить</Text>
          </Pressable>
        )}
      </View>
    </TouchableOpacity>
  );
}