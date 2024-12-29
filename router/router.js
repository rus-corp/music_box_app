import React from 'react';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Auth from '../components/screens/auth/Auth';
import Main from '../components/screens/main/Main';

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Auth',
  screenOptions: {
    headerShown: false
  },
  screens: {
    Auth: Auth,
    Main: Main,
  },
});

export const Navigation = createStaticNavigation(RootStack);