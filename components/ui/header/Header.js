import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles'


export default function Header() {
  const navigation = useNavigation()
  const handlePress = (screen) => {
    navigation.navigate(screen)
  }
  return(
    <LinearGradient style={styles.headerContainer} colors={['rgba(122, 145, 240, 1)', 'rgba(220, 92, 189, 1)']}>
      <View style={styles.headerImage}>
        <Image source={require('../../../assets/main/header_logo.png')}/>
      </View>
      <View style={styles.headerContent}>
        <Text style={styles.headerItem}>Плейлисты</Text>
        <Text style={styles.headerItem}>Play</Text>
        <TouchableOpacity onPress={() => handlePress('Settings')}>
          <Text style={styles.headerItem}>Настройки</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}