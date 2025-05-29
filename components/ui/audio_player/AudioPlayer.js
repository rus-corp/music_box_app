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
import { trackLogToFile } from '../../shared/helpers';
import { appLogToFile } from '../../shared/helpers';



export default function AudioPlayer({
  tracks,
  fetchBases,
  baseName
}) {

  const [sound, setSound] = React.useState(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTrack, setCurrentTrack] = React.useState(tracks[0])
  const [currentTrackIndex, setCurrentTrackIndex] = React.useState(0)
  const [currentBaseName, setCurrentBaseName] = React.useState(baseName)

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
      return () => {
        if (sound) {
          sound.unloadAsync().catch(() => {})
        }
      }
      // return sound
      //   ? () => {
      //     sound.unloadAsync()
      //   }
      //   : undefined
    }
  }, [tracks])

  React.useEffect(() => {
    if (!sound) return;
    let isCancelled = false
    const statusUpdate = async (status) => {
      if (status.didJustFinish && !isCancelled) {
        try {
          const basetoUse = currentBaseName || baseName
          await trackLogToFile(currentTrack, basetoUse)
          await appLogToFile(`track play finish ${currentTrack}`)

          let nextTrack = null
          let nextBaseName = currentBaseName
          let newTracks = tracks

          const nextIndex = currentTrackIndex + 1
          if (nextIndex >= tracks.length) {
            await appLogToFile(`track list ended, got new track list`)
            const newTracksData = await fetchBases()
            newTracks = newTracksData.selectedTracks
            nextBaseName = newTracksData.baseName
            setCurrentBaseName(newTracksData.baseName)
            setCurrentTrackIndex(0)
            nextTrack = newTracks[0]
          } else {
            setCurrentTrackIndex(nextIndex)
            nextTrack = tracks[nextIndex];
          }

          if (sound) {
            await sound.unloadAsync()
          }
          if (!isCancelled) {
            const fileUri = `${FileSystem.documentDirectory}bases/${nextBaseName}/${nextTrack}`
            const { sound: NewSound } = await Audio.Sound.createAsync(
              { uri: fileUri },
              { shouldPlay: true }
            )
            setSound(NewSound)
            setCurrentTrack(nextTrack)
            setIsPlaying(true);
          }
        } catch {
          console.log('Error switching track', error);
        }
      }
    }
    sound.setOnPlaybackStatusUpdate(statusUpdate)
    return () => {
      isCancelled = true
      sound.setOnPlaybackStatusUpdate(null)
    }
  }, [sound])

  async function loadAndPlayAudio() {
    if (!currentTrack) return;
    const fileUri = `${FileSystem.documentDirectory}bases/${baseName}/${currentTrack}`
    console.log(fileUri)
    const { sound } = await Audio.Sound.createAsync(
      { uri: fileUri },
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


