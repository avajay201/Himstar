import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ToastAndroid, useWindowDimensions } from "react-native";
import WebView from "react-native-webview";
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";


const ViewComp = ({ route, navigation }) => {
    const { competition } = route.params;
    const [dynamicHeight, setDynamicHeight] = useState(500);
    const [rules, setRules] = useState(`
            <html>
                <head>
                    <style>
                        body {
                            font-size: 40px; /* Adjust font size here */
                            color: #333; /* Optional: Change text color */
                            font-family: Arial, sans-serif; /* Optional: Change font family */
                        }
                    </style>
                </head>
                <body>
                    ${competition?.rules || '<p>No rules available</p>'}
                </body>
            </html>
    `)

    useEffect(() => {
        if (!competition) {
            ToastAndroid.show('Unable to view this competition, please try after some time.', ToastAndroid.SHORT);
            navigation.goBack();
        }
    }, []);

    const compRegister = async() => {
        const email = await AsyncStorage.getItem('AuthEmail');
        const name = await AsyncStorage.getItem('AuthName');
        const phone = await AsyncStorage.getItem('AuthPhone');
        if (!email || !name || !phone){
            ToastAndroid.show('Please update your profile before competetion register.', ToastAndroid.SHORT);
            return;
        }
        navigation.navigate('Payment', { compId: competition.id, compType: competition.competition_type, amount: String(competition.price), productInfo: competition?.name, firstName: name, email: email, phone: phone });
    };

    const videoUpload = () => {
        navigation.navigate('VideoCreate', { compId: competition.id });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.backButtonContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <Image
                source={{ uri: competition?.file_uri }}
                style={styles.bannerImage}
            />

            <View style={styles.compTagsContainer}>
                <TouchableOpacity style={[styles.tag, { backgroundColor: '#54C560' }]}>
                    <Text style={styles.tagText}>{competition?.stage}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.tag, { backgroundColor: '#E2AA19' }]}>
                    <Text style={styles.tagText}>₹{competition?.price}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.tag, { backgroundColor: '#874936' }]}>
                    <Text style={styles.tagText}>{competition?.remaining_slots}/{competition?.max_participants}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.detailsContainer}>
                <Text style={styles.competitionName}>{competition?.name}</Text>

                <Text style={styles.description}>{competition?.description}</Text>

                <View style={styles.textContainer}>
                    <Text style={styles.textLabel}>Price: </Text>
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
                    <Text style={styles.textValue}>{competition?.registration_open_date}</Text>
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.textLabel}>Registration Closes: </Text>
                    <Text style={styles.textValue}>{competition?.registration_close_date}</Text>
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.textLabel}>Location: </Text>
                    <Text style={styles.textValue}>{competition?.location}</Text>
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

                <View style={styles.rulesContainer}>
                    <Text style={styles.rulesHeading}>Rules:</Text>
                    <WebView
                        style={[styles.webview, { height: dynamicHeight }]}
                        originWhitelist={['*']}
                        source={{ html: rules }}
                    />
                </View>

                {competition.is_live && <TouchableOpacity disabled={competition.is_done} style={[styles.registerButton, { backgroundColor: competition.is_done ? '#E8B8D4' : '#B94EA0' }]} onPress={() => competition.is_done ? null : (competition.is_participated ? videoUpload() : compRegister())}>
                    <Text style={styles.registerButtonText}>{competition.is_done ? 'Enrolled' : (competition.is_participated ? 'Upload your video' : 'Enroll Now')}</Text>
                </TouchableOpacity>}
            </View>
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
});

export default ViewComp;
