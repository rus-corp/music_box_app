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
import { appLogToFile, removeAppLogFile, removeTrackLogFile } from '../../shared/helpers/track_logs';
import { sendAppLogs, sendTrackLogs } from '../../../api/logs/logs_api';

import { checkFileSize } from '../../../api/downloading/download_api';
import { checkBasesTracks } from '../../shared/helpers/tracks_utils';



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
  // const [downloadCollection, setDowmloadCollection] = React.useState(false)
  const [currentBaseName, setCurrentBaseName] = React.useState('')

  const handleStartPlay = async () => {
    await appLogToFile('handleStartPlay func')
    const sheduleData = await handleCheckClientSheduler()
    await appLogToFile(`client sheduleData ${JSON.stringify(sheduleData)}`)
    const currentShedule = getCurrentSheduler(sheduleData)
    if (!currentShedule) {
      Alert.alert('Нет активного расписания', 'Создайте расписание в личном кабинете', [
        { text: 'OK' }
      ])
    }
    currentCollectionRef.current = currentShedule
    const data = await getBasesTracks(currentShedule)
    await appLogToFile(`client bases tracks ${data.length}`)
    trackGeneratorRef.current = trackListGenerator(data, 20)
    const { value, done } = trackGeneratorRef.current.next()
    await appLogToFile(`client first generator ${JSON.stringify(value)}`)
    if (value) {
      setTracks(value.selectedTracks)
      setCurrentBaseName(value.baseName)
    }
  }

  // const handleCheckDownloadCollection = () => {
  //   setDowmloadCollection(true)
  // }

  const handlePress = async (collectionData) => {
    await appLogToFile(`download collection ${JSON.stringify(collectionData)}`)
    await activateKeepAwakeAsync()
    setProgress(0)
    setDownloading(true)
    try {
      await checkFolderDownloadTracks(collectionData, (current, total) => {
        setProgress((current / total) * 100)
      })
      // handleCheckDownloadCollection()
    } catch (error) {
      console.log('Error downloading tracks:', error)
    } finally {
      setDownloading(false)
      await deactivateKeepAwake()
      await appLogToFile('deactivateKeepAwake')
      return true
    }
  }



  const clientCollections = async () => {
    await appLogToFile('clientCollections func')
    const clientCollections = await getSavedCollections()
    await appLogToFile(`client saved collections ${JSON.stringify(clientCollections)}`)
    if (clientCollections.length === 0) {
      const response = await getClientCollections()
      if (response.status === 200) {
        await appLogToFile(`client get collections from server ${JSON.stringify(response.data)}`)
        const handleSaveCollection = await saveCollections(response.data)
        await appLogToFile(`client save collections to storage`)
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
    await appLogToFile('fetchBases func')
    const collectionFolders = await checkCollectionFolders()
    if (collectionFolders.some(item => item.folderInfo === false)) {
      Alert.alert('Необходимо загрузить треки', 'Нажмите на кнопку "Загрузить"', [
        { text: 'Загрузить', onPress: () => handlePress(collectionData) },
        { text: 'Отмена', onPress: () => console.log('Canceled') }
      ])
    }
  }

  const getNextTrackList = async () => {
    await appLogToFile('client next generator')
    const sheduleData = await handleCheckClientSheduler()
    await appLogToFile('client check sheduler')
    const currentShedule = getCurrentSheduler(sheduleData)
    await appLogToFile('client curent sheduler')
    if (!currentShedule) {
      Alert.alert('Нет активного расписания', 'Создайте расписание в личном кабинете', [
        { text: 'OK' }
      ])
    }
    if (currentShedule !== currentCollectionRef.current) {
      await appLogToFile('change curent sheduler')
      currentCollectionRef.current = currentShedule
      const data = await getBasesTracks(currentShedule)
      trackGeneratorRef.current = trackListGenerator(data, 20)
      await appLogToFile('get new bases and tracks generator')
    }
    const { value, done } = trackGeneratorRef.current.next()
    if (value) {
      setTracks(value.selectedTracks)
      setCurrentBaseName(value.baseName)
    }
    return value
  }

  const handleUpdateSheduler = async () => {
    await appLogToFile('client cliked update sheduler')
    const updatedShedule = await updateSheduler()
  }

  const handleUpdateBases = async () => {
    await appLogToFile('client cliked update bases')
    const collectionBases =  await updateBasesTracks()
  }

  React.useEffect(() => {
    const collections = async () => {
      await appLogToFile('useEffect playlist')
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
    console.log('folders', folders)
    // const appLogUri = `${FileSystem.documentDirectory}app_logs.txt`
    // const appLogDAta = await FileSystem.readAsStringAsync(appLogUri, {
    //   encoding: FileSystem.EncodingType.UTF8
    // })
    // const lines = appLogDAta.split('\n')
    // console.log('app log data', lines)
    // const handleSendAppLogs = await sendAppLogs()
    // console.log('send app logs', handleSendAppLogs)
    // if (handleSendAppLogs.status === 201) {
    //   console.log('app logs sended')
    //   await removeAppLogFile()
    // }
    // const handleSendTrackLogs = await sendTrackLogs()
    // console.log('send track logs', handleSendTrackLogs)
    // if (handleSendTrackLogs.status === 201) {
    //   console.log('track logs sended')
    //   await removeTrackLogFile()
    // }
    // const folders = await checkBasesTracks()
    // const delLog = await FileSystem.deleteAsync(`${FileSystem.documentDirectory}app_logs.txt`)
    // console.log(folders)
    // const log = await appLogToFile('new log')
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
                // collectionDownload={downloadCollection}
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