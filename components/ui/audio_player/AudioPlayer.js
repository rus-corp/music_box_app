import React from 'react';
import { View, Text, Alert } from 'react-native';
import { Audio, InterruptionModeAndroid } from 'expo-av';
import { styles } from './styles'
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getRandomTrack } from '../../shared/helpers';
import { saveTrackLogsToStorage } from '../../shared/helpers';

export default function AudioPlayer({
  tracks,
  onRequestMoreTracks,
  fetchBases,
  baseName
}) {

  const [sound, setSound] = React.useState(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTrack, setCurrentTrack] = React.useState(tracks[0])
  const [currentTrackIndex, setCurrentTrackIndex] = React.useState(0)

  const trackTitleSlice = (trackName) => {
    if (trackName) {
      const trackSliceName = trackName.split('/')
      return trackSliceName[trackSliceName.length - 1].slice(0, -4).replaceAll('_', ' ')
    } else {
      return ''
    }
  }
  
  React.useEffect(() => {
    if (!currentTrack) {
      setCurrentTrack(tracks[0])
      Audio.setAudioModeAsync({
        staysActiveInBackground: true,
        interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: true
      })
      return sound
        ? () => {
          sound.unloadAsync()
        }
        : undefined
    }
  }, [tracks, sound])

  React.useEffect(() => {
    if (!sound) return;
    const statusUpdate = async (status) => {
      if (status.didJustFinish) {
        await saveTrackLogsToStorage(
          tracks[currentTrackIndex],
          baseName
        )
        const nextIndex = currentTrackIndex + 1
        if (nextIndex > (tracks.length - 1)) {
          const newTracks = await fetchBases()
          console.log('newTracks', newTracks)
          setCurrentTrackIndex(0)
          const nextTrack = newTracks[0]
          setCurrentTrack(nextTrack)
          await sound.unloadAsync();
          const {sound: newSound} = await Audio.Sound.createAsync(
            { uri: nextTrack },
            { shouldPlay: true }
          )
          setSound(newSound)
          setIsPlaying(true)
        } else {
          setCurrentTrackIndex(nextIndex)
          const nextTrack = tracks[nextIndex]
          setCurrentTrack(nextTrack)
          await sound.unloadAsync();
          const {sound: newSound} = await Audio.Sound.createAsync(
            { uri: nextTrack },
            { shouldPlay: true }
          )
          setSound(newSound)
          setIsPlaying(true)
        }
      }
    }
    sound.setOnPlaybackStatusUpdate(statusUpdate)
    return () => {
      sound.setOnPlaybackStatusUpdate(null)
    }
  }, [sound, tracks, currentTrack])

  async function loadAndPlayAudio() {
    if (!currentTrack) return;
    const { sound } = await Audio.Sound.createAsync(
      { uri: currentTrack },
      { shouldPlay: true }
    );
    setSound(sound);
    setIsPlaying(true);
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
      await loadAndPlayAudio();
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


