import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import LinearGradient from 'react-native-linear-gradient';
import {allGetStream} from '../provider/autoEmbed/allGetStream';
import {useNavigation} from '@react-navigation/native';
import {Dialog, Portal, Button} from 'react-native-paper';
import {headers} from '../headers';

const {width} = Dimensions.get('window');

const MovieDetailScreen = ({route}) => {
  const {mov} = route.params;
  console.log('mov from detail', mov);
  const [movie, setMovie] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [visible, setVisible] = React.useState(false);
  const [gettingStream, setGettingStream] = useState(false);
  const [links, setLinks] = useState(null);
  const [logo, setLogo] = useState();
  const abortControllerRef = useRef(null);

  const showDialog = () => setVisible(true);

  const hideDialog = () => {
    setVisible(false);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const navigation = useNavigation();

  const getStream = async () => {
    setGettingStream(true);
    showDialog();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setLinks(null);

      var link = await allGetStream(
        movie.imdb_id,
        '',
        '',
        movie.title,
        movie.id,
        movie.release_date,
        'movie',
        {signal: controller.signal},
      );

      setLinks(link);
      // var link = [];
      if (link.length === 0) {
        setLinks(null);
        // setLinks({
        //   server: 'Fucking server1',
        //   link: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        //   subtitles: [
        //     {
        //       language: 'English',
        //       url: 'https://raw.githubusercontent.com/leandrowkz/react-native-subtitles/master/test.vtt',
        //     },
        //   ],
        // });
        // link = links;
        return;
      }
      if (controller.signal.aborted) {
        console.log('Stream request aborted; skipping navigation.');
        return;
      }
      hideDialog();
      navigation.navigate('PlayerScreen', {
        // streamData: link,
        streamData: link,
        movie: movie,
        logo: logo,
      });
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Stream request was aborted');
      } else {
        console.error(error);
      }
    } finally {
      setGettingStream(false);
      abortControllerRef.current = null;
    }
  };

  useEffect(() => {
    axios
      .get(
        `${process.env.API_URL}/movie/${mov.id}?append_to_response=similar%2C%20casts`,
        {
          headers: {
            accept: 'application/json',
            authorization: `Bearer ${process.env.API_TOKEN}`,
          },
        },
      )
      .then(response => {
        setMovie(response.data);
        axios
          .get(
            `https://v3-cinemeta.strem.io/meta/movie/${response.data.imdb_id}.json`,
            {
              headers: headers,
            },
          )
          .then(response => {
            setLogo(response.data.meta.logo);
          });
      })
      .catch(error => console.error(error));
  }, [mov.id]);

  const extractYear = date => {
    return date.split('-')[0];
  };

  const convertMinutesToHoursAndMinutes = totalMinutes => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}hr ${minutes}m`;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.overview}>{movie?.overview}</Text>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Genre</Text>
              <Text style={styles.sectionContent}>
                {movie?.genres?.map(genre => genre.name).join(', ')}
              </Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Production</Text>
              <Text style={styles.sectionContent}>
                {movie?.production_companies
                  ?.map(company => company.name)
                  .join(', ')}
              </Text>
            </View>
          </View>
        );
      case 'casts':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionContent}>
              Cast information coming soon...
            </Text>
          </View>
        );
      case 'related':
        return (
          <View style={styles.tabContent}>
            {movie?.similar?.results &&
              movie.similar.results
                .reduce((rows, item, index) => {
                  if (index % 3 === 0) rows.push([]);
                  rows[rows.length - 1].push(item);
                  return rows;
                }, [])
                .map((row, rowIndex) => (
                  <View key={rowIndex} style={styles.movieRow}>
                    {row.map(item => (
                      <TouchableOpacity
                        key={item.id}
                        onPress={() => {
                          if (item.media_type === 'movie') {
                            navigation.navigate('MovieDetailScreen', {
                              mov: item,
                            });
                          } else {
                            navigation.navigate('SeriesDetailScreen', {
                              mov: item,
                            });
                          }
                        }}
                        style={styles.movieItemContainer}>
                        <Image
                          source={{
                            uri: item.poster_path
                              ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                              : 'https://via.placeholder.com/200',
                          }}
                          style={styles.movieItemImage}
                        />
                        <Text style={styles.movieItemTitle} numberOfLines={1}>
                          {item.name || item.title || item.original_title}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ))}
          </View>
        );
      default:
        return null;
    }
  };

  if (!movie) return <ActivityIndicator animating={true} color="black" />;

  return (
    <ScrollView style={styles.container}>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog} dismissable={false}>
          <Dialog.Content>
            {gettingStream && !links && (
              <View style={{flexDirection: 'row'}}>
                <ActivityIndicator
                  size="small"
                  animating={true}
                  color="white"
                />
                <Text
                  style={{
                    color: 'white',
                    fontSize: 14,
                    fontWeight: 'bold',
                    marginLeft: 10,
                  }}>
                  Grabbing streamable links from Server 1.
                </Text>
              </View>
            )}

            {!gettingStream && (links || links?.length > 0) ? (
              <View style={{flexDirection: 'row'}}>
                <Ionicons name="checkmark-done" color="white" size={20} />
                <Text
                  style={{
                    color: 'white',
                    fontSize: 14,
                    fontWeight: 'bold',
                    marginLeft: 10,
                  }}>
                  Stream found, playing...
                </Text>
              </View>
            ) : null}

            {!gettingStream && links == null ? (
              <View style={{flexDirection: 'row'}}>
                <Ionicons name="close-circle-sharp" color="white" size={20} />
                <Text
                  style={{
                    color: 'white',
                    fontSize: 14,
                    fontWeight: 'bold',
                    marginLeft: 10,
                  }}>
                  No streamable links found.
                </Text>
              </View>
            ) : null}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <View style={styles.heroSection}>
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`,
          }}
          style={styles.backdropImage}
        />

        <LinearGradient
          colors={['rgba(31, 31, 31, 0)', 'rgba(31, 31, 31, 1)']}
          style={styles.gradient}
        />
        <View style={styles.movieInfo}>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/original/${movie.poster_path}`,
            }}
            style={styles.posterImage}
          />
          <View style={styles.titleSection}>
            <Text style={styles.title}>
              {movie.name ||
                movie.title ||
                movie.original_name ||
                movie.original_title}
            </Text>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={15} color="yellow" />
              <Text style={styles.rating}>
                {`${movie.vote_average.toFixed(
                  1,
                )} · ${convertMinutesToHoursAndMinutes(
                  movie?.runtime || 0,
                )} · ${extractYear(movie.release_date)}`}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.watchButton}
          onPress={() => {
            getStream();
          }}>
          <Text style={styles.watchButtonText}>Watch Now</Text>
          <Icon name="play" size={18} color="black" style={{marginLeft: 5}} />
        </TouchableOpacity>
        <View style={styles.iconButtons}>
          <TouchableOpacity style={styles.iconButton}>
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
              <Icon name="bookmark-o" size={20} color="white" />
              <Text
                style={{
                  color: 'white',
                  marginTop: 5,
                  fontSize: 13,
                  fontFamily: 'ProductSans-Regular',
                }}>
                Add List
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
              <SimpleLineIcons name="social-youtube" size={20} color="white" />
              <Text
                style={{
                  color: 'white',
                  marginTop: 5,
                  fontSize: 13,
                  fontFamily: 'ProductSans-Regular',
                }}>
                Trailer
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
              <MaterialCommunityIcons
                name="share-outline"
                size={20}
                color="white"
              />
              <Text
                style={{
                  color: 'white',
                  marginTop: 5,
                  fontSize: 13,
                  fontFamily: 'ProductSans-Regular',
                }}>
                Share
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <View style={styles.tabButtons}>
          {['overview', 'casts', 'related'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                activeTab === tab && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab(tab)}>
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === tab && styles.activeTabButtonText,
                ]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {renderTabContent()}
      </View>
    </ScrollView>
  );
};

export default MovieDetailScreen;

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
    left: 20,
    right: 10,
    flexDirection: 'row',
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
    fontFamily: 'ProductSans-Medium',
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10,
  },
  watchButton: {
    backgroundColor: '#f2e6d9',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  watchButtonText: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  iconButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 15,
  },
  tabContainer: {
    padding: 20,
  },
  tabButtons: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tabButton: {
    marginRight: 20,
    paddingBottom: 5,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#f2e6d9',
  },
  tabButtonText: {
    color: 'grey',
    fontSize: 16,
  },
  activeTabButtonText: {
    color: '#f2e6d9',
  },
  tabContent: {
    marginTop: 10,
  },
  overview: {
    color: 'white',
    lineHeight: 20,
  },
  section: {
    marginTop: 15,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionContent: {
    color: 'white',
    fontSize: 14,
  },
  movieRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  movieItemContainer: {
    flex: 1,
    alignItems: 'center',
    maxWidth: (width - 60) / 3,
  },
  movieItemImage: {
    borderRadius: 5,
    height: 160,
    width: '100%',
    resizeMode: 'cover',
  },
  movieItemTitle: {
    color: 'white',
    fontSize: 13,
    marginTop: 5,
  },
});
