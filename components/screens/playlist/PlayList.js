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
import { trackListGenerator } from '../../shared/helpers/play_utils';
import { getBasesTracks } from '../../shared/helpers/play_utils';

import { checkFolderDownloadTracks, saveCollections,
  getSavedCollections, clearApp } from '../../shared/helpers';



export default function PlayList() {
  const { user } = React.useContext(AppContext)
  const trackGeneratorRef = React.useRef(null)
  const [collections, setCollections] = React.useState([])
  const [tracks, setTracks] = React.useState([])
  const [progress, setProgress] = React.useState(0)
  const [downloading, setDownloading] = React.useState(false)
  const [downloadCollection, setDowmloadCollection] = React.useState(false)
  const [handleStartPlayData, setHandleStartPlayData] = React.useState(null)

  const handleStartPlay = async () => {
    if (!trackGeneratorRef.current) return
    const { value, done } = trackGeneratorRef.current.next()
    console.log('generator')
    if (value) {
      console.log('value', value)
      setTracks(value)
    }
    return value
  }

  // const handleStartPlay = (data) => {
  //   setTracks(data)
  // }

  const handleCheckDownloadCollection = () => {
    setDowmloadCollection(true)
  }

  const handlePress = async (collectionData) => {
    setProgress(0)
    setDownloading(true)
    await checkFolderDownloadTracks(collectionData, (current, total) => {
      setProgress((current / total) * 100)
    })
    setDownloading(false)
    handleCheckDownloadCollection()
  }



  const clientCollections = async () => {
    const clientSavedCollections = await getSavedCollections()
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
  }

  const handleClearApp = async() => {}

  const handleDeleteAccess = async () => {
    const token = await AsyncStorage.removeItem('access_token')
    console.log(token)
    const deletedToken = await AsyncStorage.getItem('access_token')
    console.log(deletedToken)
  }

  const deleteStorageCollections = async () => {
    await clearApp()
    // await AsyncStorage.removeItem('clientCollections')
    // const clientSavedCollections = await getSavedCollections()
    console.log('collections deleted')
  }

  const fetchBases = async () => {
    const data = await getBasesTracks()
    trackGeneratorRef.current = trackListGenerator(data, 20)
    const { value, done } = trackGeneratorRef.current.next()
    if (value) {
      setTracks(value)
    }
  }

  const getNextTrackList = () => {
    const { value, done } = trackGeneratorRef.current.next()
    console.log('generator next track list')
    if (value) {
      setTracks(value)
    }
    return value
  }

  React.useEffect(() => {
    clientCollections()
    if (collections) {
      fetchBases()
    }
  }, [user])
  
  return(
    <View style={styles.mainContainer}>
      <Header />
      <Button title="Delete collections" onPress={deleteStorageCollections} />
      <Button title='Start Play' onPress={fetchBases} />
      <LinearGradient style={styles.mainContent} colors={['rgba(120, 135, 251, 0.312)', 'rgba(204, 102, 198, 0.1508)', 'rgba(255, 255, 255, 0.52)']}>
        <View style={styles.mainContent}>
          <View style={styles.mainContentHeader}>
            <Text style={styles.headerContentItem}>Рекомендации</Text>
            <Text style={styles.headerContentItem}>Избранные</Text>
          </View>
          <View style={styles.line}></View>
          {downloading && (
              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>Загрузка: {Math.round(progress)}%</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progress}%` }]} />
                </View>
              </View>
            )}
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.collectionList}>
              {collections?.map((collectionItem) => (
                <Collection key={collectionItem.id}
                collectionTitle={collectionItem.name}
                image={collectionItem.image}
                trackCount={collectionItem.track_count}
                collectionId={collectionItem.id}
                startPlay={handleStartPlay}
                collectionDownload={downloadCollection}
                onRegisterStartPlay={setHandleStartPlayData}
                />
              ))}
            </View>
            
          </ScrollView>
          <AudioPlayer
          tracks={tracks}
          fetchBases={getNextTrackList}
          onRequestMoreTracks={handleStartPlayData}
          />
        </View>
      </LinearGradient>
    </View>
  );
}