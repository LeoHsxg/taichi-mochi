This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

# FocusMonitorApp

一個專注於提升工作效率的 React Native 應用程式，結合 Pomodoro 計時器和應用程式監控功能。

## 🚀 功能特色

### ✅ 權限管理

- **使用情況存取權限**: 監控其他應用程式的使用情況
- **覆蓋其他應用程式權限**: 顯示浮動提醒視窗
- **通知權限**: 接收專注提醒和休息提醒

### ✅ Pomodoro 計時器

- 可自訂的工作時間、休息時間和長休息時間
- 自動切換工作/休息模式
- 進度顯示和會話計數
- 暫停/繼續/停止功能

### ✅ 應用程式監控

- 即時監控前景應用程式
- 偵測干擾應用程式（如 Instagram、YouTube 等）
- 自動顯示提醒視窗

### ✅ 浮動提醒視窗

- 使用 Android 原生 Overlay 功能
- 自訂提醒內容和按鈕
- 自動隱藏功能

### ✅ Firebase 推播通知

- 整合 Firebase Cloud Messaging (FCM)
- 支援前景和背景通知處理
- 伺服器端推播提醒

## 📱 技術架構

### 前端技術

- **React Native CLI** (非 Expo)
- **TypeScript**
- **React Hooks**

### 主要套件

- `@react-native-firebase/app` - Firebase 核心
- `@react-native-firebase/messaging` - FCM 推播通知
- `react-native-permissions` - 權限管理
- `react-native-device-info` - 裝置資訊
- `react-native-background-timer` - 背景計時器

### 專案結構

```
src/
├── components/          # 可重用組件
├── services/           # 業務邏輯服務
│   ├── PermissionService.ts
│   ├── AppMonitorService.ts
│   ├── OverlayService.ts
│   ├── PomodoroService.ts
│   └── NotificationService.ts
├── screens/            # 畫面組件
│   ├── PermissionScreen.tsx
│   └── PomodoroScreen.tsx
├── hooks/              # 自定義 Hooks
├── utils/              # 工具函數
└── types/              # TypeScript 類型定義
```

## 🔧 安裝與設定

### 前置需求

- Node.js >= 18
- React Native CLI
- Android Studio
- Android SDK

### 安裝步驟

1. **安裝依賴**

```bash
npm install
```

2. **Android 設定**

```bash
cd android
./gradlew clean
cd ..
```

3. **啟動 Metro**

```bash
npm start
```

4. **執行應用程式**

```bash
npm run android
```

### Firebase 設定

1. 在 Firebase Console 建立新專案
2. 下載 `google-services.json` 到 `android/app/` 目錄
3. 在 `android/build.gradle` 添加 Firebase 依賴
4. 在 `android/app/build.gradle` 應用 Firebase 插件

## 📋 權限說明

### Android 權限

- `PACKAGE_USAGE_STATS` - 監控應用程式使用情況
- `SYSTEM_ALERT_WINDOW` - 顯示浮動視窗
- `POST_NOTIFICATIONS` - 發送通知 (Android 13+)
- `FOREGROUND_SERVICE` - 前景服務
- `WAKE_LOCK` - 保持裝置喚醒

### 權限申請流程

1. 應用程式啟動時檢查權限狀態
2. 引導使用者開啟必要權限
3. 提供跳轉到系統設定的按鈕
4. 權限授權後自動進入主功能

## 🎯 使用方式

### 初次使用

1. 啟動應用程式
2. 按照提示開啟必要權限
3. 開始使用 Pomodoro 計時器

### Pomodoro 計時器

- 點擊「開始工作」開始 25 分鐘工作時段
- 工作結束後自動提醒休息
- 完成 4 個工作時段後進入長休息
- 可隨時暫停、繼續或停止計時器

### 應用程式監控

- 權限授權後自動開始監控
- 開啟干擾應用程式時顯示提醒
- 點擊「回到專注 App」返回應用程式

## 🔮 未來規劃

### 短期目標

- [ ] 實作原生 Android 模組
- [ ] 完善 Overlay 功能
- [ ] 添加統計分析功能
- [ ] 優化使用者介面

### 長期目標

- [ ] 支援 iOS 平台
- [ ] 添加雲端同步功能
- [ ] 實作 AI 智能提醒
- [ ] 社群功能

## 🛠️ 開發注意事項

### 原生模組需求

目前以下功能需要實作原生 Android 模組：

1. **UsageStatsManager API** - 獲取前景應用程式資訊
2. **WindowManager** - 顯示浮動視窗
3. **Foreground Service** - 背景監控服務

### 建議實作方式

- 使用 React Native 原生模組橋接
- 參考現有套件如 `react-native-usage-stats`
- 實作自定義 Overlay 服務

## 📄 授權

本專案採用 MIT 授權條款。

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📞 聯絡方式

如有問題或建議，請透過 GitHub Issues 聯絡。
