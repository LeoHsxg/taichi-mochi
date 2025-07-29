package com.taichi_mochi.ui

import android.content.Context
import android.graphics.Color
import android.view.Gravity
import android.view.View
import android.view.WindowManager
import android.widget.Button
import android.widget.FrameLayout
import android.widget.ImageView
import com.bumptech.glide.Glide

class OverlayGifLooping(
    context: Context, 
    onButtonClick: (() -> Unit)? = null
) {
    
    private val backgroundView: ImageView
    private val buttonView: Button
    private val windowManager: WindowManager = context.getSystemService(Context.WINDOW_SERVICE) as WindowManager
    
    init {
        // 創建背景 GIF view
        backgroundView = ImageView(context).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
            scaleType = ImageView.ScaleType.CENTER_CROP
            
            // 使用 Glide 載入本地的 mochi_jumping.GIF
            Glide.with(context)
                .asGif()
                .load("file:///android_asset/mochi/mochi_jumping.GIF")
                .into(this)
        }
        
        // 創建按鈕 view
        buttonView = Button(context).apply {
            text = "不要點這個按鈕"
            textSize = 12f
            setPadding(10, 10, 10, 10)
            setTextColor(Color.WHITE)
            
            // 移除背景和陰影
            setBackgroundColor(Color.TRANSPARENT)
            elevation = 0f

            setOnClickListener {
                onButtonClick?.invoke()
            }
        }
        
        android.util.Log.d("OverlayGifLooping", "背景和按鈕 view 已創建")
    }
    
    fun show() {
        try {
            // 創建背景 window 參數 - 完全不攔截觸控
            val backgroundParams = WindowManager.LayoutParams(
                WindowManager.LayoutParams.MATCH_PARENT,
                WindowManager.LayoutParams.MATCH_PARENT,
                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O)
                    WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
                else
                    WindowManager.LayoutParams.TYPE_PHONE,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or
                WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS or
                WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE, // 完全不攔截觸控
                android.graphics.PixelFormat.TRANSPARENT
            )
            
            // 創建按鈕 window 參數 - 按鈕可點，其他區域放行
            val buttonParams = WindowManager.LayoutParams(
                WindowManager.LayoutParams.WRAP_CONTENT,
                WindowManager.LayoutParams.WRAP_CONTENT,
                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O)
                    WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
                else
                    WindowManager.LayoutParams.TYPE_PHONE,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL, // 按鈕可點，其他區域放行
                android.graphics.PixelFormat.TRANSPARENT
            ).apply {
                gravity = Gravity.CENTER_HORIZONTAL or Gravity.BOTTOM
                y = 150 // 使用 y 偏移來設定距離底部的間距
            }
            
            // 添加背景 window
            windowManager.addView(backgroundView, backgroundParams)
            android.util.Log.d("OverlayGifLooping", "背景 window 已添加")
            
            // 添加按鈕 window
            windowManager.addView(buttonView, buttonParams)
            android.util.Log.d("OverlayGifLooping", "按鈕 window 已添加")
            
        } catch (e: Exception) {
            android.util.Log.e("OverlayGifLooping", "添加 window 失敗", e)
        }
    }
    
    fun hide() {
        try {
            // 移除背景 window
            windowManager.removeView(backgroundView)
            android.util.Log.d("OverlayGifLooping", "背景 window 已移除")
            
            // 移除按鈕 window
            windowManager.removeView(buttonView)
            android.util.Log.d("OverlayGifLooping", "按鈕 window 已移除")
            
        } catch (e: Exception) {
            android.util.Log.e("OverlayGifLooping", "移除 window 失敗", e)
        }
    }
} 