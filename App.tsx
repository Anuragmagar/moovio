import React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {
  Home3,
  MusicPlaylist,
  SearchNormal1,
  Setting2,
} from 'iconsax-react-native';
import HomeScreen from './src/screens/HomeScreen';
import SearchStackNavigator from './src/screens/SearchStackNavigator';
import WatchListScreen from './src/screens/WatchList';
import SettingsStackNavigator from './src/screens/SettingsStackNavigator';

const Tab = createMaterialBottomTabNavigator();

function App(): React.JSX.Element {
  return (
    <Tab.Navigator
      activeColor="white"
      inactiveColor="#D1D1D1"
      barStyle={{backgroundColor: '#424242', height: 70}}
      activeIndicatorStyle={{backgroundColor: '#f2e6d9'}}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, focused}) => (
            <Home3 size={20} color={focused ? 'black' : 'white'} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        // component={SearchScreen}
        component={SearchStackNavigator}
        options={{
          tabBarIcon: ({color, focused}) => (
            <SearchNormal1 size={20} color={focused ? 'black' : 'white'} />
          ),
        }}
      />
      <Tab.Screen
        name="Watch List"
        component={WatchListScreen}
        options={{
          tabBarIcon: ({color, focused}) => (
            <MusicPlaylist size={20} color={focused ? 'black' : 'white'} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStackNavigator}
        options={{
          tabBarIcon: ({color, focused}) => (
            <Setting2 size={20} color={focused ? 'black' : 'white'} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default App;
