package com.taichi_mochi

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.media.RingtoneManager
import android.net.Uri
import android.os.Build
import androidx.core.app.NotificationCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import android.util.Log

class MyFirebaseMessagingService : FirebaseMessagingService() {

    companion object {
        private const val CHANNEL_ID = "taichi_mochi_channel"
        private const val CHANNEL_NAME = "Taichi Mochi Notifications"
        private const val CHANNEL_DESCRIPTION = "Notifications for Taichi Mochi app"
    }

    /**
     * 當 FCM 分配或刷新 Token 時被呼叫
     */
    override fun onNewToken(token: String) {
        super.onNewToken(token)
        // 將新的 FCM token 發送到 React Native
        sendTokenToReactNative(token)
    }

    /**
     * 收到 FCM 訊息時進行處理
     */
    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)
        
        Log.d("FCM", "Message received: ${remoteMessage.data}")
        
        // 取得 data 中的值並檢查是否要顯示 overlay
        val showOverlay = remoteMessage.data["show_overlay"]?.toBoolean() ?: false
        val overlayType = remoteMessage.data["overlay_type"] ?: "type1"
        val overlayMessage = remoteMessage.data["overlay_message"] ?: "專注時間到！"
        if (showOverlay) {
            // 僅透過前景服務啟動 overlay
            if (ForegroundMonitorService.isRunning()) {
                Log.d("FCM", "前景服務正在運行，透過前景服務啟動 overlay")
                startOverlayViaForegroundService(overlayType, overlayMessage)
            } else {
                Log.d("FCM", "前景服務未運行，overlay 啟動失敗")
            }
        }
        
        // 處理收到的訊息 - 仍然發送通知作為備用
        remoteMessage.notification?.let { notification ->
            sendNotification(notification.title, notification.body)
        }
        
        // 處理資料訊息
        if (remoteMessage.data.isNotEmpty() && !showOverlay) {
            val title = remoteMessage.data["title"] ?: "新訊息"
            val body = remoteMessage.data["body"] ?: "您有新的通知"
            sendNotification(title, body)
        }
    }

    /**
     * 透過前景服務啟動 Overlay
     */
    private fun startOverlayViaForegroundService(type: String, message: String) {
        try {
            val foregroundService = ForegroundMonitorService.getInstance()
            if (foregroundService != null) {
                val intent = Intent().apply {
                    putExtra("show_overlay", true)
                    putExtra("overlay_type", type)
                    putExtra("overlay_message", message)
                }
                foregroundService.handleIntent(intent)
                Log.d("FCM", "透過前景服務啟動 overlay 成功")
            } else {
                Log.w("FCM", "前景服務實例為空，overlay 啟動失敗")
            }
        } catch (e: Exception) {
            Log.e("FCM", "透過前景服務啟動 overlay 失敗", e)
        }
    }

    /**
     * 手搓一則 Android 系統通知
     * 通常是通知無法顯示或 App 在前景時需要呼叫此方法
     */ 
    private fun sendNotification(title: String?, body: String?) {
        val intent = Intent(this, MainActivity::class.java)
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
        
        val pendingIntent = PendingIntent.getActivity(
            this, 0, intent,
            PendingIntent.FLAG_ONE_SHOT or PendingIntent.FLAG_IMMUTABLE
        )

        val defaultSoundUri: Uri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
        
        val notificationBuilder = NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle(title)
            .setContentText(body)
            .setAutoCancel(true)
            .setSound(defaultSoundUri)
            .setContentIntent(pendingIntent)

        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        // 為 Android 8.0+ 創建通知頻道
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                CHANNEL_NAME,
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = CHANNEL_DESCRIPTION
            }
            notificationManager.createNotificationChannel(channel)
        }

        notificationManager.notify(0, notificationBuilder.build())
    }

    /**
     * 將 FCM token 發送到 React Native
     */
    private fun sendTokenToReactNative(token: String) {
        // 這裡可以將 token 發送到 React Native 端
        // 可以通過 EventEmitter 或其他方式
        // 暫時先記錄到 log
        android.util.Log.d("FCM", "New token: $token")
    }
} 