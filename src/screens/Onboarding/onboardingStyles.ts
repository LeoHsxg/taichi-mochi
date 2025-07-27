import { StyleSheet, Dimensions } from 'react-native';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const ONBOARDING_IMAGE_WIDTH = 441;

const onboardingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#424242',
    alignItems: 'center',
  },
  chart: {
    position: 'absolute',
    top: 70,
    left: 0, // 預設置中，若要微調可在元件加 style 覆蓋 left
    right: 0,
    width: ONBOARDING_IMAGE_WIDTH,
    height: undefined,
    aspectRatio: 1524 / 2164, // 請根據實際原圖比例調整
    alignSelf: 'center',
  },
  chartLeftOffset: {
    left: -5, // 你可根據需求調整偏移量
  },
  chartHalfOpacity: {
    opacity: 0.5,
  },
  cap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: SCREEN_WIDTH,
    height: undefined,
    alignSelf: 'center',
  },
  textContainer: {
    marginTop: SCREEN_HEIGHT * 0.55,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  title: {
    color: '#FF2171',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  desc: {
    color: '#D6D6D6',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default onboardingStyles;
