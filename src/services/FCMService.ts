import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

class FCMService {
  private static instance: FCMService;
  private fcmToken: string | null = null;

  private constructor() {}

  public static getInstance(): FCMService {
    if (!FCMService.instance) {
      FCMService.instance = new FCMService();
    }
    return FCMService.instance;
  }

  /**
   * 初始化 FCM 服務
   */
  async initialize(): Promise<void> {
    try {
      // 請求通知權限
      await this.requestUserPermission();

      // 獲取 FCM token
      await this.getFCMToken();

      // 設置訊息處理器
      this.setupMessageHandlers();

      console.log('FCM 服務初始化完成');
    } catch (error) {
      console.error('FCM 初始化失敗:', error);
    }
  }

  /**
   * 請求通知權限
   */
  private async requestUserPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      console.log('通知權限狀態:', authStatus);
      return enabled;
    }
    return true;
  }

  /**
   * 獲取 FCM token
   */
  private async getFCMToken(): Promise<string | null> {
    try {
      const token = await messaging().getToken();
      this.fcmToken = token;

      // 儲存 token 到本地
      await AsyncStorage.setItem('fcm_token', token);

      console.log('FCM Token:', token);
      return token;
    } catch (error) {
      console.error('獲取 FCM token 失敗:', error);
      return null;
    }
  }

  /**
   * 設置訊息處理器
   */
  private setupMessageHandlers(): void {
    // 處理前景訊息
    messaging().onMessage(async remoteMessage => {
      console.log('收到前景訊息:', remoteMessage);

      // 這裡可以處理前景通知
      // 例如顯示自定義通知或更新 UI
      this.handleForegroundMessage(remoteMessage);
    });

    // 處理背景/終止狀態的訊息點擊
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('從背景狀態打開通知:', remoteMessage);
      this.handleNotificationOpen(remoteMessage);
    });

    // 檢查應用是否從通知啟動
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('從終止狀態啟動應用:', remoteMessage);
          this.handleNotificationOpen(remoteMessage);
        }
      });
  }

  /**
   * 處理前景訊息
   */
  private handleForegroundMessage(remoteMessage: any): void {
    // 這裡可以實現自定義的前景通知處理
    // 例如顯示 Toast 或更新應用內狀態
    const { title, body, data } = remoteMessage.notification || {};

    console.log('前景通知:', { title, body, data });

    // 可以發送事件到其他組件
    // EventEmitter.emit('fcm_message', { title, body, data });
  }

  /**
   * 處理通知點擊
   */
  private handleNotificationOpen(remoteMessage: any): void {
    const { data } = remoteMessage;

    console.log('通知被點擊:', data);

    // 根據通知類型導航到相應頁面
    if (data?.screen) {
      // 導航到指定頁面
      // navigation.navigate(data.screen, data.params);
    }
  }

  /**
   * 獲取當前 FCM token
   */
  getToken(): string | null {
    return this.fcmToken;
  }

  /**
   * 訂閱主題
   */
  async subscribeToTopic(topic: string): Promise<void> {
    try {
      await messaging().subscribeToTopic(topic);
      console.log(`已訂閱主題: ${topic}`);
    } catch (error) {
      console.error(`訂閱主題失敗: ${topic}`, error);
    }
  }

  /**
   * 取消訂閱主題
   */
  async unsubscribeFromTopic(topic: string): Promise<void> {
    try {
      await messaging().unsubscribeFromTopic(topic);
      console.log(`已取消訂閱主題: ${topic}`);
    } catch (error) {
      console.error(`取消訂閱主題失敗: ${topic}`, error);
    }
  }
}

export default FCMService;
