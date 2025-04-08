import React from 'react';
import * as FileSystem from 'expo-file-system'
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';

import { styles } from './styles'

import Header from '../../ui/header/Header';
import { Text, View, ScrollView, Button, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppContext } from '../../../hooks/AppContext';
import Collection from '../../shared/collection_item/Collection';
import AudioPlayer from '../../ui/audio_player/AudioPlayer';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { checkFileSize } from '../../../api/downloading/download_api';

import { getClientCollections } from '../../../api';
import { checkFolderDownloadTracks, saveCollections,
  getSavedCollections, clearApp, getBasesTracks, trackListGenerator,
  getCurrentSheduler, checkCollectionFolders, handleCheckClientSheduler,
  updateSheduler }
  from '../../shared/helpers';


import { updateBasesTracks } from '../../shared/helpers/base_utils';


import { getTrackLogs } from '../../shared/helpers/track_logs';


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
    if (!currentShedule) {
      Alert.alert('Нет активного расписания', 'Создайте расписание в личном кабинете', [
        { text: 'OK' }
      ])
    }
    currentCollectionRef.current = currentShedule
    const data = await getBasesTracks(currentShedule)
    trackGeneratorRef.current = trackListGenerator(data, 20)
    const { value, done } = trackGeneratorRef.current.next()
    if (value) {
      setTracks(value.selectedTracks)
      setCurrentBaseName(value.baseName)
    }
  }

  const handleCheckDownloadCollection = () => {
    setDowmloadCollection(true)
  }

  const handlePress = async (collectionData) => {
    await activateKeepAwakeAsync()
    setProgress(0)
    setDownloading(true)
    try {
      await checkFolderDownloadTracks(collectionData, (current, total) => {
        setProgress((current / total) * 100)
      })
      handleCheckDownloadCollection()
    } catch (error) {
      console.log('Error downloading tracks:', error)
    } finally {
      setDownloading(false)
      await deactivateKeepAwake()
    }
  }



  const clientCollections = async () => {
    const clientCollections = await getSavedCollections()
    if (clientCollections.length === 0) {
      const response = await getClientCollections()
      if (response.status === 200) {
        const handleSaveCollection = await saveCollections(response.data)
        setCollections(handleSaveCollection)
        return handleSaveCollection
      }
    } else {
      setCollections(clientCollections)
      return clientCollections
    }
  }


  const handleDeleteAccess = async () => {
    const token = await AsyncStorage.removeItem('access_token')
    const deletedToken = await AsyncStorage.getItem('access_token')
    console.log(deletedToken)
  }

  const fetchBases = async (collectionData) => {
    // console.log('fetch bases collectionData', collectionData)
    const collectionFolders = await checkCollectionFolders()
    if (collectionFolders.some(item => item.folderInfo === false)) {
      Alert.alert('Необходимо загрузить треки', 'Нажмите на кнопку "Загрузить"', [
        { text: 'Загрузить', onPress: () => handlePress(collectionData) },
        { text: 'Отмена', onPress: () => console.log('Canceled') }
      ])
    }
  }

  const getNextTrackList = async () => {
    const sheduleData = await handleCheckClientSheduler()
    const currentShedule = getCurrentSheduler(sheduleData)
    if (!currentShedule) {
      Alert.alert('Нет активного расписания', 'Создайте расписание в личном кабинете', [
        { text: 'OK' }
      ])
    }
    if (currentShedule !== currentCollectionRef.current) {
      currentCollectionRef.current = currentShedule
      const data = await getBasesTracks(currentShedule)
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
    const collectionBases =  await updateBasesTracks()
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

  const handleCheckSize = async() => {
    // await clearApp()
    const folders = await FileSystem.readDirectoryAsync(`${FileSystem.documentDirectory}`)
    console.log(folders)
    // await FileSystem.deleteAsync(`${FileSystem.documentDirectory}bases/`)
    // const res = await getTrackLogs()
    // console.log('track logs', res)
    // console.log(res.length)
  }
  
  return(
    <View style={styles.mainContainer}>
      <Header />
      <Button title='Clear App' onPress={handleCheckSize} />
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
          // onRequestMoreTracks={handleStartPlayData}
          baseName={currentBaseName}
          />
        </View>
      </LinearGradient>
    </View>
  );
}