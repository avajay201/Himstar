import React, { useState, useEffect } from 'react';
import { View, Text, Button, BackHandler, ToastAndroid } from 'react-native';


const Home = ({ navigation }) => {
  const [backPressedOnce, setBackPressedOnce] = useState(false);

  useEffect(() => {
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
  }, [backPressedOnce]);

  return (
    <View>
      <Text>Home Screen</Text>
      <Button title="Go to Leaderboard" onPress={() => navigation.navigate('Leaderboard')} />
      <Button title="Go to Contact Us" onPress={() => navigation.navigate('ContactUs')} />
    </View>
  );
};

export default Home;
