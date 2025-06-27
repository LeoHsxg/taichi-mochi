import { OverlayConfig } from '../types';

class OverlayService {
  private isVisible = false;
  private currentConfig?: OverlayConfig;

  /**
   * 顯示 Overlay
   */
  showOverlay(config: OverlayConfig): void {
    this.currentConfig = config;
    this.isVisible = true;

    // 這裡需要實作原生模組來顯示 Overlay
    // 使用 WindowManager 或 SYSTEM_ALERT_WINDOW 權限
    console.log('顯示 Overlay:', config);

    // 如果設定自動隱藏，設定定時器
    if (config.autoHide && config.autoHideDelay) {
      setTimeout(() => {
        this.hideOverlay();
      }, config.autoHideDelay);
    }
  }

  /**
   * 隱藏 Overlay
   */
  hideOverlay(): void {
    this.isVisible = false;
    this.currentConfig = undefined;

    // 這裡需要實作原生模組來隱藏 Overlay
    console.log('隱藏 Overlay');
  }

  /**
   * 更新 Overlay 內容
   */
  updateOverlay(config: Partial<OverlayConfig>): void {
    if (!this.isVisible || !this.currentConfig) return;

    this.currentConfig = { ...this.currentConfig, ...config };

    // 這裡需要實作原生模組來更新 Overlay 內容
    console.log('更新 Overlay:', this.currentConfig);
  }

  /**
   * 檢查 Overlay 是否可見
   */
  isOverlayVisible(): boolean {
    return this.isVisible;
  }

  /**
   * 獲取當前 Overlay 配置
   */
  getCurrentConfig(): OverlayConfig | undefined {
    return this.currentConfig;
  }

  /**
   * 顯示干擾應用程式提醒
   */
  showDistractionAlert(appName: string): void {
    this.showOverlay({
      message: `檢測到您正在使用 ${appName}，請回到專注模式！`,
      showReturnButton: true,
      returnButtonText: '回到專注 App',
      autoHide: false,
    });
  }

  /**
   * 顯示休息提醒
   */
  showBreakReminder(): void {
    this.showOverlay({
      message: '工作時間結束！該休息一下了。',
      showReturnButton: true,
      returnButtonText: '開始休息',
      autoHide: true,
      autoHideDelay: 10000, // 10 秒後自動隱藏
    });
  }

  /**
   * 顯示專注提醒
   */
  showFocusReminder(): void {
    this.showOverlay({
      message: '休息時間結束！該回到工作了。',
      showReturnButton: true,
      returnButtonText: '開始工作',
      autoHide: true,
      autoHideDelay: 10000, // 10 秒後自動隱藏
    });
  }
}

export const overlayService = new OverlayService();
