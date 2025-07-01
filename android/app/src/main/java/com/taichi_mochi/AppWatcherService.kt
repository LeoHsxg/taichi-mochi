package com.taichi_mochi

import android.accessibilityservice.AccessibilityService
import android.content.Intent
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.modules.core.DeviceEventManagerModule

class AppWatcherService : AccessibilityService() {
    
    companion object {
        private const val TAG = "AppWatcherService"
        private var instance: AppWatcherService? = null
        
        fun getInstance(): AppWatcherService? = instance
        
        fun isRunning(): Boolean = instance != null
    }
    
    private var currentPackageName: String? = null
    private var isMonitoring = false
    
    override fun onServiceConnected() {
        super.onServiceConnected()
        Log.d(TAG, "AccessibilityService 已連接")
        instance = this
    }
    
    override fun onAccessibilityEvent(event: AccessibilityEvent) {
        if (!isMonitoring) return
        
        when (event.eventType) {
            AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED,
            AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED -> {
                val packageName = event.packageName?.toString()
                if (packageName != null && packageName != currentPackageName) {
                    currentPackageName = packageName
                    Log.d(TAG, "前景應用程式變更: $packageName")
                    
                    // 發送事件到 React Native
                    sendAppChangeEvent(packageName)
                }
            }
        }
    }
    
    override fun onInterrupt() {
        Log.d(TAG, "AccessibilityService 被中斷")
    }
    
    override fun onDestroy() {
        super.onDestroy()
        Log.d(TAG, "AccessibilityService 已銷毀")
        instance = null
        isMonitoring = false
    }
    
    fun startMonitoring() {
        isMonitoring = true
        Log.d(TAG, "開始監控前景應用程式")
    }
    
    fun stopMonitoring() {
        isMonitoring = false
        Log.d(TAG, "停止監控前景應用程式")
    }
    
    fun getCurrentPackageName(): String? {
        return currentPackageName
    }
    
    private fun sendAppChangeEvent(packageName: String) {
        try {
            val reactContext = FocusNativeModule.reactContext
            reactContext?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                ?.emit("onForegroundAppChanged", packageName)
        } catch (e: Exception) {
            Log.e(TAG, "發送事件失敗: ${e.message}")
        }
    }
} 