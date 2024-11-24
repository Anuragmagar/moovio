import React, {useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  StatusBar,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PopularNetworksHolder from '../components/PopularNetworksHolder';
import CategoriesHolder from '../components/CategoriesHolder';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

const SearchScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState([]);
  const navigation = useNavigation();

  const handleSearch = text => {
    setSearchText(text);
  };

  const renderMovieItem = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        if (item.media_type == 'movie') {
          navigation.navigate('MovieDetailScreen', {mov: item});
        } else {
          navigation.navigate('SeriesDetailScreen', {mov: item});
        }
      }}>
      <View style={styles.movieItem} key={item.id}>
        <Image
          source={{
            uri: item.poster_path
              ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
              : 'https://via.placeholder.com/200',
          }}
          style={{
            borderRadius: 5,
            height: 160,
            resizeMode: 'cover',
            marginRight: 10,
          }}
        />
        <View>
          <Text
            style={{
              color: 'white',
              marginTop: 2,
              fontSize: 13,
            }}
            numberOfLines={1}>
            {item.name || item.title || item.original_title}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleSubmit = event => {
    const query = event.nativeEvent.text;
    console.log('getting the data');

    axios
      .get(
        `${process.env.API_URL}/search/multi?query=` +
          query +
          '&include_adult=true&language=en-US&page=1',
        {
          headers: {
            accept: 'application/json',
            authorization: `Bearer ${process.env.API_TOKEN}`,
          },
        },
      )
      .then(res => {
        console.log(res.data);
        setResults(res.data['results']);
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.container}>
        <LinearGradient
          colors={['rgba(128, 0, 128, 0.5)', 'transparent']}
          style={styles.gradient}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
        />
        <View style={styles.contentContainer}>
          <ScrollView
            style={[styles.scrollView, {marginTop: StatusBar.currentHeight}]}>
            <Text style={styles.title}>Search</Text>
            <View style={styles.searchContainer}>
              <Ionicons
                name="search"
                size={24}
                color="white"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder='Try searching "Iron Man..."'
                placeholderTextColor="#D1D1D1"
                onChangeText={handleSearch}
                onSubmitEditing={handleSubmit}
                value={searchText}
                returnKeyType="search"
              />
            </View>

            {searchText.length == 0 && results?.length == 0 ? (
              <View style={{backgroundColor: 'transparent', marginBottom: 25}}>
                <Text style={styles.sectionTitle}>Popular Networks</Text>
                <ScrollView
                  horizontal
                  style={styles.horizontalScroll}
                  showsHorizontalScrollIndicator={false}>
                  <PopularNetworksHolder
                    imgUrl={require('../assets/images/networks/netflix-white.png')}
                  />
                  <PopularNetworksHolder
                    imgUrl={require('../assets/images/networks/apple_tv_plus_white.png')}
                  />
                  <PopularNetworksHolder
                    imgUrl={require('../assets/images/networks/prime_white.png')}
                  />
                  <PopularNetworksHolder
                    imgUrl={require('../assets/images/networks/hulu_white.png')}
                  />
                  <PopularNetworksHolder
                    imgUrl={require('../assets/images/networks/hbo_white.png')}
                  />
                  <PopularNetworksHolder
                    imgUrl={require('../assets/images/networks/amc_white.png')}
                  />
                  <PopularNetworksHolder
                    imgUrl={require('../assets/images/networks/paramount_white.png')}
                  />
                </ScrollView>

                <Text style={styles.sectionTitle}>Popular Companies</Text>
                <ScrollView
                  horizontal
                  style={styles.horizontalScroll}
                  showsHorizontalScrollIndicator={false}>
                  <PopularNetworksHolder
                    imgUrl={require('../assets/images/networks/marvel_studio.png')}
                  />
                  <PopularNetworksHolder
                    imgUrl={require('../assets/images/networks/pixar_white.png')}
                  />
                  <PopularNetworksHolder
                    imgUrl={require('../assets/images/networks/warnerbros_white.png')}
                  />
                  <PopularNetworksHolder
                    imgUrl={require('../assets/images/networks/disney_white.png')}
                  />
                  <PopularNetworksHolder
                    imgUrl={require('../assets/images/networks/dc_white.png')}
                  />
                  <PopularNetworksHolder
                    imgUrl={require('../assets/images/networks/paramount_white.png')}
                  />
                  <PopularNetworksHolder
                    imgUrl={require('../assets/images/networks/columbia_white.png')}
                  />
                  <PopularNetworksHolder
                    imgUrl={require('../assets/images/networks/dreamworks_white.png')}
                  />
                </ScrollView>

                <Text style={styles.sectionTitle}>Browse Categories</Text>
                <View style={styles.categoriesGrid}>
                  <CategoriesHolder imgUrl={1} title="TV Shows" />
                  <CategoriesHolder imgUrl={2} title="Movies" />
                  <CategoriesHolder imgUrl={3} title="Action" />
                  <CategoriesHolder imgUrl={4} title="Adventure" />
                  <CategoriesHolder imgUrl={5} title="Animation" />
                  <CategoriesHolder imgUrl={6} title="Comedy" />
                  <CategoriesHolder imgUrl={7} title="Crime" />
                  <CategoriesHolder imgUrl={8} title="Documentry" />
                  <CategoriesHolder imgUrl={9} title="Drama" />
                  <CategoriesHolder imgUrl={10} title="Family" />
                  <CategoriesHolder imgUrl={11} title="Fantasy" />
                  <CategoriesHolder imgUrl={12} title="History" />
                  <CategoriesHolder imgUrl={13} title="Horror" />
                  <CategoriesHolder imgUrl={14} title="Mystery" />
                  <CategoriesHolder imgUrl={15} title="Romance" />
                  <CategoriesHolder imgUrl={16} title="Sci-Fi" />
                  <CategoriesHolder imgUrl={17} title="Thriller" />
                  <CategoriesHolder imgUrl={18} title="War" />
                  <CategoriesHolder imgUrl={19} title="Western" />
                </View>
              </View>
            ) : null}
          </ScrollView>

          <FlatList
            keyExtractor={item => item.id.toString()}
            data={results}
            renderItem={renderMovieItem}
            numColumns={3}
            style={{
              paddingLeft: 15,
              paddingRight: 15,
              marginTop: results?.length > 0 ? 20 : 10,
            }}
          />
        </View>
      </View>
    </>
  );
};

export default SearchScreen;

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
  },
  title: {
    color: 'white',
    fontSize: 26,
    fontFamily: 'ProductSans-Regular',
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#424242',
    borderRadius: 10,
  },
  searchIcon: {
    padding: 10,
  },
  searchInput: {
    flex: 1,
    color: '#D1D1D1',
    fontSize: 14,
    padding: 10,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  horizontalScroll: {
    height: 80,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 9,
  },
  movieItem: {
    width: (width - 45) / 3,
    marginBottom: 15,
    marginRight: 5,
  },
});
