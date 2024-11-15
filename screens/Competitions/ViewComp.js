import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ToastAndroid } from "react-native";
import { BASE_URL } from "../../actions/APIs";
import Icon from 'react-native-vector-icons/Ionicons';


const ViewComp = ({ route, navigation }) => {
    const { competition } = route.params;

    useEffect(()=>{
        if (!competition) {
            ToastAndroid.show('Unable to view this competition, please try after some time.', ToastAndroid.SHORT);
            navigation.goBack();
        }
    }, []);

    const compRegister = ()=>{
        // navigation.navigate('VideoCreate', {compId: competition.id});
        navigation.navigate('Payment', {compId: competition.id});
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.backButtonContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <Image
                source={{ uri: BASE_URL + competition?.banner_image }}
                style={styles.bannerImage}
            />

            <View style={styles.detailsContainer}>
                <Text style={styles.competitionName}>{competition?.name}</Text>

                <Text style={styles.description}>{competition?.description}</Text>

                <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>Start Date: {competition?.start_date}</Text>
                    <Text style={styles.dateText}>End Date: {competition?.end_date}</Text>
                </View>

                <Text style={styles.location}>Location: {competition?.location}</Text>

                <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>Registration Opens: {competition?.registration_open_date}</Text>
                    <Text style={styles.dateText}>Registration Closes: {competition?.registration_close_date}</Text>
                </View>

                <Text style={styles.price}>Price: ₹{competition?.price}</Text>

                <Text style={styles.category}>Category: {competition?.category}</Text>

                <Text style={styles.maxParticipants}>Max Participants: {competition?.max_participants}</Text>

                <View style={styles.rulesContainer}>
                    <Text style={styles.rulesHeading}>Rules:</Text>
                    <Text style={styles.rulesText}>{competition?.rules}</Text>
                </View>

                <TouchableOpacity style={styles.registerButton} onPress={compRegister}>
                    <Text style={styles.registerButtonText}>Enroll Now</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#fff",
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
    detailsContainer: {
        padding: 20,
    },
    competitionName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: "#666",
        marginBottom: 20,
    },
    dateContainer: {
        marginBottom: 15,
    },
    dateText: {
        fontSize: 14,
        color: "#333",
    },
    location: {
        fontSize: 14,
        color: "#333",
        marginBottom: 15,
    },
    price: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#B94EA0",
        marginBottom: 15,
    },
    category: {
        fontSize: 14,
        color: "#666",
        marginBottom: 15,
    },
    maxParticipants: {
        fontSize: 14,
        color: "#333",
        marginBottom: 15,
    },
    rulesContainer: {
        marginBottom: 20,
    },
    rulesHeading: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    rulesText: {
        fontSize: 14,
        color: "#666",
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
