import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { appMonitorService } from '../services/AppMonitorService';
import { AppInfo } from '../types';

const AccessibilityTestScreen: React.FC = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [accessibilityEnabled, setAccessibilityEnabled] = useState(false);
  const [currentApp, setCurrentApp] = useState<AppInfo | undefined>();
  const [logMessages, setLogMessages] = useState<string[]>([]);

  const addLogMessage = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogMessages(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 19)]);
  }, []);

  const checkAccessibilityStatus = useCallback(async () => {
    try {
      const enabled = await appMonitorService.checkAccessibilityService();
      setAccessibilityEnabled(enabled);
      addLogMessage(`無障礙服務狀態: ${enabled ? '已啟用' : '未啟用'}`);
    } catch (error) {
      addLogMessage(`檢查無障礙服務失敗: ${error}`);
    }
  }, [addLogMessage]);

  useEffect(() => {
    checkAccessibilityStatus();
    return () => {
      appMonitorService.stopMonitoring();
    };
  }, [checkAccessibilityStatus]);

  const handleStartMonitoring = async () => {
    try {
      // 設定測試用的干擾應用程式
      appMonitorService.setDistractingApps([
        {
          packageName: 'com.whatsapp',
          appName: 'WhatsApp',
          category: 'social',
        },
        {
          packageName: 'com.facebook.katana',
          appName: 'Facebook',
          category: 'social',
        },
        {
          packageName: 'com.instagram.android',
          appName: 'Instagram',
          category: 'social',
        },
      ]);

      // 設定干擾應用程式偵測回調
      appMonitorService.setOnDistractingAppDetected(appInfo => {
        addLogMessage(
          `偵測到干擾應用程式: ${appInfo.appName} (${appInfo.packageName})`,
        );
        setCurrentApp(appInfo);

        // 顯示提醒
        Alert.alert(
          '專注提醒',
          `您正在使用 ${appInfo.appName}，請回到專注模式！`,
          [{ text: '知道了', style: 'default' }],
        );
      });

      await appMonitorService.startMonitoring();
      setIsMonitoring(true);
      addLogMessage('開始監控前景應用程式');
    } catch (error) {
      addLogMessage(`啟動監控失敗: ${error}`);
    }
  };

  const handleStopMonitoring = () => {
    appMonitorService.stopMonitoring();
    setIsMonitoring(false);
    setCurrentApp(undefined);
    addLogMessage('停止監控前景應用程式');
  };

  const handleOpenSettings = () => {
    appMonitorService.openAccessibilitySettings();
    addLogMessage('開啟無障礙服務設定頁面');
  };

  const handleRefreshStatus = async () => {
    await checkAccessibilityStatus();
    addLogMessage('重新檢查無障礙服務狀態');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>AccessibilityService 測試</Text>

        {/* 狀態顯示 */}
        <View style={styles.statusSection}>
          <Text style={styles.sectionTitle}>服務狀態</Text>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>無障礙服務:</Text>
            <View
              style={[
                styles.statusIndicator,
                accessibilityEnabled ? styles.enabled : styles.disabled,
              ]}
            >
              <Text style={styles.statusText}>
                {accessibilityEnabled ? '已啟用' : '未啟用'}
              </Text>
            </View>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>監控狀態:</Text>
            <View
              style={[
                styles.statusIndicator,
                isMonitoring ? styles.enabled : styles.disabled,
              ]}
            >
              <Text style={styles.statusText}>
                {isMonitoring ? '監控中' : '已停止'}
              </Text>
            </View>
          </View>
          {currentApp && (
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>當前應用:</Text>
              <Text style={styles.currentAppText}>{currentApp.appName}</Text>
            </View>
          )}
        </View>

        {/* 控制按鈕 */}
        <View style={styles.controlSection}>
          <Text style={styles.sectionTitle}>控制</Text>

          {!accessibilityEnabled && (
            <TouchableOpacity
              style={styles.button}
              onPress={handleOpenSettings}
            >
              <Text style={styles.buttonText}>啟用無障礙服務</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.button} onPress={handleRefreshStatus}>
            <Text style={styles.buttonText}>重新檢查狀態</Text>
          </TouchableOpacity>

          {!isMonitoring ? (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleStartMonitoring}
              disabled={!accessibilityEnabled}
            >
              <Text style={styles.buttonText}>開始監控</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.dangerButton]}
              onPress={handleStopMonitoring}
            >
              <Text style={styles.buttonText}>停止監控</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 使用說明 */}
        <View style={styles.instructionSection}>
          <Text style={styles.sectionTitle}>使用說明</Text>
          <Text style={styles.instructionText}>
            1. 首先啟用無障礙服務權限{'\n'}
            2. 點擊「開始監控」按鈕{'\n'}
            3. 切換到其他應用程式（如 WhatsApp、Facebook）{'\n'}
            4. 觀察日誌輸出和提醒彈窗{'\n'}
            5. 測試完成後點擊「停止監控」
          </Text>
        </View>

        {/* 日誌顯示 */}
        <View style={styles.logSection}>
          <Text style={styles.sectionTitle}>日誌</Text>
          <View style={styles.logContainer}>
            {logMessages.map((message, index) => (
              <Text key={index} style={styles.logMessage}>
                {message}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  statusSection: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  controlSection: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  instructionSection: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  logSection: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusLabel: {
    fontSize: 16,
    color: '#666',
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
  },
  enabled: {
    backgroundColor: '#4CAF50',
  },
  disabled: {
    backgroundColor: '#F44336',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  currentAppText: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#666',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#2196F3',
  },
  dangerButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  logContainer: {
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 5,
    maxHeight: 200,
  },
  logMessage: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'monospace',
    marginBottom: 2,
  },
});

export default AccessibilityTestScreen;
