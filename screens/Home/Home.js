import React from 'react';
import { View, Text, Button } from 'react-native';

const Home = ({ navigation }) => {
  return (
    <View>
      <Text>Home Screen</Text>
      <Button title="Go to Leaderboard" onPress={() => navigation.navigate('Leaderboard')} />
      <Button title="Go to Contact Us" onPress={() => navigation.navigate('ContactUs')} />
    </View>
  );
};

export default Home;
