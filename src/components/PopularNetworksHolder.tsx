import React from 'react';
import {View, Image, StyleSheet, ImageSourcePropType} from 'react-native';

interface PopularNetworksHolderProps {
  imgUrl: ImageSourcePropType;
}

const PopularNetworksHolder = ({imgUrl}: PopularNetworksHolderProps) => {
  return (
    <View style={styles.container}>
      <Image source={imgUrl} style={styles.image} resizeMode="contain" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(111, 111, 111, 1)',
    borderRadius: 5,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    marginRight: 15,
  },
  image: {
    width: 80,
    height: 30,
  },
});

export default PopularNetworksHolder;
