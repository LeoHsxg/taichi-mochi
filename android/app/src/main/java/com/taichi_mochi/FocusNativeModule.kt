package com.taichi_mochi

import android.content.Intent
import android.os.Build
import android.provider.Settings
import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.modules.core.DeviceEventManagerModule

@ReactModule(name = FocusNativeModule.NAME)
class FocusNativeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    companion object {
        const val NAME = "FocusNativeModule"
        var reactContext: ReactApplicationContext? = null
    }

    override fun getName() = NAME

    override fun initialize() {
        super.initialize()
        reactContext = reactApplicationContext
    }

    // 檢查浮動視窗權限
    @ReactMethod
    fun canDrawOverlays(promise: Promise) {
        val context = reactApplicationContext
        val result = Settings.canDrawOverlays(context)
        promise.resolve(result)
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

    // 顯示浮動視窗
    @ReactMethod
    fun showOverlay(message: String) {
        val intent = Intent(reactApplicationContext, OverlayService::class.java)
        intent.putExtra("message", message)
        reactApplicationContext.startService(intent)
    }

    // 關閉浮動視窗
    @ReactMethod
    fun hideOverlay() {
        val intent = Intent(reactApplicationContext, OverlayService::class.java)
        reactApplicationContext.stopService(intent)
    }

    // 發送事件到 React Native
    fun sendEvent(eventName: String, params: WritableMap?) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }
}