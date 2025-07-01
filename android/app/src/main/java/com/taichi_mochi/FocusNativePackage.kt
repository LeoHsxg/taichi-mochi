package com.taichi_mochi

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager


// 將我們自訂的 Native Module (FocusNativeModule) 註冊到 React Native
class FocusNativePackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        // 註冊我們自訂的 Native Module (FocusNativeModule)
        return listOf(FocusNativeModule(reactContext))
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        // 目前沒有自訂的 ViewManager (原生 UI)，所以回傳空列表
        return emptyList()
    }
}