import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  // Linking,
} from 'react-native';

const WelcomeScreen = ({ navigation }: any) => {
  const [checked, setChecked] = useState(false);

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleSignUp = () => {
    navigation.navigate('Signup');
  };

  return (
    <View style={styles.container}>
      {/* 背景裝飾線條 */}
      <Image
        source={require('../../../assets/images/lines/line_yellow.png')}
        style={styles.lineYellow}
      />
      <Image
        source={require('../../../assets/images/lines/line_blue.png')}
        style={styles.lineBlue}
      />
      <Image
        source={require('../../../assets/images/lines/line_purple.png')}
        style={styles.linePurple}
      />

      <Text style={styles.title}>Welcome to{'\n'}MOCHISOL!</Text>
      <Text style={styles.subtitle}>
        Let’s scroll smarter, feel better,{'\n'}
        and make your social time a little lighter ✨
      </Text>

      {/* 麻糬圖 */}
      <Image
        source={require('../../../assets/images/mochi/mochi_welcome.png')}
        style={styles.mochi}
      />

      {/* Login 按鈕 */}
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginBtnText}>Login</Text>
      </TouchableOpacity>
      {/* Sign Up 按鈕 */}
      <TouchableOpacity style={styles.signupBtn} onPress={handleSignUp}>
        <Text style={styles.signupBtnText}>Sign Up</Text>
      </TouchableOpacity>

      {/* 條款勾選 */}
      <View style={styles.termsRow}>
        <TouchableOpacity
          onPress={() => setChecked(!checked)}
          style={styles.checkbox}
        >
          {checked ? <View style={styles.checkedBox} /> : null}
        </TouchableOpacity>
        <Text style={styles.termsText}>
          By continue, you agree to our{' '}
          <Text
            style={styles.link}
            // onPress={() => Linking.openURL('https://your-terms-url')}
          >
            Terms
          </Text>{' '}
          and{' '}
          <Text
            style={styles.link}
            // onPress={() => Linking.openURL('https://your-privacy-url')}
          >
            Privacy Policy
          </Text>
          .
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A3A3A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  lineYellow: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 210,
    height: 210,
    resizeMode: 'contain',
  },
  lineBlue: {
    position: 'absolute',
    left: 0,
    top: '30%',
    width: 60,
    height: 450,
    resizeMode: 'contain',
  },
  linePurple: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 120,
    height: 180,
    resizeMode: 'contain',
  },
  title: {
    color: '#FF1E7A',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 16,
    // fontFamily: 'Jaro', // 若有自訂字體可開啟
  },
  subtitle: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  mochi: {
    width: 140,
    height: 140,
    marginBottom: 32,
    resizeMode: 'contain',
  },
  loginBtn: {
    backgroundColor: '#CFCFCF',
    borderRadius: 32,
    width: '90%',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  loginBtnText: {
    color: '#3A3A3A',
    fontSize: 22,
    fontWeight: 'bold',
    // fontFamily: 'Jaro',
  },
  signupBtn: {
    backgroundColor: '#FF1E7A',
    borderRadius: 32,
    width: '90%',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  signupBtnText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    // fontFamily: 'Jaro',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    flexWrap: 'wrap',
    width: '90%',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#CFCFCF',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    width: 14,
    height: 14,
    backgroundColor: '#FF1E7A',
  },
  termsText: {
    color: '#CFCFCF',
    fontSize: 13,
    flex: 1,
    flexWrap: 'wrap',
  },
  link: {
    color: '#fff',
    textDecorationLine: 'underline',
  },
});

export default WelcomeScreen;
