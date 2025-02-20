import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


import { Navigation } from './router/router';
import AppProvider from './hooks/AppContext';

// import NavigationWrapper from './router/router';



export default function App() {
  return (
    <AppProvider>
      <View style={styles.container}>
        <SafeAreaView style={styles.container}>
          <Navigation />
        </SafeAreaView>
      </View>
    </AppProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
