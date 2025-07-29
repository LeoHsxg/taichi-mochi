import React from 'react';
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

const MeditationEndScreen = () => {
  const navigation = useNavigation<any>();

  const handleGreat = () => {
    // 回到 MochiComfortScreen
    navigation.navigate('MochiComfort');
  };

  return (
    <View style={styles.container}>
      {/* 背景線條 */}
      <Image
        source={require('../../../assets/images/lines/line_medi.png')}
        style={styles.backgroundLines}
        resizeMode="cover"
      />

      {/* 背景橢圓 */}
      <Image
        source={require('../../../assets/images/ellipse/ellipse_medi_end.png')}
        style={styles.backgroundEllipse}
        resizeMode="cover"
      />

      {/* 標題 */}
      <Text style={styles.title}>DONE!</Text>

      {/* 完成訊息 */}
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>You did great work!</Text>
        <Text style={styles.subMessageText}>
          Bet you'd feel refreshed after a break from scrolling —time to dive
          back into the 3D world!
        </Text>
      </View>

      {/* 麻糬角色 */}
      <View style={styles.mochiContainer}>
        <Image
          source={require('../../../assets/images/mochi/mochi_medi.png')}
          style={styles.mochiImage}
          resizeMode="contain"
        />
      </View>

      {/* 完成按鈕 */}
      <TouchableOpacity style={styles.greatButton} onPress={handleGreat}>
        <Text style={styles.greatButtonText}>GREAT!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#424242', // 深灰色背景
    alignItems: 'center',
    paddingTop: 240,
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
  backgroundEllipse: {
    position: 'absolute',
    top: 32,
    left: '50%',
    marginLeft: -275, // 550/2 = 275，讓圖片以中心點對齊
    width: 550,
    height: 550,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    letterSpacing: 2,
  },
  messageContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
  subMessageText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.9,
  },
  mochiContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mochiImage: {
    width: 200,
    height: 200,
  },
  greatButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 30,
    paddingVertical: 8,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  greatButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '400',
  },
});

export default MeditationEndScreen;
