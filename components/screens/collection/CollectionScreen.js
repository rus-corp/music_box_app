import React from 'react';
import { View, Text, Button, Platform, FlatList } from 'react-native';
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
    setCollectionTracksData(tracks)
  }

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
        <View style={styles.tracksList}>
          <FlatList
          data={collectionTracksData}
          renderItem={({item, indx}) => <TrackItem key={indx} trackTitle={item} />}
          keyExtractor={item => item.id}
          />
        </View>
      </LinearGradient>
    </View>
  );
}



function TrackItem ({ trackTitle }) {
  return (
    <View style={styles.trackItem}>
      <Text>{trackTitle}</Text>
    </View>
  );
}