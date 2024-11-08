import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, Animated, Dimensions, TouchableOpacity, Image, Modal, TextInput, StyleSheet, Share, ToastAndroid } from 'react-native';
import Video from 'react-native-video';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Applogo from '../../assets/images/logo.png';


const { height } = Dimensions.get('window');

const Reels = () => {
  const [videos, setVideos] = useState([
    {
      "id": 1,
      "title": "Sunset Over the Mountains",
      "video_file": "http://192.168.75.200:8000/media/videos/videoplayback.mp4",
      "is_like": false,
    },
    {
      "id": 2,
      "title": "City Lights at Night",
      "video_file": "http://192.168.75.200:8000/media/videos/videoplayback_1.mp4",
      "is_like": true,
    },
    {
      "id": 3,
      "title": "Waves Crashing on the Beach",
      "video_file": "http://192.168.75.200:8000/media/videos/videoplayback_2.mp4",
      "is_like": false,
    },
    {
      "id": 4,
      "title": "Forest Adventure Trails",
      "video_file": "http://192.168.75.200:8000/media/videos/videoplayback_3.mp4",
      "is_like": false,
    },
    {
      "id": 5,
      "title": "Exploring the Desert",
      "video_file": "http://192.168.75.200:8000/media/videos/videoplayback_4.mp4",
      "is_like": false,
    },
    {
      "id": 6,
      "title": "Snowy Mountain Peaks",
      "video_file": "http://192.168.75.200:8000/media/videos/videoplayback_5.mp4",
      "is_like": false,
    },
    {
      "id": 7,
      "title": "Busy Streets Downtown",
      "video_file": "http://192.168.75.200:8000/media/videos/videoplayback_6.mp4",
      "is_like": true,
    },
    {
      "id": 8,
      "title": "A Walk Through the Woods",
      "video_file": "http://192.168.75.200:8000/media/videos/videoplayback_7.mp4",
      "is_like": false,
    },
    {
      "id": 9,
      "title": "Golden Hour by the Lake",
      "video_file": "http://192.168.75.200:8000/media/videos/videoplayback_8.mp4",
      "is_like": false,
    },
    {
      "id": 10,
      "title": "Exploring Ancient Ruins",
      "video_file": "http://192.168.75.200:8000/media/videos/videoplayback_9.mp4",
      "is_like": true,
    }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const isFocused = useIsFocused();
  const [isMuted, setIsMuted] = useState(false);
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [likesModalVisible, setLikesModalVisible] = useState(false);
  const [comments, setComments] = useState([
    { "id": 1, "username": "user001", "profile_pic": "", "comment": "Awesome video!" },
    { "id": 2, "username": "user002", "profile_pic": "", "comment": "This is amazing!" },
    { "id": 3, "username": "user003", "profile_pic": "", "comment": "Love this content!" },
    { "id": 4, "username": "user004", "profile_pic": "", "comment": "Can't wait to see more!" },
    { "id": 5, "username": "user005", "profile_pic": "", "comment": "Great editing skills!" },
    { "id": 6, "username": "user006", "profile_pic": "", "comment": "Super cool shots!" },
    { "id": 7, "username": "user007", "profile_pic": "", "comment": "Incredible quality!" },
    { "id": 8, "username": "user008", "profile_pic": "", "comment": "You nailed it!" },
    { "id": 9, "username": "user009", "profile_pic": "", "comment": "Absolutely fantastic!" },
    { "id": 10, "username": "user010", "profile_pic": "", "comment": "Stunning visuals!" },
    { "id": 11, "username": "user011", "profile_pic": "", "comment": "Keep up the good work!" },
    { "id": 12, "username": "user012", "profile_pic": "", "comment": "I enjoyed every second!" },
    { "id": 13, "username": "user013", "profile_pic": "", "comment": "So inspiring!" },
    { "id": 14, "username": "user014", "profile_pic": "", "comment": "This made my day!" },
    { "id": 15, "username": "user015", "profile_pic": "", "comment": "Just wow!" },
  ]);
  const [newComment, setNewComment] = useState('');

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
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

  const likeReel = async (id) => {
    setVideos((prevVideos) =>
      prevVideos.map((video) =>
        video.id === id ? { ...video, is_like: !video.is_like } : video
      )
    );
  };

  const addComment = () => {
    if (newComment.trim()) {
      setComments((prevComments) => [
        { id: comments.length + 1, comment: newComment, profile_pic: '', username: 'avajay201' },
        ...prevComments,
      ]);
      setNewComment('');
    }
  };

  const shareReel = async (video) => {
    try {
      await Share.share({
        message: `Check out this video: ${video.title}\n${video.video_file}`,
      });
    } catch (error) {
      ToastAndroid.show('Failed to share this reel.', ToastAndroid.SHORT);
    }
  };

  const showComments = (videoId) => {
    setCommentsModalVisible(true);
  };

  const showLikes = (videoId) => {
    setLikesModalVisible(true);
  };

  const renderComments = useCallback(({ item, index }) => {
    return (
      <View style={styles.commentContainer}>
        <Image source={Applogo} style={styles.commentProfilePic} />
        <View style={styles.commentContent}>
          <Text style={styles.commentUsername}>{item.username}</Text>
          <Text style={styles.commentText}>{item.comment}</Text>
        </View>
      </View>
    )
  });

  const renderLikes = useCallback(({ item, index }) => {
    return (
      <View style={styles.likeItem}>
        <View style={styles.userLikeDetails}>
          <Image
            source={Applogo}
            style={styles.likeProfilePic}
          />
          <Text style={styles.likeUserName}>{item.username}</Text>
        </View>
        <Icon name="favorite" size={24} color="red" style={styles.likeIcon} />
      </View>
    )
  });

  const renderVideo = useCallback(({ item, index }) => {
    return (
      <View style={styles.videoContainer}>
        {loading && <ActivityIndicator size="large" color="white" style={{ position: 'absolute', zIndex: 1 }} />}

        <Video
          source={{ uri: item.video_file }}
          style={{ height: '100%', width: '100%' }}
          resizeMode="cover"
          onLoadStart={() => setLoading(true)}
          onLoad={() => setLoading(false)}
          paused={index !== currentIndex || paused}
          repeat
          muted={isMuted}
        />

        {!loading && <TouchableOpacity onPress={() => setPaused(!paused)} style={{ position: 'absolute', top: height / 2 - 20, alignSelf: 'center', zIndex: 3 }}>
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
                source={Applogo}
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
          <TouchableOpacity style={{ marginBottom: 20, alignItems: 'center' }} onLongPress={showLikes} onPress={() => likeReel(item.id)}>
            <Icon name={item.is_like ? "favorite" : "favorite-border"} size={30} color={item.is_like ? "red" : "white"} />
            <Text style={{ color: 'white', fontSize: 12 }}>100</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginBottom: 20, alignItems: 'center' }} onPress={() => showComments(item.id)}>
            <Icon name="chat-bubble-outline" size={30} color="white" />
            <Text style={{ color: 'white', fontSize: 12 }}>{comments.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginBottom: 20, alignItems: 'center' }} onPress={() => shareReel(item)}>
            <Icon name="share" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsMuted(!isMuted)}>
            <Icon name={isMuted ? "volume-off" : "volume-up"} size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    )
  });

  const slideAnim = useRef(new Animated.Value(500)).current;
  useEffect(() => {
    if (commentsModalVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 500,
        duration: 100,
        useNativeDriver: true,
      }).start(() => {
        setCommentsModalVisible(false);
      });
    }
  }, [commentsModalVisible]);

  useEffect(() => {
    if (likesModalVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 500,
        duration: 100,
        useNativeDriver: true,
      }).start(() => {
        setLikesModalVisible(false);
      });
    }
  }, [likesModalVisible]);

  const closeLikeModalWithSlideDown = () => {
    Animated.timing(slideAnim, {
      toValue: 500,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      setLikesModalVisible(false);
    });
  };

  const closeCommentModalWithSlideDown = () => {
    Animated.timing(slideAnim, {
      toValue: 500,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      setCommentsModalVisible(false);
    });
  };

  return (
    <>
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

      <Modal animationType="none" visible={commentsModalVisible} onRequestClose={closeCommentModalWithSlideDown}>
        <Animated.View style={[styles.commentModalOverlay, { transform: [{ translateY: slideAnim }] }]}>
          <TouchableOpacity onPress={closeCommentModalWithSlideDown} style={styles.commentModalCloseIcon}>
            <Icon name="close" size={30} color="white" />
          </TouchableOpacity>

          <FlatList
            data={comments}
            keyExtractor={(comment) => comment.id.toString()}
            renderItem={renderComments}
          />

          <View style={styles.addCommentContainer}>
            <TextInput
              placeholder="Add a comment..."
              placeholderTextColor="gray"
              value={newComment}
              onChangeText={setNewComment}
              style={styles.commentInput}
            />
            <TouchableOpacity disabled={!newComment.trim() ? true : false} onPress={addComment} style={styles.addCommentBtn}>
              <Icon name="send" size={30} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>

      <Modal
        visible={likesModalVisible}
        onRequestClose={closeLikeModalWithSlideDown}
      >
        <Animated.View style={[styles.likesModalOverlay, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.likesHeaderContainer}>
            <Text style={styles.likesTitle}>Likes</Text>
            <TouchableOpacity onPress={closeLikeModalWithSlideDown} style={styles.likesModalCloseButton}>
              <Icon name="close" size={30} color="white" />
            </TouchableOpacity>
            <Text style={styles.likesCount}>{comments.length}</Text>
          </View>

          <FlatList
            data={comments}
            keyExtractor={(comment) => comment.id.toString()}
            renderItem={renderLikes}
            contentContainerStyle={styles.flatListContent}
          />
        </Animated.View>
      </Modal>
    </>
  );
};


const styles = StyleSheet.create({
  videoContainer: {
    height,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  commentModalOverlay: {
    flex: 1,
    marginTop: 250,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
  },
  commentModalCloseIcon: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'gray',
  },
  commentProfilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'gray',
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentUsername: {
    color: '#FFDD59',
    fontSize: 14,
    fontWeight: 'bold',
  },
  commentText: {
    color: 'white',
    fontSize: 14,
    marginTop: 2,
  },
  addCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    borderTopWidth: 0.5,
    borderTopColor: 'gray',
    paddingTop: 10,
  },
  commentInput: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  addCommentBtn: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 7,
  },
  likesModalOverlay: {
    flex: 1,
    marginTop: 250,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
  },
  likesHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 30,
    paddingLeft: 20,
    paddingRight: 15,
  },
  likesTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  likesModalCloseButton: {
    position: 'absolute',
    top: -50,
    right: -10,
    padding: 10,
  },
  likesCount: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  flatListContent: {
    paddingBottom: 50,
  },
  likeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#333',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  userLikeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeProfilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 5,
  },
  likeUserName: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  likeIcon: {
    marginRight: 10,
  },
});

export default Reels;
