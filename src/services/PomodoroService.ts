import { PomodoroSession, PomodoroSettings } from '../types';

class PomodoroService {
  private currentSession?: PomodoroSession;
  private settings: PomodoroSettings = {
    workDuration: 25, // 25 分鐘工作時間
    breakDuration: 5, // 5 分鐘休息時間
    longBreakDuration: 15, // 15 分鐘長休息時間
    sessionsUntilLongBreak: 4, // 4 個工作時段後長休息
  };
  private sessionCount = 0;
  private timer?: NodeJS.Timeout;
  private onSessionComplete?: (session: PomodoroSession) => void;
  private onSessionUpdate?: (session: PomodoroSession) => void;

  /**
   * 設定回調函數
   */
  setOnSessionComplete(callback: (session: PomodoroSession) => void): void {
    this.onSessionComplete = callback;
  }

  setOnSessionUpdate(callback: (session: PomodoroSession) => void): void {
    this.onSessionUpdate = callback;
  }

  /**
   * 更新設定
   */
  updateSettings(newSettings: Partial<PomodoroSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  /**
   * 獲取當前設定
   */
  getSettings(): PomodoroSettings {
    return { ...this.settings };
  }

  /**
   * 開始工作時段
   */
  startWorkSession(): void {
    this.stopCurrentSession();

    this.currentSession = {
      id: Date.now().toString(),
      type: 'work',
      duration: this.settings.workDuration,
      startTime: new Date(),
      isActive: true,
    };

    this.startTimer();
  }

  /**
   * 開始休息時段
   */
  startBreakSession(): void {
    this.stopCurrentSession();

    const isLongBreak =
      (this.sessionCount + 1) % this.settings.sessionsUntilLongBreak === 0;

    this.currentSession = {
      id: Date.now().toString(),
      type: isLongBreak ? 'longBreak' : 'break',
      duration: isLongBreak
        ? this.settings.longBreakDuration
        : this.settings.breakDuration,
      startTime: new Date(),
      isActive: true,
    };

    this.startTimer();
  }

  /**
   * 暫停當前時段
   */
  pauseSession(): void {
    if (this.currentSession && this.currentSession.isActive) {
      this.currentSession.isActive = false;
      this.stopTimer();

      if (this.onSessionUpdate) {
        this.onSessionUpdate(this.currentSession);
      }
    }
  }

  /**
   * 恢復當前時段
   */
  resumeSession(): void {
    if (this.currentSession && !this.currentSession.isActive) {
      this.currentSession.isActive = true;
      this.startTimer();

      if (this.onSessionUpdate) {
        this.onSessionUpdate(this.currentSession);
      }
    }
  }

  /**
   * 停止當前時段
   */
  stopSession(): void {
    this.stopCurrentSession();
  }

  /**
   * 獲取當前時段
   */
  getCurrentSession(): PomodoroSession | undefined {
    return this.currentSession;
  }

  /**
   * 獲取剩餘時間（秒）
   */
  getRemainingTime(): number {
    if (!this.currentSession || !this.currentSession.isActive) return 0;

    const elapsed = Math.floor(
      (Date.now() - this.currentSession.startTime.getTime()) / 1000,
    );
    const totalSeconds = this.currentSession.duration * 60;
    const remaining = totalSeconds - elapsed;

    return Math.max(0, remaining);
  }

  /**
   * 獲取已過時間（秒）
   */
  getElapsedTime(): number {
    if (!this.currentSession || !this.currentSession.isActive) return 0;

    return Math.floor(
      (Date.now() - this.currentSession.startTime.getTime()) / 1000,
    );
  }

  /**
   * 獲取進度百分比
   */
  getProgress(): number {
    if (!this.currentSession) return 0;

    const totalSeconds = this.currentSession.duration * 60;
    const elapsed = this.getElapsedTime();

    return Math.min(100, (elapsed / totalSeconds) * 100);
  }

  /**
   * 開始計時器
   */
  private startTimer(): void {
    this.stopTimer();

    this.timer = setInterval(() => {
      if (this.currentSession && this.currentSession.isActive) {
        const remaining = this.getRemainingTime();

        if (this.onSessionUpdate) {
          this.onSessionUpdate(this.currentSession);
        }

        if (remaining <= 0) {
          this.completeSession();
        }
      }
    }, 1000);
  }

  /**
   * 停止計時器
   */
  private stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  /**
   * 停止當前時段
   */
  private stopCurrentSession(): void {
    if (this.currentSession) {
      this.currentSession.endTime = new Date();
      this.currentSession.isActive = false;
    }
    this.stopTimer();
  }

  /**
   * 完成時段
   */
  private completeSession(): void {
    if (!this.currentSession) return;

    this.stopCurrentSession();

    if (this.currentSession.type === 'work') {
      this.sessionCount++;
    }

    if (this.onSessionComplete) {
      this.onSessionComplete(this.currentSession);
    }
  }

  /**
   * 重置計數器
   */
  resetSessionCount(): void {
    this.sessionCount = 0;
  }

  /**
   * 獲取會話計數
   */
  getSessionCount(): number {
    return this.sessionCount;
  }
}

export const pomodoroService = new PomodoroService();
