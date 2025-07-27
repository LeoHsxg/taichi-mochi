import React from 'react';
import { View, Text, Image } from 'react-native';
import onboardingStyles from './onboardingStyles';

const Step1 = () => (
  <View style={onboardingStyles.container}>
    <Image
      source={require('../../../assets/images/onboarding/1-chart.png')}
      style={[onboardingStyles.chart, onboardingStyles.chartLeftOffset]}
      resizeMode="contain"
    />
    <View style={onboardingStyles.textContainer}>
      <Text style={onboardingStyles.title}>Welcome to{'\n'}MOCHISOL!</Text>
      <Text style={onboardingStyles.desc}>
        MochiSOL helps you use social media more mindfully — by tracking your
        eye movements and spotting emotional stress as you scroll.\nIt gently
        reminds you to pause, reflect, and take care of your feelings. ✨🧸
      </Text>
    </View>
  </View>
);

export default Step1;
