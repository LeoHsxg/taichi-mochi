# FCM 與 Overlay 彈窗整合說明

## 功能概述

當 Mochi 應用程式在後台時，可以透過 FCM (Firebase Cloud Messaging) 接收訊息並顯示三種不同類型的彈窗：

1. **自我宣告彈窗** (type1) - 半透明白色背景，提醒使用者專注
2. **GIF 循環彈窗** (type2) - 顯示 GIF 動畫，吸引注意力
3. **強制阻擋彈窗** (type3) - 紅色全螢幕阻擋，強制使用者回到應用程式

## FCM 訊息格式

### 觸發 Overlay 彈窗的訊息格式

```json
{
  "data": {
    "show_overlay": "true",
    "overlay_type": "type1", // "type1", "type2", 或 "type3"
    "overlay_message": "專注時間到！該休息了！",
    "gif_url": "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" // 僅 type2 需要
  }
}
```

### 參數說明

- `show_overlay`: 設為 "true" 時會觸發彈窗顯示
- `overlay_type`:
  - `"type1"`: 自我宣告彈窗
  - `"type2"`: GIF 循環彈窗
  - `"type3"`: 強制阻擋彈窗
- `overlay_message`: 彈窗中顯示的文字訊息
- `gif_url`: 僅在 `overlay_type` 為 `"type2"` 時需要，指定要顯示的 GIF 網址

### 一般通知訊息格式

```json
{
  "data": {
    "title": "通知標題",
    "body": "通知內容"
  }
}
```

## 使用範例

### 1. 發送自我宣告彈窗

```json
{
  "data": {
    "show_overlay": "true",
    "overlay_type": "type1",
    "overlay_message": "專注時間結束！該休息一下了。"
  }
}
```

### 2. 發送 GIF 循環彈窗

```json
{
  "data": {
    "show_overlay": "true",
    "overlay_type": "type2",
    "overlay_message": "休息時間到！",
    "gif_url": "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"
  }
}
```

### 3. 發送強制阻擋彈窗

```json
{
  "data": {
    "show_overlay": "true",
    "overlay_type": "type3",
    "overlay_message": "請回到 Mochi 應用程式繼續專注！"
  }
}
```

## 權限要求

應用程式需要以下權限才能正常顯示彈窗：

1. `SYSTEM_ALERT_WINDOW` - 顯示在其他應用程式上層的權限
2. `POST_NOTIFICATIONS` - 發送通知的權限 (Android 13+)

## 錯誤處理

如果無法顯示彈窗（例如權限不足），系統會自動發送通知作為備用方案。

## 測試方法

1. 確保應用程式已安裝並授予必要權限
2. 將應用程式放到後台
3. 透過 Firebase Console 或 API 發送測試訊息
4. 觀察彈窗是否正確顯示

## 注意事項

- 彈窗會顯示在所有其他應用程式之上
- 使用者可以點擊按鈕關閉彈窗
- 強制阻擋彈窗 (type3) 會自動啟動 Mochi 應用程式
- 如果沒有 `SYSTEM_ALERT_WINDOW` 權限，會顯示通知要求使用者授予權限
