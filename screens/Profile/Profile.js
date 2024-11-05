import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, ToastAndroid, Animated, Modal, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AppLogo from './../../assets/images/logo.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { useFocusEffect } from '@react-navigation/native';


const Profile = ({ navigation }) => {
  const scrollViewRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [dobPickerVisible, setDobPickerVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const errorAnimation = useRef(new Animated.Value(-100)).current;
  const [loading, setLoading] = useState(false);
  const date = dayjs();
  const [errors, setErrors] = useState({});
  const [profileData, setProfileData] = useState({
    username: 'john_doe',
    email: 'john.doe@example.com',
    fullName: 'John Doe',
    dob: '1990-01-01',
    gender: 'Male',
    zipcode: '123456',
    phonenumber: '1234567890',
  });
  const [formData, setFormData] = useState(profileData);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;
  const zipCodeRegex = /^[0-9]{1,6}$/;

  useFocusEffect(
    useCallback(() => {
      return () => {
        setFormData({
          username: '',
          fullName: '',
          email: '',
          zipcode: '',
          dob: '',
          phoneNumber: '',
          gender: '',
        });
        setErrorMessage('');
        setSuccessMessage('');
        setIsErrorVisible(false);
        setErrors({});
        setLoading(false);
        setDobPickerVisible(false);
      };
    }, [])
  );

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('AuthToken');
      await AsyncStorage.removeItem('AuthUser');
      await AsyncStorage.removeItem('AuthEmail');
      ToastAndroid.show('Logout successfully.', ToastAndroid.SHORT);
      navigation.navigate('Login');
    }
    catch (error) {
      ToastAndroid.show('Something went wrong.', ToastAndroid.SHORT);
    }
  };

  const renderRadioButton = (label) => {
    return (
      <TouchableOpacity
        style={styles.radioButton}
        onPress={() => handleInputChange('gender', label.toLowerCase())}
      >
        <View style={[styles.radioCircle, formData.gender?.toLowerCase() === label.toLowerCase() && styles.selectedCircle]} />
        <Text style={styles.radioText}>{label}</Text>
      </TouchableOpacity>
    )
  };

  const validateStep = () => {
    const newErrors = {};

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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveProfile = async () => {
    if (!validateStep()) return;
    scrollViewRef.current.scrollTo({ y: 0, animated: true });
    setLoading(true);
    // const result = await profileUpdate(formData);
    const result = [200, '']
    let errorMsg;
    let successMsg = false;
    if (!result) {
      errorMsg = 'Something went wrong.';
      setErrorMessage(errorMsg);
      setIsErrorVisible(true);
    }
    else if (result[0] === 200) {
      successMsg = true;
      setSuccessMessage('Profile updated successfully.');
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
        }).start(() => { setIsErrorVisible(false); setErrorMessage(''); setSuccessMessage('') });
        if (successMsg) {
          setIsEditing(false);
          setProfileData(formData);
          setLoading(false);
        }
      }, 2000);
    }
    if (!successMsg) {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setFormData(profileData);
  };

  return (
    <ScrollView ref={scrollViewRef} contentContainerStyle={styles.container}>
      {isErrorVisible && (
        <Animated.View style={[styles.apiErrorContainer, { transform: [{ translateY: errorAnimation }], backgroundColor: successMessage ? 'green' : 'red' }]}>
          <Text style={styles.apiErrorText}>{errorMessage || successMessage}</Text>
        </Animated.View>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Icon name="logout" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={styles.profilePictureContainer}>
        <Image source={AppLogo} style={styles.profilePicture} />
      </View>

      {!isEditing && <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={styles.editButton}>
        <Icon name="edit" size={24} color="#FFFFFF" />
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>}

      <View style={styles.profileDataContainer}>
        {!isEditing && <>
          <Text style={[styles.title, { marginTop: !isEditing ? 10 : 0, marginBottom: !isEditing ? 5 : 0 }]}>Username</Text>
          <View style={styles.profileData}>
            <Text>{profileData.username}</Text>
          </View>
        </>
        }

        <Text style={[styles.title, { marginTop: !isEditing ? 10 : 0, marginBottom: !isEditing ? 5 : 0 }]}>Full Name</Text>
        {isEditing ?
          <><TextInput
            style={styles.input}
            value={formData.fullName}
            placeholder="Enter your full name"
            onChangeText={(text) => handleInputChange('fullName', text)}
            maxLength={50}
          />
            {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
          </>
          :
          <View style={styles.profileData}>
            <Text>{profileData.fullName}</Text>
          </View>
        }

        <Text style={[styles.title, { marginTop: !isEditing ? 10 : 0, marginBottom: !isEditing ? 5 : 0 }]}>Email</Text>
        {isEditing ?
          <><TextInput
            style={styles.input}
            value={formData.email}
            placeholder="Enter your email"
            onChangeText={(text) => handleInputChange('email', text)}
            maxLength={150}
          />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </>
          :
          <View style={styles.profileData}>
            <Text>{profileData.email}</Text>
          </View>
        }

        <Text style={[styles.title, { marginTop: !isEditing ? 10 : 0, marginBottom: !isEditing ? 5 : 0 }]}>ZIP Code</Text>
        {isEditing ?
          <><TextInput
            style={styles.input}
            value={formData.zipcode}
            onChangeText={(text) => handleInputChange('zipcode', text)}
            keyboardType="numeric"
            placeholder="Enter ZIP Code"
            maxLength={6}
          />
            {errors.zipcode && <Text style={styles.errorText}>{errors.zipcode}</Text>}
          </>
          :
          <View style={styles.profileData}>
            <Text>{profileData.zipcode}</Text>
          </View>
        }

        <Text style={[styles.title, { marginTop: !isEditing ? 10 : 0, marginBottom: !isEditing ? 5 : 0 }]}>Date of Birth</Text>
        {isEditing ?
          <><TouchableOpacity onPress={() => setDobPickerVisible(!dobPickerVisible)}>
            <TextInput
              style={styles.input}
              value={formData.dob}
              placeholder="YYYY-MM-DD"
              editable={false}
              maxLength={10}
            />
          </TouchableOpacity>
            {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}

            {dobPickerVisible && (
              <DateTimePicker
                mode="single"
                date={date}
                onChange={(params) => {
                  const selectedDate = new Date(params.date);
                  const currentDate = new Date();
                  if (!isNaN(selectedDate)) {
                    if (selectedDate > currentDate) {
                      setErrors({ ...errors, dob: 'Date cannot be in the future.' });
                    }
                    else {
                      handleInputChange('dob', dayjs(selectedDate).format('YYYY-MM-DD'))
                      setDobPickerVisible(false);
                    }
                  } else {
                    ToastAndroid.show('Something went wrong.', ToastAndroid.SHORT);
                  }
                }}
              />
            )}
          </>
          :
          <View style={styles.profileData}>
            <Text>{profileData.dob}</Text>
          </View>
        }

        <Text style={[styles.title, { marginTop: !isEditing ? 10 : 0, marginBottom: !isEditing ? 5 : 0 }]}>Phone Number</Text>
        {isEditing ?
          <><TextInput
            style={styles.input}
            value={formData.phonenumber}
            onChangeText={(text) => handleInputChange('phonenumber', text)}
            keyboardType="phone-pad"
            placeholder="Enter Phone Number"
            maxLength={10}
          />
            {errors.phonenumber && <Text style={styles.errorText}>{errors.phonenumber}</Text>}
          </>
          :
          <View style={styles.profileData}>
            <Text>{profileData.phonenumber}</Text>
          </View>
        }

        <Text style={[styles.title, { marginTop: !isEditing ? 10 : 0, marginBottom: !isEditing ? 5 : 0 }]}>Gender</Text>
        {isEditing ?
          <><View style={styles.radioContainer}>
            {renderRadioButton('Male')}
            {renderRadioButton('Female')}
            {renderRadioButton('Other')}
          </View>
            {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
          </>
          :
          <View style={styles.profileData}>
            <Text>{profileData.gender}</Text>
          </View>
        }
      </View>


      {isEditing && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={saveProfile} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={cancelEdit} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        transparent={true}
        animationType="fade"
        visible={loading}
      >
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color={'#B94EA0'} />
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
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
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  logoutButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#B94EA0',
    borderRadius: 50,
    padding: 10,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B94EA0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    marginTop: 10,
  },
  editButtonText: {
    color: '#FFFFFF',
    marginLeft: 5,
    fontSize: 16,
  },
  profileDataContainer: {
    justifyContent: 'center',
    padding: 5,
    width: '100%',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  title: {
    fontSize: 15,
    color: '#000',
    fontWeight: 'bold',
    fontFamily: 'DMSans_700Bold',
  },
  profileData: {
    backgroundColor: '#F5D0E5',
    padding: 10,
    borderRadius: 7,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    borderRadius: 20,
  },
  radioContainer: {
    marginBottom: 20,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    marginRight: 10,
  },
  selectedCircle: {
    backgroundColor: '#B94EA0',
  },
  radioText: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'DMSans_500Medium',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#B94EA0',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: '#C4C4C4',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  saveButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  cancelButtonText: {
    color: '#000000',
    textAlign: 'center',
  },
  loaderOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});

export default Profile;
