import React from 'react';
import { View, Text, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { styles } from './styles'
import { LinearGradient } from 'expo-linear-gradient';
import { getTrackMeta } from '../../shared/helpers/utils';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function AudioPlayer({ tracks, playPress }) {
  const [sound, setSound] = React.useState(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTrack, setCurrentTrack] = React.useState(tracks[0])
  const trackMeat = async() => {
    const fileUrl = `file:///data/user/0/host.exp.exponent/files/music_box/Boorn/${tracks[0]}`
    const response = await getTrackMeta(fileUrl)
    console.log('response', response)
  }
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
  React.useEffect(() => {
    return() => {
      if (sound) {
        sound.unloadAsync()
      }
    }
  }, [sound])

  async function loadAndPlayAudio() {
    console.log(currentTrack)
    const trackUri = `file:///data/user/0/host.exp.exponent/files/music_box/Boorn/${currentTrack}`
    console.log('trackUri', trackUri)
    const { sound } = await Audio.Sound.createAsync(
      { uri: `file:///data/user/0/host.exp.exponent/files/music_box/Boorn/${currentTrack}` },
      { shouldPlay: true }
    );
    setSound(sound);
    setIsPlaying(true);

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        const currentIndx = tracks.indexOf(currentTrack)
        const nextIndex = (currentIndx + 1) % tracks.length
        setCurrentTrack(tracks[nextIndex])
        setIsPlaying(false);
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

  async function stopAudio() {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
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


