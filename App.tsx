/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';
import DebugNavigator from './src/navigation/DebugNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import OnboardingNavigator from './src/navigation/OnboardingNavigator';
import MainTabNavigator from './src/navigation/MainTabNavigator';

const FLOW = {
  MENU: 'menu',
  DEBUG: 'debug',
  AUTH: 'auth',
  ONBOARDING: 'onboarding',
  MAIN: 'main',
};

type FlowType = keyof typeof FLOW;

function App() {
  const [flow, setFlow] = useState<FlowType>('MENU');

  const renderMenu = () => (
    <View style={styles.menuContainer}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>選擇流程</Text>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setFlow('DEBUG')}
      >
        <Text style={styles.menuButtonText}>Debug Navigator</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setFlow('AUTH')}
      >
        <Text style={styles.menuButtonText}>Auth Navigator</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setFlow('ONBOARDING')}
      >
        <Text style={styles.menuButtonText}>Onboarding Navigator</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setFlow('MAIN')}
      >
        <Text style={styles.menuButtonText}>MainTab Navigator</Text>
      </TouchableOpacity>
    </View>
  );

  const handleBack = () => setFlow('MENU');

  if (flow === 'MENU') return renderMenu();
  if (flow === 'DEBUG') return <DebugNavigatorWithBack onBack={handleBack} />;
  if (flow === 'AUTH')
    return <NavigatorWithBack Navigator={AuthNavigator} onBack={handleBack} />;
  if (flow === 'ONBOARDING')
    return (
      <NavigatorWithBack Navigator={OnboardingNavigator} onBack={handleBack} />
    );
  if (flow === 'MAIN')
    return (
      <NavigatorWithBack Navigator={MainTabNavigator} onBack={handleBack} />
    );
  return null;
}

function DebugNavigatorWithBack({ onBack }: { onBack: () => void }) {
  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>← 返回選單</Text>
      </TouchableOpacity>
      <DebugNavigator />
    </View>
  );
}

function NavigatorWithBack({
  Navigator,
  onBack,
}: {
  Navigator: React.ComponentType;
  onBack: () => void;
}) {
  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>← 返回選單</Text>
      </TouchableOpacity>
      <Navigator />
    </View>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  menuButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginVertical: 12,
    width: 240,
    alignItems: 'center',
  },
  menuButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    padding: 12,
    backgroundColor: '#eee',
    alignItems: 'flex-start',
  },
  backButtonText: {
    fontSize: 16,
    color: '#2196F3',
  },
});

export default App;
