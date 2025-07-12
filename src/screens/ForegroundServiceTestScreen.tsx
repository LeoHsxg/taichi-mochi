import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import ForegroundService from '../services/ForegroundService';

const ForegroundServiceTestScreen: React.FC = () => {
  const [isServiceRunning, setIsServiceRunning] = useState(false);
  const [overlayType, setOverlayType] = useState('type1');
  const [overlayMessage, setOverlayMessage] = useState('專注時間到！');
  const [gifUrl, setGifUrl] = useState(
    'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif',
  );
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  const checkServiceStatus = useCallback(async () => {
    try {
      const running = await ForegroundService.isRunning();
      setIsServiceRunning(running);
      addLog(`服務狀態檢查: ${running ? '運行中' : '未運行'}`);
    } catch (error) {
      addLog(`檢查服務狀態失敗: ${error}`);
    }
  }, []);

  useEffect(() => {
    checkServiceStatus();
  }, [checkServiceStatus]);

  const handleStartService = async () => {
    try {
      addLog('正在啟動前景服務...');
      const result = await ForegroundService.start();
      setIsServiceRunning(result);
      if (result) {
        addLog('前景服務啟動成功');
        Alert.alert('成功', '前景服務已啟動');
      } else {
        addLog('前景服務啟動失敗');
        Alert.alert('失敗', '前景服務啟動失敗');
      }
    } catch (error) {
      addLog(`啟動服務錯誤: ${error}`);
      Alert.alert('錯誤', `啟動服務失敗: ${error}`);
    }
  };

  const handleStopService = async () => {
    try {
      addLog('正在停止前景服務...');
      const result = await ForegroundService.stop();
      setIsServiceRunning(false);
      if (result) {
        addLog('前景服務停止成功');
        Alert.alert('成功', '前景服務已停止');
      } else {
        addLog('前景服務停止失敗');
        Alert.alert('失敗', '前景服務停止失敗');
      }
    } catch (error) {
      addLog(`停止服務錯誤: ${error}`);
      Alert.alert('錯誤', `停止服務失敗: ${error}`);
    }
  };

  const handleShowOverlay = async () => {
    try {
      addLog(
        `正在顯示 overlay: type=${overlayType}, message=${overlayMessage}`,
      );
      const result = await ForegroundService.showOverlay(
        overlayType,
        overlayMessage,
        gifUrl,
      );
      if (result) {
        addLog('Overlay 顯示成功');
        Alert.alert('成功', 'Overlay 已顯示');
      } else {
        addLog('Overlay 顯示失敗');
        Alert.alert('失敗', 'Overlay 顯示失敗');
      }
    } catch (error) {
      addLog(`顯示 overlay 錯誤: ${error}`);
      Alert.alert('錯誤', `顯示 overlay 失敗: ${error}`);
    }
  };

  const handleTestFCM = () => {
    addLog('測試 FCM 功能 - 請發送測試訊息到設備');
    Alert.alert(
      'FCM 測試',
      '請使用 Firebase Console 或其他工具發送包含以下資料的 FCM 訊息：\n\n' +
        '{\n' +
        '  "show_overlay": true,\n' +
        '  "overlay_type": "' +
        overlayType +
        '",\n' +
        '  "overlay_message": "' +
        overlayMessage +
        '",\n' +
        '  "gif_url": "' +
        gifUrl +
        '"\n' +
        '}',
    );
  };

  const handleInitialize = async () => {
    try {
      addLog('正在初始化前景服務...');
      await ForegroundService.initialize();
      await checkServiceStatus();
      addLog('前景服務初始化完成');
      Alert.alert('成功', '前景服務初始化完成');
    } catch (error) {
      addLog(`初始化錯誤: ${error}`);
      Alert.alert('錯誤', `初始化失敗: ${error}`);
    }
  };

  const handleCleanup = async () => {
    try {
      addLog('正在清理前景服務...');
      await ForegroundService.cleanup();
      await checkServiceStatus();
      addLog('前景服務清理完成');
      Alert.alert('成功', '前景服務清理完成');
    } catch (error) {
      addLog(`清理錯誤: ${error}`);
      Alert.alert('錯誤', `清理失敗: ${error}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>前景服務測試</Text>

      {/* 服務狀態 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>服務狀態</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>前景服務:</Text>
          <Text
            style={[
              styles.statusValue,
              { color: isServiceRunning ? '#4CAF50' : '#F44336' },
            ]}
          >
            {isServiceRunning ? '運行中' : '未運行'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={checkServiceStatus}
        >
          <Text style={styles.refreshButtonText}>刷新狀態</Text>
        </TouchableOpacity>
      </View>

      {/* 服務控制 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>服務控制</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.startButton]}
            onPress={handleStartService}
            disabled={isServiceRunning}
          >
            <Text style={styles.buttonText}>啟動服務</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.stopButton]}
            onPress={handleStopService}
            disabled={!isServiceRunning}
          >
            <Text style={styles.buttonText}>停止服務</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.initButton]}
            onPress={handleInitialize}
          >
            <Text style={styles.buttonText}>初始化</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.cleanupButton]}
            onPress={handleCleanup}
          >
            <Text style={styles.buttonText}>清理</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Overlay 設定 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overlay 設定</Text>

        <Text style={styles.label}>Overlay 類型:</Text>
        <View style={styles.typeContainer}>
          {['type1', 'type2', 'type3'].map(type => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeButton,
                overlayType === type && styles.typeButtonActive,
              ]}
              onPress={() => setOverlayType(type)}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  overlayType === type && styles.typeButtonTextActive,
                ]}
              >
                {type === 'type1'
                  ? '自願聲明'
                  : type === 'type2'
                  ? 'GIF 循環'
                  : '強制阻擋'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>訊息內容:</Text>
        <TextInput
          style={styles.input}
          value={overlayMessage}
          onChangeText={setOverlayMessage}
          placeholder="輸入顯示訊息"
        />

        <Text style={styles.label}>GIF URL (type2 使用):</Text>
        <TextInput
          style={styles.input}
          value={gifUrl}
          onChangeText={setGifUrl}
          placeholder="輸入 GIF URL"
        />

        <TouchableOpacity
          style={[styles.button, styles.overlayButton]}
          onPress={handleShowOverlay}
        >
          <Text style={styles.buttonText}>顯示 Overlay</Text>
        </TouchableOpacity>
      </View>

      {/* FCM 測試 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>FCM 測試</Text>
        <TouchableOpacity
          style={[styles.button, styles.fcmButton]}
          onPress={handleTestFCM}
        >
          <Text style={styles.buttonText}>測試 FCM 接收</Text>
        </TouchableOpacity>
      </View>

      {/* 日誌 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>操作日誌</Text>
        <View style={styles.logsContainer}>
          {logs.map((log, index) => (
            <Text key={index} style={styles.logText}>
              {log}
            </Text>
          ))}
          {logs.length === 0 && (
            <Text style={styles.emptyLogText}>尚無操作記錄</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 16,
    marginRight: 8,
    color: '#666',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  refreshButton: {
    backgroundColor: '#6c757d',
    padding: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  startButton: {
    backgroundColor: '#28a745',
  },
  stopButton: {
    backgroundColor: '#dc3545',
  },
  initButton: {
    backgroundColor: '#17a2b8',
  },
  cleanupButton: {
    backgroundColor: '#6c757d',
  },
  overlayButton: {
    backgroundColor: '#ffc107',
    marginTop: 12,
  },
  fcmButton: {
    backgroundColor: '#fd7e14',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#333',
  },
  typeContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  typeButton: {
    flex: 1,
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 2,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  typeButtonText: {
    fontSize: 12,
    color: '#666',
  },
  typeButtonTextActive: {
    color: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
    fontSize: 14,
  },
  logsContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
    padding: 8,
    minHeight: 100,
  },
  logText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
    fontFamily: 'monospace',
  },
  emptyLogText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default ForegroundServiceTestScreen;
