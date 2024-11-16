import React, { useEffect, useState } from 'react'
import { NativeEventEmitter, StyleSheet, Text, View, TouchableOpacity, ToastAndroid, Modal, ActivityIndicator } from 'react-native'
import PayUBizSdk from 'payu-non-seam-less-react';
import { sha512 } from 'js-sha512';
import { makePayment } from '../../actions/ApiActions';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Payment = ({ route, navigation }) => {
    const { compId, compType, amount, productInfo, firstName, email, phone } = route.params;
    const [userId, setUserId] = useState(null);
    const currentDate = new Date().toLocaleDateString();
    const [loading, setLoading] = useState(false);

    const [key, setKey] = useState("wUKnWv");
    const [merchantSalt, setMerchantSalt] = useState("dfnpSUMPtmdP9T0UT02vyKseFpuUDxSu");

    const [ios_surl, setIosSurl] = useState(
        'https://success-nine.vercel.app',
    );
    const [ios_furl, setIosFurl] = useState(
        'https://failure-kohl.vercel.app',
    );
    const [environment, setEnvironment] = useState(1 + '');
    const [android_surl, setAndroidSurl] = useState(
        'https://success-nine.vercel.app',
    );
    const [android_furl, setAndroidFurl] = useState(
        'https://failure-kohl.vercel.app',
    );

    const [showCbToolbar, setShowCbToolbar] = useState(true);
    const [userCredential, setUserCredential] = useState('');
    const [primaryColor, setPrimaryColor] = useState('#4c31ae');

    const [secondaryColor, setSecondaryColor] = useState('#022daf');
    const [merchantName, setMerchantName] = useState('DEMO PAY U');
    const [merchantLogo, setMerchantLogo] = useState("");

    const [surePayCount, setSurePayCount] = useState(1);
    const [merchantResponseTimeout, setMerchantResponseTimeout] = useState(10000);
    const [autoApprove, setAutoApprove] = useState(false);
    const [merchantSMSPermission, setMerchantSMSPermission] = useState(false);
    const [
        showExitConfirmationOnCheckoutScreen,
        setShowExitConfirmationOnCheckoutScreen,
    ] = useState(true);
    const [
        showExitConfirmationOnPaymentScreen,
        setShowExitConfirmationOnPaymentScreen,
    ] = useState(true);

    const [autoSelectOtp, setAutoSelectOtp] = useState(true);

    const fetchUser = async()=>{
        const id = await AsyncStorage.getItem('RegAuthId');
        if (!id){
            ToastAndroid.show('Something went wrong, please try again!', ToastAndroid.SHORT);
            navigation.goBack();
            setLoading(false);
        }
        setUserId(id);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    requestSMSPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
                {
                    title: 'PayU SMS Permission',
                    message:
                        'Pay U needs access to your sms to autofill OTP on Bank Pages ',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('SMS Permission Granted!');
            } else {
                console.log('SMS Permission Denied');
            }
        } catch (err) {
            console.warn(err);
        }
    };
    displayAlert = async (status, value, successResponse=null) => {
        if (status === 'Success'){
            console.log('successResponse>>>', successResponse, '++++++++++++', typeof(successResponse));
            if (compType === 'competition'){
                successResponse['competition'] = compId;
            }
            else if (compType === 'tournament'){
                successResponse['tournament'] = compId;
            }
            else {
                ToastAndroid.show('You did a wrong payment, please contact to our supports team.', ToastAndroid.LONG);
                navigation.goBack();
                setLoading(false);
                return;
            }
            successResponse['user'] = userId;
            await makePayment(successResponse);
            navigation.navigate('HomeTabs');
        };
        ToastAndroid.show(value, ToastAndroid.SHORT);
    };
    onPaymentSuccess = e => {
        console.log('Payment Success Data1:', e.merchantResponse);
        console.log('Payment Success Data2:', e.payuResponse);
        displayAlert('Success', "Registeration completed successfully.", JSON.parse(e.payuResponse));
    };

    onPaymentFailure = e => {
        console.log('Payment faluire Data1:', e.merchantResponse);
        console.log('Payment faluire Data1:', e.payuResponse);
        displayAlert('Fail', 'Payment failed, please try again!');
    };


    onPaymentCancel = e => {
        console.log('onPaymentCancel isTxnInitiated -' + e);
        displayAlert('Cancel', 'Payment canceled.');
    };

    onError = e => {
        console.log('Payment Error:', e)
        displayAlert('onError', JSON.stringify(e));
    };


    calculateHash = data => {
        console.log('Calculate HASH1', data);
        var result = sha512(data);
        console.log('Calculate HASH2', result);
        return result;
    };

    sendBackHash = (hashName, hashData) => {
        var hashValue = calculateHash(hashData);
        var result = { [hashName]: hashValue };
        console.log('SEND bACK', result);
        PayUBizSdk.hashGenerated(result);
    };
    generateHash = e => {
        console.log('Generate hash1', e.hashName);
        console.log('Generate hash2', e.hashString);
        sendBackHash(e.hashName, e.hashString + merchantSalt);
    };

    useEffect(() => {
        const eventEmitter = new NativeEventEmitter(PayUBizSdk);
        payUOnPaymentSuccess = eventEmitter.addListener(
            'onPaymentSuccess',
            onPaymentSuccess,
        );
        payUOnPaymentFailure = eventEmitter.addListener(
            'onPaymentFailure',
            onPaymentFailure,
        );
        payUOnPaymentCancel = eventEmitter.addListener(
            'onPaymentCancel',
            onPaymentCancel,
        );
        payUOnError = eventEmitter.addListener('onError', onError);
        payUGenerateHash = eventEmitter.addListener('generateHash', generateHash);

        return () => {
            payUOnPaymentSuccess.remove();
            payUOnPaymentFailure.remove();
            payUOnPaymentCancel.remove();
            payUOnError.remove();
            payUGenerateHash.remove();
        };
    }, [merchantSalt]);

    const createPaymentParams = () => {
        var txnid = new Date().getTime().toString();
        var payUPaymentParams = {
            key: key,
            transactionId: txnid,
            amount: amount,
            productInfo: productInfo,
            firstName: firstName,
            email: email,
            phone: phone,
            ios_surl: ios_surl,
            ios_furl: ios_furl,
            android_surl: android_surl,
            android_furl: android_furl,
            environment: environment,
            userCredential: userCredential,
        };
        var payUCheckoutProConfig = {
            primaryColor: primaryColor,
            secondaryColor: secondaryColor,
            merchantName: merchantName,
            merchantLogo: merchantLogo,
            showExitConfirmationOnCheckoutScreen:
                showExitConfirmationOnCheckoutScreen,
            showExitConfirmationOnPaymentScreen: showExitConfirmationOnPaymentScreen,
            surePayCount: surePayCount,
            merchantResponseTimeout: merchantResponseTimeout,
            autoSelectOtp: autoSelectOtp,
            autoApprove: autoApprove,
            merchantSMSPermission: merchantSMSPermission,
            showCbToolbar: showCbToolbar,
            enforcePaymentList: [{'payment_type' :"UPI"}, {'payment_type' :"CARD"}]
        };
        return {
            payUPaymentParams: payUPaymentParams,
            payUCheckoutProConfig: payUCheckoutProConfig,
        };
    };

    const launchPayment = () => {
        setLoading(true);
        PayUBizSdk.openCheckoutScreen(createPaymentParams());
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerText}>Checkout</Text>
            </View>

            <View style={styles.detailsCard}>
                <Text style={styles.detailItem}>
                    <Text style={styles.label}>Total Amount: </Text>₹{amount}
                </Text>
                <Text style={styles.detailItem}>
                    <Text style={styles.label}>Date: </Text>{currentDate}
                </Text>
                <Text style={styles.detailItem}>
                    <Text style={styles.label}>{compType === 'competition' ? 'Competition' : 'Tournament'} Name: </Text>{productInfo}
                </Text>
                <Text style={styles.detailItem}>
                    <Text style={styles.label}>Name: </Text>{firstName}
                </Text>
                <Text style={styles.detailItem}>
                    <Text style={styles.label}>Email: </Text>{email}
                </Text>
                <Text style={styles.detailItem}>
                    <Text style={styles.label}>Phone: </Text>{phone}
                </Text>
            </View>

            <Text style={styles.description}>
                After payment is done, you can upload your video for this competition.
            </Text>

            <TouchableOpacity style={styles.checkoutButton} onPress={launchPayment}>
                <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
            <Modal transparent={true} animationType="fade" visible={loading}>
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color='#B94EA0' />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
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
    detailsCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 20,
    },
    detailItem: {
        fontSize: 16,
        color: '#555',
        marginVertical: 8,
    },
    label: {
        fontWeight: '600',
        color: '#333',
    },
    description: {
        fontSize: 14,
        color: '#6C63FF',
        textAlign: 'center',
        marginBottom: 30,
    },
    checkoutButton: {
        backgroundColor: '#6C63FF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
      },
});

export default Payment;
