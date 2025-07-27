import React from 'react';
import { View, Text, Image } from 'react-native';
import onboardingStyles from './onboardingStyles';

const Step6 = () => (
  <View style={onboardingStyles.container}>
    <Image
      source={require('../../../assets/images/onboarding/6-pic.png')}
      style={[onboardingStyles.pic]}
      resizeMode="contain"
    />
    <View style={onboardingStyles.textContainer}>
      <Text style={onboardingStyles.title}>WEAR SOLGLASSES</Text>
      <Text style={onboardingStyles.desc}>
        to Activate Mood Detection{'\n'}
        MochiSOL works together with your SOL Glasses. They track your eye
        movements in real time, and step in when you're feeling off while
        scrolling. Before you dive into social media, make sure your glasses are
        on and connected!
      </Text>
    </View>
  </View>
);

export default Step6;
