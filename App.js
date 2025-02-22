import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';


// import { Navigation } from './router/router';
import AppProvider from './hooks/AppContext';
import RootStack from './router/router';

// import NavigationWrapper from './router/router';



// export default function App() {
//   return (
//     <AppProvider>
//       <View style={styles.container}>
//         <SafeAreaView style={styles.container}>
//           <Navigation />
//         </SafeAreaView>
//       </View>
//     </AppProvider>
//   );
// }

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </AppProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
