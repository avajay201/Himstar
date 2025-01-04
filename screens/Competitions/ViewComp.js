import React, { useCallback, useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ToastAndroid, ActivityIndicator, Modal } from "react-native";
import WebView from "react-native-webview";
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../actions/APIs";
import { fetchSpecificCompetition } from "../../actions/ApiActions";
import { useFocusEffect } from '@react-navigation/native';

const ViewComp = ({ route, navigation }) => {
    const { compId, compType } = route.params;
    const [competition, setCompetition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dynamicHeight, setDynamicHeight] = useState(500);
    const [countdown, setCountdown] = useState(null);
    const [rules, setRules] = useState(`
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            <style>
              body {
                color: #333; 
                font-family: Arial, sans-serif; 
                margin: 0; 
                padding: 0; 
              }
              .content {
                width: auto;
              }
            </style>
          </head>
          <body>
            <div class="content">
              ${competition?.rules || '<p>No rules available</p>'}
            </div>
            <script>
              (function() {
                function sendHeight() {
                  const height = document.documentElement.scrollHeight;
                  window.ReactNativeWebView.postMessage(JSON.stringify({ height }));
                }
                window.addEventListener("load", sendHeight);
                window.addEventListener("resize", sendHeight);
              })();
            </script>
          </body>
        </html>
    `);

    const fetchCompetition = async () => {
        const result = await fetchSpecificCompetition(navigation, compId, compType);
        if (result[0] === 200) {
            setCompetition(result[1]);
        }
        else {
            ToastAndroid.show('Something went wrong!', ToastAndroid.SHORT);
            navigation.goBack();
        };
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            if (!compId) {
                ToastAndroid.show('Unable to view this competition, please try after some time.', ToastAndroid.SHORT);
                navigation.goBack();
            }
            else{
                fetchCompetition();
            }
            return ()=>{};
        }, [])
    );

    useEffect(() => {
        if (competition?.reg_open && competition?.registration_close_date) {
          const interval = setInterval(() => {
            const now = new Date().getTime();
            const closeDate = new Date(
              competition.registration_close_date,
            ).getTime();
            const distance = closeDate - now;
    
            if (distance < 0) {
              clearInterval(interval);
              setCountdown(null);
            } else {
              const days = Math.floor(distance / (1000 * 60 * 60 * 24));
              const hours = Math.floor(
                (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
              );
              const minutes = Math.floor(
                (distance % (1000 * 60 * 60)) / (1000 * 60),
              );
              const seconds = Math.floor((distance % (1000 * 60)) / 1000);
              setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
            }
          }, 1000);
          return () => clearInterval(interval);
        }
    }, [competition]);

    const viewCompReels = () => {
        if (competition.competition_type === 'tournament') {
            navigation.navigate('Reels', { value: "TOUR-" + competition.id });
        }
        else{
            navigation.navigate('Reels', { value: "COMP-" + competition.id });
        }
    };

    // useEffect(() => {
    //     if (!compId) {
    //         ToastAndroid.show('Unable to view this competition, please try after some time.', ToastAndroid.SHORT);
    //         navigation.goBack();
    //         return;
    //     }
    //     fetchCompetition();
    // }, []);

    // const compRegister = async () => {
    //     const email = await AsyncStorage.getItem('AuthEmail');
    //     const name = await AsyncStorage.getItem('AuthName');
    //     const phone = await AsyncStorage.getItem('AuthPhone');
    //     const reg_id = await AsyncStorage.getItem('RegAuthId');
    //     console.log(email, name, phone, reg_id);
    //     if (!email || !name || !phone || !reg_id) {
    //         ToastAndroid.show('Please update your profile before competetion register.', ToastAndroid.SHORT);
    //         return;
    //     }
    //     navigation.navigate('Payment', { compId: competition?.id, compType: competition?.competition_type, amount: String(competition?.price), productInfo: competition?.name, firstName: name, email: email, phone: phone, reg_id: String(reg_id) });
    // };

    const isVideoButtonDisabled = () => {
        const currentDate = new Date();
        const startDate = new Date(competition?.start_date);
        const endDate = new Date(competition?.end_date);
      
        // Disable button if current date is before the start date or after the end date
        return currentDate < startDate || currentDate > endDate;
    };

    const videoUpload = () => {
        navigation.navigate('VideoCreate', { competition: competition });
    };

    const navigateVideoPreview = async()=>{
        navigation.navigate('VideoPreview', { uri: BASE_URL + competition?.temp_video, videoDimensions: null, musicUri: null, competition: competition });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.backButtonContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <Image
                source={{ uri: competition?.competition_type === 'tournament' ? competition?.competition?.banner_image && competition?.competition?.banner_image?.includes('media') ? BASE_URL + competition?.competition?.banner_image : competition?.competition?.file_uri : competition?.banner_image && competition?.banner_image?.includes('media') ? BASE_URL + competition?.banner_image : competition?.file_uri }}
                style={styles.bannerImage}
            />

            <View style={styles.videoButtonContainer}>
                <TouchableOpacity
                onPress={viewCompReels}
                disabled={isVideoButtonDisabled()}
                style={[
                    styles.videoButton,
                    {backgroundColor: isVideoButtonDisabled() ? '#C4C4C4' : '#B94EA0'},
                ]}>
                <Icon name="play" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            
            <View style={styles.compTagsContainer}>
                {competition?.competition_type === 'competition' && 
                    <TouchableOpacity style={[styles.tag, { backgroundColor: '#54C560' }]}>
                        <Text style={styles.tagText}>{competition?.stage}</Text>
                    </TouchableOpacity>
                }

                <TouchableOpacity style={[styles.tag, { backgroundColor: '#E2AA19' }]}>
                    <Text style={styles.tagText}>Prize : ₹{competition?.winning_price}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.tag, { backgroundColor: '#874936' }]}>
                    <Text style={styles.tagText}>{competition?.remaining_slots}/{competition?.max_participants}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.detailsContainer}>
                <Text style={styles.competitionName}>{competition?.name}</Text>

                {countdown && (
                    <View style={styles.countdownContainer}>
                        <Text style={styles.countdownText}>
                        Registration closes in: {countdown}
                        </Text>
                    </View>
                )}

                <Text style={styles.description}>{competition?.description}</Text>

                <View style={styles.textContainer}>
                    <Text style={styles.textLabel}>Registration Fees: </Text>
                    <Text style={styles.textValue}>₹{competition?.price}</Text>
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.textLabel}>Start Date: </Text>
                    <Text style={styles.textValue}>{competition?.start_date}</Text>
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.textLabel}>End Date: </Text>
                    <Text style={styles.textValue}>{competition?.end_date}</Text>
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.textLabel}>Registration Opens: </Text>
                    <Text style={styles.textValue}>{competition?.competition_type === 'competition' ? competition?.registration_open_date : competition?.competition?.registration_open_date}</Text>
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.textLabel}>Registration Closes: </Text>
                    <Text style={styles.textValue}>{competition?.competition_type === 'competition' ? competition?.registration_close_date : competition?.competition?.registration_close_date}</Text>
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.textLabel}>Location: </Text>
                    <Text style={styles.textValue}>{competition?.competition_type === 'competition' ? competition?.location : competition?.competition?.location}</Text>
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.textLabel}>Category: </Text>
                    <Text style={styles.textValue}>{competition?.category}</Text>
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.textLabel}>Total Slots: </Text>
                    <Text style={styles.textValue}>{competition?.max_participants}</Text>
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.textLabel}>Remaining Slots: </Text>
                    <Text style={styles.textValue}>{competition?.remaining_slots}</Text>
                </View>

                {/* <View style={styles.rulesContainer}>
                    <Text style={styles.rulesHeading}>Rules:</Text>
                    <View style={{ height: dynamicHeight }}>
                        <WebView
                            nestedScrollEnabled={true} // Enable nested scrolling
                            onContentProcessDidTerminate={() => console.log('WebView process terminated')} // Optional for debugging
                            style={[styles.webview, { flex: 1 }]}
                            originWhitelist={['*']}
                            source={{ html: rules }}
                            onLoadEnd={() => setDynamicHeight(null)} // Dynamically adjust height
                            onMessage={(event) => {
                                const data = JSON.parse(event.nativeEvent.data);
                                setDynamicHeight(data.height || 500); // Set WebView height dynamically
                            }}
                        />
                    </View>
                </View> */}

                {
                    competition?.reg_open &&
                    <TouchableOpacity style={[styles.registerButton, { backgroundColor: '#B94EA0' }]} onPress={() => competition?.is_done ? navigation.navigate('Leaderboard', { compId: competition?.competition_type === 'competition' ? competition?.id : competition?.competition?.id }) : (competition?.is_participated ? navigateVideoPreview() : videoUpload())}>
                        <Text style={styles.registerButtonText}>{competition?.is_done ? 'Leaderboard' : (competition?.is_participated ? 'Complete' : 'Enroll Now')}</Text>
                    </TouchableOpacity>
                }

            </View>
            <Modal transparent={true} animationType="fade" visible={loading}>
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color='#B94EA0' />
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#fff",
    },
    webview: {
        width: '100%',
    },
    backButtonContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 10,
    },
    backButton: {
        padding: 10,
    },
    bannerImage: {
        width: "100%",
        height: 200,
        borderRadius: 10,
    },
    compTagsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingHorizontal: 10,
    },
    tag: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        marginHorizontal: 5,
        borderRadius: 50,
    },
    tagText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    detailsContainer: {
        padding: 20,
    },
    competitionName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: "#666",
        marginBottom: 20,
        textAlign: 'justify',
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        justifyContent: 'space-between',
    },
    textLabel: {
        fontSize: 16,
        color: '#B94EA0',
        fontWeight: 'bold',
    },
    textValue: {
        fontSize: 14,
        color: "#000",
    },
    rulesContainer: {
        marginBottom: 20,
    },
    rulesHeading: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#B94EA0",
    },
    rulesText: {
        fontSize: 14,
        color: "#666",
        width: '100%',
        padding: 10,
    },
    registerButton: {
        backgroundColor: "#B94EA0",
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: "center",
    },
    registerButtonText: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "bold",
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
    countdownContainer: {
        padding: 12,
        backgroundColor: '#FAF3E0',
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 12,
        borderWidth: 1,
        borderColor: '#E0C097',
    },
    countdownText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#5C3D2E',
        textAlign: 'center',
    },
    videoButtonContainer: {
        position: 'absolute',
        top: 20,
        right: 10,
        zIndex: 10,
    },
    videoButton: {
        backgroundColor: '#B94EA0',
        padding: 10,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
    },
});

export default ViewComp;
