import React from 'react';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Auth from '../components/screens/auth/Auth';
import PlayList from '../components/screens/playlist/PlayList';


const RootStack = createNativeStackNavigator({
  initialRouteName: 'Auth',
  screenOptions: {
    headerShown: false
  },
  screens: {
    Auth: Auth,
    PlayList: PlayList,
  },
});

export const Navigation = createStaticNavigation(RootStack);