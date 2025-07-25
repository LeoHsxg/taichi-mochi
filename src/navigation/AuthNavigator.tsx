import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/Auth/WelcomeScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import LoginSuccessScreen from '../screens/Auth/LoginSuccessScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import SignupSuccessScreen from '../screens/Auth/SignupSuccessScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="LoginSuccess" component={LoginSuccessScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
    <Stack.Screen name="SignupSuccess" component={SignupSuccessScreen} />
  </Stack.Navigator>
);

export default AuthNavigator;
