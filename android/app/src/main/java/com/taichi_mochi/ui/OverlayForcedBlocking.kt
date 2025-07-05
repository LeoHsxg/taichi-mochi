package com.taichi_mochi.ui

import android.content.Context
import android.graphics.Color
import android.view.Gravity
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView

class OverlayForcedBlocking(
    context: Context, 
    message: String, 
    onButtonClick: (() -> Unit)? = null
) : LinearLayout(context) {
    init {
        layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
        
        orientation = VERTICAL
        setBackgroundColor(Color.parseColor("#FF0000")) // 紅色全螢幕阻擋
        gravity = Gravity.CENTER
        setPadding(60, 60, 60, 60)

        val messageView = TextView(context)
        messageView.text = message
        messageView.textSize = 28f
        messageView.setTextColor(Color.WHITE)
        messageView.gravity = Gravity.CENTER
        messageView.setPadding(0, 0, 0, 60)
        addView(messageView)

        val button = Button(context)
        button.text = "回到 Mochi App"
        button.textSize = 20f
        button.setPadding(60, 20, 60, 20)
        button.setOnClickListener {
            onButtonClick?.invoke()
        }
        addView(button)
    }
}