import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import BootSplash from 'react-native-bootsplash';

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const HomeScreen = () => {
  const randomNumber = generateRandomNumber(1, 100);
  const randomType = generateRandomNumber(0, 1);
  const [logo, setLogo] = useState();
  const [moovio, setMoovio] = useState();
  const [moovioType, setMoovioType] = useState();
  const [trendingMovie, setTrendingMovie] = useState();
  const [trendingTv, setTrendingTv] = useState();
  const navigation = useNavigation();

  const formatDate = dateString => {
    const date = new Date(dateString);
    const options = {year: 'numeric', month: 'long', day: 'numeric'};
    return date.toLocaleDateString('en-US', options);
  };

  useEffect(() => {
    SystemNavigationBar.setNavigationColor('#424242');
  }, []);

  useEffect(() => {
    console.log('this is from env', process.env.API_URL);
    axios
      .get(
        `${process.env.API_URL}/${
          randomType == 0 ? 'tv' : 'movie'
        }/top_rated?language=en-US&page=${randomNumber}`,
        {
          headers: {
            accept: 'application/json',
            authorization: `Bearer ${process.env.API_TOKEN}`,
          },
        },
      )
      .then(response => {
        var data = response.data;
        var nextRand = generateRandomNumber(1, data.results.length);

        setMoovio(data.results[nextRand]);
        setMoovioType(randomType);

        BootSplash.hide({fade: true});
        console.log('BootSplash has been hidden successfully');
        axios
          .get(
            `${process.env.API_URL}/${randomType == 0 ? 'tv' : 'movie'}/${
              data.results[nextRand]?.id ?? data.results[nextRand + 1]?.id
            }/images?include_image_language=en`,
            {
              headers: {
                accept: 'application/json',
                authorization: `Bearer ${process.env.API_TOKEN}`,
              },
            },
          )
          .then(response => {
            console.log('this is images');
            console.log(response.data);

            setLogo(response.data.logos[1]?.file_path);
          });
      })
      .catch(error => console.error(error));

    axios
      .get(
        `${process.env.API_URL}/discover/movie?include_adult=true&language=en-US&page=1&sort_by=popularity.desc`,
        {
          headers: {
            accept: 'application/json',
            authorization: `Bearer ${process.env.API_TOKEN}`,
          },
        },
      )
      .then(response => {
        setTrendingMovie(response.data.results);
      });

    axios
      .get(`${process.env.API_URL}/trending/tv/week?language=en-US`, {
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${process.env.API_TOKEN}`,
        },
      })
      .then(response => {
        console.log('tv');
        console.log(response.data);
        setTrendingTv(response.data.results);
      });
  }, []);

  if (!moovio) {
    return <ActivityIndicator animating={true} color="white" />;
  }

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />

      <ScrollView
        style={styles.container}
        bounces={true}
        overScrollMode="always"
        showsVerticalScrollIndicator={false}>
        <Pressable
          onPress={() => {
            if (moovioType == 0) {
              navigation.navigate('SeriesDetailScreen', {mov: moovio});
            } else {
              navigation.navigate('MovieDetailScreen', {mov: moovio});
            }
          }}>
          <View style={styles.heroSection}>
            <Image
              source={{
                uri: moovio
                  ? `https://image.tmdb.org/t/p/original/${moovio.backdrop_path}`
                  : 'https://via.placeholder.com/200',
              }}
              style={styles.backdropImage}
            />
            <LinearGradient
              colors={['rgba(31, 31, 31, 0)', 'rgba(31,31,31, 1)']}
              style={styles.gradient}
            />
            <View style={styles.movieInfo}>
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/original/${logo}`,
                }}
                resizeMode="center"
                style={{height: '60', width: '100%'}}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <Image
                  source={require('../../src/assets/images/imdb.png')}
                  style={{height: 10, width: 25}}
                />
                <Text style={{color: 'white', fontSize: 12, marginLeft: 10}}>
                  {moovio.vote_average.toFixed(1)} |{' '}
                  {moovioType == 0 ? 'TV' : 'Movie'} |{' '}
                  {formatDate(moovio.first_air_date || moovio.release_date)}
                </Text>
              </View>
            </View>
          </View>
        </Pressable>
        <View
          style={{
            paddingLeft: 20,
          }}>
          <Text
            style={{
              color: 'white',
              fontFamily: 'ProductSans-Medium',
              fontSize: 16,
              marginBottom: 10,
            }}>
            Movies Trending Today
          </Text>
          <FlatList
            data={trendingMovie}
            horizontal
            keyExtractor={item => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('MovieDetailScreen', {mov: item});
                }}>
                <View style={styles.movieCard}>
                  <Image
                    source={{
                      uri: item.poster_path
                        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                        : 'https://via.placeholder.com/200',
                    }}
                    style={styles.movieImage}
                  />
                  <Text style={styles.movieTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
        <View style={{marginBottom: 10, marginTop: 20, paddingLeft: 20}}>
          <Text
            style={{
              color: 'white',
              fontFamily: 'ProductSans-Medium',
              fontSize: 16,
              marginBottom: 10,
            }}>
            TV Shows Trending Today
          </Text>
          <FlatList
            data={trendingTv}
            horizontal
            keyExtractor={item => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('SeriesDetailScreen', {mov: item});
                }}>
                <View style={styles.movieCard}>
                  <Image
                    source={{
                      uri: item.poster_path
                        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                        : 'https://via.placeholder.com/200',
                    }}
                    style={styles.movieImage}
                  />
                  <Text style={styles.movieTitle} numberOfLines={1}>
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f1f1f',
  },
  heroSection: {
    height: 400,
    position: 'relative',
  },
  backdropImage: {
    width: '100%',
    height: 400,
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 400,
  },
  movieInfo: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  posterImage: {
    height: 150,
    width: 100,
    borderRadius: 8,
  },
  titleSection: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  rating: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginLeft: 5,
  },
  movieCard: {
    marginRight: 15,
    alignItems: 'flex-start',
    width: 120,
  },
  movieImage: {
    width: 120,
    height: 180,
  },
  movieTitle: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
});
