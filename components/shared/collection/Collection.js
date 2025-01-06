import React from 'react';
import { View, Text, Image, TouchableOpacity, Button, Pressable } from 'react-native';
import { styles } from './styles'
import { baseUrl } from '../../../api';
import { useNavigation } from '@react-navigation/native';
import { checkFolder, createFolder } from '../helpers/utils';


export default function Collection({ collectionTitle, image, trackCount, collectionId }) {
  const imageSource = 'http://87.228.25.221:8000/api' + image
  const navigation = useNavigation()
  const [folderExsist, setFolderExsist] = React.useState(false)

  const handlePress = () => {
    navigation.navigate('CollectionDetails', { id: collectionId })
  }

  const handleCreateDir = async() => {
    const folder = await createFolder(collectionTitle)
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
          <Text style={styles.desc}>{trackCount} трек</Text>
        </View>
        {folderExsist ? (
          <Pressable style={styles.collectionBtn}>
            <Text>Воспроизвести</Text>
          </Pressable>
        ): (
          <Pressable style={styles.collectionBtn} onPress={handleCreateDir}>
            <Text>Загрузить</Text>
          </Pressable>
        )}
      </View>
    </TouchableOpacity>
  );
}