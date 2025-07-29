package com.taichi_mochi

import android.content.Intent
import android.os.Build
import android.provider.Settings
import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.modules.core.DeviceEventManagerModule

/**
 * 這是暴露給 React Native 的橋接模組 (Bridge Module)，提供 JS 層呼叫的原生方法
 */
@ReactModule(name = FocusNativeModule.NAME)
class FocusNativeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    companion object {
        const val NAME = "FocusNativeModule"
        // 儲存 ReactApplicationContext 的實例
        // NEED TO UNDERSTAND
        var reactContext: ReactApplicationContext? = null
    }

    override fun getName() = NAME

    override fun initialize() {
        super.initialize()
        // 在模組初始化時，將 ReactApplicationContext 實例儲存起來
        // 這樣我們可以在模組的其他方法中使用它
        // NEED TO UNDERSTAND
        reactContext = reactApplicationContext
    }

    // 跳轉到無障礙服務設定頁
    @ReactMethod
    fun openAccessibilitySettings() {
        val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        reactApplicationContext.startActivity(intent)
    }

    // 檢查無障礙服務是否啟用
    @ReactMethod
    fun isAccessibilityServiceEnabled(promise: Promise) {
        val result = AppWatcherService.isRunning()
        promise.resolve(result)
    }

    // 啟動無障礙服務監控
    @ReactMethod
    fun startAccessibilityMonitoring() {
        val appWatcher = AppWatcherService.getInstance()
        appWatcher?.startMonitoring()
    }

    // 停止無障礙服務監控
    @ReactMethod
    fun stopAccessibilityMonitoring() {
        val appWatcher = AppWatcherService.getInstance()
        appWatcher?.stopMonitoring()
    }

    // 檢查浮動視窗權限
    @ReactMethod
    fun canDrawOverlays(promise: Promise) {
        val context = reactApplicationContext
        val result = Settings.canDrawOverlays(context)
        promise.resolve(result)
    }

    // 保留原有接口，行為同 selfdeclaration
    @ReactMethod
    fun showOverlay(message: String) {
        val intent = Intent(reactApplicationContext, OverlayService::class.java)
        intent.putExtra("type", "type1") // selfdeclaration
        intent.putExtra("message", message)
        reactApplicationContext.startService(intent)
    }

    // 新增：自我宣告 overlay
    @ReactMethod
    fun showSelfDeclarationOverlay(message: String) {
        val intent = Intent(reactApplicationContext, OverlayService::class.java)
        intent.putExtra("type", "type1")
        intent.putExtra("message", message)
        reactApplicationContext.startService(intent)
    }

    // 新增：循環 GIF overlay
    @ReactMethod
    fun showGifLoopingOverlay() {
        val intent = Intent(reactApplicationContext, OverlayService::class.java)
        intent.putExtra("type", "type2")
        reactApplicationContext.startService(intent)
    }

    // 新增：強制阻擋 overlay
    @ReactMethod
    fun showForcedBlockingOverlay(message: String) {
        val intent = Intent(reactApplicationContext, OverlayService::class.java)
        intent.putExtra("type", "type3")
        intent.putExtra("message", message)
        reactApplicationContext.startService(intent)
    }

    // 關閉浮動視窗
    @ReactMethod
    fun hideOverlay() {
        val intent = Intent(reactApplicationContext, OverlayService::class.java)
        reactApplicationContext.stopService(intent)
    }

    // 發送事件到 React Native，較少使用
    // 在 AppMonitorService.kt 中使用
    // NEED TO UNDERSTAND
    fun sendEvent(eventName: String, params: WritableMap?) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }
}