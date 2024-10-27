import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

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

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Reels" component={Reels} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    );
};
