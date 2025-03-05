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


export default function AudioPlayer({ tracks, onRequestMoreTracks, fetchBases }) {
  console.log('tracks', tracks)
  console.log('15 tracks len: ', tracks.length)
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
    // if (tracks.length > 0 && trackList.length === 0) {
    //   setTrackList([...tracks])
    // }
    if (!currentTrack) {
      setCurrentTrack(tracks[0])
      console.log('1ef tracks len', tracks.length)
      // console.log('tracks[0]',tracks[0])
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
        const nextIndex = currentTrackIndex + 1
        console.log('nextIndex', nextIndex)
        // const updatedTrackList = trackList.filter(track => track !== currentTrack)
        // console.log('2 effect tracks', tracks.length)
        // console.log('2ef traksList len', trackList.length)
        // console.log('updatedTrackList', updatedTrackList.length)
        if (nextIndex > (tracks.length - 1)) {
          if (onRequestMoreTracks) {
            console.log('request new trackList')
            const newTracks = fetchBases()
            console.log('newTracks', newTracks)
            setCurrentTrackIndex(0)
            const nextTrack = newTracks[0]
            setCurrentTrack(nextTrack)
            console.log('track after new request', nextTrack)
            await sound.unloadAsync();
            const {sound: newSound} = await Audio.Sound.createAsync(
              { uri: nextTrack },
              { shouldPlay: true }
            )
            setSound(newSound)
            setIsPlaying(true)
            // setTrackList(newTracks)
          }
        } else {
          setCurrentTrackIndex(nextIndex)
          // const newTrackLIst = trackList.slice(1)
          // setTrackList(updatedTrackList)
          const nextTrack = tracks[nextIndex]
          console.log('nextTrack', nextTrack)
          // setTrackList(newTrackLIst)
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
    // const localUri = `${FileSystem.documentDirectory}${currentTrack}`;
    // console.log('localUri: ', localUri)
    // const fileInfo = await FileSystem.getInfoAsync(currentTrack);
    // console.log('fileInfo: ', fileInfo.uri)
    // if(!fileInfo.exists){
    //   return
    // }
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


