import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles'


export default function Collection({ collectionTitle, color, trackCount}) {
  return(
    <View style={[styles.collectionItem, {backgroundColor: color}]}>
      <Text>{collectionTitle}</Text>
    </View>
  );
}