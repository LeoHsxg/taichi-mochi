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
    gifUrl: String,
    onButtonClick: (() -> Unit)? = null
) : LinearLayout(context) {
    init {
        layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
        
        orientation = VERTICAL
        setBackgroundColor(0xCC000000.toInt()) // 半透明黑色背景
        gravity = Gravity.CENTER
        setPadding(60, 60, 60, 60)

        val imageView = ImageView(context)
        val imageParams = LayoutParams(LayoutParams.MATCH_PARENT, 0, 1f) // 使用 weight 讓圖片佔用剩餘空間
        imageView.layoutParams = imageParams
        imageView.scaleType = ImageView.ScaleType.FIT_CENTER
        // 使用 Glide 載入 GIF
        Glide.with(context).asGif().load(gifUrl).into(imageView)
        addView(imageView)

        val button = Button(context)
        button.text = "關閉 Overlay"
        button.textSize = 20f
        button.setPadding(60, 20, 60, 20)
        
        // 為按鈕設置佈局參數，確保它有固定高度
        val buttonParams = LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT)
        buttonParams.gravity = Gravity.CENTER_HORIZONTAL
        buttonParams.topMargin = 20 // 在按鈕上方添加一些間距
        button.layoutParams = buttonParams
        
        button.setOnClickListener {
            onButtonClick?.invoke()
        }
        addView(button)
    }
} 