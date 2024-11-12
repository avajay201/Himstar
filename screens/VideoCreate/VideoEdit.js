import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList, ActivityIndicator, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Video from 'react-native-video';
import { mergeVideo, searchMusic } from '../../actions/ApiActions';
import Sound from 'react-native-sound';


const MusicModal = ({ visible, onClose, handleTrackSelectWithVideo }) => {
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sound, setSound] = useState(null);
    const [query, setQuery] = useState('');
    const [musicData, setMusicData] = useState([]);

    const getMusics = async (query = null) => {
        let result;
        if (query && query.length > 2) {
            result = await searchMusic(query);
        } else {
            result = await searchMusic();
        }
        if (result) {
            setMusicData(result);
        }
        setLoading(false);
    };

    useEffect(() => {
        getMusics();
    }, []);

    useEffect(() => {
        getMusics(query);
    }, [query]);

    useEffect(() => {
        if (currentTrack) {
            if (sound) {
                sound.release();
            }

            const track = new Sound(currentTrack.preview, null, (error) => {
                if (error) {
                    console.log('Failed to load the track', error);
                    return;
                }
                setSound(track);
                if (isPlaying) {
                    track.play();
                }
            });
        }

        return () => {
            if (sound) {
                sound.release();
            }
        };
    }, [currentTrack, isPlaying]);

    const handlePlayPause = () => {
        if (sound) {
            if (isPlaying) {
                sound.pause();
            } else {
                sound.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTrackSelect = (item) => {
        if (currentTrack?.id === item.id) {
            handlePlayPause();
        } else {
            if (sound) {
                sound.pause();
                sound.release();
            }

            setCurrentTrack(item);
            setIsPlaying(true);
        }
    };

    const selectMusic = async(music)=>{
        setMusicData([]);
        handlePlayPause();
        handleTrackSelectWithVideo(music);
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search for a song."
                    placeholderTextColor="#888"
                    value={query}
                    onChangeText={setQuery}
                />
                {loading ? (
                    <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
                ) : (
                    <FlatList
                        data={musicData}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.musicRow}>
                                <Image source={{ uri: item.album.cover }} style={styles.musicImage} />
                                <TouchableOpacity style={styles.musicInfo} onPress={()=>selectMusic(item)}>
                                    <View style={styles.musicInfo}>
                                        <Text style={styles.musicName}>{item.title}</Text>
                                        <Text style={styles.singerName}>{item.artist.name}</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.playPauseButton}
                                    onPress={() => handleTrackSelect(item)}
                                >
                                    <Icon
                                        name={currentTrack?.id === item.id && isPlaying ? 'pause' : 'play-arrow'}
                                        size={25}
                                        color="#fff"
                                    />
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
    const [videoUri, setVideoUri] = useState(uri);
    const [soundWithVideo, setSoundWithVideo] = useState(null);
    const [music, setMusic] = useState(null);
    const videoRef = useRef(null);

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
        if(soundWithVideo && !isPlaying){
            soundWithVideo.play();
        }
        if(soundWithVideo && isPlaying){
            soundWithVideo.pause();
        }
    };

    const openMusicModal = () => {
        if(soundWithVideo){
            soundWithVideo.pause();
        };
        setIsPlaying(false);
        setIsMusicModalVisible(true);
    };

    const closeMusciModal = () => {
        setIsMusicModalVisible(false);
    };

    const handleTrackSelectWithVideo = (item) => {
        setIsMusicModalVisible(false);
        setMusic(item);
        const track = new Sound(item.preview, null, (error) => {
            if (error) {
                console.log('Failed to load the track', error);
                return;
            }
            setSoundWithVideo(track);
            track.play();
            setIsPlaying(true);
            if (videoRef.current) {
                videoRef.current.seek(0);
            }
        });
        if(soundWithVideo){
            soundWithVideo.pause();
        };
    };

    const handleVideoEnd = () => {
        if (soundWithVideo) {
            soundWithVideo.setCurrentTime(0);
            soundWithVideo.play();
        }
    };

    const navigateVideoPreview = async()=>{
        setIsPlaying(false);
        if (soundWithVideo) {
            soundWithVideo.pause();
        };

        navigation.navigate('VideoPreview', { uri: videoUri, videoDimensions: videoDimensions, musicUri: soundWithVideo && music ? music.preview : null })

        // if (soundWithVideo && music){
            // try{
            //     const formData = new FormData();
            //     formData.append('video', {
            //         uri: videoUri,
            //         type: 'video/mp4',
            //         name: 'video.mp4',
            //     });
            //     formData.append('music', music.preview);
            //     const result = await mergeVideo(formData);
            //     console.log('Result::::', result);
            // }
            // catch(error){
            //     console.log('ERROR:::::', error);
            // }
        //     return;
        // };

        // console.log('No Music +++++++++++++++++++');
    };

    return (
        <View style={styles.container}>
            <View style={[styles.videoContainer, videoDimensions]}>

                {videoUri ? (
                    <Video
                        ref={videoRef}
                        source={{ uri: videoUri }}
                        style={videoDimensions}
                        resizeMode="cover"
                        paused={!isPlaying}
                        muted={soundWithVideo ? true : isMuted}
                        repeat={true}
                        onEnd={()=> soundWithVideo ? handleVideoEnd() : null}
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
                {!soundWithVideo && <TouchableOpacity onPress={() => setIsMuted(!isMuted)}>
                    <Icon name={isMuted ? 'volume-off' : 'volume-up'} size={30} color="white" />
                </TouchableOpacity>}
            </View>

            <View style={styles.navigationButtons}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={30} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigateVideoPreview()}>
                    <Icon name="arrow-forward" size={30} color="white" />
                </TouchableOpacity>
            </View>

            {isMusicModalVisible && <MusicModal visible={isMusicModalVisible} onClose={closeMusciModal} handleTrackSelectWithVideo={handleTrackSelectWithVideo} />}
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
    musicPlayerControls: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    trackName: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
});

export default VideoEdit;
