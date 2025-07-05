import { NativeModules } from 'react-native';

interface FocusNativeModuleInterface {
  // 權限檢查
  canDrawOverlays(): Promise<boolean>;

  // 無障礙服務
  isAccessibilityServiceEnabled(): Promise<boolean>;
  startAccessibilityMonitoring(): void;
  stopAccessibilityMonitoring(): void;
  openAccessibilitySettings(): void;

  // 浮動視窗控制
  showOverlay(message: string): void;
  hideOverlay(): void;

  // 新增的三種 Overlay 類型
  showSelfDeclarationOverlay(message: string): void;
  showGifLoopingOverlay(gifUrl: string): void;
  showForcedBlockingOverlay(message: string): void;
}

export const FocusNativeModule: FocusNativeModuleInterface =
  NativeModules.FocusNativeModule;
