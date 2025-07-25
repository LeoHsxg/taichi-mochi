import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Step1 from '../screens/Onboarding/Step1';
import Step2 from '../screens/Onboarding/Step2';
import Step3 from '../screens/Onboarding/Step3';
import Step4 from '../screens/Onboarding/Step4';
import Step5 from '../screens/Onboarding/Step5';
import Step6 from '../screens/Onboarding/Step6';
import Step7 from '../screens/Onboarding/Step7';

const Stack = createStackNavigator();

const OnboardingNavigator = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false, gestureEnabled: false }}
  >
    <Stack.Screen name="Step1" component={Step1} />
    <Stack.Screen name="Step2" component={Step2} />
    <Stack.Screen name="Step3" component={Step3} />
    <Stack.Screen name="Step4" component={Step4} />
    <Stack.Screen name="Step5" component={Step5} />
    <Stack.Screen name="Step6" component={Step6} />
    <Stack.Screen name="Step7" component={Step7} />
  </Stack.Navigator>
);

export default OnboardingNavigator;
