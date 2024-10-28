import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import { useIsFocused } from '@react-navigation/native';  // For pausing when screen changes
import Icon from 'react-native-vector-icons/FontAwesome';


const { height } = Dimensions.get('window');

const Reels = () => {
  const [videos, setVideos] = useState([
    {
        "id": 1,
        "title": "Video Title 1",
        "video_file": "http://192.168.98.200:8000/media/videos/videoplayback.mp4"
    },
    {
        "id": 2,
        "title": "Video Title 2",
        "video_file": "http://192.168.98.200:8000/media/videos/videoplayback_1.mp4"
    },
    {
        "id": 3,
        "title": "Video Title 3",
        "video_file": "http://192.168.98.200:8000/media/videos/videoplayback_2.mp4"
    },
    {
        "id": 4,
        "title": "Video Title 4",
        "video_file": "http://192.168.98.200:8000/media/videos/videoplayback_3.mp4"
    },
    {
        "id": 5,
        "title": "Video Title 5",
        "video_file": "http://192.168.98.200:8000/media/videos/videoplayback_4.mp4"
    },
    {
        "id": 6,
        "title": "Video Title 6",
        "video_file": "http://192.168.98.200:8000/media/videos/videoplayback_5.mp4"
    },
    {
        "id": 7,
        "title": "Video Title 7",
        "video_file": "http://192.168.98.200:8000/media/videos/videoplayback_6.mp4"
    },
    {
        "id": 8,
        "title": "Video Title 8",
        "video_file": "http://192.168.98.200:8000/media/videos/videoplayback_7.mp4"
    },
    {
        "id": 9,
        "title": "Video Title 9",
        "video_file": "http://192.168.98.200:8000/media/videos/videoplayback_8.mp4"
    },
    {
        "id": 10,
        "title": "Video Title 10",
        "video_file": "http://192.168.98.200:8000/media/videos/videoplayback_9.mp4"
    }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const isFocused = useIsFocused();

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    console.log('viewableItems>>>', viewableItems)
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
      setPaused(false)
    }
  });

  const viewConfigRef = { viewAreaCoveragePercentThreshold: 50 };

  useEffect(() => {
    // Auto-pause video when the screen is not focused
    if (!isFocused) {
      setPaused(true);
    }
  }, [isFocused]);

  const togglePause = () => setPaused(!paused);

  return (
    <FlatList
      data={videos}
      pagingEnabled
      snapToInterval={height}
      snapToAlignment="start"
      decelerationRate="fast"
      horizontal={false}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item, index }) => (
        <View style={{ height, justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          {loading && <ActivityIndicator size="large" color="#0000ff" style={{ position: 'absolute', zIndex: 1 }} />}
          <TouchableOpacity onPress={togglePause} style={{ height: '100%', width: '100%' }}>
          <Video
            source={{ uri: item.video_file }}
            style={{ height: '100%', width: '100%' }}
            resizeMode="cover"
            onLoadStart={() => setLoading(true)}
            onLoad={() => setLoading(false)}
            paused={index !== currentIndex || paused}
            repeat
          />
          <Icon
              name={paused ? 'play' : 'pause'}
              size={40}
              color="white"
              style={{
                position: 'absolute',
                alignSelf: 'center',
                top: height / 2 - 20,
                zIndex: 2,
                opacity: 0.8,
              }}
            />
            </TouchableOpacity>
        </View>
      )}
      onViewableItemsChanged={onViewableItemsChanged.current}
      viewabilityConfig={viewConfigRef}
    />
  );
};

export default Reels;
