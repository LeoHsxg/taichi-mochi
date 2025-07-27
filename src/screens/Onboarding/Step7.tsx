import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import onboardingStyles from './onboardingStyles';

const Step7 = () => (
  <View style={onboardingStyles.container}>
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

    <Text style={styles.superbText}>SUPERB!!</Text>
    <Text style={styles.instructionText}>
      Now you know how Mochi works! You can review our functions anytime in{' '}
      <Text style={styles.highlightText}>Personal {'>'} Settings</Text>.
    </Text>

    <Image
      source={require('../../../assets/images/mochi/mochi_happy.png')}
      style={styles.mochiImage}
      resizeMode="contain"
    />

    <TouchableOpacity style={styles.startButton}>
      <Text style={styles.startButtonText}>START!</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
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
  superbText: {
    color: '#FF2171',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 200,
    marginBottom: 16,
  },
  instructionText: {
    color: '#D6D6D6',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 32,
    lineHeight: 24,
  },
  highlightText: {
    color: '#4A90E2',
    textDecorationLine: 'underline',
  },
  mochiImage: {
    width: 183,
    height: 172,
    marginBottom: 60,
  },
  startButton: {
    backgroundColor: '#FF2171',
    borderRadius: 50,
    width: 200,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Step7;
