/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {configureFonts, MD3DarkTheme, PaperProvider} from 'react-native-paper';
import {name as appName} from './app.json';
import {NavigationContainer} from '@react-navigation/native';
import MovieDetailScreen from './src/screens/MovieDetailScreen';
import PlayerScreen from './src/screens/PlayerScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SeriesPlayerScreen from './src/screens/SeriesPlayerScreen';
import SeriesDetailScreen from './src/screens/SeriesDetailScreen';
import {enableScreens} from 'react-native-screens';

enableScreens(true);

const Stack = createNativeStackNavigator();

const fontConfig = {
  android: {
    regular: {
      fontFamily: 'ProductSans-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'ProductSans-Medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'ProductSans-Light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Roboto-Thin',
      fontWeight: 'normal',
    },
  },
};

const theme = {
  // ...MD3LightTheme,
  ...MD3DarkTheme,
  fonts: configureFonts({config: fontConfig}),
};

export default function Main() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        {/* <App /> */}
        <Stack.Navigator screenOptions={{headerShown: false}}>
          {/* Main Tab Navigator */}
          <Stack.Screen name="MainTabs" component={App} />
          {/* Player Screen outside of the Tab Navigator */}
          <Stack.Screen name="PlayerScreen" component={PlayerScreen} />
          <Stack.Screen
            name="SeriesPlayerScreen"
            component={SeriesPlayerScreen}
          />
          <Stack.Screen
            name="MovieDetailScreen"
            component={MovieDetailScreen}
            options={{title: 'Movie Details'}}
          />
          <Stack.Screen
            name="SeriesDetailScreen"
            component={SeriesDetailScreen}
            options={{title: 'Series Details'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
