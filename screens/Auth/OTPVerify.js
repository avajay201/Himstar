import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, Modal } from 'react-native';

const OTPVerify = ({ navigation }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

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
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleResendOtp = () => {
  };

  const handleVerify = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Login');
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.otpText}>OTP</Text>
      <Text style={styles.description}>A 6 digit code has been sent to your email</Text>
      
      <View style={styles.otpInputContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpBox}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            ref={(ref) => inputRefs.current[index] = ref}
          />
        ))}
      </View>
      
      <TouchableOpacity onPress={handleResendOtp}>
        <Text style={styles.resendText}>
          Didn't receive any code? Resend
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
        <Text style={styles.verifyButtonText}>Verify</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        animationType="fade"
        visible={loading}
      >
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#28a745" />
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
  otpText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 30,
    textAlign: 'center',
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpBox: {
    width: 40,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dee2e6',
    textAlign: 'center',
    fontSize: 20,
  },
  resendText: {
    color: '#007bff',
    fontSize: 14,
    marginBottom: 40,
  },
  verifyButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 5,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
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
  },
});

export default OTPVerify;
