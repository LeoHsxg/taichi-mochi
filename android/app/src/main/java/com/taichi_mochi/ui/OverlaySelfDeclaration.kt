package com.taichi_mochi.ui

import android.content.Context
import android.graphics.Color
import android.graphics.Paint
import android.graphics.drawable.GradientDrawable
import android.view.Gravity
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import androidx.core.view.setPadding

class OverlaySelfDeclaration(
    context: Context,
    message: String,
    onButtonClick: (() -> Unit)? = null
) : LinearLayout(context) {
    private var isButtonClicked = false
    private lateinit var actionButton: Button

    // 固定顯示內容
    private val stats1 = "7 voluntary stops after initial reminder"
    private val stats2 = "2 system-enforced stops"
    private val encouragement = message
    private val buttonText = "I got this! Staying on track today 💪"

    init {
        layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
        orientation = VERTICAL
        setBackgroundColor(Color.parseColor("#444444"))
        gravity = Gravity.CENTER

        // Card container
        val card = LinearLayout(context)
        card.orientation = VERTICAL
        card.gravity = Gravity.CENTER
        card.setPadding(40)
        val cardParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT)
        cardParams.setMargins(60, 120, 60, 120)
        card.layoutParams = cardParams
        val cardBg = GradientDrawable()
        cardBg.cornerRadius = 40f
        cardBg.setColor(Color.parseColor("#444444"))
        cardBg.setStroke(0, Color.TRANSPARENT)
        card.background = cardBg
        card.elevation = 16f

        // 標題與說明
        val titleRow = LinearLayout(context)
        titleRow.orientation = HORIZONTAL
        titleRow.gravity = Gravity.CENTER_VERTICAL
        val title = TextView(context)
        title.text = "Hi, Matt."
        title.textSize = 20f
        title.setTextColor(Color.parseColor("#FF2D6A"))
        title.setPadding(0, 0, 10, 0)
        title.paint.isFakeBoldText = true
        val desc = TextView(context)
        desc.text = "Here's your yesterday's stats:"
        desc.textSize = 16f
        desc.setTextColor(Color.parseColor("#EEEEEE"))
        titleRow.addView(title)
        titleRow.addView(desc)
        card.addView(titleRow)

        // 第一行統計
        val stat1Row = LinearLayout(context)
        stat1Row.orientation = HORIZONTAL
        stat1Row.gravity = Gravity.CENTER_VERTICAL
        stat1Row.setPadding(0, 30, 0, 0)
        val stat1Bg = GradientDrawable()
        stat1Bg.cornerRadius = 16f
        stat1Bg.setColor(Color.parseColor("#E6005A7A"))
        val stat1 = TextView(context)
        stat1.text = "✔ $stats1"
        stat1.textSize = 16f
        stat1.setTextColor(Color.WHITE)
        stat1.setPadding(24, 8, 24, 8)
        stat1.background = stat1Bg
        stat1Row.addView(stat1)
        card.addView(stat1Row)

        // 第二行統計
        val stat2Row = LinearLayout(context)
        stat2Row.orientation = HORIZONTAL
        stat2Row.gravity = Gravity.CENTER_VERTICAL
        stat2Row.setPadding(0, 18, 0, 0)
        val stat2 = TextView(context)
        stat2.text = "✔ $stats2"
        stat2.textSize = 16f
        stat2.setTextColor(Color.WHITE)
        stat2.paintFlags = stat2.paintFlags or Paint.STRIKE_THRU_TEXT_FLAG
        stat2Row.addView(stat2)
        // angry face icon
        val angry = TextView(context)
        angry.text = "\uD83D\uDE20" // 😠
        angry.textSize = 20f
        angry.setPadding(16, 0, 0, 0)
        stat2Row.addView(angry)
        card.addView(stat2Row)

        // 鼓勵語
        val encouragementView = TextView(context)
        encouragementView.text = encouragement
        encouragementView.textSize = 15f
        encouragementView.setTextColor(Color.parseColor("#EEEEEE"))
        encouragementView.gravity = Gravity.CENTER
        encouragementView.setPadding(0, 28, 0, 28)
        card.addView(encouragementView)

        // 按鈕
        actionButton = Button(context)
        actionButton.text = buttonText
        actionButton.textSize = 15f
        actionButton.setTextColor(Color.WHITE)
        actionButton.setPadding(32, 12, 32, 12)
        val btnBg = GradientDrawable()
        btnBg.cornerRadius = 24f
        btnBg.setColor(Color.parseColor("#888888"))
        actionButton.background = btnBg
        actionButton.setOnClickListener {
            if (!isButtonClicked) {
                isButtonClicked = true
                btnBg.setColor(Color.parseColor("#B2C94B")) // 綠色
                actionButton.setTextColor(Color.parseColor("#444444"))
                actionButton.invalidate()
            }
            onButtonClick?.invoke()
        }
        card.addView(actionButton)

        addView(card)
    }
} 