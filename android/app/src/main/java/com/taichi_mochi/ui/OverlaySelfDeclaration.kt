package com.taichi_mochi.ui

import android.content.Context
import android.graphics.Color
import android.view.Gravity
import android.view.View
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView

class OverlaySelfDeclaration(
    context: Context, 
    message: String, 
    onButtonClick: (() -> Unit)? = null
) : LinearLayout(context) {
    init {
        layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
        
        orientation = VERTICAL
        setBackgroundColor(0x88FFFFFF.toInt())
        gravity = Gravity.CENTER
        setPadding(60, 60, 60, 60)

        val titleView = TextView(context)
        titleView.text = "專注提醒"
        titleView.textSize = 32f
        titleView.setTextColor(Color.parseColor("#333333"))
        titleView.gravity = Gravity.CENTER
        titleView.setPadding(0, 0, 0, 40)
        addView(titleView)

        val messageView = TextView(context)
        messageView.text = message
        messageView.textSize = 20f
        messageView.setTextColor(Color.parseColor("#666666"))
        messageView.gravity = Gravity.CENTER
        messageView.setPadding(0, 0, 0, 60)
        addView(messageView)

        val button = Button(context)
        button.text = "繼續使用"
        button.textSize = 18f
        button.setPadding(60, 20, 60, 20)
        button.setOnClickListener {
            onButtonClick?.invoke()
        }
        addView(button)
    }
} 