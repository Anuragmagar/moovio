import React from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Pressable,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Divider} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

const {height} = Dimensions.get('window');

const SettingsScreen = () => {
  const navigation = useNavigation();

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.container}>
        <LinearGradient
          colors={['rgba(0, 128, 0, 0.3)', 'transparent']}
          style={styles.gradient}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
        />
        <View style={styles.contentContainer}>
          <ScrollView
            style={[styles.scrollView, {marginTop: StatusBar.currentHeight}]}>
            <Text style={styles.title}>Preferences</Text>

            <View
              style={{
                flexDirection: 'row',
                paddingRight: 15,
                justifyContent: 'space-between',
                backgroundColor: '#3d3b3c',
                padding: 10,
                paddingLeft: 15,
                borderRadius: 10,
                opacity: 0.8,
                marginTop: 15,
              }}>
              <Text style={styles.typo}>Share the App!</Text>
              <View style={{flexDirection: 'row'}}>
                <Ionicons
                  name="clipboard-outline"
                  style={{marginRight: 15}}
                  color="white"
                  size={20}
                />
                <Ionicons name="share-outline" color="white" size={20} />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                paddingRight: 1,
                marginTop: 25,
                marginBottom: 15,
              }}>
              <Ionicons
                name="timer"
                color="#e6e6e6"
                size={25}
                style={{marginRight: 10}}
              />
              <Text style={styles.typo}>Recently Watched</Text>
            </View>
            <Divider theme={{colors: {primary: 'white'}}} bold />
            <View
              style={{
                flexDirection: 'row',
                paddingRight: 1,
                marginTop: 15,
                marginBottom: 15,
              }}>
              <Ionicons
                name="settings"
                color="#e6e6e6"
                size={25}
                style={{marginRight: 10}}
              />
              <Text style={styles.typo}>Settings</Text>
            </View>
            <Divider theme={{colors: {primary: 'white'}}} bold />

            <View
              style={{
                flexDirection: 'row',
                paddingRight: 1,
                marginTop: 15,
                marginBottom: 15,
              }}>
              <Ionicons
                name="time"
                color="#e6e6e6"
                size={25}
                style={{marginRight: 10}}
              />
              <Text style={styles.typo}>Check for updates</Text>
            </View>
            <Divider theme={{colors: {primary: 'white'}}} bold />
            <Pressable
              onPress={() => {
                navigation.navigate('AboutScreen');
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  paddingRight: 1,
                  marginTop: 15,
                  marginBottom: 15,
                }}>
                <Ionicons
                  name="information-circle"
                  color="#e6e6e6"
                  size={25}
                  style={{marginRight: 10}}
                />
                <Text style={styles.typo}>About Moovio</Text>
              </View>
            </Pressable>
            <Divider theme={{colors: {primary: 'white'}}} bold />
          </ScrollView>
        </View>
      </View>
    </>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
    height: height * 0.7,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height * 0.3,
  },
  scrollView: {
    padding: 15,
    flex: 1,
  },
  title: {
    color: 'white',
    fontSize: 26,
    fontFamily: 'ProductSans-Regular',
    marginBottom: 10,
  },
  typo: {
    color: 'white',
    fontSize: 15,
  },
});
