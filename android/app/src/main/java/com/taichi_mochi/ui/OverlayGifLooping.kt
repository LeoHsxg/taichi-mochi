package com.taichi_mochi.ui

import android.content.Context
import android.graphics.Color
import android.view.Gravity
import android.widget.Button
import android.widget.ImageView
import android.widget.LinearLayout
import com.bumptech.glide.Glide

class OverlayGifLooping(
    context: Context, 
    onButtonClick: (() -> Unit)? = null
) : LinearLayout(context) {
    init {
        layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
        
        orientation = VERTICAL
        setBackgroundColor(0xCC000000.toInt()) // 半透明黑色背景
        gravity = Gravity.CENTER
        setPadding(0, 0, 0, 0) // 移除 padding 讓 GIF 可以全屏顯示

        val imageView = ImageView(context)
        val imageParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT) // 讓圖片填滿整個螢幕
        imageView.layoutParams = imageParams
        imageView.scaleType = ImageView.ScaleType.CENTER_CROP // 使用 CENTER_CROP 讓圖片填滿螢幕
        // 使用 Glide 載入本地的 mochi_jumping.GIF
        Glide.with(context)
            .asGif()
            .load("file:///android_asset/mochi/mochi_jumping.GIF")
            .into(imageView)
        addView(imageView)

        val button = Button(context)
        button.text = "關閉 Overlay"
        button.textSize = 20f
        button.setPadding(60, 20, 60, 20)
        
        // 為按鈕設置佈局參數，讓它浮在 GIF 上方
        val buttonParams = LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT)
        buttonParams.gravity = Gravity.CENTER_HORIZONTAL or Gravity.BOTTOM
        buttonParams.bottomMargin = 50 // 距離底部的間距
        button.layoutParams = buttonParams
        
        button.setOnClickListener {
            onButtonClick?.invoke()
        }
        addView(button)
    }
} 