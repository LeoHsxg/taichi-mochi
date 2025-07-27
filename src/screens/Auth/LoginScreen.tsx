import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // 這裡可以添加登入邏輯
    navigation.navigate('LoginSuccess');
  };

  const handleSignUp = () => {
    navigation.navigate('Signup');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 背景裝飾線條 */}
      <Image
        source={require('../../../assets/images/lines/line_blue.png')}
        style={styles.lineBlue}
      />
      <Image
        source={require('../../../assets/images/lines/line_yellow.png')}
        style={styles.lineYellow}
      />
      <Image
        source={require('../../../assets/images/lines/line_purple.png')}
        style={styles.linePurple}
      />

      {/* 標題區域 */}
      <View style={styles.header}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>
          We're so glad to see you again! Please continue to use Mochisol.
        </Text>
      </View>

      {/* 輸入區域 */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="EMAIL/USERNAME/PHONE"
          placeholderTextColor="#9E9E9E"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="PASSWORD"
          placeholderTextColor="#9E9E9E"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgotten Password?</Text>
        </TouchableOpacity>
      </View>

      {/* 登入按鈕 */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>LOGIN</Text>
      </TouchableOpacity>

      {/* 分隔線 */}
      <View style={styles.divider}>
        <Text style={styles.dividerText}>OR</Text>
      </View>

      {/* 社交登入 */}
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Text style={styles.facebookText}>f</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Text style={styles.googleText}>G</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Text style={styles.lineText}>LINE</Text>
        </TouchableOpacity>
      </View>

      {/* 註冊連結 */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <TouchableOpacity onPress={handleSignUp}>
          <Text style={styles.signupLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#424242',
    paddingHorizontal: 24,
  },
  lineBlue: {
    position: 'absolute',
    left: 0,
    top: '30%',
    width: 60,
    height: 450,
    resizeMode: 'contain',
  },
  lineYellow: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 210,
    height: 210,
    resizeMode: 'contain',
  },
  linePurple: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 160,
    height: 240,
    resizeMode: 'contain',
  },
  header: {
    marginTop: 200,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF2171',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 32,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    color: '#2196F3',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#FF2171',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 40,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  facebookText: {
    color: '#1877F2',
    fontSize: 20,
    fontWeight: 'bold',
  },
  googleText: {
    color: '#DB4437',
    fontSize: 20,
    fontWeight: 'bold',
  },
  lineText: {
    color: '#00B900',
    fontSize: 12,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  signupLink: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
