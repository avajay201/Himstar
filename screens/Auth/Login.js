import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const errorAnimation = useRef(new Animated.Value(-100)).current;

  useFocusEffect(
    useCallback(() => {
      return () => {
        // This cleanup function will run when the screen is unfocused
        setEmail('');
        setPassword('');
        setShowPassword(false);
        setErrorMessage('');
        setSuccessMessage('');
        setIsErrorVisible(false);
      };
    }, [])
  );

  const handleLogin = async() => {
    setLoading(true);
    const result = ''
    // await AsyncStorage.setItem('key', JSON.stringify(value));
    setSuccessMessage('Login successfully.');
    setTimeout(()=>{
      setLoading(false);
    }, 1000);

    setTimeout(()=>{
      setIsErrorVisible(true);
    }, 1100);

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

      setTimeout(()=>{
        navigation.navigate('HomeTabs');
      }, 100);
    }, 3000);
  };

  return (
    <View style={styles.container}>
      {isErrorVisible && (
        <Animated.View style={[styles.apiErrorContainer, { transform: [{ translateY: errorAnimation }], backgroundColor: successMessage ? 'green' : 'red' }]}>
          <Text style={styles.apiErrorText}>{errorMessage || successMessage}</Text>
        </Animated.View>
      )}
      <View style={styles.googleLogin}>
        <Icon name="google" size={24} color="#DB4437" />
        <Text style={styles.loginText}>Login with Google</Text>
      </View>

      <View style={styles.separatorContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIconContainer}
        >
          <Icon name={showPassword ? "eye" : "eye-slash"} size={20} color="#555" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <Text>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>Create an Account</Text>
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  googleLogin: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginText: {
    marginLeft: 10,
    fontSize: 18,
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
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  registerContainer: {
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
  passwordContainer: {
    width: '100%',
    position: 'relative',
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
});

export default Login;
