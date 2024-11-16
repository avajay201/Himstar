import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, ToastAndroid, Text, ScrollView } from 'react-native';
import Video from 'react-native-video';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';


const VideoCreate = ({ route, navigation }) => {
    const { compId } = route.params;
    const [videoUri, setVideoUri] = useState(null);
    const [videoOptionsIsVisible, setVideoOptionsIsVisible] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [videoDimensions, setVideoDimensions] = useState({ width: '100%', height: 300 });
    const screenWidth = Dimensions.get('window').width;
    const [rulesAccepted, setRulesAccepted] = useState(false);
    const rules = [
        'Your video should not exceed 5 minutes in length.',
        'Ensure your video is in MP4 format.',
        'Your video should not contain any offensive or copyrighted material.',
        'Maintain a resolution of at least 720p for better clarity.',
        'You can upload only one video per competition.',
        'Submit your video before the competition deadline.',
        'Ensure proper lighting and audio quality in your video.',
        'Your video must be your original work.',
        'Once submitted, you cannot modify your video.',
    ];

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
            navigation.navigate('VideoEdit', { uri: videoUri, videoDimensions: videoDimensions, compId: compId });
        }
    };

    return (
        rulesAccepted ? (<View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
            </View>
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
        </View>)
        :
        (<View style={styles.rulesMainContainer}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerText}>Upload Rules</Text>
            </View>

            <ScrollView contentContainerStyle={styles.rulesContainer}>
                {rules.map((rule, index) => (
                    <View key={index} style={styles.ruleItem}>
                        <Text style={styles.ruleNumber}>{index + 1}.</Text>
                        <Text style={styles.ruleText}>{rule}</Text>
                    </View>
                ))}
            </ScrollView>

            <TouchableOpacity
                style={styles.proceedButton}
                onPress={() => setRulesAccepted(true)}
            >
                <Text style={styles.proceedButtonText}>I Agree & Continue</Text>
            </TouchableOpacity>
        </View>)
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
    rulesMainContainer: {
        flex: 1,
        backgroundColor: '#f4f4f9',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        marginRight: 10,
        padding: 10,
    },
    backArrow: {
        fontSize: 24,
        color: '#6C63FF',
    },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    rulesContainer: {
        paddingBottom: 20,
    },
    ruleItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 15,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    ruleNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6C63FF',
        marginRight: 10,
    },
    ruleText: {
        fontSize: 16,
        color: '#555',
        flex: 1,
    },
    proceedButton: {
        backgroundColor: '#6C63FF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        marginTop: 20,
    },
    proceedButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default VideoCreate;
