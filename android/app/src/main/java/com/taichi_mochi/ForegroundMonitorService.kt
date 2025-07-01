package com.taichi_mochi

import android.app.*
import android.content.Intent
import android.os.Build
import android.os.IBinder

// 使用前台服務 + UsageStats 輪詢前景 App，並透過 Broadcast/Callback 回傳 JS
// 因為太耗電，現已全面替換為使用 AccessibilityService 的 AppWatcherService.kt
// NEED TO UNDERSTAND
class ForegroundMonitorService : Service() {
    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                "focus_monitor",
                "Focus Monitor",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
            val notification = Notification.Builder(this, "focus_monitor")
                .setContentTitle("Focus Monitor")
                .setContentText("正在監控前景應用程式")
                .setSmallIcon(android.R.drawable.ic_menu_info_details)
                .build()
            startForeground(1, notification)
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // 這裡可以定時查詢前景 App，並透過 Broadcast/Callback 回傳 JS
        // 你可以用 Handler.postDelayed 或 Timer
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        stopForeground(true)
    }
}
