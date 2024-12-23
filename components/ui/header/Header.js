import React from 'react';
import { View, Text, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { styles } from './styles'


export default function Header() {
  return(
    <LinearGradient style={styles.headerContainer} colors={['rgba(122, 145, 240, 1)', 'rgba(220, 92, 189, 1)']}>
      <View style={styles.headerImage}>
        <Image source={require('../../../assets/main/header_logo.png')}/>
      </View>
      <View style={styles.headerContent}>
        <Text style={styles.headerItem}>Плейлисты</Text>
        <Text style={styles.headerItem}>Play</Text>
        <Text style={styles.headerItem}>Настройки</Text>
      </View>
    </LinearGradient>
  );
}