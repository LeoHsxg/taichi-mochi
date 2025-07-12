package com.taichi_mochi

import android.app.*
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

// 前景服務：持續運行並處理 FCM 訊息來開啟對應的彈窗
class ForegroundMonitorService : Service() {
    
    companion object {
        private const val TAG = "ForegroundMonitorService"
        private const val NOTIFICATION_ID = 1001
        private const val CHANNEL_ID = "foreground_monitor_channel"
        private const val CHANNEL_NAME = "前景監控服務"
        private const val CHANNEL_DESCRIPTION = "持續監控並處理 FCM 訊息"
        
        // 檢查服務是否正在運行
        fun isRunning(): Boolean {
            return instance != null
        }
        
        private var instance: ForegroundMonitorService? = null
        fun getInstance(): ForegroundMonitorService? = instance
    }
    
    private lateinit var fcmReceiver: FCMReceiver
    
    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        instance = this
        Log.d(TAG, "前景服務已創建")
        
        // 創建通知頻道
        createNotificationChannel()
        
        // 註冊 FCM 接收器
        registerFCMReceiver()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.d(TAG, "前景服務已啟動")
        
        // 啟動前景服務
        startForeground(NOTIFICATION_ID, createNotification())
        
        // 處理啟動參數
        intent?.let { handleIntent(it) }
        
        return START_STICKY
    }
    
    override fun onDestroy() {
        super.onDestroy()
        Log.d(TAG, "前景服務已銷毀")
        instance = null
        
        // 取消註冊 FCM 接收器
        unregisterFCMReceiver()
    }
    
    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                CHANNEL_NAME,
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = CHANNEL_DESCRIPTION
                setShowBadge(false)
                enableLights(false)
                enableVibration(false)
            }
            
            val notificationManager = getSystemService(NotificationManager::class.java)
            notificationManager.createNotificationChannel(channel)
        }
    }
    
    private fun createNotification(): Notification {
        val intent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
        
        val pendingIntent = PendingIntent.getActivity(
            this, 0, intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("太極麻糬")
            .setContentText("正在監控專注狀態")
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .setAutoCancel(false)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()
    }
    
    private fun registerFCMReceiver() {
        fcmReceiver = FCMReceiver()
        val filter = IntentFilter("com.google.firebase.MESSAGING_EVENT")
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(fcmReceiver, filter, Context.RECEIVER_NOT_EXPORTED)
        } else {
            registerReceiver(fcmReceiver, filter)
        }
        Log.d(TAG, "FCM 接收器已註冊")
    }
    
    private fun unregisterFCMReceiver() {
        try {
            unregisterReceiver(fcmReceiver)
            Log.d(TAG, "FCM 接收器已取消註冊")
        } catch (e: Exception) {
            Log.e(TAG, "取消註冊 FCM 接收器失敗", e)
        }
    }
    
    fun handleIntent(intent: Intent) {
        // 處理從 FCM 或其他來源傳來的參數
        val showOverlay = intent.getBooleanExtra("show_overlay", false)
        val overlayType = intent.getStringExtra("overlay_type") ?: "type1"
        val overlayMessage = intent.getStringExtra("overlay_message") ?: "專注時間到！"
        val gifUrl = intent.getStringExtra("gif_url")
        
        if (showOverlay) {
            startOverlayService(overlayType, overlayMessage, gifUrl)
        }
    }
    
    private fun startOverlayService(type: String, message: String, gifUrl: String? = null) {
        try {
            val intent = Intent(this, OverlayService::class.java).apply {
                putExtra("type", type)
                putExtra("message", message)
                if (gifUrl != null) {
                    putExtra("gifUrl", gifUrl)
                }
            }
            Log.d(TAG, "準備啟動 OverlayService, type=$type, message=$message, gifUrl=$gifUrl")
            
            // 檢查是否有 SYSTEM_ALERT_WINDOW 權限
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                if (android.provider.Settings.canDrawOverlays(this)) {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        Log.d(TAG, "使用 startForegroundService 啟動 OverlayService")
                        startForegroundService(intent)
                    } else {
                        Log.d(TAG, "使用 startService 啟動 OverlayService")
                        startService(intent)
                    }
                } else {
                    Log.w(TAG, "SYSTEM_ALERT_WINDOW permission not granted")
                    // 如果沒有權限，發送通知作為備用
                    sendFallbackNotification("需要權限", "請授予顯示在其他應用程式上層的權限")
                }
            } else {
                Log.d(TAG, "使用 startService 啟動 OverlayService")
                startService(intent)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to start overlay service", e)
            // 如果啟動失敗，發送通知作為備用
            sendFallbackNotification("彈窗啟動失敗", "無法顯示專注提醒彈窗")
        }
    }
    
    private fun sendFallbackNotification(title: String, body: String) {
        val notificationManager = getSystemService(NotificationManager::class.java)
        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle(title)
            .setContentText(body)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .build()
        
        notificationManager.notify(NOTIFICATION_ID + 1, notification)
    }
    
    // FCM 接收器內部類別
    inner class FCMReceiver : android.content.BroadcastReceiver() {
        override fun onReceive(context: android.content.Context?, intent: android.content.Intent?) {
            Log.d(TAG, "收到 FCM 廣播")
            
            // 這裡可以處理 FCM 訊息
            // 實際的 FCM 處理邏輯會在 MyFirebaseMessagingService 中進行
            // 前景服務主要負責持續運行和提供穩定的環境
        }
    }
}
