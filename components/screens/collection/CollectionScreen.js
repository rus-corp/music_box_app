import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles'


export default function CollectionScreen({ route }) {
  const { id } = route.params
  const [tracks, setTracks] = React.useState([])

  return(
    <View>
      <Text>COllection {id}</Text>
    </View>
  );
}