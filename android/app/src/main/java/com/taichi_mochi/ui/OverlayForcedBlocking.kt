package com.taichi_mochi.ui

import android.content.Context
import android.graphics.Color
import android.graphics.Typeface
import android.view.Gravity
import android.view.ViewGroup
import android.widget.Button
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import androidx.cardview.widget.CardView

class OverlayForcedBlocking(
    context: Context, 
    message: String, 
    onButtonClick: (() -> Unit)? = null
) : LinearLayout(context) {
    init {
        layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
        
        orientation = VERTICAL
        setBackgroundColor(Color.parseColor("#58CDCDCD")) // 半透明白色背景
        gravity = Gravity.CENTER
        setPadding(40, 40, 40, 40)

        // 創建圓角矩形卡片容器
        val cardView = CardView(context)
        val cardParams = LayoutParams(
            LayoutParams.MATCH_PARENT,
            LayoutParams.WRAP_CONTENT
        )
        cardParams.setMargins(40, 40, 40, 40)
        cardView.layoutParams = cardParams
        cardView.radius = 40f
        cardView.setCardBackgroundColor(Color.parseColor("#424242")) // 深灰色背景
        cardView.setContentPadding(40, 40, 40, 40)

        // 卡片內容容器
        val cardContent = LinearLayout(context)
        cardContent.orientation = VERTICAL
        cardContent.gravity = Gravity.CENTER

        // 載入 Jaro 字體
        val jaroFont = Typeface.createFromAsset(context.assets, "fonts/Jaro.ttf")

        // 大標題
        val titleView = TextView(context)
        titleView.text = "MAN"
        titleView.textSize = 64f
        titleView.setTextColor(Color.parseColor("#FF0066")) // 亮粉色
        titleView.typeface = jaroFont
        titleView.gravity = Gravity.CENTER
        titleView.setLineSpacing(0f, 0.5f) // 縮小行距
        titleView.setIncludeFontPadding(false)
        
        val titleParams = LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        )
        titleParams.setMargins(0, 0, 0, 0) // 使用 margin 控制間距
        titleView.layoutParams = titleParams
        cardContent.addView(titleView)

        // 副標題
        val subtitleView = TextView(context)
        subtitleView.text = "What can I say?"
        subtitleView.textSize = 32f
        subtitleView.setTextColor(Color.parseColor("#FF0066")) // 亮粉色
        subtitleView.typeface = jaroFont
        subtitleView.gravity = Gravity.CENTER
        subtitleView.setIncludeFontPadding(false)
        
        val subtitleParams = LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        )
        subtitleParams.setMargins(0, -45, 0, 20) // 使用 margin 控制間距
        subtitleView.layoutParams = subtitleParams
        cardContent.addView(subtitleView)

        // 生氣麻糬圖片
        val mochiImageView = ImageView(context)
        val imageParams = LinearLayout.LayoutParams(250, 250) // 放大一倍：120 -> 240
        imageParams.gravity = Gravity.CENTER
        imageParams.setMargins(0, 50, 0, 50)
        mochiImageView.layoutParams = imageParams
        val inputStream = context.assets.open("mochi/mochi_angry.png")
        val drawable = android.graphics.drawable.Drawable.createFromStream(inputStream, null)
        mochiImageView.setImageDrawable(drawable)
        inputStream.close()
        mochiImageView.setPadding(0, 0, 0, 20)
        cardContent.addView(mochiImageView)

        // 警告文字
        val messageView = TextView(context)
        messageView.text = message
        messageView.textSize = 14f
        messageView.setTextColor(Color.WHITE)
        messageView.gravity = Gravity.CENTER
        messageView.setPadding(0, 0, 0, 30)
        messageView.setLineSpacing(8f, 1f) // 增加行距：額外間距 8px，倍數 1
        cardContent.addView(messageView)

        // 按鈕容器
        val buttonContainer = LinearLayout(context)
        buttonContainer.orientation = HORIZONTAL
        buttonContainer.gravity = Gravity.CENTER
        buttonContainer.setPadding(20, 30, 20, 60) // 增加頂部間距

        // 左邊按鈕
        val leftButton = Button(context)
        val leftButtonParams = LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f)
        leftButtonParams.setMargins(0, 0, 10, 0)
        leftButton.layoutParams = leftButtonParams
        leftButton.text = "end, home"
        leftButton.textSize = 14f
        leftButton.setTextColor(Color.parseColor("#424242"))
        leftButton.setTypeface(null, Typeface.BOLD) // 設置粗體
        leftButton.setPadding(2, 2, 2, 2) // 減少 padding
        
        // 創建圓角背景
        val leftButtonBackground = android.graphics.drawable.GradientDrawable()
        leftButtonBackground.setColor(Color.parseColor("#CCCCCC"))
        leftButtonBackground.cornerRadius = 1000f // 圓角
        leftButton.background = leftButtonBackground
        
        leftButton.setOnClickListener {
            onButtonClick?.invoke()
        }

        // 右邊按鈕
        val rightButton = Button(context)
        val rightButtonParams = LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f)
        rightButtonParams.setMargins(10, 0, 0, 0)
        rightButton.layoutParams = rightButtonParams
        rightButton.text = "go cool down"
        rightButton.textSize = 14f
        rightButton.setTextColor(Color.parseColor("#424242"))
        rightButton.setTypeface(null, Typeface.BOLD) // 設置粗體
        rightButton.setPadding(2, 2, 2, 2) // 減少 padding
        
        // 創建圓角背景
        val rightButtonBackground = android.graphics.drawable.GradientDrawable()
        rightButtonBackground.setColor(Color.parseColor("#CCCCCC"))
        rightButtonBackground.cornerRadius = 1000f // 圓角
        rightButton.background = rightButtonBackground
        
        rightButton.setOnClickListener {
            onButtonClick?.invoke()
        }

        buttonContainer.addView(leftButton)
        buttonContainer.addView(rightButton)
        cardContent.addView(buttonContainer)

        cardView.addView(cardContent)
        addView(cardView)
    }
}