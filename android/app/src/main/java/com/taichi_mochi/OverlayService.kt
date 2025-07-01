package com.taichi_mochi

import android.app.Service
import android.content.Intent
import android.graphics.PixelFormat
import android.os.IBinder
import android.view.*
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import android.util.Log

class OverlayService : Service() {
    private var windowManager: WindowManager? = null
    private var overlayView: View? = null

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
        Log.d("OverlayService", "Service created")
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.d("OverlayService", "onStartCommand called")
        
        if (overlayView != null) {
            Log.d("OverlayService", "Overlay already exists, returning")
            return START_STICKY
        }

        val message = intent?.getStringExtra("message") ?: "專注時間到！"
        
        // 創建全螢幕白色背景的佈局
        val layout = LinearLayout(this)
        layout.orientation = LinearLayout.VERTICAL
        layout.setBackgroundColor(0x88FFFFFF.toInt()) // 純白色背景
        layout.gravity = Gravity.CENTER
        layout.setPadding(60, 60, 60, 60)
        
        // 添加標題文字
        val titleView = TextView(this)
        titleView.text = "專注提醒"
        titleView.textSize = 32f
        titleView.setTextColor(0xFF333333.toInt())
        titleView.gravity = Gravity.CENTER
        titleView.setPadding(0, 0, 0, 40)
        layout.addView(titleView)
        
        // 添加訊息文字
        val messageView = TextView(this)
        messageView.text = message
        messageView.textSize = 20f
        messageView.setTextColor(0xFF666666.toInt())
        messageView.gravity = Gravity.CENTER
        messageView.setPadding(0, 0, 0, 60)
        layout.addView(messageView)

        // 添加跳轉按鈕
        val button = Button(this)
        button.text = "回到 Mochi App"
        button.textSize = 18f
        button.setPadding(60, 20, 60, 20)
        button.setOnClickListener {
            Log.d("OverlayService", "Button clicked, launching app")
            val launchIntent = packageManager.getLaunchIntentForPackage(packageName)
            if (launchIntent != null) {
                launchIntent.addFlags(
                Intent.FLAG_ACTIVITY_NEW_TASK or 
                Intent.FLAG_ACTIVITY_CLEAR_TOP or
                Intent.FLAG_ACTIVITY_REORDER_TO_FRONT
                )
                startActivity(launchIntent)
            }
            stopSelf()
        }
        layout.addView(button)

        // 設定全螢幕視窗參數
        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT, // 全螢幕寬度
            WindowManager.LayoutParams.WRAP_CONTENT, // 全螢幕高度
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O)
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            else
                WindowManager.LayoutParams.TYPE_PHONE,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or 
            WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or
            WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
            PixelFormat.TRANSLUCENT
        )
        params.gravity = Gravity.TOP or Gravity.LEFT

        overlayView = layout
        try {
            windowManager?.addView(overlayView, params)
            Log.d("OverlayService", "Overlay view added successfully")
        } catch (e: Exception) {
            Log.e("OverlayService", "Failed to add overlay view", e)
        }
        
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        Log.d("OverlayService", "Service destroying")
        if (overlayView != null) {
            try {
                windowManager?.removeView(overlayView)
                Log.d("OverlayService", "Overlay view removed")
            } catch (e: Exception) {
                Log.e("OverlayService", "Failed to remove overlay view", e)
            }
            overlayView = null
        }
    }
}