import { Platform } from 'react-native';
import { OverlayConfig } from '../types';
import { FocusNativeModule } from '../types/native';

class OverlayService {
  private isVisible = false;
  private currentConfig?: OverlayConfig;

  /**
   * 顯示 Overlay
   */
  showOverlay(config: OverlayConfig): void {
    if (Platform.OS !== 'android') {
      console.log('Overlay 僅支援 Android 平台');
      return;
    }
    this.currentConfig = config;
    this.isVisible = true;
    try {
      FocusNativeModule.showOverlay(config.message);
      console.log('顯示 Overlay:', config);
      if (config.autoHide && config.autoHideDelay) {
        setTimeout(() => {
          this.hideOverlay();
        }, config.autoHideDelay);
      }
    } catch (error) {
      console.error('顯示 Overlay 失敗:', error);
    }
  }

  /**
   * 隱藏 Overlay
   */
  hideOverlay(): void {
    if (Platform.OS !== 'android') return;
    this.isVisible = false;
    this.currentConfig = undefined;
    try {
      FocusNativeModule.hideOverlay();
      console.log('隱藏 Overlay');
    } catch (error) {
      console.error('隱藏 Overlay 失敗:', error);
    }
  }

  /**
   * 更新 Overlay 內容
   */
  updateOverlay(config: Partial<OverlayConfig>): void {
    if (!this.isVisible || !this.currentConfig) return;

    this.currentConfig = { ...this.currentConfig, ...config };

    // 重新顯示 Overlay 來更新內容
    if (config.message) {
      this.showOverlay(this.currentConfig);
    }

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
