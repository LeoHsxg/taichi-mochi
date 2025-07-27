import React from 'react';
import { View, Text, Image } from 'react-native';
import onboardingStyles from './onboardingStyles';

const Step3 = () => (
  <View style={onboardingStyles.container}>
    <Image
      source={require('../../../assets/images/onboarding/3-chart.png')}
      style={[
        onboardingStyles.chart,
        onboardingStyles.chartLeftOffset,
        onboardingStyles.chartHalfOpacity,
      ]}
      resizeMode="contain"
    />
    <Image
      source={require('../../../assets/images/onboarding/3-cap.png')}
      style={[onboardingStyles.cap, { aspectRatio: 1524 / 836 }]}
      resizeMode="contain"
    />
    <View style={onboardingStyles.textContainer}>
      <Text style={onboardingStyles.title}>FUNCTION I.{'\n'}MOCHI ALERT</Text>
      <Text style={onboardingStyles.desc}>
        2nd: Angry Mochi{''}
        Been scrolling too long? Angry Mochi shows up to block the screen and
        firmly stop you — it’s pause time!
      </Text>
    </View>
  </View>
);

export default Step3;
