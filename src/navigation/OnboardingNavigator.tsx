import React, { useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, PanResponder } from 'react-native';
import Step1 from '../screens/Onboarding/Step1';
import Step2 from '../screens/Onboarding/Step2';
import Step3 from '../screens/Onboarding/Step3';
import Step4 from '../screens/Onboarding/Step4';
import Step5 from '../screens/Onboarding/Step5';
import Step6 from '../screens/Onboarding/Step6';
import Step7 from '../screens/Onboarding/Step7';

const { width, height } = Dimensions.get('window');

const steps = [
  <Step1 key="step1" />,
  <Step2 key="step2" />,
  <Step3 key="step3" />,
  <Step4 key="step4" />,
  <Step5 key="step5" />,
  <Step6 key="step6" />,
  <Step7 key="step7" />,
];

const OnboardingSwiper = () => {
  const [index, setIndex] = useState(0);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < 30;
      },
      onPanResponderRelease: (_, { dx }) => {
        if (dx < -50) {
          setIndex(prev => Math.min(prev + 1, steps.length - 1));
        } else if (dx > 50) {
          setIndex(prev => Math.max(prev - 1, 0));
        }
      },
    }),
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.page}>{steps[index]}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  page: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OnboardingSwiper;
