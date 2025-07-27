import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';

const LoginSuccessScreen = ({ navigation }: any) => {
  const handleStart = () => {
    // 導航到主應用程式
    navigation.navigate('Main');
  };

  const handleReview = () => {
    // 導航到教學頁面
    navigation.navigate('Onboarding');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 歡迎訊息 */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeTitle}>WELCOME BACK!</Text>
        <Text style={styles.welcomeSubtitle}>NOW LET'S START MOCHI TODAY!</Text>
      </View>

      {/* 角色圖示 */}
      <View style={styles.characterContainer}>
        <Image
          source={require('../../../assets/images/mochi/mochi_happy.png')}
          style={styles.character}
        />
      </View>

      {/* 操作按鈕 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.startButton} onPress={handleStart}>
          <Text style={styles.startButtonText}>START</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.reviewButton} onPress={handleReview}>
          <Text style={styles.reviewButtonText}>REVIEW HOW MOCHI WORKS</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#424242',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 120,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF2171',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
  },
  characterContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  character: {
    width: 183,
    height: 172,
    resizeMode: 'contain',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#FF1E7A',
    borderRadius: 32,
    width: '70%',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  reviewButton: {
    backgroundColor: '#CFCFCF',
    borderRadius: 32,
    width: '70%',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  reviewButtonText: {
    color: '#3A3A3A',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginSuccessScreen;
