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

class MyFirebaseMessagingService : FirebaseMessagingService() {

    companion object {
        private const val CHANNEL_ID = "taichi_mochi_channel"
        private const val CHANNEL_NAME = "Taichi Mochi Notifications"
        private const val CHANNEL_DESCRIPTION = "Notifications for Taichi Mochi app"
    }

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        // 將新的 FCM token 發送到 React Native
        sendTokenToReactNative(token)
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)
        
        // 處理收到的訊息
        remoteMessage.notification?.let { notification ->
            sendNotification(notification.title, notification.body)
        }
        
        // 處理資料訊息
        remoteMessage.data.isNotEmpty().let {
            val title = remoteMessage.data["title"] ?: "新訊息"
            val body = remoteMessage.data["body"] ?: "您有新的通知"
            sendNotification(title, body)
        }
    }

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
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = CHANNEL_DESCRIPTION
            }
            notificationManager.createNotificationChannel(channel)
        }

        notificationManager.notify(0, notificationBuilder.build())
    }

    private fun sendTokenToReactNative(token: String) {
        // 這裡可以將 token 發送到 React Native 端
        // 可以通過 EventEmitter 或其他方式
        // 暫時先記錄到 log
        android.util.Log.d("FCM", "New token: $token")
    }
} 