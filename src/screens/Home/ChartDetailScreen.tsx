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

const { width, height } = Dimensions.get('window');

const ChartDetailScreen = () => {
  const navigation = useNavigation<any>();

  const handleBottomHalfPress = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require('../../../assets/images/screen/home_chart.png')}
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
    aspectRatio: 1524 / 4005, // 保持圖片比例
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

export default ChartDetailScreen;
