import React from 'react';
import { createStaticNavigation, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import Auth from '../components/screens/auth/Auth';
import PlayList from '../components/screens/playlist/PlayList';
import CollectionScreen from '../components/screens/collection/CollectionScreen';
import { AppContext } from '../hooks/AppContext';


const Stack = createNativeStackNavigator()


export default function RootStack() {
  const { user } = React.useContext(AppContext)
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name='PlayList' component={PlayList} />
          <Stack.Screen name='CollectionDetails' component={CollectionScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name='Auth' component={Auth}/>
        </>
      )}
    </Stack.Navigator>
  )
}


// const RootStack = createNativeStackNavigator({
//   initialRouteName: 'Auth',
//   screenOptions: {
//     headerShown: false
//   },
//   screens: {
//     Auth: Auth,
//     PlayList: PlayList,
//     CollectionDetails: CollectionScreen,
//   },
// });

// export const Navigation = createStaticNavigation(RootStack);