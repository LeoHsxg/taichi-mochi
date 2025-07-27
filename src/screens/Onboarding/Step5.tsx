import React from 'react';
import { View, Text, Image } from 'react-native';
import onboardingStyles from './onboardingStyles';

const Step5 = () => (
  <View style={onboardingStyles.container}>
    <Image
      source={require('../../../assets/images/onboarding/5-chart.png')}
      style={[
        onboardingStyles.chart,
        onboardingStyles.chartLeftOffset,
        onboardingStyles.chartHalfOpacity,
      ]}
      resizeMode="contain"
    />
    <Image
      source={require('../../../assets/images/onboarding/5-cap.png')}
      style={[onboardingStyles.cap, { aspectRatio: 1524 / 1548 }]}
      resizeMode="contain"
    />
    <View style={onboardingStyles.textContainer}>
      <Text style={onboardingStyles.title}>FUNCTION III.{'\n'}TRACKER</Text>
      <Text style={onboardingStyles.desc}>
        Reflect & Report{''}
        After scrolling, Mochi shows you charts of your weekly usage and stress
        patterns — helping you reflect and build better habits! 💪
      </Text>
    </View>
  </View>
);

export default Step5;
