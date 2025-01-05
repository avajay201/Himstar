import { useEffect, useState } from "react";
import { getPaymentHistory } from "../../actions/ApiActions";
import { 
    ToastAndroid, 
    ActivityIndicator, 
    Modal, 
    StyleSheet, 
    View, 
    Text, 
    FlatList, 
    ImageBackground,
    TouchableOpacity 
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { BASE_URL } from "../../actions/APIs";


export default PaymentHistory = ({ navigation }) => {
    const [paymentData, setPaymentData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPaymentData = async () => {
        const result = await getPaymentHistory();
        if (result[0] === 200) {
            setPaymentData(result[1]);
        } else {
            ToastAndroid.show(result[1], ToastAndroid.SHORT);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPaymentData();
    }, []);

    const renderPaymentItem = ({ item }) => (
        <View style={styles.card}>
            <ImageBackground 
                source={{ uri: !item?.banner?.includes('media') ? item.banner : BASE_URL + item.banner }} 
                style={styles.cardHeader}
                imageStyle={styles.cardHeaderImage}
            >
                <Text style={styles.cardTitle}>{item.productinfo}</Text>
            </ImageBackground>
            <View style={styles.cardBody}>
                <Text style={styles.detailText}>
                    <Text style={styles.label}>Name:</Text> {item.firstname}
                </Text>
                <Text style={styles.detailText}>
                    <Text style={styles.label}>Email:</Text> {item.email}
                </Text>
                <Text style={styles.detailText}>
                    <Text style={styles.label}>Phone:</Text> {item.phone}
                </Text>
                <Text style={styles.detailText}>
                    <Text style={styles.label}>Amount:</Text> ₹{item.amount}
                </Text>
                <Text style={styles.detailText}>
                    <Text style={styles.label}>Status:</Text> 
                    <Text style={item.status === "success" ? styles.success : styles.failure}>
                        {item.status}
                    </Text>
                </Text>
                <Text style={styles.detailText}>
                    <Text style={styles.label}>Mode:</Text> {item.mode}
                </Text>
                <Text style={styles.detailText}>
                    <Text style={styles.label}>Date:</Text> {new Date(item.created_at).toLocaleDateString()}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.backButtonContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.headerText}>Payment Details</Text>
            </View>
            <Modal transparent={true} animationType="fade" visible={loading}>
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#FF5722" />
                </View>
            </Modal>
            {!loading && paymentData.length > 0 ? (
                <FlatList
                    data={paymentData}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderPaymentItem}
                    contentContainerStyle={styles.listContainer}
                />
            ) : (
                !loading && (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No payment records found.</Text>
                    </View>
                )
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F1F1F1",
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    backButtonContainer: {
        position: 'absolute',
        top: 13,
        left: 10,
        zIndex: 10,
    },
    backButton: {
        padding: 10,
    },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#B94EA0',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    listContainer: {
        padding: 10,
    },
    card: {
        backgroundColor: "#FFF",
        borderRadius: 10,
        marginVertical: 10,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    cardHeader: {
        height: 150,
        justifyContent: "flex-end",
        padding: 10,
    },
    cardHeaderImage: {
        borderRadius: 10,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFF",
        textShadowColor: "rgba(0, 0, 0, 0.6)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 4,
    },
    cardBody: {
        padding: 15,
    },
    detailText: {
        fontSize: 14,
        color: "#6B6B6B",
        marginBottom: 8,
    },
    label: {
        fontWeight: "bold",
        color: "#333",
    },
    success: {
        color: "#4CAF50",
        fontWeight: "bold",
    },
    failure: {
        color: "#F44336",
        fontWeight: "bold",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        fontSize: 16,
        color: "#888",
    },
});
