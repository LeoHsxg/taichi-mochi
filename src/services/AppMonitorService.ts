import { AppState, AppStateStatus, Platform } from 'react-native';
import { AppInfo, DistractingApp } from '../types';
import { FocusNativeModule } from '../types/native';

class AppMonitorService {
  private isMonitoring = false;
  private monitoringInterval?: NodeJS.Timeout;
  private currentForegroundApp?: AppInfo;
  private distractingApps: DistractingApp[] = [];
  private onDistractingAppDetected?: (appInfo: AppInfo) => void;

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
  startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;

    // 啟動原生前景監控服務
    if (Platform.OS === 'android') {
      try {
        FocusNativeModule.startForegroundMonitor();
        console.log('原生前景監控服務已啟動');
      } catch (error) {
        console.error('啟動原生前景監控服務失敗:', error);
      }
    }

    this.monitoringInterval = setInterval(() => {
      this.checkForegroundApp();
    }, 1000); // 每秒檢查一次

    // 監聽應用程式狀態變化
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  /**
   * 停止監控
   */
  stopMonitoring(): void {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;

    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }

    // 停止原生前景監控服務
    if (Platform.OS === 'android') {
      try {
        FocusNativeModule.stopForegroundMonitor();
        console.log('原生前景監控服務已停止');
      } catch (error) {
        console.error('停止原生前景監控服務失敗:', error);
      }
    }

    // AppState 在新版本中不需要手動移除監聽器
    // 監聽器會在組件卸載時自動清理
  }

  /**
   * 檢查前景應用程式
   */
  private async checkForegroundApp(): Promise<void> {
    try {
      if (Platform.OS !== 'android') return;

      // 使用原生模組獲取前景應用程式資訊
      const packageName = await FocusNativeModule.getForegroundApp();

      if (packageName && this.isDistractingApp(packageName)) {
        const appInfo = this.getAppInfo(packageName);
        this.currentForegroundApp = {
          ...appInfo,
          isDistracting: true,
          lastOpened: new Date(),
        };

        if (this.onDistractingAppDetected) {
          this.onDistractingAppDetected(this.currentForegroundApp);
        }
      }
    } catch (error) {
      console.error('檢查前景應用程式失敗:', error);
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
      // 應用程式回到前景時檢查
      this.checkForegroundApp();
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
}

export const appMonitorService = new AppMonitorService();
