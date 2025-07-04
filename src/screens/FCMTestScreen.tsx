import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import FCMService from '../services/FCMService';

const FCMTestScreen: React.FC = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeFCM();
  }, []);

  const initializeFCM = async () => {
    try {
      const fcmService = FCMService.getInstance();
      await fcmService.initialize();

      const token = fcmService.getToken();
      setFcmToken(token);
      setIsInitialized(true);

      console.log('FCM 初始化成功');
    } catch (error) {
      console.error('FCM 初始化失敗:', error);
      Alert.alert('錯誤', 'FCM 初始化失敗');
    }
  };

  const copyTokenToClipboard = () => {
    if (fcmToken) {
      // 在實際應用中，您可以使用 Clipboard API
      console.log('FCM Token:', fcmToken);
      Alert.alert('成功', 'Token 已複製到控制台');
    }
  };

  const subscribeToTestTopic = async () => {
    try {
      const fcmService = FCMService.getInstance();
      await fcmService.subscribeToTopic('test_topic');
      Alert.alert('成功', '已訂閱測試主題');
    } catch (error) {
      Alert.alert('錯誤', '訂閱主題失敗');
    }
  };

  const unsubscribeFromTestTopic = async () => {
    try {
      const fcmService = FCMService.getInstance();
      await fcmService.unsubscribeFromTopic('test_topic');
      Alert.alert('成功', '已取消訂閱測試主題');
    } catch (error) {
      Alert.alert('錯誤', '取消訂閱主題失敗');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>FCM 測試頁面</Text>

      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>初始化狀態:</Text>
        <Text
          style={[
            styles.statusValue,
            { color: isInitialized ? 'green' : 'red' },
          ]}
        >
          {isInitialized ? '已初始化' : '未初始化'}
        </Text>
      </View>

      <View style={styles.tokenContainer}>
        <Text style={styles.tokenLabel}>FCM Token:</Text>
        <Text style={styles.tokenValue} numberOfLines={3}>
          {fcmToken || '載入中...'}
        </Text>
        {fcmToken && (
          <TouchableOpacity
            style={styles.copyButton}
            onPress={copyTokenToClipboard}
          >
            <Text style={styles.copyButtonText}>複製 Token</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={subscribeToTestTopic}>
          <Text style={styles.buttonText}>訂閱測試主題</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={unsubscribeFromTestTopic}
        >
          <Text style={styles.buttonText}>取消訂閱測試主題</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>使用說明:</Text>
        <Text style={styles.infoText}>
          1. 確保應用已獲得通知權限{'\n'}
          2. 複製 FCM Token 用於後端發送通知{'\n'}
          3. 訂閱主題以接收群組通知{'\n'}
          4. 測試本地通知功能
        </Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>測試方法:</Text>
        <Text style={styles.infoText}>
          1. 使用 Firebase Console 發送測試通知{'\n'}
          2. 使用 FCM API 發送通知到特定 Token{'\n'}
          3. 發送主題通知到所有訂閱者
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
    color: '#333',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tokenContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tokenLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  tokenValue: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
  copyButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  copyButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
});

export default FCMTestScreen;
