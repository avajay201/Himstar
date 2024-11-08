import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import Login from './screens/Auth/Login';
import Register from './screens/Auth/Register';
import OtpVerify from './screens/Auth/OtpVerify';
import Leaderboard from './screens/LeaderBoard/Leaderboard';
import SplashScreen from './screens/OtherScreens/SplashScreen';
import WelcomeScreen from './screens/OtherScreens/WelcomeScreen';
import ContactUs from './screens/ContactUs/ContactUs';
import NavBar from './screens/NavBar/NavBar';
import UpcomingComps from './screens/Competitions/UpcomingComps';
import ActiveComps from './screens/Competitions/ActiveComps';
import Wallet from './screens/Wallet/Wallet';
import MyVideos from './screens/MyVideos/MyVideos';
import MyContests from './screens/MyContests/MyContests';


const Stack = createNativeStackNavigator();

function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('WelcomeScreen');

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '74136365421-al19jp7vrln6gqhuugt2m5ffkmi8qjjf.apps.googleusercontent.com',
    });
  }, []);

  const AuthCheck = async()=>{
    const authToken = await AsyncStorage.getItem('AuthToken');
    const username = await AsyncStorage.getItem('AuthUser');
    const email = await AsyncStorage.getItem('AuthEmail');
    if (authToken && username && email) {
      setInitialRoute('HomeTabs');
    }
  };

  useEffect(() => {
    AuthCheck();
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
    <Stack.Screen 
      name="WelcomeScreen" 
      component={WelcomeScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="Login" 
      component={Login} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="Register" 
      component={Register} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="OtpVerify" 
      component={OtpVerify} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="HomeTabs" 
      component={NavBar} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="Leaderboard" 
      component={Leaderboard} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="ContactUs" 
      component={ContactUs} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="UpcomingComps" 
      component={UpcomingComps} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="ActiveComps" 
      component={ActiveComps} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="MyContests" 
      component={MyContests} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="MyVideos" 
      component={MyVideos} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="Wallet" 
      component={Wallet} 
      options={{ headerShown: false }}
    />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
