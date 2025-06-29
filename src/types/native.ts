import { NativeModules } from 'react-native';

interface FocusNativeModuleInterface {
  // 權限檢查
  canDrawOverlays(): Promise<boolean>;
  hasUsageAccess(): Promise<boolean>;

  // 設定跳轉
  openUsageAccessSettings(): void;

  // 浮動視窗控制
  showOverlay(message: string): void;
  hideOverlay(): void;

  // 前景監控服務
  startForegroundMonitor(): void;
  stopForegroundMonitor(): void;

  // 前景應用程式查詢
  getForegroundApp(): Promise<string | null>;
}

export const FocusNativeModule: FocusNativeModuleInterface =
  NativeModules.FocusNativeModule;
