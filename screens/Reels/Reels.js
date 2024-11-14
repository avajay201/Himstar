import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, Animated, Dimensions, TouchableOpacity, Image, Modal, TextInput, StyleSheet, Share, ToastAndroid } from 'react-native';
import Video from 'react-native-video';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Applogo from '../../assets/images/logo.png';
import { postedVideos, postLikes, likePost, postComments, postComment } from '../../actions/ApiActions';
import { BASE_URL } from '../../actions/APIs';
import AsyncStorage from '@react-native-async-storage/async-storage';


const { height } = Dimensions.get('window');

const Reels = () => {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const isFocused = useIsFocused();
  const [isMuted, setIsMuted] = useState(false);
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [likesModalVisible, setLikesModalVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [likesLoading, setLikesLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [userId, setUserId] = useState(null);

  const fetchUser = async()=>{
    const id = await AsyncStorage.getItem('RegAuthId');
    setUserId(id);
  };

  const getPostedVideos = async()=>{
    const result = await postedVideos(userId);
    if (result[0] === 200){
      setVideos(result[1]);
    }
  };

  const postToggleLike = async(postId)=>{
    const result = await likePost({user_id: userId, post_id: postId});
    if (result[0] === 200){
      const updatedVideos = videos.map((video) => {
        if (video.id === postId) {
          return {
            ...video,
            is_like: !video.is_like,
            likes: video.is_like
              ? video.likes - 1
              : video.likes + 1,
          };
        }
        return video;
      });
      setVideos(updatedVideos);
    }
  };

  useEffect(()=>{
    getPostedVideos();
  }, [userId]);

  useEffect(()=>{
    fetchUser();
  }, []);

  const getPostLikes = async(id)=>{
    setLikesLoading(true);
    const result = await postLikes(id);
    if (result[0] === 200){
      setLikes(result[1]);
    }
    else{
      let errorMsg;
      if (typeof (result[1]) === 'object') {
          const firstKey = Object.keys(result[1])[0];
          errorMsg = result[1][firstKey][0];
      }
      else {
          errorMsg = result[1];
      }
      ToastAndroid.show(errorMsg, ToastAndroid.SHORT);
    }
    setLikesLoading(false);
  };

  const getPostComments = async(id)=>{
    setCommentsLoading(true);
    const result = await postComments(id);
    if (result[0] === 200){
      setComments(result[1]);
    }
    else{
      let errorMsg;
      if (typeof (result[1]) === 'object') {
          const firstKey = Object.keys(result[1])[0];
          errorMsg = result[1][firstKey][0];
      }
      else {
          errorMsg = result[1];
      }
      ToastAndroid.show(errorMsg, ToastAndroid.SHORT);
    }
    setCommentsLoading(false);
  };

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

  const addComment = async () => {
    if (newComment.trim()) {
      const result = await postComment({user: userId, post: commentsModalVisible, content: newComment});
      if (result[0] === 201){
        setComments((prevComments) => [
          { id: result[1].id, content: newComment, profile_pic: '', username: 'avajay201' },
          ...prevComments,
        ]);
        const updatedVideos = videos.map((video) => {
          if (video.id === commentsModalVisible) {
            return {
              ...video,
              comments: video.comments + 1,
            };
          }
          return video;
        });
        setVideos(updatedVideos);
      }
      else{
        ToastAndroid.show('Something went wrong!', ToastAndroid.SHORT);
      }
      setNewComment('');
    }
  };

  const shareReel = async (video) => {
    try {
      await Share.share({
        message: `Check out this video: ${BASE_URL + video.video}`,
      });
    } catch (error) {
      ToastAndroid.show('Failed to share this reel.', ToastAndroid.SHORT);
    }
  };

  const showComments = (videoId) => {
    setCommentsModalVisible(videoId);
    getPostComments(videoId);
  };

  const showLikes = (videoId) => {
    getPostLikes(videoId);
    setLikesModalVisible(true);
  };

  const renderComments = useCallback(({ item, index }) => {
    return (
      <View style={styles.commentContainer}>
        <Image source={Applogo} style={styles.commentProfilePic} />
        <View style={styles.commentContent}>
          <Text style={styles.commentUsername}>{item.username}</Text>
          <Text style={styles.commentText}>{item.content}</Text>
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
          source={{ uri: BASE_URL + item.video }}
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
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>{item.username}</Text>
          </View>
        </View>

        <View style={{ position: 'absolute', bottom: 85, right: 10, alignItems: 'center', zIndex: 3 }}>
          <TouchableOpacity style={{ marginBottom: 20, alignItems: 'center' }} onLongPress={()=>showLikes(item.id)} onPress={() => postToggleLike(item.id)}>
            <Icon name={item.is_like ? "favorite" : "favorite-border"} size={30} color={item.is_like ? "red" : "white"} />
            <Text style={{ color: 'white', fontSize: 12 }}>{item.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginBottom: 20, alignItems: 'center' }} onPress={() => showComments(item.id)}>
            <Icon name="chat-bubble-outline" size={30} color="white" />
            <Text style={{ color: 'white', fontSize: 12 }}>{item.comments}</Text>
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

      <Modal animationType="none" visible={commentsModalVisible ? true : false} onRequestClose={closeCommentModalWithSlideDown}>
        <Animated.View style={[styles.commentModalOverlay, { transform: [{ translateY: slideAnim }] }]}>
          <TouchableOpacity onPress={closeCommentModalWithSlideDown} style={styles.commentModalCloseIcon}>
            <Icon name="close" size={30} color="white" />
          </TouchableOpacity>
          
          {commentsLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="white" />
            </View>
          ) : comments.length === 0 ? (
            <View style={styles.noLikesContainer}>
              <Text style={styles.noLikesText}>No Comments!</Text>
            </View>
          ) : (
            <FlatList
              data={comments}
              keyExtractor={(comment) => comment.id.toString()}
              renderItem={renderComments}
            />
          )}

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

      <Modal visible={likesModalVisible} onRequestClose={closeLikeModalWithSlideDown}>
      <Animated.View style={[styles.likesModalOverlay, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.likesHeaderContainer}>
          <Text style={styles.likesTitle}>Likes</Text>
          <TouchableOpacity onPress={closeLikeModalWithSlideDown} style={styles.likesModalCloseButton}>
            <Icon name="close" size={30} color="white" />
          </TouchableOpacity>
          <Text style={styles.likesCount}>{likes.length}</Text>
        </View>

        {likesLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="white" />
          </View>
        ) : likes.length === 0 ? (
          <View style={styles.noLikesContainer}>
            <Text style={styles.noLikesText}>No Likes!</Text>
          </View>
        ) : (
          <FlatList
            data={likes}
            keyExtractor={(like) => like.id.toString()}
            renderItem={renderLikes}
            contentContainerStyle={styles.flatListContent}
          />
        )}
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noLikesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noLikesText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Reels;
