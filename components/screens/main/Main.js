import React from 'react';

import { styles } from './styles'

import Header from '../../ui/header/Header';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Main() {
  return(
    <View style={styles.mainContainer}>
      <Header />
      <LinearGradient colors={['rgba(120, 135, 251, 0.312)', 'rgba(204, 102, 198, 0.1508)', 'rgba(255, 255, 255, 0.52)']}>
        <View style={styles.mainContent}>
          <View style={styles.mainContentHeader}>
            <Text style={styles.headerContentItem}>Рекомендации</Text>
            <Text style={styles.headerContentItem}>Избранные</Text>
          </View>
          <View style={styles.line}></View>
        </View>
      </LinearGradient>
    </View>
  );
}