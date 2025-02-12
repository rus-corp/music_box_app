import React from 'react';

import { styles } from './styles'

import Header from '../../ui/header/Header';
import { Text, View, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppContext } from '../../../hooks/AppContext';
import Collection from '../../shared/collection_item/Collection';
import AudioPlayer from '../../ui/audio_player/AudioPlayer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getClientCollections } from '../../../api';


export default function PlayList() {
  const { user } = React.useContext(AppContext)
  const [collections, setCollections] = React.useState([])
  const [tracks, setTracks] = React.useState([])

  const handleStartPlay = (data) => {
    console.log('tracks: ', data)
    setTracks(data)
  }

  const clientCollections = async () => {
    const response = await getClientCollections()
    console.log(response.data)
    console.log('bases', response.data[0].base_collection_association)
    // берем название баз из ответа и проверяем есть ли папка с таким названием
    // если нет, то выводим алерт на загрузку треков 
    // создаем папки с названием баз и загружаем в нее треки
    if (response.status === 200) {
      setCollections(response.data)
      // const clietCollections = response.data.map(item => item.name)
      // await AsyncStorage.setItem('clientCollections', JSON.stringify(clientCollections));
    }
  }

  React.useEffect(() => {
    clientCollections()
  }, [user])
  
  return(
    <View style={styles.mainContainer}>
      <Header />
      <LinearGradient style={styles.mainContent} colors={['rgba(120, 135, 251, 0.312)', 'rgba(204, 102, 198, 0.1508)', 'rgba(255, 255, 255, 0.52)']}>
        <View style={styles.mainContent}>
          <View style={styles.mainContentHeader}>
            <Text style={styles.headerContentItem}>Рекомендации</Text>
            <Text style={styles.headerContentItem}>Избранные</Text>
          </View>
          <View style={styles.line}></View>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.collectionList}>
              {collections.map((collectionItem) => (
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