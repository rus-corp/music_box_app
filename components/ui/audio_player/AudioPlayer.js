import React from 'react';
import { View, Text, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { styles } from './styles'
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getNextTrackUri } from '../../shared/helpers/utils';


export default function AudioPlayer({ tracks, playPress }) {
  const [sound, setSound] = React.useState(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTrack, setCurrentTrack] = React.useState(tracks[0])

  const trackTitleSlice = (trackName) => {
    if (trackName) {
      const slicedName = trackName.slice(0, -4)
      return slicedName
    } else {
      return ''
    }
  }
  React.useEffect(() => {
    if (tracks && tracks.length > 0) {
      setCurrentTrack(tracks[0])
    }
  }, [tracks])

  // React.useEffect(() => {
  //   return() => {
  //     if (sound) {
  //       sound.unloadAsync()
  //     }
  //   }
  // }, [sound])
  React.useEffect(() => {
    if (!sound) return;
  
    const statusUpdate = async (status) => {
      if (status.didJustFinish) {
        const currentIndx = tracks.indexOf(currentTrack);
        const nextIndex = (currentIndx + 1) % tracks.length;
        const nextTrack = tracks[nextIndex];
        const nextFileUri = `${FileSystem.documentDirectory}music_box/Boorn/${nextTrack}`;
  
        await sound.unloadAsync();
  
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: nextFileUri },
          { shouldPlay: true }
        );
  
        setSound(newSound);
        setIsPlaying(true);
        setCurrentTrack(nextTrack);
      }
    };
  
    sound.setOnPlaybackStatusUpdate(statusUpdate);
  
    return () => {
      sound.setOnPlaybackStatusUpdate(null);
    };
  }, [sound, currentTrack, tracks]);

  async function loadAndPlayAudio() {
    console.log('loadAndPlayAudio')
    const localUri = `${FileSystem.documentDirectory}music_box/Boorn/${currentTrack}`;
    console.log('localUri: ', localUri)
    const fileInfo = await FileSystem.getInfoAsync(localUri);
    console.log('fileInfo: ', fileInfo.uri)
    if(!fileInfo.exists){
      return
    }
    const { sound } = await Audio.Sound.createAsync(
      { uri: fileInfo.uri },
      { shouldPlay: true }
    );
    setSound(sound);
    setIsPlaying(true);

    sound.setOnPlaybackStatusUpdate(async (status) => {
      if (status.didJustFinish) {
        const currentIndx = tracks.indexOf(currentTrack)
        const nextIndex = (currentIndx + 1) % tracks.length
        const nextTrack = tracks[nextIndex]
        console.log('nextTrack: ', nextTrack)
        const nextFileUri = `${FileSystem.documentDirectory}music_box/Boorn/${nextTrack}`
        await sound.unloadAsync()
        console.log('nextFileUri: ', nextFileUri)
        const { sound: newSound } = await Audio.Sound.createAsync({
          uri: nextFileUri,
          shouldPlay: true
        })
        setSound(newSound)
        setIsPlaying(true);
        setCurrentTrack(nextTrack)
      }
    });
  }

  async function handlePlayPause() {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } else {
      loadAndPlayAudio();
    }
  }

  return (
    <LinearGradient style={styles.player} colors={['rgba(122, 145, 240, 1)', 'rgba(220, 92, 189, 1)']}>
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle}>{trackTitleSlice(currentTrack)}</Text>
      </View>
      <View style={styles.control}>
        <Ionicons name="play-skip-back" size={34} color="white" />
        {isPlaying ? (
          <MaterialCommunityIcons name="pause-circle" size={34} color="white" onPress={handlePlayPause}/>
        ) : (
          <FontAwesome name="play-circle" size={34} color="white" onPress={handlePlayPause}/>
        )}
        <Ionicons name="play-skip-forward" size={34} color="white" />
      </View>
      <View style={styles.volume}>
        <MaterialIcons name="volume-up" size={34} color="white" />
      </View>
    </LinearGradient>
  );
}


