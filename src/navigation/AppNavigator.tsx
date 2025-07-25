import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import OnboardingNavigator from './OnboardingNavigator';
import MainTabNavigator from './MainTabNavigator';

// TODO: 根據實際登入/註冊/Onboarding 狀態切換
const isLoggedIn = false;
const isOnboarding = true;

const AppNavigator = () => (
  <NavigationContainer>
    {isLoggedIn ? (
      <MainTabNavigator />
    ) : isOnboarding ? (
      <OnboardingNavigator />
    ) : (
      <AuthNavigator />
    )}
  </NavigationContainer>
);

export default AppNavigator;
