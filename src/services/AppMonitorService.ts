import {
  AppState,
  AppStateStatus,
  Platform,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import { AppInfo, DistractingApp } from '../types';
import { FocusNativeModule } from '../types/native';
import { overlayService } from './OverlayService';

class AppMonitorService {
  private isMonitoring = false;
  private currentForegroundApp?: AppInfo;
  private distractingApps: DistractingApp[] = [];
  private onDistractingAppDetected?: (appInfo: AppInfo) => void;
  private eventEmitter?: NativeEventEmitter;

  /**
   * 設定干擾應用程式清單
   */
  setDistractingApps(apps: DistractingApp[]): void {
    this.distractingApps = apps;
  }

  /**
   * 設定干擾應用程式偵測回調
   */
  setOnDistractingAppDetected(callback: (appInfo: AppInfo) => void): void {
    this.onDistractingAppDetected = callback;
  }

  /**
   * 開始監控
   */
  async startMonitoring(): Promise<void> {
    if (this.isMonitoring) return;
    this.isMonitoring = true;
    if (Platform.OS === 'android') {
      try {
        const isAccessibilityEnabled =
          await FocusNativeModule.isAccessibilityServiceEnabled();
        if (isAccessibilityEnabled) {
          FocusNativeModule.startAccessibilityMonitoring();
          this.setupAccessibilityEventEmitter();
          console.log('AccessibilityService 監控已啟動');
        } else {
          console.warn('請先啟用無障礙服務！');
        }
      } catch (error) {
        console.error('啟動監控服務失敗:', error);
      }
    }
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  /**
   * 停止監控
   */
  stopMonitoring(): void {
    if (!this.isMonitoring) return;
    this.isMonitoring = false;
    if (Platform.OS === 'android') {
      try {
        FocusNativeModule.stopAccessibilityMonitoring();
        console.log('監控服務已停止');
      } catch (error) {
        console.error('停止監控服務失敗:', error);
      }
    }
    if (this.eventEmitter) {
      this.eventEmitter.removeAllListeners('onForegroundAppChanged');
      this.eventEmitter = undefined;
    }
  }

  /**
   * 設定 AccessibilityService 事件監聽器
   */
  private setupAccessibilityEventEmitter(): void {
    if (Platform.OS !== 'android') return;
    this.eventEmitter = new NativeEventEmitter(NativeModules.FocusNativeModule);
    this.eventEmitter.addListener(
      'onForegroundAppChanged',
      (packageName: string) => {
        console.log('前景應用程式變更:', packageName);
        this.handleForegroundAppChange(packageName);
      },
    );
  }

  /**
   * 處理前景應用程式變更事件
   */
  private handleForegroundAppChange(packageName: string): void {
    if (this.isDistractingApp(packageName)) {
      const appInfo = this.getAppInfo(packageName);
      this.currentForegroundApp = {
        ...appInfo,
        isDistracting: true,
        lastOpened: new Date(),
      };
      if (this.onDistractingAppDetected) {
        this.onDistractingAppDetected(this.currentForegroundApp);
      }
      // 顯示 overlay
      overlayService.showOverlay({
        message: `檢測到您正在使用 ${appInfo.appName}，請回到專注模式！`,
        showReturnButton: true,
      });
    } else {
      // 如果切回本 app，則隱藏 overlay
      overlayService.hideOverlay();
    }
  }

  /**
   * 獲取應用程式資訊
   */
  private getAppInfo(packageName: string): AppInfo {
    const distractingApp = this.distractingApps.find(
      app => app.packageName === packageName,
    );
    return {
      packageName,
      appName: distractingApp?.appName || packageName,
      isDistracting: !!distractingApp,
    };
  }

  /**
   * 檢查是否為干擾應用程式
   */
  private isDistractingApp(packageName: string): boolean {
    return this.distractingApps.some(app => app.packageName === packageName);
  }

  /**
   * 處理應用程式狀態變化
   */
  private handleAppStateChange = (nextAppState: AppStateStatus): void => {
    if (nextAppState === 'active') {
      // 無需主動查詢，事件會自動推送
    }
  };

  /**
   * 獲取當前監控狀態
   */
  isMonitoringActive(): boolean {
    return this.isMonitoring;
  }

  /**
   * 獲取當前前景應用程式
   */
  getCurrentForegroundApp(): AppInfo | undefined {
    return this.currentForegroundApp;
  }

  /**
   * 獲取干擾應用程式清單
   */
  getDistractingApps(): DistractingApp[] {
    return [...this.distractingApps];
  }

  /**
   * 檢查無障礙服務是否啟用
   */
  async checkAccessibilityService(): Promise<boolean> {
    if (Platform.OS !== 'android') return false;
    try {
      return await FocusNativeModule.isAccessibilityServiceEnabled();
    } catch (error) {
      console.error('檢查無障礙服務狀態失敗:', error);
      return false;
    }
  }

  /**
   * 跳轉到無障礙服務設定頁
   */
  openAccessibilitySettings(): void {
    if (Platform.OS === 'android') {
      FocusNativeModule.openAccessibilitySettings();
    }
  }
}

export const appMonitorService = new AppMonitorService();
