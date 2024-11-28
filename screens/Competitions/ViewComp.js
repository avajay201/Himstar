import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ToastAndroid, useWindowDimensions } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import RenderHTML from 'react-native-render-html';


const ViewComp = ({ route, navigation }) => {
    const { competition } = route.params;
    const { width } = useWindowDimensions();

    useEffect(()=>{
        if (!competition) {
            ToastAndroid.show('Unable to view this competition, please try after some time.', ToastAndroid.SHORT);
            navigation.goBack();
        }
    }, []);

    const compRegister = ()=>{
        navigation.navigate('Payment', {compId: competition.id, compType: competition.competition_type, amount: String(competition.price), productInfo: competition?.name, firstName: 'Ajay Verma', email: 'ajayverma6367006928@gmail.com', phone: '6367006928'});
    };

    const videoUpload = ()=>{
        navigation.navigate('VideoCreate', {compId: competition.id});
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.backButtonContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <Image
                source={{ uri: competition?.file_uri }}
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
                    <Text style={styles.rulesText}>
                        <RenderHTML
                        contentWidth={width}
                        source={{ html: competition?.rules || '<p>No rules available</p>' }}
                        />
                    </Text>
                </View>

                <TouchableOpacity disabled={competition.is_done} style={[styles.registerButton, {backgroundColor: competition.is_done ? '#E8B8D4' : '#B94EA0'}]} onPress={()=>competition.is_done ? null : (competition.is_participated ? videoUpload() : compRegister())}>
                    <Text style={styles.registerButtonText}>{competition.is_done ? 'Enrolled' : (competition.is_participated ? 'Upload your video' : 'Enroll Now')}</Text>
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
