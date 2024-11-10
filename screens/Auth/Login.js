import React, { useState, useCallback, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Image, Animated, Modal, ActivityIndicator, BackHandler } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import googleIcon from '../../assets/images/google-img.png';
import { useFocusEffect } from '@react-navigation/native';
import { userLogin } from '../../actions/ApiActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';


const primaryColor = '#B94EA0';
const secondaryColor = '#FFFFFF';
const thirdColor = '#000';

const Login = ({ navigation }) => {
  const [backPressedOnce, setBackPressedOnce] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const errorAnimation = useRef(new Animated.Value(-100)).current;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        if (backPressedOnce) {
          BackHandler.exitApp();
          return true;
        }
        setBackPressedOnce(true);
        ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);

        setTimeout(() => setBackPressedOnce(false), 2000);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );

      return () => backHandler.remove();
    }, [backPressedOnce])
  );

  useFocusEffect(
    useCallback(() => {
      return () => {
        setUsername('');
        setPassword('');
        setShowPassword(false);
        setErrorMessage('');
        setSuccessMessage('');
        setIsErrorVisible(false);
        setErrors({});
        setLoading(false);
      };
    }, [])
  );

  const validateStep = () => {
    const newErrors = {};
    if (!username) {
      newErrors.username = 'Username is required.';
    }
    if (!password){
      newErrors.password = 'Password is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async() => {
    if (!validateStep()) {
      return;
    }
    setLoading(true);
    const result = await userLogin({username_or_email: username, password: password});
    let errorMsg;
    let successMsg = false;
    if (!result){
      errorMsg = 'Something went wrong.';
      setErrorMessage(errorMsg);
      setIsErrorVisible(true);
    }
    else if (result[0] === 200) {
      successMsg = true;
      await AsyncStorage.setItem('AuthToken', result[1].access);
      await AsyncStorage.setItem('AuthUser', result[1].username);
      await AsyncStorage.setItem('AuthEmail', result[1].email);
      setSuccessMessage('Login successfully.');
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
          navigation.navigate('HomeTabs');
        }
      }, 1000);
    }
    if (!successMsg){
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async() => {
    try {
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('User Info:', userInfo);
    } catch (error) {
      console.log('Google sign in error>>>>>', error);
    }
  };

  return (
    <View style={styles.container}>
      {isErrorVisible && (
        <Animated.View style={[styles.apiErrorContainer, { transform: [{ translateY: errorAnimation }], backgroundColor: successMessage ? 'green' : 'red' }]}>
          <Text style={styles.apiErrorText}>{errorMessage || successMessage}</Text>
        </Animated.View>
      )}
      <Text style={styles.title}>Email/Username</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={(text)=>{ setErrors({ ...errors, ['username']: '' }); setUsername(text)}}
        placeholder="Enter your email/username"
        maxLength={150}
      />
      {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

      <Text style={styles.title}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          value={password}
          placeholder="Enter your password"
          onChangeText={(text)=>{ setErrors({ ...errors, ['password']: '' }); setPassword(text)}}
          secureTextEntry={!showPassword}
          maxLength={50}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIconContainer}>
          <Icon
            name={showPassword ? 'visibility' : 'visibility-off'}
            size={24}
            color={thirdColor}
          />
        </TouchableOpacity>
      </View>
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      <View style={styles.spacer} />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Get started</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>
          <Text style={styles.linkBlackText}>Don't have an Account? </Text>
          <Text style={styles.linkPrimaryText}>Create Account</Text>
        </Text>
      </TouchableOpacity>

      <View style={styles.separatorContainer}>
        <View style={styles.separator} />
        <Text style={styles.separatorText}>or</Text>
        <View style={styles.separator} />
      </View>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
        <View style={styles.googleButtonContent}>
          <Image source={googleIcon} style={styles.googleIcon} />
          <Text style={styles.googleButtonText}> Google Account</Text>
        </View>
      </TouchableOpacity>

      <Modal transparent={true} animationType="fade" visible={loading}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={primaryColor} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: secondaryColor,
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
  title: {
    fontSize: 20,
    marginBottom: 10,
    color: thirdColor,
    fontWeight: 'bold',
    fontFamily: 'DMSans_700Bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    borderRadius: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  passwordInput: {
    borderColor: '#fff',
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginBottom: 15,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    borderRadius: 20,
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 10,
    top: 22,
  },
  spacer: {
    height: 20,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: primaryColor,
    marginHorizontal: 10,
  },
  separatorText: {
    fontSize: 16,
    color: thirdColor,
    fontFamily: 'DMSans_500Medium',
  },
  googleButton: {
    width: '100%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: primaryColor,
    borderRadius: 10,
    marginVertical: 15,
    paddingVertical: 10,
    alignItems: 'center',
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    color: primaryColor,
    fontWeight: 'bold',
    fontFamily: 'DMSans_700Bold',
    fontSize: 16,
  },
  button: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: primaryColor,
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 15,
  },
  buttonText: {
    color: secondaryColor,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'DMSans_700Bold',
  },
  linkText: {
    marginTop: 15,
    textAlign: 'center',
    fontFamily: 'DMSans_700Bold',
    fontSize: 15,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  linkBlackText: {
    color: '#000',
  },
  linkPrimaryText: {
    color: primaryColor,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});

export default Login;
