# FCM (Firebase Cloud Messaging) 整合說明

## 概述

本專案已成功整合 Firebase Cloud Messaging (FCM) 來處理推送通知功能。FCM 允許您向 Android 應用程式發送通知，無論應用程式是在前景、背景還是終止狀態。

## 已完成的整合

### 1. Android 原生整合

#### 檔案結構

- `android/app/google-services.json` - Firebase 配置檔案
- `android/app/src/main/java/com/taichi_mochi/MyFirebaseMessagingService.kt` - 自定義 FCM 服務
- `android/app/src/main/AndroidManifest.xml` - 已配置 FCM 服務

#### 功能

- 自動處理 FCM token 生成和更新
- 處理前景和背景通知
- 創建通知頻道 (Android 8.0+)
- 處理通知點擊事件

### 2. React Native 整合

#### 檔案結構

- `src/services/FCMService.ts` - FCM 服務類別
- `src/screens/FCMTestScreen.tsx` - FCM 測試頁面

#### 功能

- 請求通知權限
- 獲取和管理 FCM token
- 處理前景訊息
- 訂閱/取消訂閱主題
- 處理通知點擊導航

## 使用方法

### 1. 初始化 FCM

FCM 服務會在應用程式啟動時自動初始化：

```typescript
// 在 App.tsx 中已自動初始化
const fcmService = FCMService.getInstance();
await fcmService.initialize();
```

### 2. 獲取 FCM Token

```typescript
const fcmService = FCMService.getInstance();
const token = fcmService.getToken();
console.log('FCM Token:', token);
```

### 3. 訂閱主題

```typescript
const fcmService = FCMService.getInstance();
await fcmService.subscribeToTopic('news');
await fcmService.subscribeToTopic('updates');
```

### 4. 取消訂閱主題

```typescript
const fcmService = FCMService.getInstance();
await fcmService.unsubscribeFromTopic('news');
```

## 測試 FCM 功能

### 1. 使用 FCM 測試頁面

應用程式包含一個專門的 FCM 測試頁面，您可以：

1. 查看 FCM 初始化狀態
2. 複製 FCM token
3. 訂閱/取消訂閱測試主題
4. 測試本地通知

### 2. 使用 Firebase Console

1. 登入 [Firebase Console](https://console.firebase.google.com/)
2. 選擇您的專案
3. 前往 "Messaging" 頁面
4. 發送測試通知

### 3. 使用 FCM API

您可以使用 FCM HTTP v1 API 發送通知：

```bash
curl -X POST -H "Authorization: Bearer YOUR_SERVER_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "message": {
         "token": "DEVICE_FCM_TOKEN",
         "notification": {
           "title": "測試通知",
           "body": "這是一個測試通知"
         },
         "data": {
           "screen": "FCMTestScreen",
           "type": "test"
         }
       }
     }' \
     https://fcm.googleapis.com/v1/projects/YOUR_PROJECT_ID/messages:send
```

## 通知處理

### 1. 前景通知

當應用程式在前景時，通知會通過 `onMessage` 事件處理：

```typescript
messaging().onMessage(async remoteMessage => {
  console.log('收到前景訊息:', remoteMessage);
  // 處理前景通知
});
```

### 2. 背景/終止狀態通知

當應用程式在背景或終止狀態時，通知會通過系統通知顯示，點擊後會觸發相應的事件。

### 3. 通知點擊處理

```typescript
// 從背景狀態打開通知
messaging().onNotificationOpenedApp(remoteMessage => {
  console.log('從背景狀態打開通知:', remoteMessage);
  // 導航到相應頁面
});

// 從終止狀態啟動應用
messaging()
  .getInitialNotification()
  .then(remoteMessage => {
    if (remoteMessage) {
      console.log('從終止狀態啟動應用:', remoteMessage);
      // 導航到相應頁面
    }
  });
```

## 權限要求

### Android 權限

應用程式需要以下權限：

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

### 通知權限

應用程式會在首次啟動時請求通知權限。用戶可以隨時在系統設定中管理通知權限。

## 故障排除

### 1. 常見問題

**Q: 收不到通知**
A: 檢查以下項目：

- 確認應用程式有通知權限
- 確認 FCM token 正確
- 確認 Firebase 配置正確
- 檢查網路連接

**Q: 通知不顯示**
A: 檢查以下項目：

- 確認通知頻道已創建
- 確認通知權限已授予
- 檢查應用程式是否在背景模式

**Q: Token 為空**
A: 檢查以下項目：

- 確認 Google Play Services 已安裝
- 確認網路連接正常
- 重新初始化 FCM 服務

### 2. 日誌檢查

使用以下命令查看 FCM 相關日誌：

```bash
adb logcat | grep -i fcm
adb logcat | grep -i firebase
```

### 3. 測試步驟

1. 確保應用程式已安裝並運行
2. 檢查 FCM token 是否生成
3. 使用 Firebase Console 發送測試通知
4. 檢查通知是否正確顯示
5. 測試通知點擊功能

## 進階功能

### 1. 自定義通知樣式

您可以修改 `MyFirebaseMessagingService.kt` 來自定義通知樣式：

```kotlin
val notificationBuilder = NotificationCompat.Builder(this, CHANNEL_ID)
    .setSmallIcon(R.mipmap.ic_launcher)
    .setContentTitle(title)
    .setContentText(body)
    .setAutoCancel(true)
    .setSound(defaultSoundUri)
    .setContentIntent(pendingIntent)
    .setPriority(NotificationCompat.PRIORITY_HIGH) // 設置優先級
    .setVibrate(longArrayOf(1000, 1000, 1000)) // 設置震動
```

### 2. 處理資料訊息

除了通知訊息，您還可以處理資料訊息：

```typescript
messaging().onMessage(async remoteMessage => {
  if (remoteMessage.data) {
    // 處理資料訊息
    const { type, value } = remoteMessage.data;
    switch (type) {
      case 'update_ui':
        // 更新 UI
        break;
      case 'sync_data':
        // 同步資料
        break;
    }
  }
});
```

### 3. 群組通知

您可以將多個通知分組：

```kotlin
val notificationBuilder = NotificationCompat.Builder(this, CHANNEL_ID)
    .setGroup("group_key")
    .setGroupSummary(true)
```

## 注意事項

1. **Token 更新**: FCM token 可能會定期更新，請確保您的後端系統能夠處理 token 更新。

2. **網路依賴**: FCM 需要網路連接才能正常工作。

3. **電池優化**: 某些 Android 設備的電池優化可能會影響 FCM 的可靠性。

4. **測試環境**: 建議在真實設備上測試 FCM 功能，模擬器可能無法正常接收通知。

5. **版本相容性**: 確保使用的 Firebase 版本與 React Native 版本相容。

## 相關資源

- [Firebase Cloud Messaging 官方文檔](https://firebase.google.com/docs/cloud-messaging)
- [React Native Firebase 文檔](https://rnfirebase.io/messaging/usage)
- [FCM HTTP v1 API 文檔](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages)
