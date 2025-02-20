import React from 'react';
import { View, Text, Image, TouchableOpacity, Pressable, Alert } from 'react-native';
import { styles } from './styles'
import { baseUrl, getCollectionTracks, getCollectionBases } from '../../../api';
import { useNavigation } from '@react-navigation/native';
import { checkFolder, deleteFolder, saveFileToFolder, getCollectionFiles, getStartTrackList } from '../helpers/utils';


export default function Collection({ collectionTitle, image, trackCount, collectionId, startPlay }) {
  const imageSource = 'https://music-sol.ru/api' + image
  const navigation = useNavigation()
  const [press, setPress] = React.useState(false)
  const [folderExsist, setFolderExsist] = React.useState(false)
  const handlePress = () => {
    navigation.navigate('CollectionDetails', { title: collectionTitle, image: image })
  }
  const handleCreateDir = async() => {
    // const collectionTracks = await getCollectionBases(collectionId)
    // if (collectionTracks.status === 200) {
    //   const bases = collectionTracks.data.base_collection_association
    //   console.log(collectionTracks.data)
    //   console.log(bases)
    //   // console.log(collectionTracks.data.tracks)
    //   // const filesList = collectionTracks.data.tracks
    //   // await saveFileToFolder(collectionTitle, filesList)
    //   // setFolderExsist(true)
    // }else {
    //   console.log('server error')
    // }
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
  }, [collectionTitle])

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
        <Pressable onPress={handleDeleteFolder}>
          <Text>Delete Folder</Text>
        </Pressable>
      </View>
    </TouchableOpacity>
  );
}