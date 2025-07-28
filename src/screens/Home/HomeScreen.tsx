import React from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';

const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();

  const handleBottomHalfPress = () => {
    navigation.navigate('ChartDetail');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require('../../../assets/images/screen/home.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </ScrollView>

      {/* 隱形按鈕覆蓋螢幕下半部分 */}
      <TouchableOpacity
        style={styles.bottomHalfButton}
        onPress={handleBottomHalfPress}
        activeOpacity={1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  image: {
    width: width,
    height: undefined,
    aspectRatio: 1524 / 3300, // 保持圖片比例
  },
  bottomHalfButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height / 4, // 覆蓋螢幕下半部分
    backgroundColor: 'transparent',
  },
});

export default HomeScreen;
