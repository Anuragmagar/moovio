// src/navigators/SearchStackNavigator.js
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SettingsScreen from './SettingsScreen';
import AboutScreen from './AboutScreen';

const Stack = createNativeStackNavigator();

const SettingsStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="Preferences"
        component={SettingsScreen}
        options={{title: 'Preferences'}}
      />
      <Stack.Screen
        name="AboutScreen"
        component={AboutScreen}
        options={{
          title: 'About',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
};

export default SettingsStackNavigator;
