import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './screens/Auth/Login';
import Register from './screens/Auth/Register';
import OtpVerify from './screens/Auth/OtpVerify';
import Leaderboard from './screens/LeaderBoard/Leaderboard';
import SplashScreen from './screens/OtherScreens/SplashScreen';
import WelcomeScreen from './screens/OtherScreens/WelcomeScreen';
import ContactUs from './screens/ContactUs/ContactUs';
import NavBar from './screens/NavBar/NavBar';


const Stack = createNativeStackNavigator();

function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator>
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
