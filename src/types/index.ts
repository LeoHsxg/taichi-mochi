// 權限相關類型
export interface PermissionStatus {
  usageAccess: boolean;
  overlayPermission: boolean;
  notificationPermission: boolean;
}

// 應用程式監控相關類型
export interface AppInfo {
  packageName: string;
  appName: string;
  isDistracting: boolean;
  lastOpened?: Date;
}

export interface DistractingApp {
  packageName: string;
  appName: string;
  category: 'social' | 'entertainment' | 'gaming' | 'other';
}

// Pomodoro 計時器相關類型
export interface PomodoroSession {
  id: string;
  type: 'work' | 'break' | 'longBreak';
  duration: number; // 分鐘
  startTime: Date;
  endTime?: Date;
  isActive: boolean;
}

export interface PomodoroSettings {
  workDuration: number; // 分鐘
  breakDuration: number; // 分鐘
  longBreakDuration: number; // 分鐘
  sessionsUntilLongBreak: number;
}

// 通知相關類型
export interface NotificationData {
  title: string;
  body: string;
  type: 'break_reminder' | 'distraction_alert' | 'focus_reminder';
  data?: Record<string, any>;
}

// Overlay 相關類型
export interface OverlayConfig {
  message: string;
  showReturnButton: boolean;
  returnButtonText?: string;
  autoHide?: boolean;
  autoHideDelay?: number; // 毫秒
}

// Firebase 相關類型
export interface FCMToken {
  token: string;
  timestamp: Date;
}

// 應用程式狀態
export interface AppState {
  permissions: PermissionStatus;
  distractingApps: DistractingApp[];
  currentSession?: PomodoroSession;
  settings: PomodoroSettings;
  isMonitoring: boolean;
  overlayVisible: boolean;
}
