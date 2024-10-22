import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Register({ navigation }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({}); // To hold error messages

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    // Clear error for the current field
    setErrors({ ...errors, [name]: '' });
  };

  const validateStep = () => {
    const newErrors = {};
    switch (step) {
      case 1:
        if (!formData.username) newErrors.username = 'Username is required.';
        if (!formData.fullName) newErrors.fullName = 'Full name is required.';
        if (!formData.email) newErrors.email = 'Email is required.';
        // Add email format validation if needed
        break;
      case 2:
        if (!formData.zipCode) newErrors.zipCode = 'Zip code is required.';
        if (!formData.dob) newErrors.dob = 'Date of Birth is required.';
        if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required.';
        if (!formData.gender) newErrors.gender = 'Please select a gender.';
        break;
      case 3:
        if (!formData.password) newErrors.password = 'Password is required.';
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required.';
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match.';
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

  const handleRegister = () => {
    navigation.navigate('OTPVerify');
  };

  return (
    <View style={styles.container}>
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
            value={formData.zipCode}
            onChangeText={(text) => handleInputChange('zipCode', text)}
          />
          {errors.zipCode && <Text style={styles.errorText}>{errors.zipCode}</Text>}
          
          <TextInput
            style={styles.input}
            placeholder="Date of Birth (DOB)"
            value={formData.dob}
            onChangeText={(text) => handleInputChange('dob', text)}
          />
          {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}
          
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChangeText={(text) => handleInputChange('phoneNumber', text)}
          />
          {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
          
          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity onPress={() => handleInputChange('gender', 'Male')}>
              <Text style={styles.genderOption}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleInputChange('gender', 'Female')}>
              <Text style={styles.genderOption}>Female</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleInputChange('gender', 'Other')}>
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
              value={formData.confirmPassword}
              onChangeText={(text) => handleInputChange('confirmPassword', text)}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIconContainer}
            >
              <Icon name={showConfirmPassword ? "eye" : "eye-off"} size={20} color="#555" />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
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
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNextStep}
        >
          <Text style={styles.nextButtonText}>
            {step < 3 ? 'Next' : 'Register'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.LoginContainer}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Login an Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
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
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  line: {
    height: 1,
    backgroundColor: '#ccc',
    flex: 1,
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 16,
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
  LoginContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});
