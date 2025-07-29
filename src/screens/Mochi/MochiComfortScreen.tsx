import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

const MochiComfortScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();

  // 定義三個按鈕的初始座標
  const BUTTON_INITIAL_POSITIONS = {
    button1: { x: 0, y: 0 }, // 左邊按鈕
    button2: { x: 0, y: 0 }, // 中間按鈕
    button3: { x: 0, y: 0 }, // 右邊按鈕
  };

  // 為三個按鈕創建動畫值，設定初始位置
  /*
    useRef：React hook，用來在多次 render 之間保持同一個物件不重建。
    new Animated.ValueXY({ x, y })：創建一組可驅動 transform.translateX/Y 的二維數值，用來做移動動畫。
    .current：拿到 ref 存的實際 Animated.ValueXY 實例。
  */
  const button1Position = useRef(
    new Animated.ValueXY(BUTTON_INITIAL_POSITIONS.button1),
  ).current;
  const button2Position = useRef(
    new Animated.ValueXY(BUTTON_INITIAL_POSITIONS.button2),
  ).current;
  const button3Position = useRef(
    new Animated.ValueXY(BUTTON_INITIAL_POSITIONS.button3),
  ).current;

  // 追蹤當前位置狀態，設定初始位置
  const button1CurrentPos = useRef(BUTTON_INITIAL_POSITIONS.button1);
  const button2CurrentPos = useRef(BUTTON_INITIAL_POSITIONS.button2);
  const button3CurrentPos = useRef(BUTTON_INITIAL_POSITIONS.button3);

  // 生成隨機移動動畫
  const createRandomAnimation = useCallback(
    (
      animatedValue: Animated.ValueXY,
      currentPosRef: React.MutableRefObject<{ x: number; y: number }>,
      initialPos: { x: number; y: number },
    ) => {
      // 在初始位置附近生成隨機偏移（範圍較小，避免飄太遠）
      const randomOffsetX = (Math.random() - 0.5) * 40; // 在 -20 到 20 之間移動
      const randomOffsetY = (Math.random() - 0.5) * 40; // 在 -20 到 20 之間移動

      // 計算目標位置（初始位置 + 隨機偏移）
      const targetX = initialPos.x + randomOffsetX;
      const targetY = initialPos.y + randomOffsetY;

      // 更新追蹤的位置
      currentPosRef.current = { x: targetX, y: targetY };

      const duration = 3000 + Math.random() * 2000; // 3-5 秒的隨機持續時間

      return Animated.timing(animatedValue, {
        toValue: { x: targetX, y: targetY },
        duration: duration,
        useNativeDriver: false,
      });
    },
    [],
  );

  // 開始連續動畫
  const startContinuousAnimation = useCallback(
    (
      animatedValue: Animated.ValueXY,
      currentPosRef: React.MutableRefObject<{ x: number; y: number }>,
      initialPos: { x: number; y: number },
    ) => {
      const animate = () => {
        const animation = createRandomAnimation(
          animatedValue,
          currentPosRef,
          initialPos,
        );
        // 「動畫結束」的 callback
        animation.start(() => {
          // 不再重置位置，直接開始下一個動畫
          animate(); // 重新呼叫自己 → 無限迴圈
        });
      };
      animate();
    },
    [createRandomAnimation],
  );

  useEffect(() => {
    // 為每個按鈕啟動動畫，但延遲不同時間以創造更自然的移動
    const timer1 = setTimeout(
      () =>
        startContinuousAnimation(
          button1Position,
          button1CurrentPos,
          BUTTON_INITIAL_POSITIONS.button1,
        ),
      0,
    );
    const timer2 = setTimeout(
      () =>
        startContinuousAnimation(
          button2Position,
          button2CurrentPos,
          BUTTON_INITIAL_POSITIONS.button2,
        ),
      1000,
    );
    const timer3 = setTimeout(
      () =>
        startContinuousAnimation(
          button3Position,
          button3CurrentPos,
          BUTTON_INITIAL_POSITIONS.button3,
        ),
      2000,
    );

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [
    button1Position,
    button2Position,
    button3Position,
    startContinuousAnimation,
    BUTTON_INITIAL_POSITIONS.button1,
    BUTTON_INITIAL_POSITIONS.button2,
    BUTTON_INITIAL_POSITIONS.button3,
  ]);

  const handleDeepBreath = () => {
    console.log('Deep Breath pressed');
    navigation.navigate('Meditation');
  };

  const handleMeditate = () => {
    console.log('Meditate pressed');
    navigation.navigate('Meditation');
  };

  const handleTakeWalk = () => {
    console.log('Take Walk pressed');
    navigation.navigate('Meditation');
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
        <Animated.View
          style={[
            styles.buttonWrapper,
            {
              transform: [
                { translateX: button1Position.x },
                { translateY: button1Position.y },
              ],
            },
          ]}
        >
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
        </Animated.View>

        <Animated.View
          style={[
            styles.buttonWrapper,
            {
              transform: [
                { translateX: button2Position.x },
                { translateY: button2Position.y },
              ],
            },
          ]}
        >
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
        </Animated.View>

        <Animated.View
          style={[
            styles.buttonWrapper,
            {
              transform: [
                { translateX: button3Position.x },
                { translateY: button3Position.y },
              ],
            },
          ]}
        >
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
        </Animated.View>
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
    marginTop: 40,
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
