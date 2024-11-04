import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
                        iconName = focused ? 'home-filled' : 'home';
                    } else if (route.name === 'Reels') {
                        iconName = focused ? 'video-label' : 'video-label';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person-2' : 'person-outline';
                    }

                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: 'gray',
                tabBarShowLabel: false,
            })}
        >
            <Tab.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Tab.Screen name="Reels" component={Reels} options={{ headerShown: false }} />
            <Tab.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
};
