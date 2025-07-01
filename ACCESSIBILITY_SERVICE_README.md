# AccessibilityService 前景應用程式監控

## 概述

本專案已整合 AccessibilityService 來監控前景應用程式狀態，提供更即時和可靠的應用程式切換偵測功能。

## 功能特點

### 1. 即時監控

- 使用 Android AccessibilityService 監控前景應用程式變更
- 當使用者切換到其他應用程式時立即觸發事件
- 比傳統的輪詢方式更有效率且更準確

### 2. 雙重保障

- 優先使用 AccessibilityService 進行監控
- 如果 AccessibilityService 未啟用，自動降級到傳統的前景服務監控
- 確保在不同權限狀態下都能正常運作

### 3. 事件驅動

- 透過 React Native 事件系統發送應用程式變更通知
- 支援即時回調處理
- 減少不必要的輪詢開銷

## 設定步驟

### 1. 啟用無障礙服務

1. 開啟應用程式
2. 進入權限設定畫面
3. 點擊「無障礙服務」的「開啟設定」按鈕
4. 在系統設定中找到「taichi_mochi」
5. 啟用無障礙服務
6. 返回應用程式，權限狀態會自動更新

### 2. 程式碼使用範例

```typescript
import { appMonitorService } from './src/services/AppMonitorService';

// 設定干擾應用程式清單
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
]);

// 設定干擾應用程式偵測回調
appMonitorService.setOnDistractingAppDetected(appInfo => {
  console.log('偵測到干擾應用程式:', appInfo.appName);
  // 顯示提醒視窗或執行其他操作
});

// 開始監控
await appMonitorService.startMonitoring();

// 檢查無障礙服務狀態
const isEnabled = await appMonitorService.checkAccessibilityService();
console.log('無障礙服務狀態:', isEnabled);

// 停止監控
appMonitorService.stopMonitoring();
```

## 技術架構

### Android 端

#### AppWatcherService.kt

- 繼承 `AccessibilityService`
- 監聽 `TYPE_WINDOW_STATE_CHANGED` 和 `TYPE_WINDOW_CONTENT_CHANGED` 事件
- 透過 React Native 事件系統發送應用程式變更通知

#### FocusNativeModule.kt

- 提供無障礙服務相關的 JavaScript 介面
- 支援檢查服務狀態、啟動/停止監控
- 提供設定頁面跳轉功能

### React Native 端

#### AppMonitorService.ts

- 統一管理應用程式監控邏輯
- 支援 AccessibilityService 和傳統監控方式
- 提供事件監聽和回調處理

## 權限要求

### AndroidManifest.xml

```xml
<!-- 無障礙服務權限 -->
<uses-permission android:name="android.permission.BIND_ACCESSIBILITY_SERVICE"/>

<!-- 無障礙服務宣告 -->
<service
  android:name=".AppWatcherService"
  android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE"
  android:exported="false">
  <intent-filter>
    <action android:name="android.accessibilityservice.AccessibilityService"/>
  </intent-filter>
  <meta-data
    android:name="android.accessibilityservice"
    android:resource="@xml/accessibility_service_config"/>
</service>
```

### accessibility_service_config.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<accessibility-service
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:accessibilityEventTypes="typeWindowStateChanged|typeWindowContentChanged"
    android:accessibilityFeedbackType="feedbackGeneric"
    android:notificationTimeout="100"
    android:canRetrieveWindowContent="true"
    android:description="@string/accessibility_service_description"
    android:accessibilityFlags="flagReportViewIds"
/>
```

## 事件處理

### 前景應用程式變更事件

- 事件名稱：`onForegroundAppChanged`
- 事件資料：`packageName` (字串)
- 觸發時機：使用者切換到不同應用程式時

### 事件監聽範例

```typescript
import { NativeEventEmitter, NativeModules } from 'react-native';

const eventEmitter = new NativeEventEmitter(NativeModules.FocusNativeModule);
eventEmitter.addListener('onForegroundAppChanged', (packageName: string) => {
  console.log('前景應用程式變更:', packageName);
  // 處理應用程式變更邏輯
});
```

## 最佳實踐

### 1. 權限檢查

在開始監控前，務必檢查無障礙服務是否已啟用：

```typescript
const isEnabled = await appMonitorService.checkAccessibilityService();
if (!isEnabled) {
  // 引導使用者啟用無障礙服務
  appMonitorService.openAccessibilitySettings();
}
```

### 2. 錯誤處理

監控服務可能因為權限問題而失敗，建議加入錯誤處理：

```typescript
try {
  await appMonitorService.startMonitoring();
} catch (error) {
  console.error('啟動監控失敗:', error);
  // 顯示錯誤訊息或降級處理
}
```

### 3. 資源清理

在組件卸載時記得停止監控：

```typescript
useEffect(() => {
  appMonitorService.startMonitoring();

  return () => {
    appMonitorService.stopMonitoring();
  };
}, []);
```

## 注意事項

1. **權限要求**：無障礙服務需要使用者手動在系統設定中啟用
2. **電池優化**：AccessibilityService 不會被系統電池優化影響
3. **隱私保護**：服務只監控應用程式切換，不會收集其他資訊
4. **相容性**：支援 Android 4.4 (API 19) 及以上版本

## 故障排除

### 常見問題

1. **無障礙服務未啟用**

   - 檢查系統設定中的無障礙服務是否已啟用
   - 確認應用程式在無障礙服務清單中

2. **事件未觸發**

   - 確認服務已正確啟動
   - 檢查事件監聽器是否正確設定

3. **權限被撤銷**
   - 重新啟用無障礙服務
   - 檢查應用程式權限設定

### 除錯方法

1. 查看 Logcat 日誌中的 `AppWatcherService` 標籤
2. 使用 `appMonitorService.checkAccessibilityService()` 檢查服務狀態
3. 確認 AndroidManifest.xml 中的服務宣告正確

## 更新日誌

- **v1.0.0**: 初始版本，支援基本的 AccessibilityService 監控
- **v1.1.0**: 添加事件驅動架構和雙重保障機制
- **v1.2.0**: 優化效能和錯誤處理
