import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles'
import Header from '../../ui/header/Header';
import { LinearGradient } from 'expo-linear-gradient';


export default function SettingsScreen() {
  return(
    <View style={styles.mainContainer}>
      <Header />
      <LinearGradient
      style={styles.mainContent}
      colors={['rgba(120, 135, 251, 0.312)', 'rgba(204, 102, 198, 0.1508)', 'rgba(255, 255, 255, 0.52)']}
      >
        <View style={styles.blockContent}>
          <Text>settings screen</Text>
        </View>
      </LinearGradient>
    </View>
  );
}