import React from 'react';
import { View, Text, FlatList, ScrollView } from 'react-native';
import { styles } from './styles'
import Header from '../../ui/header/Header';
import { LinearGradient } from 'expo-linear-gradient';

import CollectionHeader from '../../shared/collection_header/CollectionHeader';
import { getCollectionFiles } from '../../shared/helpers/collection_utils';



export default function CollectionScreen({ route }) {
  const { title, image } = route.params
  const [collectionTracksData, setCollectionTracksData] = React.useState([])

  const collectionTracks = async (collectionName) => {
    const tracks = await getCollectionFiles(collectionName)
    // console.log('tracks', tracks)
    setCollectionTracksData(tracks)
  }
  // console.log('collectionTracksData', collectionTracksData.length)

  React.useEffect(() => {
    collectionTracks(title)
  }, [title])

  return(
    <View style={styles.mainContainer}>
      <Header />
      <LinearGradient
      style={styles.mainContent}
      colors={['rgba(120, 135, 251, 0.52)', 'rgba(204, 102, 198, 0.1508)', 'rgba(255, 255, 255, 0.52)']}>
        <CollectionHeader
        collectionTitle={title}
        collectionImage={image}
        tracksCount={collectionTracksData.length}
        />
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.flatList}>
            {collectionTracksData.map((item, indx) => (
              <TrackItem key={indx}
              trackTitle={item}
              />
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}



function TrackItem ({ trackTitle }) {
  const formatTrackTitle = (trackName) => {
    if (trackName) {
      const trackSliceName = trackName.split('/')
      return trackSliceName[trackSliceName.length - 1].slice(0, -4).replaceAll('_', ' ')
    } else {
      return ''
    }
  }
  return (
    <View style={styles.trackItem}>
      <Text style={styles.trackTitle}>{formatTrackTitle(trackTitle)}</Text>
    </View>
  );
}