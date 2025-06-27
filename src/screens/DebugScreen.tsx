import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { permissionService } from '../services/PermissionService';
import { appMonitorService } from '../services/AppMonitorService';
import { overlayService } from '../services/OverlayService';
import { pomodoroService } from '../services/PomodoroService';
import { FocusNativeModule } from '../types/native';
import { PermissionStatus } from '../types';

const DebugScreen: React.FC = () => {
  const [permissions, setPermissions] = useState<PermissionStatus>({
    usageAccess: false,
    overlayPermission: false,
    notificationPermission: false,
  });
  const [logs, setLogs] = useState<string[]>([]);
  const [foregroundApp, setForegroundApp] = useState<string>('');

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const testPermissions = async () => {
    addLog('開始測試權限...');
    try {
      await permissionService.testPermissions();
      const currentPermissions = await permissionService.checkAllPermissions();
      setPermissions(currentPermissions);
      addLog('權限測試完成');
    } catch (error) {
      addLog(`權限測試失敗: ${error}`);
    }
  };

  const testOverlay = () => {
    addLog('測試浮動視窗...');
    overlayService.showOverlay({
      message: '這是一個測試浮動視窗',
      showReturnButton: true,
      returnButtonText: '關閉',
      autoHide: true,
      autoHideDelay: 5000,
    });
    addLog('浮動視窗已顯示');
  };

  const testAppMonitor = () => {
    addLog('測試應用程式監控...');
    if (appMonitorService.isMonitoringActive()) {
      appMonitorService.stopMonitoring();
      addLog('應用程式監控已停止');
    } else {
      appMonitorService.startMonitoring();
      addLog('應用程式監控已啟動');
    }
  };

  const testPomodoro = () => {
    addLog('測試 Pomodoro 計時器...');
    const currentSession = pomodoroService.getCurrentSession();
    if (currentSession) {
      addLog(
        `當前會話: ${
          currentSession.type
        }, 剩餘時間: ${pomodoroService.getRemainingTime()}秒`,
      );
    } else {
      addLog('沒有進行中的會話');
    }
  };

  const startWorkSession = () => {
    addLog('開始工作會話...');
    pomodoroService.startWorkSession();
    addLog('工作會話已開始');
  };

  const testNativeOverlay = async () => {
    addLog('測試原生浮動視窗...');
    try {
      FocusNativeModule.showOverlay('這是原生浮動視窗測試');
      addLog('原生浮動視窗已顯示');
    } catch (error) {
      addLog(`原生浮動視窗測試失敗: ${error}`);
    }
  };

  const testNativeForegroundApp = async () => {
    addLog('測試原生前景應用程式查詢...');
    try {
      const packageName = await FocusNativeModule.getForegroundApp();
      setForegroundApp(packageName || '無');
      addLog(`前景應用程式: ${packageName || '無'}`);
    } catch (error) {
      addLog(`前景應用程式查詢失敗: ${error}`);
    }
  };

  const testNativePermissions = async () => {
    addLog('測試原生權限檢查...');
    try {
      const overlayGranted = await FocusNativeModule.canDrawOverlays();
      const usageGranted = await FocusNativeModule.hasUsageAccess();
      addLog(`覆蓋權限: ${overlayGranted}`);
      addLog(`使用情況存取權限: ${usageGranted}`);
    } catch (error) {
      addLog(`原生權限檢查失敗: ${error}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>調試畫面</Text>

        {/* 權限狀態 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>權限狀態</Text>
          <View style={styles.permissionItem}>
            <Text>使用情況存取: {permissions.usageAccess ? '✅' : '❌'}</Text>
          </View>
          <View style={styles.permissionItem}>
            <Text>覆蓋權限: {permissions.overlayPermission ? '✅' : '❌'}</Text>
          </View>
          <View style={styles.permissionItem}>
            <Text>
              通知權限: {permissions.notificationPermission ? '✅' : '❌'}
            </Text>
          </View>
        </View>

        {/* 前景應用程式 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>前景應用程式</Text>
          <Text style={styles.foregroundAppText}>
            目前前景 App: {foregroundApp || '未查詢'}
          </Text>
        </View>

        {/* 測試按鈕 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>功能測試</Text>

          <TouchableOpacity style={styles.button} onPress={testPermissions}>
            <Text style={styles.buttonText}>測試權限</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={testOverlay}>
            <Text style={styles.buttonText}>測試浮動視窗</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={testAppMonitor}>
            <Text style={styles.buttonText}>測試應用程式監控</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={testPomodoro}>
            <Text style={styles.buttonText}>測試 Pomodoro</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={startWorkSession}>
            <Text style={styles.buttonText}>開始工作會話</Text>
          </TouchableOpacity>
        </View>

        {/* 原生模組測試 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>原生模組測試</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={testNativePermissions}
          >
            <Text style={styles.buttonText}>測試原生權限檢查</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={testNativeOverlay}>
            <Text style={styles.buttonText}>測試原生浮動視窗</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={testNativeForegroundApp}
          >
            <Text style={styles.buttonText}>測試原生前景應用程式查詢</Text>
          </TouchableOpacity>
        </View>

        {/* 日誌 */}
        <View style={styles.section}>
          <View style={styles.logHeader}>
            <Text style={styles.sectionTitle}>調試日誌</Text>
            <TouchableOpacity onPress={clearLogs}>
              <Text style={styles.clearButton}>清除</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.logContainer}>
            {logs.map((log, index) => (
              <Text key={index} style={styles.logText}>
                {log}
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
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  permissionItem: {
    paddingVertical: 8,
  },
  foregroundAppText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clearButton: {
    color: '#F44336',
    fontSize: 14,
    fontWeight: '500',
  },
  logContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    maxHeight: 200,
  },
  logText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
});

export default DebugScreen;
