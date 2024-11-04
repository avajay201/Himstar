import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Dimensions, TouchableOpacity, Image } from 'react-native';
import Video from 'react-native-video';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import googleIcon from '../../assets/images/logo.png';


const { height } = Dimensions.get('window');

const Reels = () => {
  const [videos, setVideos] = useState([
    {
        "id": 1,
        "title": "Sunset Over the Mountains",
        "video_file": "http://192.168.75.200:8000/media/videos/videoplayback.mp4"
    },
    {
        "id": 2,
        "title": "City Lights at Night",
        "video_file": "http://192.168.75.200:8000/media/videos/videoplayback_1.mp4"
    },
    {
        "id": 3,
        "title": "Waves Crashing on the Beach",
        "video_file": "http://192.168.75.200:8000/media/videos/videoplayback_2.mp4"
    },
    {
        "id": 4,
        "title": "Forest Adventure Trails",
        "video_file": "http://192.168.75.200:8000/media/videos/videoplayback_3.mp4"
    },
    {
        "id": 5,
        "title": "Exploring the Desert",
        "video_file": "http://192.168.75.200:8000/media/videos/videoplayback_4.mp4"
    },
    {
        "id": 6,
        "title": "Snowy Mountain Peaks",
        "video_file": "http://192.168.75.200:8000/media/videos/videoplayback_5.mp4"
    },
    {
        "id": 7,
        "title": "Busy Streets Downtown",
        "video_file": "http://192.168.75.200:8000/media/videos/videoplayback_6.mp4"
    },
    {
        "id": 8,
        "title": "A Walk Through the Woods",
        "video_file": "http://192.168.75.200:8000/media/videos/videoplayback_7.mp4"
    },
    {
        "id": 9,
        "title": "Golden Hour by the Lake",
        "video_file": "http://192.168.75.200:8000/media/videos/videoplayback_8.mp4"
    },
    {
        "id": 10,
        "title": "Exploring Ancient Ruins",
        "video_file": "http://192.168.75.200:8000/media/videos/videoplayback_9.mp4"
    }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const isFocused = useIsFocused();
  const [isMuted, setIsMuted] = useState(false);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    console.log('viewableItems>>>', viewableItems)
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
      setPaused(false)
    }
  });

  const viewConfigRef = { viewAreaCoveragePercentThreshold: 50 };

  useEffect(() => {
    if (!isFocused) {
      setPaused(true);
    }
  }, [isFocused]);

  const togglePause = () => setPaused(!paused);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const renderVideo = ({item, index})=>{
    return (
      <View style={{ height, justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        {loading && <ActivityIndicator size="large" color="white" style={{ position: 'absolute', zIndex: 1 }} />}

        <Video
          source={{ uri: item.video_file }}
          style={{ height: '100%', width: '100%' }}
          resizeMode="cover"
          onLoadStart={() => setLoading(true)}
          onLoad={() => setLoading(false)}
          paused={index !== currentIndex || paused}
          repeat
          volume={isMuted ? 0 : 1}
        />

        {!loading && <TouchableOpacity onPress={togglePause} style={{ position: 'absolute', top: height / 2 - 20, alignSelf: 'center', zIndex: 3 }}>
          <Icon
            name={paused ? 'play-arrow' : 'pause'}
            size={40}
            color="white"
            style={{ opacity: 0.8 }}
          />
        </TouchableOpacity>
        }

        <View style={{ position: 'absolute', bottom: 80, left: 10, flexDirection: 'row', alignItems: 'center', zIndex: 3 }}>
          <View style={{ marginRight: 8 }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'gray' }}>
            <Image
              source={googleIcon}
              style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'gray' }}
            />
            </View>
          </View>
          <View>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>avajay201</Text>
            <Text style={{ color: 'white', fontSize: 14, marginTop: 4 }}>{item.title}</Text>
          </View>
        </View>

        <View style={{ position: 'absolute', bottom: 85, right: 10, alignItems: 'center', zIndex: 3 }}>
          <TouchableOpacity style={{ marginBottom: 20, alignItems: 'center' }}>
            <Icon name="favorite-border" size={30} color="white" />
            <Text style={{ color: 'white', fontSize: 12 }}>1.2k</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginBottom: 20, alignItems: 'center' }}>
            <Icon name="chat-bubble-outline" size={30} color="white" />
            <Text style={{ color: 'white', fontSize: 12 }}>300</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginBottom: 20, alignItems: 'center' }}>
            <Icon name="share" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleMute}>
            <Icon name={isMuted ? "volume-off" : "volume-up"} size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    )
  };

  return (
    <FlatList
      data={videos}
      pagingEnabled
      snapToInterval={height}
      snapToAlignment="start"
      decelerationRate="fast"
      horizontal={false}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderVideo}
      onViewableItemsChanged={onViewableItemsChanged.current}
      viewabilityConfig={viewConfigRef}
    />
  );
};

export default Reels;
