import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LogBox } from 'react-native';

import Login from './screens/Auth/Login';
import Register from './screens/Auth/Register';
import ChangePassword from './screens/Auth/ChangePassword';
import EditProfile from './screens/Profile/EditProfile';
import OtpVerify from './screens/Auth/OtpVerify';
import Leaderboard from './screens/LeaderBoard/Leaderboard';
import SplashScreen from './screens/OtherScreens/SplashScreen';
import WelcomeScreen from './screens/OtherScreens/WelcomeScreen';
import ContactUs from './screens/ContactUs/ContactUs';
import NavBar from './screens/NavBar/NavBar';
import UpcomingComps from './screens/Competitions/UpcomingComps';
import LiveComps from './screens/Competitions/LiveComps';
import Wallet from './screens/Wallet/Wallet';
import MyVideos from './screens/MyVideos/MyVideos';
import MyCompetitions from './screens/MyCompetitions/MyCompetitions';
import VideoCreate from './screens/VideoCreate/VideoCreate';
import VideoEdit from './screens/VideoCreate/VideoEdit';
import VideoPreview from './screens/VideoCreate/VideoPreview';
import ViewComp from './screens/Competitions/ViewComp';
import Payment from './screens/Payment/Payment';
import { MainProvider } from './others/MyContext';
import PaymentHistory from './screens/Payment/PaymentHistory';


const Stack = createNativeStackNavigator();

function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('WelcomeScreen');

  useEffect(() => {
    LogBox.ignoreAllLogs(true);
    GoogleSignin.configure({
      webClientId: '528751908224-u4d7cuelmvmfsbv6qtsvlhki5ijccqgd.apps.googleusercontent.com',
    });
  }, []);

  const AuthCheck = async () => {
    const authToken = await AsyncStorage.getItem('AuthToken');
    const username = await AsyncStorage.getItem('AuthUser');
    const email = await AsyncStorage.getItem('AuthEmail');
    const userId = await AsyncStorage.getItem('AuthId');
    if (authToken && username && email && userId) {
      setInitialRoute('HomeTabs');
    }
  };

  useEffect(() => {
    AuthCheck();
    setTimeout(() => {
      setIsLoading(false);
    }, 2900);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  };

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
        name="LiveComps"
        component={LiveComps}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyCompetitions"
        component={MyCompetitions}
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
      <Stack.Screen
        name="VideoCreate"
        component={VideoCreate}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VideoEdit"
        component={VideoEdit}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VideoPreview"
        component={VideoPreview}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ViewComp"
        component={ViewComp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Payment"
        component={Payment}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentHistory"
        component={PaymentHistory}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MainProvider>
        <AppNavigator />
      </MainProvider>
    </NavigationContainer>
  );
}
