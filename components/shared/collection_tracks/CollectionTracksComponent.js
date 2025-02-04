import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../collection_item/styles';


export default function CollectionTracksComponent({ collectionTitle }) {
  return(
    <View>
      <Text>Collection Tracks Component {collectionTitle}</Text>
    </View>
  );
}