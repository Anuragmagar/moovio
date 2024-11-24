import React from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

const {height} = Dimensions.get('window');

const AboutScreen = () => {
  const navigation = useNavigation();

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <ScrollView
            style={[styles.scrollView, {marginTop: StatusBar.currentHeight}]}>
            <View
              style={{
                flexDirection: 'row',
                paddingLeft: 1,
              }}>
              <Pressable
                onPress={() => {
                  navigation.goBack();
                }}>
                <Ionicons
                  name="chevron-back"
                  color="#e6e6e6"
                  size={22}
                  style={{marginRight: 10}}
                />
              </Pressable>
              <Text style={styles.title}>About Moovio</Text>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
              }}>
              <Image
                source={require('../assets/images/moovio1.png')}
                style={{
                  height: 100,
                  width: 100,
                  marginTop: 40,
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                paddingRight: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  marginTop: 10,
                  fontFamily: 'ProductSans-Black',
                }}>
                MOOVIO
              </Text>
              <Text
                style={{
                  marginTop: 10,
                  color: '#fcc182',
                  fontFamily: 'ProductSans-Black',
                  marginLeft: 5,
                }}>
                · ode to saam.
              </Text>
            </View>
            <Text
              style={{
                color: 'gray',
                textAlign: 'center',
                // marginTop: 30,
                marginBottom: 20,
              }}>
              1.0.0 — RELEASE
            </Text>
            <Text style={styles.typo}>
              A modern streaming service app that provides users with a
              convenient way to play and watch the latest movies and TV shows
              available on the internet. With a user-friendly interface and a
              vast collection of content, it aims to deliver an exceptional
              streaming experience to its users.
            </Text>
            <Text style={styles.section}>App Features:</Text>
            <Text style={styles.section_typo}>· Extensive Library</Text>
            <Text style={styles.section_typo}>· Search and Discover</Text>
            <Text style={styles.section_typo}>
              · Personalized Recommendations
            </Text>
            <Text style={styles.section_typo}>· Smart Watch History</Text>
            <Text style={styles.section_typo}>· High-Quality Streaming</Text>
            <Text style={styles.section_typo}>· Subtitle Selections</Text>
          </ScrollView>
        </View>
      </View>
    </>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    padding: 15,
    flex: 1,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'ProductSans-Regular',
    marginBottom: 10,
    marginLeft: 10,
  },
  typo: {
    color: '#ffffffb3',
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'justify',
  },
  section: {
    color: 'white',
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'justify',
    marginTop: 8,
    fontFamily: 'ProductSans-Medium',
  },
  section_typo: {
    color: '#ffffffb3',
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'justify',
    fontFamily: 'ProductSans-Regular',
    marginLeft: 10,
    lineHeight: 30,
  },
});
