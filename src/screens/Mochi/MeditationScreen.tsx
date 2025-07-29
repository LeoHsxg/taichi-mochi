import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MeditationScreen = () => {
  const navigation = useNavigation<any>();
  const [timeLeft, setTimeLeft] = useState(47); // 預設47秒
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            setIsActive(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const handleStop = () => {
    setIsActive(false);
    navigation.navigate('MeditationEnd');
  };

  return (
    <View style={styles.container}>
      {/* 背景線條 */}
      <Image
        source={require('../../../assets/images/lines/line_medi.png')}
        style={styles.backgroundLines}
        resizeMode="cover"
      />

      {/* 標題 */}
      <Text style={styles.title}>MEDITATING...</Text>

      {/* 計時器容器 */}
      <View style={styles.timerContainer}>
        <Image
          source={require('../../../assets/images/ellipse/ellipse_medi.png')}
          style={styles.timerBlob}
          resizeMode="contain"
        />
        <View style={styles.timerTextContainer}>
          <Text style={styles.timerText}>{timeLeft}</Text>
          <Text style={styles.timerLabel}>Seconds left</Text>
        </View>
      </View>

      {/* 麻糬角色 */}
      <View style={styles.mochiContainer}>
        <Image
          source={require('../../../assets/images/mochi/mochi_medi.png')}
          style={styles.mochiImage}
          resizeMode="contain"
        />
      </View>

      {/* 停止按鈕 */}
      <TouchableOpacity style={styles.stopButton} onPress={handleStop}>
        <Text style={styles.stopButtonText}>Stop now?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#424242', // 深灰色背景
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  backgroundLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: SCREEN_WIDTH,
    height: undefined,
    aspectRatio: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 0,
    letterSpacing: 2,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 0,
    marginTop: -100,
  },
  timerBlob: {
    width: 550,
    height: 550,
    alignSelf: 'center',
  },
  timerTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    color: '#FFFFFF',
    fontSize: 72,
    fontWeight: '500',
  },
  timerLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.9,
  },
  mochiContainer: {
    alignItems: 'center',
    marginTop: -100,
    marginBottom: 10,
  },
  mochiImage: {
    width: 200,
    height: 200,
  },
  stopButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 30,
    paddingVertical: 8,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  stopButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '400',
  },
});

export default MeditationScreen;
