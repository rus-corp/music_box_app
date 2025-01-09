import React from 'react';
import { View, Text, Pressable, StyleSheet, Button } from 'react-native';
import { Audio } from 'expo-av';


export default function AudioPlayer({ tracks, playPress }) {
  console.log(tracks)
  const [sound, setSound] = React.useState(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTrack, setCurrentTrack] = React.useState(tracks[0])

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
    console.log(trackUri)
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
    <View style={styles.container}>
      <Button title={isPlaying ? 'Pause' : 'Play'} onPress={handlePlayPause} />
      <Button title="Stop" onPress={stopAudio} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});