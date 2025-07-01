package com.taichi_mochi

import android.accessibilityservice.AccessibilityService
import android.content.Intent
import android.content.pm.PackageManager
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
    private var lastPkg: String? = null
    private var lastTime: Long = 0
    private var HOME_PKG: String? = null
    
    override fun onServiceConnected() {
        super.onServiceConnected()
        Log.d(TAG, "AccessibilityService 已連接")
        instance = this
        // 取得桌面 launcher 的 package name
        val i = Intent(Intent.ACTION_MAIN).apply { addCategory(Intent.CATEGORY_HOME) }
        HOME_PKG = try {
            packageManager.resolveActivity(i, PackageManager.MATCH_DEFAULT_ONLY)?.activityInfo?.packageName
        } catch (e: Exception) {
            null
        }
    }
    
    override fun onAccessibilityEvent(event: AccessibilityEvent) {
        if (!isMonitoring) return
        if (event.eventType != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) return
        val pkg = event.packageName?.toString() ?: return
        // 過濾桌面/本身
        if (pkg == HOME_PKG || pkg == this.packageName) return
        // debounce
        val now = System.currentTimeMillis()
        if (pkg == lastPkg && now - lastTime < 500) return
        lastPkg = pkg
        lastTime = now
        currentPackageName = pkg
        Log.d(TAG, "前景應用程式變更: $pkg")
        sendAppChangeEvent(pkg)
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