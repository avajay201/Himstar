import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Animated, Modal, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from 'react-native-ui-datepicker';
import { userRegistration } from '../../actions/ApiActions';
import { useFocusEffect } from '@react-navigation/native';
import dayjs from 'dayjs';


export default function Register({ navigation }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    zipcode: '',
    dob: '',
    phonenumber: '',
    gender: '',
    password: '',
    confirm_password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dobPickerVisible, setDobPickerVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const errorAnimation = useRef(new Animated.Value(-100)).current;
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(dayjs());

  const [showDatePicker, setShowDatePicker] = useState(false);

  useFocusEffect(
    useCallback(() => {
      return () => {
        // This cleanup function will run when the screen is unfocused
        setFormData({
          username: '',
          fullName: '',
          email: '',
          zipCode: '',
          dob: '',
          phoneNumber: '',
          gender: '',
          password: '',
          confirmPassword: '',
        });
        setShowPassword(false);
        setShowConfirmPassword(false);
        setStep(1);
        setErrorMessage('');
        setSuccessMessage('');
        setIsErrorVisible(false);
      };
    }, [])
  );

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{5,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;
  const zipCodeRegex = /^[0-9]{1,6}$/;

  const validateStep = () => {
    const newErrors = {};
    switch (step) {
      case 1:
        if (!formData.username) {
          newErrors.username = 'Username is required.';
        } else if (!usernameRegex.test(formData.username)) {
          newErrors.username = 'Username must be at least 6 characters long and start with a letter.';
        }

        if (!formData.fullName) {
          newErrors.fullName = 'Full name is required.';
        } else if (formData.fullName.length < 3) {
          newErrors.fullName = 'Full name must be at least 3 characters long.';
        }

        if (!formData.email) {
          newErrors.email = 'Email is required.';
        } else if (!emailRegex.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address.';
        }
        break;

      case 2:
        if (!formData.zipcode) {
          newErrors.zipcode = 'Zip code is required.';
        } else if (!zipCodeRegex.test(formData.zipcode)) {
          newErrors.zipcode = 'Zip code must be a 6-digit integer.';
        }

        if (!formData.dob) {
          newErrors.dob = 'Date of Birth is required.';
        }

        if (!formData.phonenumber) {
          newErrors.phonenumber = 'Phone number is required.';
        } else if (!phoneRegex.test(formData.phonenumber)) {
          newErrors.phonenumber = 'Please enter a valid 10-digit phone number.';
        }

        if (!formData.gender) newErrors.gender = 'Please select a gender.';
        break;

      case 3:
        if (!formData.password) newErrors.password = 'Password is required.';
        if (!formData.confirm_password) newErrors.confirm_password = 'Confirm password is required.';
        if (formData.password !== formData.confirm_password) {
          newErrors.confirm_password = 'Passwords do not match.';
        }
        break;

      default:
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleNextStep = () => {
    if (validateStep()) {
      if (step < 3) {
        setStep(step + 1);
      } else {
        handleRegister();
      }
    }
  };

  const handleBackStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    const result = await userRegistration(formData);
    console.log('Result:', result);
    let errorMessage;
    let successMsg = false;
    if (result[0] === 200){
      successMsg = true;
      setSuccessMessage('Registration completed successfully.');
      setIsErrorVisible(true);
    }
    else{
      if (typeof(result[1]) === 'object'){
        const firstKey = Object.keys(result[1])[0];
        errorMessage = result[1][firstKey][0];
      }
      else{
        errorMessage = result[1];
      }
      setErrorMessage(errorMessage);
      setIsErrorVisible(true);
    }
    if(errorMessage || successMsg){
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
        }).start(() => setIsErrorVisible(false));
        if (successMsg){
          setTimeout(()=>{
            navigation.navigate('OTPVerify');
          }, 100);
        }
      }, 3000);
    }
    setLoading(false);
  };

  const showDatePickerHandler = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const formattedDate = selectedDate.toLocaleDateString('en-GB'); // Format as DD/MM/YYYY
      setFormData({ ...formData, dob: formattedDate });
      setErrors({ ...errors, dob: '' }); // Clear DOB error if any
    }
  };

  return (
    <View style={styles.container}>
      {isErrorVisible && (
        <Animated.View style={[styles.apiErrorContainer, { transform: [{ translateY: errorAnimation }], backgroundColor: successMessage ? 'green' : 'red' }]}>
          <Text style={styles.apiErrorText}>{errorMessage || successMessage}</Text>
        </Animated.View>
      )}
      {step === 1 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={formData.username}
            onChangeText={(text) => handleInputChange('username', text)}
          />
          {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={formData.fullName}
            onChangeText={(text) => handleInputChange('fullName', text)}
          />
          {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => handleInputChange('email', text)}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <View style={styles.separatorContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
          </View>
          <TouchableOpacity style={styles.googleButton}>
            <Icon name="google" size={20} color="red" style={styles.googleIcon} />
            <Text style={styles.googleButtonText}>Register with Google</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 2 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Zip Code"
            value={formData.zipcode}
            onChangeText={(text) => handleInputChange('zipcode', text)}
            keyboardType="numeric"
            maxLength={6}
          />
          {errors.zipcode && <Text style={styles.errorText}>{errors.zipcode}</Text>}

          <TouchableOpacity onPress={() => setDobPickerVisible(!dobPickerVisible)}>
            <TextInput
              style={styles.input}
              placeholder="Date of Birth (DOB)"
              value={formData.dob}
              editable={false}
            />
          </TouchableOpacity>
          {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}

          {dobPickerVisible && (
            <DateTimePicker
            mode="single"
            date={date}
            onChange={(params) => {
              console.log('Selected Date:', params.date);
              const selectedDate = new Date(params.date);
              if (!isNaN(selectedDate)) {
                handleInputChange('dob', dayjs(selectedDate).format('YYYY-MM-DD'))
                setDobPickerVisible(false);
              } else {
                console.error('Invalid date selected');
              }
            }}
          />
          )}

          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={formData.phonenumber}
            onChangeText={(text) => handleInputChange('phonenumber', text)}
            keyboardType="phone-pad"
            maxLength={10}
          />
          {errors.phonenumber && <Text style={styles.errorText}>{errors.phonenumber}</Text>}

          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity onPress={() => handleInputChange('gender', 'male')}>
              <Text style={styles.genderOption}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleInputChange('gender', 'female')}>
              <Text style={styles.genderOption}>Female</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleInputChange('gender', 'other')}>
              <Text style={styles.genderOption}>Other</Text>
            </TouchableOpacity>
          </View>
          {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
        </>
      )}

      {step === 3 && (
        <>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={formData.password}
              onChangeText={(text) => handleInputChange('password', text)}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIconContainer}
            >
              <Icon name={showPassword ? "eye" : "eye-off"} size={20} color="#555" />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry={!showConfirmPassword}
              value={formData.confirm_password}
              onChangeText={(text) => handleInputChange('confirm_password', text)}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIconContainer}
            >
              <Icon name={showConfirmPassword ? "eye" : "eye-off"} size={20} color="#555" />
            </TouchableOpacity>
          </View>
          {errors.confirm_password && <Text style={styles.errorText}>{errors.confirm_password}</Text>}
        </>
      )}

      <View style={styles.buttonContainer}>
        {step > 1 && (
          <TouchableOpacity
            style={[styles.nextButton, styles.backButton]}
            onPress={handleBackStep}
          >
            <Text style={styles.nextButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
          <Text style={styles.nextButtonText}>
            {step < 3 ? 'Next' : 'Register'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.LoginContainer}>
        <Text>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Login here</Text>
        </TouchableOpacity>
      </View>
      <Modal
        transparent={true}
        animationType="fade"
        visible={loading}
      >
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  orText: {
    marginHorizontal: 10,
    color: '#555',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  googleIcon: {
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  nextButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  backButton: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  label: {
    marginVertical: 10,
    fontWeight: 'bold',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  genderOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  passwordContainer: {
    width: '100%',
    position: 'relative',
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  LoginContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  loaderOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});