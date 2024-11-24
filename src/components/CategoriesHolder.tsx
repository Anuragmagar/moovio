import React from 'react';
import {View, Image, Text, StyleSheet, ImageSourcePropType} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
interface CategoriesHolderProps {
  imgUrl: number;
  title: string;
}

const categoryImages: {[key: number]: ImageSourcePropType} = {
  1: require('../assets/images/categories/1.jpg'),
  2: require('../assets/images/categories/2.jpg'),
  3: require('../assets/images/categories/3.jpg'),
  4: require('../assets/images/categories/4.jpg'),
  5: require('../assets/images/categories/5.jpg'),
  6: require('../assets/images/categories/6.jpg'),
  7: require('../assets/images/categories/7.jpg'),
  8: require('../assets/images/categories/8.jpg'),
  9: require('../assets/images/categories/9.jpg'),
  10: require('../assets/images/categories/10.jpg'),
  11: require('../assets/images/categories/11.jpg'),
  12: require('../assets/images/categories/12.jpg'),
  13: require('../assets/images/categories/13.jpg'),
  14: require('../assets/images/categories/14.jpg'),
  15: require('../assets/images/categories/15.jpg'),
  16: require('../assets/images/categories/16.jpg'),
  17: require('../assets/images/categories/17.jpg'),
  18: require('../assets/images/categories/18.jpg'),
  19: require('../assets/images/categories/19.jpg'),
};

const CategoriesHolder: React.FC<CategoriesHolderProps> = ({imgUrl, title}) => {
  return (
    <View style={styles.container}>
      <Image source={categoryImages[imgUrl]} style={styles.image} />
      <LinearGradient
        colors={['rgba(31, 31, 31, 1)', 'rgba(31, 31, 31, 0)']}
        style={styles.gradient}
        start={{x: 0, y: 1}}
        end={{x: 0, y: 0}}
      />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(111, 111, 111, 1)',
    borderRadius: 10,
    overflow: 'hidden',
    width: '48.75%',
    aspectRatio: 16 / 9,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
  },
  title: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default CategoriesHolder;
