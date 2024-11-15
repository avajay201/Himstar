import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, Modal, Animated } from 'react-native';
import { verifyOtp, userRegistration } from '../../actions/ApiActions';


const OTPVerify = ({ route, navigation }) => {
  const { userData } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [error, setError] = useState(false);
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const inputRefs = useRef([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const errorAnimation = useRef(new Animated.Value(-100)).current;

  const handleOtpChange = (value, index) => {
    if (/^\d*$/.test(value)) {
      let otpCopy = [...otp];
      otpCopy[index] = value;
      setOtp(otpCopy);

      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      } else if (!value && index > 0) {
        inputRefs.current[index - 1].focus();
      }

      if (error) setError(false);
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleVerify = async () => {
    if (otp.includes('')) {
      setError(true);
      triggerShake();
      return;
    }

    setVerifyLoading(true);
    const result = await verifyOtp({ email: userData.email, otp: otp.join(''), user_data: userData });
    let errorMsg;
    let successMsg = false;
    if (!result){
      errorMsg = 'Something went wrong.';
      setErrorMessage(errorMsg);
      setIsErrorVisible(true);
    }
    else if (result[0] === 201) {
      successMsg = true;
      setSuccessMessage(result[1].message);
      setIsErrorVisible(true);
    }
    else {
      if (typeof (result[1]) === 'object') {
        const firstKey = Object.keys(result[1])[0];
        errorMsg = result[1][firstKey][0];
      }
      else {
        errorMsg = result[1];
      }
      setErrorMessage(errorMsg);
      setIsErrorVisible(true);
    }
    if (errorMsg || successMsg) {
      Animated.timing(errorAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        Animated.timing(errorAnimation, {
          toValue: -100,
          duration: 500,
          useNativeDriver: true,
        }).start(() =>{ setIsErrorVisible(false); setErrorMessage(''); setSuccessMessage('')});
        if (successMsg) {
          setVerifyLoading(false);
          navigation.navigate('Login');
        }
      }, 2000);
    }
    if (!successMsg){
      setVerifyLoading(false);
    }
  };

  const handleResendOtp = async() => {
    const result = await userRegistration(userData);
    let errorMsg;
    let successMsg = false;
    if (!result){
      errorMsg = 'Something went wrong.';
      setErrorMessage(errorMsg);
      setIsErrorVisible(true);
    }
    else if (result[0] === 200) {
      successMsg = true;
      setSuccessMessage('An OTP has been sent to your email.');
      setIsErrorVisible(true);
    }
    else {
      if (typeof (result[1]) === 'object') {
        const firstKey = Object.keys(result[1])[0];
        errorMsg = result[1][firstKey][0];
      }
      else {
        errorMsg = result[1];
      }
      setErrorMessage(errorMsg);
      setIsErrorVisible(true);
    }
    if (errorMsg || successMsg) {
      Animated.timing(errorAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        Animated.timing(errorAnimation, {
          toValue: -100,
          duration: 500,
          useNativeDriver: true,
        }).start(() =>{ setIsErrorVisible(false); setErrorMessage(''); setSuccessMessage('')});
      }, 2000);
    }
    if (!successMsg){
      setVerifyLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {isErrorVisible && (
        <Animated.View style={[styles.apiErrorContainer, { transform: [{ translateY: errorAnimation }], backgroundColor: successMessage ? 'green' : 'red' }]}>
          <Text style={styles.apiErrorText}>{errorMessage || successMessage}</Text>
        </Animated.View>
      )}
      <Text style={styles.otpText}>OTP</Text>
      <Text style={styles.description}>A 6 digit code has been sent to your email</Text>
      
      <Animated.View style={[styles.otpInputContainer, { transform: [{ translateX: shakeAnimation }] }]}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={[styles.otpBox, error && digit === '' && styles.errorBorder]}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            ref={(ref) => inputRefs.current[index] = ref}
          />
        ))}
      </Animated.View>
      
      <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
        <Text style={styles.verifyButtonText}>Verify</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleResendOtp}>
        <Text style={styles.linkText}>
          <Text style={styles.linkBlackText}>Didn’t Receive Any code? </Text>
          <Text style={styles.linkPrimaryText}>Resend</Text>
        </Text>
      </TouchableOpacity>

      <Modal transparent={true} animationType="fade" visible={verifyLoading}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={'#B94EA0'} />
          <Text style={styles.loadingText}>Verifying...</Text>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
  },
  apiErrorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 15,
    zIndex: 1000000,
  },
  apiErrorText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  otpText: {
    fontSize: 24,
    marginBottom: 20,
    color: '#B94EA0',
    fontWeight: 'bold',
    fontFamily: 'DMSans_700Bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 20,
    color: '#979C93',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'DMSans_700Bold',
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpBox: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 20,
    marginLeft: 7,
    borderColor: '#B94EA0',
  },
  errorBorder: {
    borderColor: 'red',
  },
  resendText: {
    color: '#007bff',
    fontSize: 14,
    marginBottom: 40,
  },
  verifyButton: {
    width: '80%',
    alignSelf: 'center',
    backgroundColor: '#B94EA0',
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 15,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'DMSans_700Bold',
  },
  linkText: {
    marginTop: 15,
    textAlign: 'center',
    fontFamily: 'DMSans_500Medium',
    fontSize: 15,
    color: '#B94EA0',
    fontWeight: 'bold',
  },
  linkBlackText: {
    color: '#000',
  },
  linkPrimaryText: {
    color: '#B94EA0',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#B94EA0',
  },
});

export default OTPVerify;
