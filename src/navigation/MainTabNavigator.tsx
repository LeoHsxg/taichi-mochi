import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from '../screens/Home/HomeScreen';
import ChartDetailScreen from '../screens/Home/ChartDetailScreen';
import MochiComfortScreen from '../screens/Mochi/MochiComfortScreen';
import MeditationScreen from '../screens/Mochi/MeditationScreen';
import MeditationEndScreen from '../screens/Mochi/MeditationEndScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import { useTheme } from '../theme/ThemeContext';

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

const getTabBarIcon = (
  route: any,
  focused: boolean,
  color: string,
  size: number,
) => {
  let iconName = 'home'; // 預設圖標

  if (route.name === 'HomeTab') {
    iconName = 'home';
  } else if (route.name === 'MochiTab') {
    iconName = 'sofa';
  } else if (route.name === 'SettingsTab') {
    iconName = 'cog';
  }

  return <Icon name={iconName} size={size} color={color} />;
};

const MainTabNavigator = () => {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) =>
          getTabBarIcon(route, focused, color, size + 4),
        tabBarActiveTintColor: colors.active,
        tabBarInactiveTintColor: colors.inactive,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingBottom: 8,
          paddingTop: 5,
          height: 70,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackScreen}
        options={{
          tabBarLabel: '',
        }}
      />
      <Tab.Screen
        name="MochiTab"
        component={MochiStackScreen}
        options={{
          tabBarLabel: '',
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{
          tabBarLabel: '',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
