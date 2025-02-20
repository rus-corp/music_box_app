import React from 'react';

import { styles } from './styles'

import Header from '../../ui/header/Header';
import { Text, View, ScrollView, Button, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppContext } from '../../../hooks/AppContext';
import Collection from '../../shared/collection_item/Collection';
import AudioPlayer from '../../ui/audio_player/AudioPlayer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getClientCollections } from '../../../api';
import { getSavedCollections, saveCollections, checkFolderDownloadTracks, clearApp } from './utils';

export default function PlayList() {
  const { user } = React.useContext(AppContext)
  const [collections, setCollections] = React.useState([])
  const [tracks, setTracks] = React.useState([])

  const handleStartPlay = (data) => {
    console.log('tracks: ', data)
    setTracks(data)
  }

  const handlePress = async (collectionData) => {
    await checkFolderDownloadTracks(collectionData)
  }

  const clientCollections = async () => {
    const clientSavedCollections = await getSavedCollections()
    console.log('clientSavedCollections', clientSavedCollections)
    if (!clientSavedCollections.length > 0) {
      const response = await getClientCollections()
      if (response.status === 200) {
        await saveCollections(response.data)
        setCollections(response.data)
        Alert.alert('Необходимо загрузить треки', 'Нажмите на кнопку "Загрузить"', [
          { text: 'Загрузить', onPress: () => handlePress(response.data) },
          { text: 'Отмена', onPress: () => console.log('Cancel Pressed'), style: 'cancel' }
        ])
      }
    } else {
      setCollections(clientSavedCollections)
    }
    // console.log(response.data)
    // console.log('bases', response.data[0].base_collection_association)
    // if (response.status === 200) {
    //   setCollections(response.data)
    //   // const clietCollections = response.data.map(item => item.name)
    //   // await AsyncStorage.setItem('clientCollections', JSON.stringify(clientCollections));
    // }
  }

  const handleClearApp = async() => {}

  const handleDeleteAccess = async () => {
    const token = await AsyncStorage.removeItem('access_token')
  }

  const deleteStorageCollections = async () => {
    await clearApp()
    // await AsyncStorage.removeItem('clientCollections')
    // const clientSavedCollections = await getSavedCollections()
    console.log('collections deleted')
  }

  React.useEffect(() => {
    clientCollections()
  }, [user])
  
  return(
    <View style={styles.mainContainer}>
      <Header />
      <Button title="Delete collections" onPress={deleteStorageCollections} />
      <Button title='Delete Access' onPress={handleDeleteAccess} />
      <LinearGradient style={styles.mainContent} colors={['rgba(120, 135, 251, 0.312)', 'rgba(204, 102, 198, 0.1508)', 'rgba(255, 255, 255, 0.52)']}>
        <View style={styles.mainContent}>
          <View style={styles.mainContentHeader}>
            <Text style={styles.headerContentItem}>Рекомендации</Text>
            <Text style={styles.headerContentItem}>Избранные</Text>
          </View>
          <View style={styles.line}></View>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.collectionList}>
              {collections?.map((collectionItem) => (
                <Collection key={collectionItem.id}
                collectionTitle={collectionItem.name}
                image={collectionItem.image}
                trackCount={collectionItem.track_count}
                collectionId={collectionItem.id}
                startPlay={handleStartPlay}
                />
              ))}
            </View>
          </ScrollView>
          <AudioPlayer tracks={tracks} />
        </View>
      </LinearGradient>
    </View>
  );
}