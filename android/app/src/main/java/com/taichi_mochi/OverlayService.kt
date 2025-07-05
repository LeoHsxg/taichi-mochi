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
import com.taichi_mochi.ui.OverlayForcedBlocking
import com.taichi_mochi.ui.OverlayGifLooping
import com.taichi_mochi.ui.OverlaySelfDeclaration

class OverlayService : Service() {
    private var windowManager: WindowManager? = null    // 系統的 WindowManager，用來插入與移除 overlay
    private var overlayView: View? = null               // 當前正在顯示的 overlay View

    override fun onBind(intent: Intent?): IBinder? = null   // 不提供 bind 功能

    override fun onCreate() {
        super.onCreate()
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
        Log.d("OverlayService", "Service created")
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.d("OverlayService", "onStartCommand called")
        
        // 如果已經有 overlayView，則返回
        if (overlayView != null) {
            Log.d("OverlayService", "Overlay already exists, returning")
            return START_STICKY
        }

        // 取得 intent 中的參數
        val type = intent?.getStringExtra("type") ?: "type1"
        val message = intent?.getStringExtra("message") ?: "專注時間到！"
        val gifUrl = intent?.getStringExtra("gifUrl")

        // 根據 type 參數建立對應的 overlayView，並傳入按鈕點擊後的 callback
        overlayView = when (type) {
            "type1" -> OverlaySelfDeclaration(this, message) {
                // 只關閉 overlay，讓使用者繼續使用
                stopSelf()
            }
            "type2" -> OverlayGifLooping(this, gifUrl ?: "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif") {
                stopSelf()
            }
            "type3" -> OverlayForcedBlocking(this, message) {
                // 強制導回 app
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
            else -> OverlaySelfDeclaration(this, message) {
                // 強制導回 app
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
        }

        // 設定全螢幕視窗參數
        val params = WindowManager.LayoutParams(
            // WindowManager.LayoutParams.WRAP_CONTENT,    // 寬度包裹內容
            // WindowManager.LayoutParams.WRAP_CONTENT,    // 高度包裹內容
            WindowManager.LayoutParams.MATCH_PARENT,    // 充滿寬度
            WindowManager.LayoutParams.MATCH_PARENT,    // 充滿高度
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O)
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY  // 使用 OVERLAY 類型
            else
                WindowManager.LayoutParams.TYPE_PHONE,
            // flag 設定：
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or   // 不獲取焦點
            WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or // 在螢幕內顯示
            WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,  // 不限制大小
            PixelFormat.TRANSLUCENT
        )
        // 螢幕填滿時，不會有 gravity 設定
        // params.gravity = Gravity.TOP or Gravity.LEFT

        // 嘗試將 overlayView 添加到 WindowManager
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