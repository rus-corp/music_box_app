import React from 'react';
import { View, Text, Button, Platform } from 'react-native';
import { styles } from './styles'
import Header from '../../ui/header/Header';
import { getCollectionTracks, downloadAudio } from '../../../api';
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';




export default function CollectionScreen({ route }) {
  const { id } = route.params
  const [collectionData, setCollectionData] = React.useState({
    data: {},
    tracks: []
  })

  const collectionTracks = async (collectionId) => {
    const response = await getCollectionTracks(collectionId)
    if (response.status === 200) {
      // console.log(response)
      setCollectionData({
        data: response.data,
        tracks: response.data.tracks
      })
    }
  }

  const handleDownloadFile = async(trackId, trackName) => {
    const filename = `${trackName}.mp3`
    const downloadUri = `${FileSystem.documentDirectory}${filename}`;
    const result = await FileSystem.downloadAsync(
      `http://87.228.25.221:8000/api/app_routers/download_file/${trackId}`,
      downloadUri
    )
    console.log(result, result.uri)
    const trackmime = result.headers['content-type']
    saveFile(result.uri, filename, trackmime)
  }
  
  const saveFile = async (uri, filename, mimetype) => {
    if (Platform.OS === "android") {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
        await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, mimetype)
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
          })
          .catch(e => console.log(e));
      } else {
        shareAsync(uri);
      }
    } else {
      shareAsync(uri);
    }
  }
  // const saveFile = async (uri, filename, mimetype) => {
  //   if (Platform.OS === 'android') {
  //     const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()
  //     if (permissions.granted) {
  //       const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
  //         permissions.directoryUri,
  //         filename,
  //         mimetype
  //       )
  //     }
  //   }
  // }

  React.useEffect(() => {
    collectionTracks(id)
  }, [id])

  return(
    <View style={styles.mainContainer}>
      <Header />
      <LinearGradient
      style={styles.mainContent}
      colors={['rgba(120, 135, 251, 0.52)', 'rgba(204, 102, 198, 0.1508)', 'rgba(255, 255, 255, 0.52)']}>
        <Text>Collection {collectionData.data.name}</Text>
        {collectionData.tracks.map((collectionTrack) => (
          <View  key={collectionTrack.id}>
            <Text>{collectionTrack.title}</Text>
            <Button title='Download' onPress={() => handleDownloadFile(collectionTrack.id, collectionTrack.title)}/>
          </View>
        ))}
      </LinearGradient>
    </View>
  );
}