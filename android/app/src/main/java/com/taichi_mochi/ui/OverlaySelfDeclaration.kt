package com.taichi_mochi.ui

import android.content.Context
import android.graphics.Color
import android.graphics.Paint
import android.graphics.drawable.GradientDrawable
import android.view.Gravity
import android.view.View
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
    private var isButtonLongPressed = false
    private lateinit var actionButton: Button

    // 固定資料
    private val stats1 = "7 voluntary stops after initial reminder"
    private val stats2 = "2 system-enforced stops"
    private val encouragement = message
    private val buttonText = "I got this! Staying on track today 💪"

    init {
        // 外層 full-screen overlay
        layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
        orientation = VERTICAL
        setBackgroundColor(Color.parseColor("#333333"))  // 深灰遮罩
        gravity = Gravity.CENTER

        // Card 容器
        val card = LinearLayout(context).apply {
            orientation = VERTICAL
            gravity = Gravity.TOP or Gravity.CENTER_HORIZONTAL
            // 內距
            val pad = (24 * resources.displayMetrics.density).toInt()
            setPadding(pad)
            // 卡片背景
            background = GradientDrawable().also {
                it.cornerRadius = 32f * resources.displayMetrics.density
                it.setColor(Color.parseColor("#505050"))
            }
            elevation = 8f * resources.displayMetrics.density
            // 外距
            layoutParams = LayoutParams(
                LayoutParams.MATCH_PARENT,
                LayoutParams.WRAP_CONTENT
            ).also { lp ->
                val mar = (32 * resources.displayMetrics.density).toInt()
                lp.setMargins(mar, mar * 2, mar, mar * 2)
            }
        }

        // 1. 標題列
        val titleRow = LinearLayout(context).apply {
            orientation = HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            layoutParams = LayoutParams(
                LayoutParams.WRAP_CONTENT,
                LayoutParams.WRAP_CONTENT
            ).also { it.bottomMargin = (8 * resources.displayMetrics.density).toInt() }
        }
        titleRow.addView(TextView(context).apply {
            text = "Hi, Matt."
            textSize = 20f
            setTextColor(Color.parseColor("#FF2D6A"))       // Figma 粉
            paint.isFakeBoldText = true
        })
        titleRow.addView(TextView(context).apply {
            text = "Here's your yesterday's stats:"
            textSize = 16f
            setTextColor(Color.parseColor("#EEEEEE"))
            setPadding((6 * resources.displayMetrics.density).toInt(), 0, 0, 0)
        })
        card.addView(titleRow)

        // 2. 第一行統計
        val stat1Row = LinearLayout(context).apply {
            orientation = HORIZONTAL
            layoutParams = LayoutParams(
                LayoutParams.WRAP_CONTENT,
                LayoutParams.WRAP_CONTENT
            ).also { it.topMargin = (12 * resources.displayMetrics.density).toInt() }
        }
        stat1Row.addView(TextView(context).apply {
            text = "✔ $stats1"
            textSize = 16f
            setTextColor(Color.WHITE)
            val bg = GradientDrawable().also {
                it.cornerRadius = 12f * resources.displayMetrics.density
                it.setColor(Color.parseColor("#E6005A"))   // 純粉底
            }
            background = bg
            setPadding(
                (16 * resources.displayMetrics.density).toInt(),
                (8 * resources.displayMetrics.density).toInt(),
                (16 * resources.displayMetrics.density).toInt(),
                (8 * resources.displayMetrics.density).toInt()
            )
        })
        card.addView(stat1Row)

        // 3. 第二行統計
        val stat2Row = LinearLayout(context).apply {
            orientation = HORIZONTAL
            layoutParams = LayoutParams(
                LayoutParams.WRAP_CONTENT,
                LayoutParams.WRAP_CONTENT
            ).also { it.topMargin = (8 * resources.displayMetrics.density).toInt() }
        }
        stat2Row.addView(TextView(context).apply {
            text = "✔ $stats2"
            textSize = 16f
            setTextColor(Color.WHITE)
            paintFlags = paintFlags or Paint.STRIKE_THRU_TEXT_FLAG
        })
        stat2Row.addView(TextView(context).apply {
            text = "\uD83D\uDE20"  // 😠
            textSize = 20f
            setPadding((8 * resources.displayMetrics.density).toInt(), 0, 0, 0)
        })
        card.addView(stat2Row)

        // 4. 鼓勵語
        card.addView(TextView(context).apply {
            text = encouragement
            textSize = 15f
            setTextColor(Color.parseColor("#DDDDDD"))
            gravity = Gravity.CENTER
            layoutParams = LayoutParams(
                LayoutParams.MATCH_PARENT,
                LayoutParams.WRAP_CONTENT
            ).also {
                it.topMargin = (16 * resources.displayMetrics.density).toInt()
                it.bottomMargin = (16 * resources.displayMetrics.density).toInt()
            }
        })

        // 5. 按鈕
        actionButton = Button(context).apply {
            text = buttonText
            textSize = 15f
            setTextColor(Color.WHITE)
            // 預設灰底
            val btnBg = GradientDrawable().also {
                it.cornerRadius = 24f * resources.displayMetrics.density
                it.setColor(Color.parseColor("#888888"))
            }
            background = btnBg
            val ph = (12 * resources.displayMetrics.density).toInt()
            val pw = (24 * resources.displayMetrics.density).toInt()
            setPadding(pw, ph, pw, ph)

            // 普通點擊：只觸發 callback，不動顏色
            setOnClickListener {
                onButtonClick?.invoke()
            }
            // 長按：換綠底＋綠框
            setOnLongClickListener {
                if (!isButtonLongPressed) {
                    isButtonLongPressed = true
                    // 綠底
                    btnBg.setColor(Color.parseColor("#B2C94B"))
                    // 2dp 綠色邊框
                    val stroke = (2 * resources.displayMetrics.density).toInt()
                    btnBg.setStroke(stroke, Color.parseColor("#B2C94B"))
                    // 文字深灰
                    setTextColor(Color.parseColor("#333333"))
                    background = btnBg
                }
                onButtonClick?.invoke()
                true
            }

            layoutParams = LayoutParams(
                LayoutParams.MATCH_PARENT,
                LayoutParams.WRAP_CONTENT
            ).also {
                it.topMargin = (16 * resources.displayMetrics.density).toInt()
            }
        }
        card.addView(actionButton)

        // 將卡片加回 overlay
        addView(card)
    }
}
