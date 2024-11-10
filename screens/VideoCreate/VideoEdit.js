import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList, ActivityIndicator, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Video from 'react-native-video';
import AppLogo from './../../assets/images/logo.png';
import { FFmpegKit } from 'ffmpeg-kit-react-native';


const dummyMusicData = [
    { id: '1', name: 'Song One', singer: 'Singer A', image: AppLogo },
    { id: '2', name: 'Song Two', singer: 'Singer B', image: AppLogo },
    { id: '4', name: 'Song Three', singer: 'Singer C', image: AppLogo },
    { id: '5', name: 'Song Three', singer: 'Singer C', image: AppLogo },
    { id: '6', name: 'Song Three', singer: 'Singer C', image: AppLogo },
    { id: '7', name: 'Song Three', singer: 'Singer C', image: AppLogo },
    { id: '8', name: 'Song Three', singer: 'Singer C', image: AppLogo },
    { id: '9', name: 'Song Three', singer: 'Singer C', image: AppLogo },
    { id: '10', name: 'Song Three', singer: 'Singer C', image: AppLogo },
    { id: '11', name: 'Song Three', singer: 'Singer C', image: AppLogo },
    { id: '12', name: 'Song Three', singer: 'Singer C', image: AppLogo },
    { id: '13', name: 'Song Three', singer: 'Singer C', image: AppLogo },
    { id: '14', name: 'Song Three', singer: 'Singer C', image: AppLogo },
    { id: '15', name: 'Song Three', singer: 'Singer C', image: AppLogo },
];

const MusicModal = ({ visible, onClose, loading }) => {
    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search a music."
                    placeholderTextColor="#888"
                />
                {loading ? (
                    <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
                ) : (
                    <FlatList
                        data={dummyMusicData}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.musicRow}>
                                <Image source={item.image} style={styles.musicImage} />
                                <View style={styles.musicInfo}>
                                    <Text style={styles.musicName}>{item.name}</Text>
                                    <Text style={styles.singerName}>{item.singer}</Text>
                                </View>
                                <TouchableOpacity style={styles.playPauseButton}>
                                    <Icon name="play-arrow" size={25} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                )}
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Icon name="close" size={30} color="white" />
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const VideoEdit = ({ route, navigation }) => {
    const { uri, videoDimensions } = route.params;
    const [isMusicModalVisible, setIsMusicModalVisible] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [loading, setLoading] = useState(true);
    const [videoUri, setVideoUri] = useState(uri);

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const openMusicModal = () => {
        setIsPlaying(false);
        setIsMusicModalVisible(true);
        setTimeout(() => {
            setLoading(false)
        }, 2000);
    };

    const closeMusciModal = () => {
        setIsMusicModalVisible(false);
        setLoading(true);
    };

    const audioRemoveProcess = () => {
        
    };

    const audioRemove = () => {
        Alert.alert(
            "Remove Audio",
            "Are you sure you want to remove the audio from this video?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Audio removal canceled"),
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: () => audioRemoveProcess()
                }
            ]
        );

    };

    const checkAudioExistsInVideo = async () => {
        const command = `-i ${videoUri} -c:v mpeg4 file2.mp4`;  // The '-vn' tells ffmpeg to ignore the video stream

        console.log('Audio CMD - ', command);

        try {
          console.log('***Audio check process started***');
          const result = await FFmpegKit.execute(command);
      
          if (result.returnCode === 0) {
            if (result.output.includes('Audio:')) {
              console.log('*********************************');
            } else {
              console.log('--------------------------------');
            }
          } else {
            console.log('777777777777777777777777777777', result);
          }
        } catch (error) {
          console.log('0000000000000000000000000000000000', error);
        }
    };

    useEffect(()=>{
        checkAudioExistsInVideo();
    }, []);

    return (
        <View style={styles.container}>
            <View style={[styles.videoContainer, videoDimensions]}>

                {videoUri ? (
                    <Video
                        source={{ uri: videoUri }}
                        style={videoDimensions}
                        resizeMode="cover"
                        paused={!isPlaying}
                        muted={isMuted}
                        repeat
                    />
                )
                    :
                    <Text>Video Player Placeholder</Text>
                }
            </View>

            <View style={styles.controls}>
                <TouchableOpacity onPress={openMusicModal}>
                    <Icon name="music-note" size={30} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={togglePlayPause}>
                    <Icon name={isPlaying ? 'pause' : 'play-arrow'} size={30} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={audioRemove}>
                    <Icon name='volume-mute' size={30} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsMuted(!isMuted)}>
                    <Icon name={isMuted ? 'volume-off' : 'volume-up'} size={30} color="white" />
                </TouchableOpacity>
            </View>

            <View style={styles.navigationButtons}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={30} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { /* Next button function here */ }}>
                    <Icon name="arrow-forward" size={30} color="white" />
                </TouchableOpacity>
            </View>

            <MusicModal visible={isMusicModalVisible} onClose={closeMusciModal} loading={loading} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
    videoContainer: { width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#333' },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '60%',
        position: 'absolute',
        bottom: 100,
    },
    navigationButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        position: 'absolute',
        bottom: 50,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    searchBar: {
        height: 40,
        backgroundColor: '#333',
        borderRadius: 10,
        paddingHorizontal: 10,
        color: '#fff',
    },
    loader: {
        marginTop: 20,
        alignSelf: 'center',
    },
    musicRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomColor: '#444',
        borderBottomWidth: 1,
    },
    musicImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    musicInfo: {
        flex: 1,
    },
    musicName: {
        color: '#fff',
        fontSize: 16,
    },
    singerName: {
        color: '#888',
        fontSize: 14,
    },
    playPauseButton: {
        padding: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
});

export default VideoEdit;
