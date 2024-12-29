import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


import { Navigation } from './router/router';
import Auth from './components/screens/auth/Auth';
import Main from './components/screens/main/Main';




export default function App() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Navigation />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
