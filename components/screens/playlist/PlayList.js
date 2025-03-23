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
import { checkFolderDownloadTracks, saveCollections,
  getSavedCollections, clearApp, getBasesTracks, trackListGenerator,
  getCurrentSheduler, checkCollectionFolders, handleCheckClientSheduler,
  updateSheduler }
  from '../../shared/helpers';


import { updateBasesTracks } from '../../shared/helpers/base_utils';

export default function PlayList() {
  const { user } = React.useContext(AppContext)
  const trackGeneratorRef = React.useRef(null)
  const currentCollectionRef = React.useRef(null)
  const [collections, setCollections] = React.useState([])
  const [tracks, setTracks] = React.useState([])
  const [progress, setProgress] = React.useState(0)
  const [downloading, setDownloading] = React.useState(false)
  const [downloadCollection, setDowmloadCollection] = React.useState(false)
  const [currentBaseName, setCurrentBaseName] = React.useState('')

  const handleStartPlay = async () => {
    const sheduleData = await handleCheckClientSheduler()
    console.log('sheduleData', sheduleData)
    const currentShedule = getCurrentSheduler(sheduleData)
    console.log(currentShedule)
    if (!currentShedule) {
      Alert.alert('Нет активного расписания', 'Создайте расписание в личном кабинете', [
        { text: 'OK' }
      ])
    }
    currentCollectionRef.current = currentShedule
    console.log('currentCollectionRef.current', currentCollectionRef.current)
    const data = await getBasesTracks(currentShedule)
    console.log('data', data)
    trackGeneratorRef.current = trackListGenerator(data, 20)
    const { value, done } = trackGeneratorRef.current.next()

    console.log('value', value)
    if (value) {
      setTracks(value.selectedTracks)
      setCurrentBaseName(value.baseName)
    }
  }

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
    const clientCollections = await getSavedCollections()
    if (clientCollections.length === 0) {
      const response = await getClientCollections()
      if (response.status === 200) {
        const handleSaveCollection = await saveCollections(response.data)
        console.log('handleSaveCollection', handleSaveCollection)
        setCollections(response.data)
        return handleSaveCollection
      }
    } else {
      setCollections(clientCollections)
      return clientCollections
    }
  }


  const handleDeleteAccess = async () => {
    const token = await AsyncStorage.removeItem('access_token')
    console.log(token)
    const deletedToken = await AsyncStorage.getItem('access_token')
    console.log(deletedToken)
  }

  const deleteStorageCollections = async () => {
    await clearApp()
    console.log('collections deleted')
  }

  const fetchBases = async (collectionData) => {
    const collectionFolders = await checkCollectionFolders()
    if (collectionFolders.some(item => item.folderInfo === false)) {
      Alert.alert('Необходимо загрузить треки', 'Нажмите на кнопку "Загрузить"', [
        { text: 'Загрузить', onPress: () => handlePress(collectionData) },
        { text: 'Отмена', onPress: () => console.log('Canceled') }
      ])
    }
  }

  const getNextTrackList = async () => {
    console.log('next gen')
    const sheduleData = await handleCheckClientSheduler()
    const currentShedule = getCurrentSheduler(sheduleData)
    console.log('next gen currentShedule', currentShedule)
    console.log('currentCollectionRef.current', currentCollectionRef.current)
    if (!currentShedule) {
      Alert.alert('Нет активного расписания', 'Создайте расписание в личном кабинете', [
        { text: 'OK' }
      ])
    }
    if (currentShedule !== currentCollectionRef.current) {
      console.log('new collection shedul')
      currentCollectionRef.current = currentShedule
      console.log(' new currentCollectionRef', currentCollectionRef)
      const data = await getBasesTracks(currentShedule)
      console.log('next collection', data)
      trackGeneratorRef.current = trackListGenerator(data, 20)
    }
    const { value, done } = trackGeneratorRef.current.next()
    if (value) {
      setTracks(value.selectedTracks)
      setCurrentBaseName(value.baseName)
    }
    return value
  }

  const handleUpdateSheduler = async () => {
    const updatedShedule = await updateSheduler()
  }

  const handleUpdateBases = async () => {
    console.log('UPDATE BASES CLICK')
    const collectionBases =  await updateBasesTracks()
    console.log('collectionBases', collectionBases)
  }

  React.useEffect(() => {
    const collections = async () => {
      const collectionsData = await clientCollections()
      if (collectionsData) {
        await fetchBases(collectionsData)
      }
    }
    collections()
  }, [user])
  
  return(
    <View style={styles.mainContainer}>
      <Header />
      <Button title='Clear app' onPress={deleteStorageCollections}/>
      <Button title='Начать воспроизведение' onPress={handleStartPlay} />
      <View style={styles.bntBlock}>
        <View style={styles.btnContainer}>
          <Button title='Обновить расписание' onPress={handleUpdateSheduler} />
        </View>
        <View style={styles.btnContainer}>
          <Button title='Обновить базы' onPress={handleUpdateBases} />
        </View>
      </View>
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
                // startPlay={handleStartPlay}
                collectionDownload={downloadCollection}
                // onRegisterStartPlay={setHandleStartPlayData}
                />
              ))}
            </View>
          </ScrollView>
          <AudioPlayer
          tracks={tracks}
          fetchBases={getNextTrackList}
          onRequestMoreTracks={handleStartPlayData}
          baseName={currentBaseName}
          />
        </View>
      </LinearGradient>
    </View>
  );
}