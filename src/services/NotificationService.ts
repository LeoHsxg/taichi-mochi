import messaging from '@react-native-firebase/messaging';
import { NotificationData, FCMToken } from '../types';

class NotificationService {
  private fcmToken?: FCMToken;
  private onNotificationReceived?: (notification: NotificationData) => void;
  private onNotificationOpened?: (notification: NotificationData) => void;

  /**
   * 初始化通知服務
   */
  async initialize(): Promise<void> {
    try {
      // 請求通知權限
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('通知權限已授權');

        // 獲取 FCM Token
        await this.getFCMToken();

        // 設定前景訊息處理器
        this.setupForegroundHandler();

        // 設定背景訊息處理器
        this.setupBackgroundHandler();

        // 設定通知開啟處理器
        this.setupNotificationOpenedHandler();
      } else {
        console.log('通知權限被拒絕');
      }
    } catch (error) {
      console.error('初始化通知服務失敗:', error);
    }
  }

  /**
   * 獲取 FCM Token
   */
  async getFCMToken(): Promise<string | undefined> {
    try {
      const token = await messaging().getToken();
      this.fcmToken = {
        token,
        timestamp: new Date(),
      };
      console.log('FCM Token:', token);
      return token;
    } catch (error) {
      console.error('獲取 FCM Token 失敗:', error);
      return undefined;
    }
  }

  /**
   * 設定前景訊息處理器
   */
  private setupForegroundHandler(): void {
    messaging().onMessage(async remoteMessage => {
      console.log('收到前景訊息:', remoteMessage);

      const notification: NotificationData = {
        title: remoteMessage.notification?.title || '專注提醒',
        body: remoteMessage.notification?.body || '',
        type: this.parseNotificationType(remoteMessage.data?.type),
        data: remoteMessage.data,
      };

      if (this.onNotificationReceived) {
        this.onNotificationReceived(notification);
      }
    });
  }

  /**
   * 設定背景訊息處理器
   */
  private setupBackgroundHandler(): void {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('收到背景訊息:', remoteMessage);

      const notification: NotificationData = {
        title: remoteMessage.notification?.title || '專注提醒',
        body: remoteMessage.notification?.body || '',
        type: this.parseNotificationType(remoteMessage.data?.type),
        data: remoteMessage.data,
      };

      // 背景訊息處理邏輯
      this.handleBackgroundNotification(notification);
    });
  }

  /**
   * 設定通知開啟處理器
   */
  private setupNotificationOpenedHandler(): void {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('通知被開啟:', remoteMessage);

      const notification: NotificationData = {
        title: remoteMessage.notification?.title || '專注提醒',
        body: remoteMessage.notification?.body || '',
        type: this.parseNotificationType(remoteMessage.data?.type),
        data: remoteMessage.data,
      };

      if (this.onNotificationOpened) {
        this.onNotificationOpened(notification);
      }
    });

    // 檢查應用程式是否從通知啟動
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('應用程式從通知啟動:', remoteMessage);

          const notification: NotificationData = {
            title: remoteMessage.notification?.title || '專注提醒',
            body: remoteMessage.notification?.body || '',
            type: this.parseNotificationType(remoteMessage.data?.type),
            data: remoteMessage.data,
          };

          if (this.onNotificationOpened) {
            this.onNotificationOpened(notification);
          }
        }
      });
  }

  /**
   * 解析通知類型
   */
  private parseNotificationType(type?: string): NotificationData['type'] {
    switch (type) {
      case 'break_reminder':
        return 'break_reminder';
      case 'distraction_alert':
        return 'distraction_alert';
      case 'focus_reminder':
        return 'focus_reminder';
      default:
        return 'focus_reminder';
    }
  }

  /**
   * 處理背景通知
   */
  private handleBackgroundNotification(notification: NotificationData): void {
    // 背景通知處理邏輯
    // 可以發送本地通知或更新應用程式狀態
    console.log('處理背景通知:', notification);
  }

  /**
   * 設定通知接收回調
   */
  setOnNotificationReceived(
    callback: (notification: NotificationData) => void,
  ): void {
    this.onNotificationReceived = callback;
  }

  /**
   * 設定通知開啟回調
   */
  setOnNotificationOpened(
    callback: (notification: NotificationData) => void,
  ): void {
    this.onNotificationOpened = callback;
  }

  /**
   * 獲取當前 FCM Token
   */
  getCurrentFCMToken(): FCMToken | undefined {
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

  /**
   * 檢查通知權限狀態
   */
  async checkNotificationPermission(): Promise<boolean> {
    try {
      const authStatus = await messaging().hasPermission();
      return authStatus === messaging.AuthorizationStatus.AUTHORIZED;
    } catch (error) {
      console.error('檢查通知權限失敗:', error);
      return false;
    }
  }
}

export const notificationService = new NotificationService();
