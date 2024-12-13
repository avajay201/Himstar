import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Video from 'react-native-video';
import { mergeVideo, removeMergedVideo, postCreate } from '../../actions/ApiActions';
import { BASE_URL } from '../../actions/APIs';
import { MainContext } from '../../others/MyContext';


const VideoPreview = ({ route, navigation }) => {
    const { uri, videoDimensions, musicUri, compId } = route.params;
    const [loading, setLoading] = useState(true);
    const [videoUri, setVideoUri] = useState(uri);
    const [isPlaying, setIsPlaying] = useState(true);
    const { setHomeReload } = useContext(MainContext);

    const mergeProcess = async()=>{
        try{
            const formData = new FormData();
            formData.append('video', {
                uri: videoUri,
                type: 'video/mp4',
                name: 'video.mp4',
            });
            formData.append('music', musicUri);
            const result = await mergeVideo(navigation, formData);
            console.log('Results: ', result);
            if (result[0] === 200){
                const videoURL = BASE_URL + '/' + result[1].merged_video;
                setVideoUri(videoURL);
            }
            else{
                ToastAndroid.show('Video processing failed, please try again!', ToastAndroid.SHORT);
                navigation.goBack();
            }
        }
        catch(error){
            ToastAndroid.show('Video processing failed, please try again!', ToastAndroid.SHORT);
            navigation.goBack();
        }
    };

    useEffect(() => {
        if (musicUri) {
            mergeProcess();
        }
        else {
            setLoading(false);
        }
    }, []);

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const uploadVideo = async () => {
        setLoading(true)
        const formData = new FormData();
        formData.append('competition', Number(compId));
        formData.append('video', {
            uri: videoUri,
            type: 'video/mp4',
            name: 'video.mp4',
        });
        const result = await postCreate(navigation, formData);
        if (result[0] === 200){
            ToastAndroid.show('Competition registration completed successfully.', ToastAndroid.SHORT);
            setHomeReload(true);
            navigation.navigate('HomeTabs');
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
        setLoading(false);
    };

    const backToVideoEdit = async()=>{
        if (musicUri){
            await removeMergedVideo(navigation, {file: videoUri.split('/').pop()});
        };
        navigation.goBack();
    };

    return (
        <>
            <View style={styles.container}>
                <View style={[styles.videoContainer, videoDimensions]}>

                    {videoUri ? (
                        <Video
                            source={{ uri: videoUri }}
                            style={videoDimensions}
                            resizeMode="cover"
                            paused={!isPlaying}
                            muted={loading ? true : false}
                            repeat={true}
                            onLoad={()=> videoUri.includes(BASE_URL) ? setLoading(false) : null}
                        />
                    )
                        :
                        <Text>Video Player Placeholder</Text>
                    }
                </View>

                {!loading && <View style={styles.controls}>
                    <TouchableOpacity onPress={togglePlayPause}>
                        <Icon name={isPlaying ? 'pause' : 'play-arrow'} size={40} color="white" />
                    </TouchableOpacity>
                </View>}

                <View style={styles.navigationButtons}>
                    <TouchableOpacity style={styles.backToVideoEdit} onPress={backToVideoEdit}>
                        <Text style={styles.backToVideoEditText}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.uploadVideo} onPress={uploadVideo}>
                        <Text style={styles.uploadVideoText}>Done</Text>
                    </TouchableOpacity>
                </View>

                <Modal transparent={true} animationType="fade" visible={loading}>
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color='#B94EA0' />
                    </View>
                </Modal>
            </View>
        </>
    )
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
    videoContainer: { width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#333' },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '60%',
        position: 'absolute',
        bottom: 120,
    },
    navigationButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 50,
        width: '80%',
        position: 'absolute',
        bottom: 50,
    },
    backToVideoEdit: {
        backgroundColor: 'gray',
        borderRadius: 10,
        paddingVertical: 10,
        width: 80,
        alignItems: 'center'
    },
    backToVideoEditText: {
        fontSize: 20,
        color: 'white',
    },
    uploadVideo: {
        backgroundColor: '#B94EA0',
        borderRadius: 10,
        paddingVertical: 10,
        width: 80,
        alignItems: 'center',
    },
    uploadVideoText: {
        fontSize: 20,
        color: 'white',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
});

export default VideoPreview;
