package com.taichi_mochi

import android.app.Activity
import android.app.AppOpsManager
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.os.Build
import android.provider.Settings
import android.view.WindowManager
import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = FocusNativeModule.NAME)
class FocusNativeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    companion object {
        const val NAME = "FocusNativeModule"
    }

    override fun getName() = NAME

    // 檢查浮動視窗權限
    @ReactMethod
    fun canDrawOverlays(promise: Promise) {
        val context = reactApplicationContext
        val result = Settings.canDrawOverlays(context)
        promise.resolve(result)
    }

    // 檢查 Usage Access 權限
    @ReactMethod
    fun hasUsageAccess(promise: Promise) {
        val context = reactApplicationContext
        val appOps = context.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
        val mode = appOps.checkOpNoThrow(
            AppOpsManager.OPSTR_GET_USAGE_STATS,
            android.os.Process.myUid(),
            context.packageName
        )
        promise.resolve(mode == AppOpsManager.MODE_ALLOWED)
    }

    // 跳轉到 Usage Access 設定頁
    @ReactMethod
    fun openUsageAccessSettings() {
        val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        reactApplicationContext.startActivity(intent)
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

    // 啟動前景監控服務
    @ReactMethod
    fun startForegroundMonitor() {
        val intent = Intent(reactApplicationContext, ForegroundMonitorService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            reactApplicationContext.startForegroundService(intent)
        } else {
            reactApplicationContext.startService(intent)
        }
    }

    // 停止前景監控服務
    @ReactMethod
    fun stopForegroundMonitor() {
        val intent = Intent(reactApplicationContext, ForegroundMonitorService::class.java)
        reactApplicationContext.stopService(intent)
    }

    // 查詢目前前景 App
    @ReactMethod
    fun getForegroundApp(promise: Promise) {
        try {
            val usageStatsManager = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
            val endTime = System.currentTimeMillis()
            val beginTime = endTime - 1000 * 10 // 查詢最近10秒
            val usageStatsList = usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY, beginTime, endTime
            )
            var lastUsedApp: String? = null
            var lastTime: Long = 0
            usageStatsList?.forEach { stat ->
                if (stat.lastTimeUsed > lastTime) {
                    lastTime = stat.lastTimeUsed
                    lastUsedApp = stat.packageName
                }
            }
            promise.resolve(lastUsedApp)
        } catch (e: Exception) {
            promise.reject("USAGE_ERROR", e)
        }
    }
}