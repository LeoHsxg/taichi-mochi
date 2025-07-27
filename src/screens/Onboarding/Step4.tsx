import React from 'react';
import { View, Text, Image } from 'react-native';
import onboardingStyles from './onboardingStyles';

const Step4 = () => (
  <View style={onboardingStyles.container}>
    <Image
      source={require('../../../assets/images/onboarding/4-chart.png')}
      style={[
        onboardingStyles.chart,
        onboardingStyles.chartLeftOffset,
        onboardingStyles.chartHalfOpacity,
      ]}
      resizeMode="contain"
    />
    <Image
      source={require('../../../assets/images/onboarding/4-cap.png')}
      style={[onboardingStyles.cap, { aspectRatio: 1524 / 1476 }]}
      resizeMode="contain"
    />
    <View style={onboardingStyles.textContainer}>
      <Text style={onboardingStyles.title}>
        FUNCTION II.{'\n'}COMFORTING MOCHI
      </Text>
      <Text style={onboardingStyles.desc}>
        Comforting Mochi{''}
        When your eyes show signs of stress, Mochi gently jumps in and follows
        your gaze — a friendly nudge to take a break.
      </Text>
    </View>
  </View>
);

export default Step4;
