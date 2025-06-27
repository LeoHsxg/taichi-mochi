import { AppState, AppStateStatus } from 'react-native';
import { AppInfo, DistractingApp } from '../types';

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

    // AppState 在新版本中不需要手動移除監聽器
    // 監聽器會在組件卸載時自動清理
  }

  /**
   * 檢查前景應用程式
   */
  private async checkForegroundApp(): Promise<void> {
    try {
      // 這裡需要實作原生模組來獲取前景應用程式資訊
      // 暫時使用模擬資料
      const foregroundApp = await this.getForegroundAppInfo();

      if (foregroundApp && this.isDistractingApp(foregroundApp.packageName)) {
        this.currentForegroundApp = {
          ...foregroundApp,
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
   * 獲取前景應用程式資訊
   */
  private async getForegroundAppInfo(): Promise<AppInfo | null> {
    // 這裡需要實作原生模組來獲取前景應用程式資訊
    // 使用 UsageStatsManager API
    return null;
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
