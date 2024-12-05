import React, { useEffect, useState, useRef, useContext } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ToastAndroid, Modal, ActivityIndicator, TouchableOpacity, Animated, Easing } from 'react-native';
import { profile } from '../../actions/ApiActions';
import { BASE_URL } from '../../actions/APIs';
import AppLogo from './../../assets/images/logo.png';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MainContext } from '../../others/MyContext';


const Profile = ({ navigation }) => {
    const [profileData, setProfileData] = useState({});
    const [loading, setLoading] = useState(true);
    const [settingsVisible, setSettingsVisible] = useState(false);
    const slideAnim = useRef(new Animated.Value(300)).current;
    const { profileReload, setProfileReload } = useContext(MainContext);

    const openSettings = () => {
        setSettingsVisible(true);
        Animated.timing(slideAnim, {
            toValue: 0, // Move to visible position
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
        }).start();
    };

    useEffect(()=>{
        if (profileReload){
            fetchprofile();
            setProfileReload(false);
        }
    }, [profileReload]);

    const closeSettings = () => {
        Animated.timing(slideAnim, {
            toValue: 300, // Move off-screen
            duration: 300,
            easing: Easing.in(Easing.ease),
            useNativeDriver: false,
        }).start(() => setSettingsVisible(false));
    };

    const fetchprofile = async () => {
        setLoading(true);
        const result = await profile();
        if (result[0] === 200) {
            setProfileData(result[1]);
        }
        else {
            ToastAndroid.show(result[1], ToastAndroid.SHORT);
        }
        setLoading(false);
    };

    const handleSettingsOption = (option) => {
        setSettingsVisible(false);
        if (option === 'EditProfile'){
            navigation.navigate(option, {profileData: profileData});
        }
        else{
            navigation.navigate(option);
        }
    };

    useEffect(() => {
        fetchprofile();
    }, []);

    const logout = async()=>{
        setLoading(true);
        setSettingsVisible(false);
        await AsyncStorage.removeItem('AuthToken');
        await AsyncStorage.removeItem('AuthUser');
        await AsyncStorage.removeItem('AuthId');
        await AsyncStorage.removeItem('RegAuthId');
        await AsyncStorage.removeItem('AuthEmail');
        ToastAndroid.show('Logout successfully.', ToastAndroid.SHORT);
        setLoading(false);
        navigation.navigate('Login');
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.header}>
                <TouchableOpacity onPress={openSettings}>
                    <Icon name="settings" size={40} color="white" />
                </TouchableOpacity>
            </View>

            <Image
                source={profileData.cover_image ? {uri: BASE_URL + profileData.cover_image} : AppLogo}
                style={styles.bannerImage}
            />

            <Image
                source={profileData.profile_image ? {uri: BASE_URL + profileData.profile_image} : AppLogo}
                style={styles.profileImage}
            />

            <Text style={styles.name}>{profileData.first_name} {profileData.last_name}</Text>
            <Text style={styles.name1}>{profileData.username}</Text>
            <View style={styles.cardsContainer}>
                <View style={styles.card}>
                    <Image
                        source={require('../../assets/images/votes.png')}
                        style={styles.cardImage}
                    />
                    <View style={styles.cardContent}>
                        <Text style={styles.cardNumber1}>{profileData.votes}</Text>
                        <Text style={styles.cardTitle}>Votes</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <Image
                        source={require('../../assets/images/points.png')}
                        style={styles.cardImage}
                    />
                    <View style={styles.cardContent}>
                        <Text style={styles.cardNumber1}>{profileData.points}</Text>
                        <Text style={styles.cardTitle}>Points</Text>
                    </View>
                </View>
            </View>

            <Modal transparent={true} animationType="fade" visible={loading}>
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color='#B94EA0' />
                </View>
            </Modal>

            <View style={styles.cardRow2}>
                <View style={styles.cardColumn}>
                    <Text style={styles.cardNumber}>{profileData.participations ? profileData.participations.length : 0}</Text>
                    <Text style={styles.cardSubtitle}>Contest Entered</Text>
                </View>
                <View style={styles.cardColumn}>
                    <Text style={styles.cardNumber}>0</Text>
                    <Text style={styles.cardSubtitle}>Top 50</Text>
                </View>
                <View style={styles.cardColumn}>
                    <Text style={styles.cardNumber}>0</Text>
                    <Text style={styles.cardSubtitle}>Votes Cast</Text>
                </View>
            </View>
            <Text style={styles.subHeading}>Awards</Text>

            <View style={styles.imageRow}>
                {profileData.eligible_awards && profileData.eligible_awards.map((award, index)=>(
                    <Image
                        key={index}
                        source={award.image ? {uri: BASE_URL + award.image} : AppLogo}
                        style={styles.image}
                    />
                ))}
            </View>

            <View style={styles.sliderContainer}>
                <Text style={styles.subHeading}>Wining Contests</Text>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.imageSlider}>
                    <Image
                        source={require('../../assets/images/Rectangle86.png')}
                        style={styles.sliderImage}
                    />
                    <Image
                        source={require('../../assets/images/Rectangle87.png')}
                        style={styles.sliderImage}
                    />
                    <Image
                        source={require('../../assets/images/Rectangle86.png')}
                        style={styles.sliderImage}
                    />
                </ScrollView>
            </View>

            <Modal transparent={true} animationType="fade" visible={loading}>
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color='#B94EA0' />
                </View>
            </Modal>

            {settingsVisible && (
                <Modal transparent={true} animationType="none" visible={settingsVisible}>
                    <Animated.View style={[styles.settingsModal, { transform: [{ translateX: slideAnim }] }]}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Settings</Text>
                            <TouchableOpacity style={styles.modalOption} onPress={() => handleSettingsOption('EditProfile')}>
                                <Text style={styles.modalOptionText}>Edit Profile</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalOption} onPress={() => handleSettingsOption('ChangePassword')}>
                                <Text style={styles.modalOptionText}>{profileData.is_password ? 'Change' : 'Create'} Password</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalOption} onPress={logout}>
                                <Text style={styles.modalOptionText}>Logout</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalClose} onPress={closeSettings}>
                                <Text style={styles.modalCloseText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </Modal>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1, // Ensures the content scrolls properly
        paddingBottom: 20,
    },
    header: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
    },
    bannerImage: {
        width: '100%',
        height: 200, // Adjust the height of the banner
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: '#fff',
        position: 'absolute',
        top: 140, // Adjust based on the height of the banner
        left: '50%',
        transform: [{ translateX: -60 }], // Center the profile image horizontally
        zIndex: 1, // Ensure the profile image is above the banner
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginTop: 50, // Adds space after the profile image
    },
    name1: {
        fontSize: 14,

        color: '#333',
        textAlign: 'center',

    },
    subHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
        textAlign: 'left',
        paddingLeft: 10,
    },
    imageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 10,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    cardsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        paddingHorizontal: 20,
    },
    card: {
        flex: 1,
        backgroundColor: '#211E74',
        borderRadius: 10,
        overflow: 'hidden',
        marginHorizontal: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    cardImage: {
        width: 50,
        height: 50,
        alignSelf: 'center',
        marginTop: 20,
    },
    cardContent: {
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#211E74',
    },
    cardRow2: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 20,
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 10,
    },
    cardColumn: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    cardNumber: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    cardTitle: {
        color: '#fff',
    },
    cardNumber1: {
        color: '#fff',
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
    },
    sliderContainer: {
        marginTop: 20,
    },
    imageSlider: {
        marginTop: 10,
    },
    sliderImage: {
        width: 250,
        height: 150,
        marginRight: 20,
        borderRadius: 10,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
    settingsModal: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#fff',
        width: 200,
        height: 'auto',
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    modalContent: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 10,
        paddingVertical: 30,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalOption: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    modalOptionText: {
        fontSize: 16,
        textAlign: 'center',
    },
    modalClose: {
        marginTop: 10,
    },
    modalCloseText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default Profile;
