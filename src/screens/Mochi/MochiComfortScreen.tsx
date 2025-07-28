import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeContext';

const { width: screenWidth } = Dimensions.get('window');

const MochiComfortScreen = () => {
  const { colors } = useTheme();

  const handleDeepBreath = () => {
    console.log('Deep Breath pressed');
  };

  const handleMeditate = () => {
    console.log('Meditate pressed');
  };

  const handleTakeWalk = () => {
    console.log('Take Walk pressed');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* 歡迎文字 - 絕對定位 */}
      <Text style={[styles.welcomeText, { color: '#ffffff' }]}>
        Hi, Matt. Take a break here.
      </Text>

      {/* 上半部分：麻糬和沙發圖片 */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../../../assets/images/mochi/mochi_sofa.png')}
          style={styles.mochiImage}
          resizeMode="contain"
        />
      </View>

      {/* 下半部分：三個光暈按鈕 */}
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Svg width={180} height={180} style={styles.svgBackground}>
            <Defs>
              <RadialGradient
                id="paint0_radial_75_2"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(90 90) rotate(90) scale(90)"
              >
                <Stop
                  offset="0.0865385"
                  stopColor="#A3B4FF"
                  stopOpacity="0.47"
                />
                <Stop offset="1" stopColor="#424242" stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Circle cx="90" cy="90" r="90" fill="url(#paint0_radial_75_2)" />
          </Svg>
          <TouchableOpacity
            style={styles.glowButton}
            onPress={handleDeepBreath}
          >
            <Text style={styles.buttonText}>Deep Breath</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonWrapper}>
          <Svg width={180} height={180} style={styles.svgBackground}>
            <Defs>
              <RadialGradient
                id="paint0_radial_75_3"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(90 90) rotate(90) scale(90)"
              >
                <Stop
                  offset="0.0865385"
                  stopColor="#FF6EA8"
                  stopOpacity="0.29"
                />
                <Stop offset="1" stopColor="#424242" stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Circle cx="90" cy="90" r="90" fill="url(#paint0_radial_75_3)" />
          </Svg>
          <TouchableOpacity style={styles.glowButton} onPress={handleMeditate}>
            <Text style={styles.buttonText}>Meditate</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonWrapper}>
          <Svg width={180} height={180} style={styles.svgBackground}>
            <Defs>
              <RadialGradient
                id="paint0_radial_1_283"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(90 90) rotate(90) scale(90)"
              >
                <Stop
                  offset="0.0865385"
                  stopColor="#79F2FF"
                  stopOpacity="0.29"
                />
                <Stop offset="1" stopColor="#424242" stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Circle cx="90" cy="90" r="90" fill="url(#paint0_radial_1_283)" />
          </Svg>
          <TouchableOpacity style={styles.glowButton} onPress={handleTakeWalk}>
            <Text style={styles.buttonText}>Take a walk</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 40,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    marginBottom: 20,
  },
  mochiImage: {
    width: screenWidth,
    height: screenWidth * 0.8, // 保持適當比例
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    flexWrap: 'wrap',
    gap: 20,
    marginTop: 20,
  },
  buttonWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgBackground: {
    position: 'absolute',
    // top: -40,
    // left: -40,
  },
  glowButton: {
    width: 100, // 固定寬高 → 正圓形
    height: 100,
    borderRadius: 50, // 半徑 = 一半 → 正圓
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    margin: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default MochiComfortScreen;
