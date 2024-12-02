import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'; // Using Ionicons

import Home from './../Home/Home';
import Reels from './../Reels/Reels';
import Profile from './../Profile/Profile';

const Tab = createBottomTabNavigator();

export default NavBar = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Reels') {
                        iconName = focused ? 'film' : 'film-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Icon name={iconName} size={30} color={color} />;
                },
                tabBarActiveTintColor: '#B94EA0',
                tabBarInactiveTintColor: 'black',
                tabBarStyle: {
                    backgroundColor: 'white',
                    borderTopWidth: 0,
                    elevation: 0,
                    height: 60,
                },
                tabBarShowLabel: false,
            })}
        >
            <Tab.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Tab.Screen name="Reels" component={Reels} options={{ headerShown: false }} />
            <Tab.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
};
