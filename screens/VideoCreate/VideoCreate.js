import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, ToastAndroid } from 'react-native';
import Video from 'react-native-video';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';


const VideoCreate = ({ navigation }) => {
    const [videoUri, setVideoUri] = useState(null);
    const [videoOptionsIsVisible, setVideoOptionsIsVisible] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [videoDimensions, setVideoDimensions] = useState({ width: '100%', height: 300 });
    const screenWidth = Dimensions.get('window').width;

    useFocusEffect(
        useCallback(() => {
            return () => {
                setVideoUri(null);
                setVideoOptionsIsVisible(false);
                setIsPlaying(true);
            };
        }, [])
    );

    const recordVideo = () => {
        launchCamera(
            {
                mediaType: 'video',
                videoQuality: 'high',
                durationLimit: 30,
                saveToPhotos: true,
            },
            (response) => {
                setVideoOptionsIsVisible(false);
                if (response.assets && response.assets.length > 0) {
                    setVideoUri(response.assets[0].uri);
                    setIsPlaying(true);
                }
            }
        );
    };

    const adjustVideoDimensions = (width, height) => {
        const screenFinalWidth = height > width ? 300 : screenWidth;
        const aspectRatio = width / height;

        setVideoDimensions({
            width: screenFinalWidth,
            height: screenFinalWidth / aspectRatio
        });
    };

    const selectVideo = () => {
        launchImageLibrary({ mediaType: 'video' }, response => {
            setVideoOptionsIsVisible(false);
            if (response.assets && response.assets.length > 0) {
                const duration = response.assets[0].duration;
                if (duration > 30){
                    ToastAndroid.show('Video must be less than 30 seconds.', ToastAndroid.SHORT);
                    return;
                }
                const { uri, height, width } = response.assets[0];
                setVideoUri(uri);
                adjustVideoDimensions(width, height);
                setIsPlaying(true);
            }
        });
    };

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const VideoPlayerComponent = ({ uri }) => (
        <Video
            source={{ uri }}
            style={videoDimensions}
            resizeMode="cover"
            paused={!isPlaying}
            repeat
        />
    );

    const navigateToVideoEdit = () => {
        if (videoUri) {
            navigation.navigate('VideoEdit', { uri: videoUri, videoDimensions: videoDimensions });
        }
    };

    return (
        <View style={styles.container}>
            {videoUri && <VideoPlayerComponent uri={videoUri} />}

            {videoUri ?
                <View style={[styles.videoOption, { bottom: 50, gap: 50 }]}>
                    <TouchableOpacity
                        style={styles.videoNextStep}
                        onPress={() => setVideoUri(null)}
                    >
                        <Icon name='close' size={30} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.videoNextStep}
                        onPress={togglePlayPause}
                    >
                        <Icon name={isPlaying ? 'pause' : 'play-arrow'} size={30} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.videoNextStep}
                        onPress={navigateToVideoEdit}
                    >
                        <Icon name='arrow-right' size={30} color="white" />
                    </TouchableOpacity>
                </View>
                :
                <TouchableOpacity
                    style={styles.cameraButton}
                    onPress={() => setVideoOptionsIsVisible(!videoOptionsIsVisible)}
                >
                    <Icon name={videoOptionsIsVisible ? 'close' : 'camera-alt'} size={30} color="white" />
                </TouchableOpacity>
            }

            {videoOptionsIsVisible && (
                <>
                    <View style={styles.videoOption}>
                        <TouchableOpacity onPress={recordVideo} style={styles.videoSelectOption}>
                            <Icon name="videocam" size={40} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={selectVideo} style={styles.videoSelectOption}>
                            <Icon name="video-library" size={40} color="white" />
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    cameraButton: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#B94EA0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 100,
        position: 'absolute',
        bottom: 120,
    },
    videoSelectOption: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#B94EA0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoNextStep: {
        alignSelf: 'center',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#B94EA0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pauseIconContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 30,
        width: 50,
        height: 50,
    },
});

export default VideoCreate;
