import React from 'react';

import { styles } from './styles'

import Header from '../../ui/header/Header';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppContext } from '../../../hooks/AppContext';

import { getClientCollections } from '../../../api';


export default function PlayList() {
  const { user } = React.useContext(AppContext)
  const [collections, setCollections] = React.useState([])

  const clientCollections = async () => {
    const response = await getClientCollections()
    console.log(response)
    if (response.status === 200) {
      setCollections(response.data)
    }
  }

  React.useEffect(() => {
    clientCollections()
  }, [user])
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
          <Text>123</Text>
          <View>
            {collections.map((collectionItem) => (
              <Text key={collectionItem.id}>{collectionItem.name}</Text>
            ))}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}