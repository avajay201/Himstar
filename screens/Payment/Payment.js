import React, { useEffect, useState } from 'react'
import { NativeEventEmitter, StyleSheet, Text, View, TouchableOpacity, ToastAndroid } from 'react-native'
import PayUBizSdk from 'payu-non-seam-less-react';
import { sha512 } from 'js-sha512';
import { makePayment } from '../../actions/ApiActions';


const Payment = ({ route, navigation }) => {
    const { compId } = route.params;
    const [key, setKey] = useState("wUKnWv");
    const [merchantSalt, setMerchantSalt] = useState("dfnpSUMPtmdP9T0UT02vyKseFpuUDxSu");

    const [amount, setAmount] = useState('100');
    const [productInfo, setProductInfo] = useState('Dance Competition');
    const [firstName, setFirstName] = useState('Ajay');

    const [email, setEmail] = useState('ajayverma6367006928@gmail.com');
    const [phone, setPhone] = useState('6367006928');

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
            // successResponse['compId'] = compId;
            await makePayment(successResponse);
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
        console.log('Payment Params:', createPaymentParams());
        PayUBizSdk.openCheckoutScreen(createPaymentParams());
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={launchPayment}>
                <Text style={styles.buttonText}>Pay Rs. {amount}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    button: {
        backgroundColor: "#B94EA0",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default Payment;
