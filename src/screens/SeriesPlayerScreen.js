import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  BackHandler,
  StatusBar,
  ToastAndroid,
} from 'react-native';
import Video, {ResizeMode, TextTrackType} from 'react-native-video';
import React, {useRef, useEffect, useState, useCallback} from 'react';
import Orientation, {
  OrientationLocker,
  LANDSCAPE,
} from 'react-native-orientation-locker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import {useFocusEffect} from '@react-navigation/native';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import {SafeAreaView} from 'react-native-safe-area-context';

import {
  Button,
  Dialog,
  Divider,
  Menu,
  Modal,
  Portal,
  SegmentedButtons,
} from 'react-native-paper';
import {Dropdown} from 'react-native-element-dropdown';

const PlayerScreen = ({navigation, route}) => {
  const {streamData, movie, logo, item} = route.params;
  console.log('from player screen ' + streamData);

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [showSeekOverlay, setShowSeekOverlay] = useState(false);
  const [seekDirection, setSeekDirection] = useState('');
  const [progress, setProgress] = useState(0);
  const [buffering, setBuffering] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [resizeMode, setResizeMode] = useState(ResizeMode.CONTAIN);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState({x: 0, y: 0});

  const [serverDialogVisible, setServerDialogVisible] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const playbacks = [
    {value: 0.25, label: '0.25x'},
    {value: 0.5, label: '0.5x'},
    {value: 1, label: '1x'},
    {value: 1.25, label: '1.25x'},
    {value: 1.5, label: '1.5x'},
    {value: 1.75, label: '1.75x'},
    {value: 2, label: '2x'},
  ];

  const [selectedUrl, setSelectedUrl] = useState(1);

  const hideControlsTimer = useRef(null);

  const openMenu = event => {
    // Get the position of the more-vert icon
    // const {pageX, pageY} = event.nativeEvent;
    // setMenuAnchor({x: pageX, y: pageY});
    // setMenuVisible(true);
    if (hideControlsTimer.current) {
      clearTimeout(hideControlsTimer.current);
    }
  };

  const closeMenu = () => {
    setMenuVisible(false);
    // Restart the hide timer when menu closes
    startHideControlsTimer();
  };

  const showServerDialog = () => {
    setServerDialogVisible(true);

    if (hideControlsTimer.current) {
      clearTimeout(hideControlsTimer.current);
    }
  };

  const hideServerDialogVisible = () => setServerDialogVisible(false);

  const startHideControlsTimer = useCallback(() => {
    if (hideControlsTimer.current) {
      clearTimeout(hideControlsTimer.current);
    }
    // hideControlsTimer.current = setTimeout(() => {
    //   setShowControls(false);
    // }, 3000);
    if (!menuVisible) {
      hideControlsTimer.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, []);

  const toggleControlsVisibility = useCallback(() => {
    if (menuVisible) {
      // If menu is visible, close it instead of toggling controls
      closeMenu();
      return;
    }

    setShowControls(prev => {
      const newValue = !prev;
      if (newValue) {
        startHideControlsTimer();
      } else if (hideControlsTimer.current) {
        clearTimeout(hideControlsTimer.current);
      }
      return newValue;
    });
  }, [menuVisible, startHideControlsTimer]);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
    startHideControlsTimer();
  }, [startHideControlsTimer]);

  const handleRewind = useCallback(() => {
    if (videoRef.current && duration > 0) {
      const newTime = Math.max(0, currentTime - 10);
      videoRef.current.seek(newTime);
      setCurrentTime(newTime);
      setSliderValue(newTime / duration); // Update slider value after seeking
      setSeekDirection('backward');
      setShowSeekOverlay(true);
      setTimeout(() => setShowSeekOverlay(false), 1000);
      startHideControlsTimer();
    }
  }, [currentTime, duration, startHideControlsTimer]);

  const handleFastForward = useCallback(() => {
    if (videoRef.current && duration > 0) {
      const newTime = Math.min(duration, currentTime + 10);
      videoRef.current.seek(newTime);
      setCurrentTime(newTime);
      setSliderValue(newTime / duration); // Update slider value after seeking
      setSeekDirection('forward');
      setShowSeekOverlay(true);
      setTimeout(() => setShowSeekOverlay(false), 1000);
      startHideControlsTimer();
    }
  }, [currentTime, duration, startHideControlsTimer]);

  const handleSliderValueChange = useCallback(
    value => {
      setIsSliding(true); // Indicate that the slider is being dragged
      const newTime = value * duration; // Calculate the time from slider value
      setSliderValue(value); // Update the slider value
      setCurrentTime(newTime); // Update the current time immediately
    },
    [duration],
  );

  const handleSliderComplete = useCallback(
    value => {
      if (videoRef.current && duration > 0) {
        const newTime = value * duration;
        videoRef.current.seek(newTime); // Seek the video to the new time
        setCurrentTime(newTime); // Set the current time to the new time
        setSliderValue(value); // Update the slider to the new value
        setIsSliding(false); // Indicate the slider is no longer being dragged
        startHideControlsTimer();
      }
    },
    [duration, startHideControlsTimer],
  );

  const handleProgress = useCallback(data => {
    if (!isSliding && data.seekableDuration > 0) {
      const currentTimeValue = data.currentTime || 0;
      const durationValue = data.seekableDuration || 0;

      // Update the current time and duration
      setCurrentTime(currentTimeValue);
      setDuration(durationValue);

      if (durationValue > 0) {
        // Update the slider value only when the video is not being dragged
        const newSliderValue = currentTimeValue / durationValue;
        setSliderValue(newSliderValue);
        setProgress((newSliderValue * 100).toFixed(2));
      }
    }
  }, []);

  const handleLoad = useCallback(data => {
    const durationValue = data.duration || 0;
    setDuration(durationValue);
    // Reset slider and current time when loading new video
    setCurrentTime(0);
    setSliderValue(0);
    setProgress(0);
  }, []);

  useEffect(() => {
    console.log(movie);
    StatusBar.setHidden(true);
    SystemNavigationBar.navigationHide();

    return () => {
      StatusBar.setHidden(false);
      SystemNavigationBar.navigationShow();
      // <OrientationLocker orientation={LANDSCAPE} />
      Orientation.lockToPortrait(); //this will lock the view to Portrait

      if (hideControlsTimer.current) {
        clearTimeout(hideControlsTimer.current);
      }
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (showControls) {
          setShowControls(false);
          return true;
        }
        navigation.goBack();
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [showControls, navigation]),
  );

  const formatTime = useCallback(timeInSeconds => {
    const roundedTime = Math.floor(timeInSeconds);
    const hours = Math.floor(roundedTime / 3600);
    const minutes = Math.floor((roundedTime % 3600) / 60);
    const seconds = roundedTime % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }, []);

  return (
    <SafeAreaView
      edges={{
        right: 'off',
        top: 'off',
        left: 'off',
        bottom: 'off',
      }}
      style={{flex: 1, position: 'relative'}}>
      <View style={styles.container}>
        <OrientationLocker orientation={LANDSCAPE} />

        <TouchableOpacity
          activeOpacity={1}
          style={styles.videoContainer}
          onPress={toggleControlsVisibility}>
          <Video
            ref={videoRef}
            source={{
              // uri: streamData[selectedUrl]['link'],
              uri: streamData[selectedUrl]?.link || '',
              // uri: 'https://i-cdn-0.winteo320ram.com/stream2/i-cdn-0/baeb44642b2b82eb73e31f333d3f21eb/MJTMsp1RshGTygnMNRUR2N2MSlnWXZEdMNDZzQWe5MDZzMmdZJTO1R2RWVHZDljekhkSsl1VwYnWtx2cihVT25kaVRTTyUENNdVS140RRVzTH1UMOpmVt5kMatmTXFVeNJTU65EVFNjTXVVP:1732181537:45.67.229.117:a9eec24a288e2e8c1f53e9ccdf2df73da5b47fbe9647a49ba28e4cb9e53c6f84/index.m3u8',
            }}
            style={styles.video}
            paused={!isPlaying}
            onBuffer={({isBuffering}) => setBuffering(isBuffering)}
            onLoad={handleLoad}
            onProgress={handleProgress}
            progressUpdateInterval={250}
            rate={playbackSpeed}
            // // onTextTracks
            // textTracks={streamData[0].subtitles}
            textTracks={streamData.subtitles}
            selectedTextTrack={{
              type: 'language',
              value: 'en',
            }}
            subtitleStyle={{
              paddingBottom: 50,
              color: 'white', // Subtitle text color
              fontSize: 18, // Adjust the font size as needed
              textShadowColor: 'black', // Border color
              textShadowOffset: {width: 5, height: 5},
              textShadowRadius: 10,
            }}
            onError={e => {
              console.log(e.error.errorString);
              if (selectedUrl < streamData.length - 1) {
                setSelectedUrl(selectedUrl + 1);
                ToastAndroid.show(
                  'Video could not be played, Trying next server',
                  ToastAndroid.SHORT,
                );
              } else {
                ToastAndroid.show(
                  'Video could not be played, try again later',
                  ToastAndroid.SHORT,
                );
                navigation.goBack();
              }
            }}
            poster={{
              source: {
                uri: logo
                  ? logo
                  : 'https://placehold.co/600x400/000000/000000/png',
              },
              resizeMode: 'center',
            }}
            resizeMode={resizeMode}
          />

          {showSeekOverlay && (
            <View style={styles.seekOverlay}>
              <Icon
                name={seekDirection === 'forward' ? 'forward-10' : 'replay-10'}
                size={40}
                color="rgba(255, 255, 255, 0.8)"
              />
            </View>
          )}

          {showControls && (
            <View style={styles.controlsContainer}>
              <View style={styles.topBar}>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                  <Icon name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.videoInfo}>
                  Ep {item.episode_number} : {item.name}
                </Text>
                <TouchableOpacity
                  onPress={event => showServerDialog(event)}
                  // hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                >
                  <Icon name="more-vert" size={24} color="white" />
                </TouchableOpacity>
              </View>

              <View style={styles.controlsWrapper}>
                {!buffering && (
                  <View style={styles.middleControls}>
                    <TouchableOpacity
                      onPress={handleRewind}
                      hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                      <Icon name="replay-10" size={36} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={togglePlayPause}
                      hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                      {/* <Icon
                        name={isPlaying ? 'pause' : 'play-arrow'}
                        size={48}
                        color="white"
                      /> */}
                      <Ionicons
                        name={isPlaying ? 'pause' : 'play'}
                        size={48}
                        color="white"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleFastForward}
                      hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                      <Icon name="forward-10" size={36} color="white" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <Menu
                visible={menuVisible}
                onDismiss={closeMenu}
                anchor={menuAnchor}>
                <Menu.Item
                  leadingIcon="play-speed"
                  onPress={() => {}}
                  title="Playback speed"
                />
                <Menu.Item
                  leadingIcon="server"
                  onPress={() => {
                    setServerDialogVisible(true);
                  }}
                  title="Server"
                />
              </Menu>

              <Portal>
                <Modal
                  visible={serverDialogVisible}
                  onDismiss={hideServerDialogVisible}
                  contentContainerStyle={{
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    width: '80%',
                    alignSelf: 'center',
                    borderRadius: 10,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '50%',
                        borderRightWidth: 1,
                        borderRightColor: 'white',
                        padding: 20,
                      }}>
                      <MaterialIcon name="play-speed" size={24} color="white" />
                      <Text
                        style={{
                          color: 'white',
                          marginLeft: 5,
                          fontSize: 16,
                          fontFamily: 'ProductSans-Medium',
                        }}>
                        Speed
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        margin: 20,
                        flexWrap: 'wrap',
                      }}>
                      <Dropdown
                        style={{
                          color: 'white',
                          width: '60%',
                          marginBottom: 20,
                        }}
                        placeholderStyle={{
                          color: 'white',
                          backgroundColor: '#424242',
                        }}
                        itemContainerStyle={{
                          backgroundColor: '#424242',
                        }}
                        containerStyle={{
                          backgroundColor: '#424242',
                          borderWidth: 1,
                          borderColor: 'gray',
                        }}
                        selectedTextStyle={{
                          color: 'white',
                        }}
                        itemTextStyle={{
                          color: 'white',
                        }}
                        renderItem={(item, index, isSelected) => (
                          <View
                            style={{
                              backgroundColor: isSelected ? 'black' : 'black',
                              paddingVertical: 10,
                              paddingHorizontal: 15,
                            }}>
                            <Text
                              style={{
                                color: isSelected ? 'green' : 'white',
                              }}>
                              {item.label}
                            </Text>
                          </View>
                        )}
                        data={playbacks}
                        labelField="label"
                        valueField="value"
                        value={playbackSpeed}
                        onChange={item => {
                          setPlaybackSpeed(item.value);
                        }}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '50%',
                        borderRightWidth: 1,
                        borderRightColor: 'white',
                        padding: 20,
                      }}>
                      <Ionicons name="cloud" size={24} color="white" />
                      <Text
                        style={{
                          color: 'white',
                          marginLeft: 8,
                          fontSize: 16,
                          fontFamily: 'ProductSans-Medium',
                        }}>
                        Servers
                      </Text>
                    </View>
                    <View
                      style={{
                        width: '50%',
                        padding: 20,
                      }}>
                      {streamData.map((item, index) => (
                        <TouchableOpacity onPress={() => setSelectedUrl(index)}>
                          <View
                            style={{
                              flexDirection: 'row',
                              paddingRight: 1,
                              marginBottom: 5,
                            }}>
                            {index == selectedUrl ? (
                              <Ionicons
                                name="checkmark"
                                size={24}
                                style={{marginRight: 5}}
                                color="white"
                              />
                            ) : (
                              <View style={{height: 24, width: 29}} />
                            )}
                            <Text
                              style={{
                                color:
                                  index == selectedUrl
                                    ? 'white'
                                    : 'rgba(255,255,255,0.8)',
                                fontSize: 16,
                                fontFamily: 'ProductSans-Medium',
                              }}>
                              {item.server}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </Modal>
              </Portal>

              <View style={styles.bottomControls}>
                <View style={styles.progressContainer}>
                  <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={1}
                    // value={progress}
                    value={sliderValue}
                    minimumTrackTintColor="#E50914"
                    maximumTrackTintColor="#FFFFFF"
                    thumbTintColor="#E50914"
                    onValueChange={handleSliderValueChange}
                    onSlidingComplete={handleSliderComplete}
                  />
                  <Text style={styles.timeText}>{formatTime(duration)}</Text>
                </View>

                <View style={styles.extraOptions}>
                  <TouchableOpacity style={styles.extraOptionButton}>
                    <Icon name="lock" color="white" size={20} />
                    <Text style={styles.extraOption}>Lock</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.extraOptionButton}>
                    <Icon name="subtitles" color="white" size={20} />
                    <Text style={styles.extraOption}>Audio & Subtitle</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.extraOptionButton}
                    onPress={() => {
                      // setResizeMode(
                      //   resizeMode === ResizeMode.CONTAIN
                      //     ? ResizeMode.COVER
                      //     : ResizeMode.CONTAIN,
                      // );
                      setResizeMode(
                        resizeMode === ResizeMode.CONTAIN
                          ? ResizeMode.COVER
                          : resizeMode === ResizeMode.COVER
                          ? ResizeMode.STRETCH
                          : ResizeMode.CONTAIN,
                      );
                      // setToast(
                      //   'Resize Mode: ' +
                      //     (resizeMode === ResizeMode.CONTAIN ? 'Cover' : 'None'),
                      //   2000,
                      // );
                    }}>
                    <Icon name="aspect-ratio" color="white" size={20} />
                    <Text style={styles.extraOption}>
                      {resizeMode === ResizeMode.CONTAIN
                        ? 'Resize'
                        : resizeMode === ResizeMode.COVER
                        ? 'Cover'
                        : 'Stretch'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {buffering && (
            <View style={styles.bufferingIndicator}>
              <ActivityIndicator size="large" color="white" />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  videoContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  seekOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  controlsContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  videoInfo: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  middleControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  controlsWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomControls: {
    paddingBottom: 20,
  },
  timeControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 5,
  },
  timeText: {
    color: 'white',
    fontSize: 14,
  },
  progressBar: {
    height: 3,
    marginHorizontal: 20,
  },
  extraOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  extraOptionButton: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  extraOption: {
    color: 'white',
    fontSize: 14,
  },
  bufferingIndicator: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },

  bottomControls: {
    paddingBottom: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    // gap: 10,
  },
  timeText: {
    color: 'white',
    fontSize: 14,
    minWidth: 45,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  extraOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
});

export default PlayerScreen;
