import React from 'react';
import { View, Text, Image } from 'react-native';
import { styles } from './styles';


export default function CollectionHeader({
  collectionTitle,
  collectionImage,
  tracksCount
}) {
  const imageSource = 'https://music-sol.ru/api' + collectionImage
  return(
    <View style={styles.headerContainer}>
      <View style={styles.containerTitle}>
        <Image
        source={{uri: imageSource}}
        style={styles.image}/>
        <Text style={styles.collectionTitle}>{collectionTitle}</Text>
      </View>
      <View style={styles.containerContent}>
        <Text style={styles.collectionDesc}>{tracksCount} треков</Text>
        <Text>Последнее обновление</Text>
      </View>
    </View>
  );
}