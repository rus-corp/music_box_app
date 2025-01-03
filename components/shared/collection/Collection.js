import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from './styles'
import { baseUrl } from '../../../api';
import { useNavigation } from '@react-navigation/native';


export default function Collection({ collectionTitle, image, trackCount, collectionId }) {
  const imageSource = 'http://87.228.25.221:8000/api' + image
  const navigation = useNavigation()

  const handlePress = () => {
    navigation.navigate('CollectionDetails', { id: collectionId })
  }

  return(
    <TouchableOpacity style={{ width: '12%', height: 190 }} onPress={handlePress}>
      <View style={styles.collectionItem}>
        <Image style={styles.image} source={{uri: imageSource}}/>
        <View style={styles.content}>
          <Text style={styles.title}>{collectionTitle}</Text>
          <Text style={styles.desc}>{trackCount} трек</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}