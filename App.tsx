/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native';
import PermissionScreen from './src/screens/PermissionScreen';
import PomodoroScreen from './src/screens/PomodoroScreen';
import DebugScreen from './src/screens/DebugScreen';
import { permissionService } from './src/services/PermissionService';
import { appMonitorService } from './src/services/AppMonitorService';
import { overlayService } from './src/services/OverlayService';
import { pomodoroService } from './src/services/PomodoroService';
import { notificationService } from './src/services/NotificationService';
import { PermissionStatus, DistractingApp } from './src/types';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<
    'permission' | 'main' | 'debug'
  >('permission');

  const initializeServices = useCallback(async () => {
    try {
      // 初始化通知服務
      await notificationService.initialize();

      // 設定通知處理器
      notificationService.setOnNotificationReceived(notification => {
        console.log('收到通知:', notification);
        // 根據通知類型處理
        switch (notification.type) {
          case 'break_reminder':
            overlayService.showBreakReminder();
            break;
          case 'focus_reminder':
            overlayService.showFocusReminder();
            break;
          case 'distraction_alert':
            // 處理干擾提醒
            break;
        }
      });

      // 設定干擾應用程式清單
      const distractingApps: DistractingApp[] = [
        {
          packageName: 'com.instagram.android',
          appName: 'Instagram',
          category: 'social',
        },
        {
          packageName: 'com.facebook.katana',
          appName: 'Facebook',
          category: 'social',
        },
        {
          packageName: 'com.twitter.android',
          appName: 'Twitter',
          category: 'social',
        },
        {
          packageName: 'com.google.android.youtube',
          appName: 'YouTube',
          category: 'entertainment',
        },
        {
          packageName: 'com.netflix.mediaclient',
          appName: 'Netflix',
          category: 'entertainment',
        },
        {
          packageName: 'com.spotify.music',
          appName: 'Spotify',
          category: 'entertainment',
        },
      ];

      appMonitorService.setDistractingApps(distractingApps);

      // 設定干擾應用程式偵測處理器
      appMonitorService.setOnDistractingAppDetected(appInfo => {
        console.log('偵測到干擾應用程式:', appInfo);
        overlayService.showDistractionAlert(appInfo.appName);
      });

      // 設定 Pomodoro 完成處理器
      pomodoroService.setOnSessionComplete(session => {
        console.log('Pomodoro 會話完成:', session);
        if (session.type === 'work') {
          overlayService.showBreakReminder();
        } else {
          overlayService.showFocusReminder();
        }
      });

      console.log('所有服務初始化完成');
    } catch (error) {
      console.error('初始化服務失敗:', error);
    }
  }, []);

  const initializeApp = useCallback(async () => {
    try {
      // 檢查權限
      const permissions = await permissionService.checkAllPermissions();
      setPermissionsGranted(
        permissions.usageAccess &&
          permissions.overlayPermission &&
          permissions.notificationPermission,
      );

      if (
        permissions.usageAccess &&
        permissions.overlayPermission &&
        permissions.notificationPermission
      ) {
        // 初始化服務
        await initializeServices();
      }

      setIsInitialized(true);
    } catch (error) {
      console.error('初始化應用程式失敗:', error);
      setIsInitialized(true);
    }
  }, [initializeServices]);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  const handlePermissionsGranted = async () => {
    setPermissionsGranted(true);
    await initializeServices();
    setCurrentScreen('main');
  };

  const handleStartMonitoring = () => {
    if (permissionsGranted) {
      appMonitorService.startMonitoring();
      Alert.alert('監控已啟動', '應用程式監控功能已開始運作');
    }
  };

  const handleStopMonitoring = () => {
    appMonitorService.stopMonitoring();
    Alert.alert('監控已停止', '應用程式監控功能已停止');
  };

  const renderScreen = () => {
    if (!isInitialized) {
      return (
        <View style={styles.container}>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <Text style={styles.loadingText}>載入中...</Text>
        </View>
      );
    }

    if (currentScreen === 'debug') {
      return <DebugScreen />;
    }

    if (!permissionsGranted) {
      return (
        <PermissionScreen onPermissionsGranted={handlePermissionsGranted} />
      );
    }

    return <PomodoroScreen />;
  };

  const renderNavigation = () => {
    if (!isInitialized || !permissionsGranted) return null;

    return (
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentScreen === 'main' && styles.activeNavButton,
          ]}
          onPress={() => setCurrentScreen('main')}
        >
          <Text
            style={[
              styles.navButtonText,
              currentScreen === 'main' && styles.activeNavButtonText,
            ]}
          >
            主畫面
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentScreen === 'debug' && styles.activeNavButton,
          ]}
          onPress={() => setCurrentScreen('debug')}
        >
          <Text
            style={[
              styles.navButtonText,
              currentScreen === 'debug' && styles.activeNavButtonText,
            ]}
          >
            調試
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {renderScreen()}
      {renderNavigation()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
  navigation: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 8,
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeNavButton: {
    backgroundColor: '#f0f0f0',
  },
  navButtonText: {
    fontSize: 16,
    color: '#666',
  },
  activeNavButtonText: {
    color: '#2196F3',
    fontWeight: '600',
  },
});

export default App;
