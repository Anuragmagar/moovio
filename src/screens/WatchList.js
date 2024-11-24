import React from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const {height} = Dimensions.get('window');

const WatchListScreen = () => {
  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.container}>
        <LinearGradient
          colors={['rgba(242, 230, 217, 0.2)', 'rgba(242, 230, 217, 0)']}
          style={styles.gradient}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          // useAngle={true}
          // angle={195}
          // angleCenter={{x: 0.5, y: 0.5}}
        />
        <View style={styles.contentContainer}>
          <ScrollView
            style={[styles.scrollView, {marginTop: StatusBar.currentHeight}]}>
            <Text style={styles.title}>Watch List</Text>
          </ScrollView>
        </View>
      </View>
    </>
  );
};

export default WatchListScreen;

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
    fontFamily: 'ProductSans-Regular',
    color: 'white',
    fontSize: 26,
    marginBottom: 10,
  },
  typo: {
    color: 'white',
    fontSize: 15,
  },
});
