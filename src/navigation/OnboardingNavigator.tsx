import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
  StyleProp,
  ViewStyle,
} from 'react-native';
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

const FADE_DURATION = 500;

const OnboardingSwiper = () => {
  // 當前頁 index
  const [index, setIndex] = useState(0);
  // 正在淡入的下一頁 index，null 表示無過渡動畫
  const [nextIndex, setNextIndex] = useState<number | null>(null);

  // 控制下一頁淡入的透明度
  const opacityNext = useRef(new Animated.Value(0)).current;

  const goToPage = (target: number) => {
    // 如果正在動畫、超出範圍或跟當前頁一樣，就不動作
    if (
      nextIndex !== null ||
      target < 0 ||
      target >= steps.length ||
      target === index
    ) {
      return;
    }
    setNextIndex(target);
    opacityNext.setValue(0);

    // 執行 0 -> 1 的淡入
    Animated.timing(opacityNext, {
      toValue: 1,
      duration: FADE_DURATION,
      useNativeDriver: true,
    }).start(() => {
      // 淡入結束後，正式切頁並清掉 nextIndex
      setIndex(target);
      setNextIndex(null);
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 20 && Math.abs(g.dy) < 30,
      onPanResponderRelease: (_, { dx }) => {
        if (dx < -50) goToPage(index + 1);
        else if (dx > 50) goToPage(index - 1);
      },
    }),
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* 底層：當前頁永久顯示 */}
      <View style={styles.page}>{steps[index]}</View>

      {/* 上層：如果有 nextIndex，就用 Animated.View 疊加並淡入 */}
      {nextIndex !== null && (
        <Animated.View
          style={[
            styles.page,
            StyleSheet.absoluteFill as StyleProp<ViewStyle>,
            { opacity: opacityNext },
          ]}
        >
          {steps[nextIndex]}
        </Animated.View>
      )}
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
