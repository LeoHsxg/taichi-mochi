package com.taichi_mochi

import android.content.Intent
import android.os.Build
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class ForegroundServiceModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        private const val TAG = "ForegroundServiceModule"
    }

    override fun getName(): String {
        return "ForegroundServiceModule"
    }

    @ReactMethod
    fun startForegroundService(promise: Promise) {
        try {
            Log.d(TAG, "開始啟動前景服務")
            
            val intent = Intent(reactApplicationContext, ForegroundMonitorService::class.java)
            
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                reactApplicationContext.startForegroundService(intent)
            } else {
                reactApplicationContext.startService(intent)
            }
            
            Log.d(TAG, "前景服務啟動成功")
            promise.resolve(true)
            
        } catch (e: Exception) {
            Log.e(TAG, "啟動前景服務失敗", e)
            promise.reject("START_FOREGROUND_SERVICE_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun stopForegroundService(promise: Promise) {
        try {
            Log.d(TAG, "開始停止前景服務")
            
            val intent = Intent(reactApplicationContext, ForegroundMonitorService::class.java)
            reactApplicationContext.stopService(intent)
            
            Log.d(TAG, "前景服務停止成功")
            promise.resolve(true)
            
        } catch (e: Exception) {
            Log.e(TAG, "停止前景服務失敗", e)
            promise.reject("STOP_FOREGROUND_SERVICE_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun isForegroundServiceRunning(promise: Promise) {
        try {
            val isRunning = ForegroundMonitorService.isRunning()
            Log.d(TAG, "前景服務運行狀態: $isRunning")
            promise.resolve(isRunning)
        } catch (e: Exception) {
            Log.e(TAG, "檢查前景服務狀態失敗", e)
            promise.reject("CHECK_FOREGROUND_SERVICE_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun showOverlay(type: String, message: String, promise: Promise) {
        try {
            Log.d(TAG, "透過前景服務顯示 overlay, type=$type, message=$message")
            
            val foregroundService = ForegroundMonitorService.getInstance()
            if (foregroundService != null) {
                val intent = Intent().apply {
                    putExtra("show_overlay", true)
                    putExtra("overlay_type", type)
                    putExtra("overlay_message", message)
                }
                foregroundService.handleIntent(intent)
                promise.resolve(true)
            } else {
                Log.w(TAG, "前景服務未運行，無法顯示 overlay")
                promise.reject("FOREGROUND_SERVICE_NOT_RUNNING", "前景服務未運行")
            }
        } catch (e: Exception) {
            Log.e(TAG, "顯示 overlay 失敗", e)
            promise.reject("SHOW_OVERLAY_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun addListener(eventName: String) {
        // 保持與新架構的相容性
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // 保持與新架構的相容性
    }

    private fun sendEvent(eventName: String, params: WritableMap?) {
        try {
            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(eventName, params)
        } catch (e: Exception) {
            Log.e(TAG, "發送事件失敗: $eventName", e)
        }
    }
} 