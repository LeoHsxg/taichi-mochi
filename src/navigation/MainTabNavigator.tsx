import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/Home/HomeScreen';
import ChartDetailScreen from '../screens/Home/ChartDetailScreen';
import MochiComfortScreen from '../screens/Mochi/MochiComfortScreen';
import MeditationScreen from '../screens/Mochi/MeditationScreen';
import MeditationEndScreen from '../screens/Mochi/MeditationEndScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const MochiStack = createStackNavigator();

const HomeStackScreen = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="Home" component={HomeScreen} />
    <HomeStack.Screen name="ChartDetail" component={ChartDetailScreen} />
  </HomeStack.Navigator>
);

const MochiStackScreen = () => (
  <MochiStack.Navigator screenOptions={{ headerShown: false }}>
    <MochiStack.Screen name="MochiComfort" component={MochiComfortScreen} />
    <MochiStack.Screen name="Meditation" component={MeditationScreen} />
    <MochiStack.Screen name="MeditationEnd" component={MeditationEndScreen} />
  </MochiStack.Navigator>
);

const MainTabNavigator = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen name="HomeTab" component={HomeStackScreen} />
    <Tab.Screen name="MochiTab" component={MochiStackScreen} />
    <Tab.Screen name="SettingsTab" component={SettingsScreen} />
  </Tab.Navigator>
);

export default MainTabNavigator;
