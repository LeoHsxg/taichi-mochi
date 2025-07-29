import ForegroundServiceModule from '../types/foregroundService';

export class ForegroundService {
  private static instance: ForegroundService;
  private runningStatus: boolean = false;

  private constructor() {}

  static getInstance(): ForegroundService {
    if (!ForegroundService.instance) {
      ForegroundService.instance = new ForegroundService();
    }
    return ForegroundService.instance;
  }

  /**
   * 啟動前景服務
   */
  async start(): Promise<boolean> {
    try {
      console.log('開始啟動前景服務...');
      const result = await ForegroundServiceModule.startForegroundService();
      this.runningStatus = result;
      console.log('前景服務啟動成功');
      return result;
    } catch (error) {
      console.error('啟動前景服務失敗:', error);
      this.runningStatus = false;
      throw error;
    }
  }

  /**
   * 停止前景服務
   */
  async stop(): Promise<boolean> {
    try {
      console.log('開始停止前景服務...');
      const result = await ForegroundServiceModule.stopForegroundService();
      this.runningStatus = false;
      console.log('前景服務停止成功');
      return result;
    } catch (error) {
      console.error('停止前景服務失敗:', error);
      throw error;
    }
  }

  /**
   * 檢查前景服務是否正在運行
   */
  async isRunning(): Promise<boolean> {
    try {
      const result = await ForegroundServiceModule.isForegroundServiceRunning();
      this.runningStatus = result;
      return result;
    } catch (error) {
      console.error('檢查前景服務狀態失敗:', error);
      return false;
    }
  }

  /**
   * 透過前景服務顯示 overlay（由 ForegroundMonitorService 直接管理 UI）
   */
  async showOverlay(type: string, message: string): Promise<boolean> {
    try {
      console.log(`透過前景服務顯示 overlay: type=${type}, message=${message}`);
      const result = await ForegroundServiceModule.showOverlay(type, message);
      console.log('Overlay 顯示成功（由 ForegroundMonitorService 管理）');
      return result;
    } catch (error) {
      console.error('顯示 overlay 失敗:', error);
      throw error;
    }
  }

  /**
   * 獲取當前運行狀態
   */
  getRunningStatus(): boolean {
    return this.runningStatus;
  }

  /**
   * 初始化前景服務
   * 在應用程式啟動時呼叫
   */
  async initialize(): Promise<void> {
    try {
      const running = await this.isRunning();
      if (!running) {
        console.log('前景服務未運行，正在啟動...');
        await this.start();
      } else {
        console.log('前景服務已在運行中');
      }
    } catch (error) {
      console.error('初始化前景服務失敗:', error);
      throw error;
    }
  }

  /**
   * 清理前景服務
   * 在應用程式關閉時呼叫
   */
  async cleanup(): Promise<void> {
    try {
      const running = await this.isRunning();
      if (running) {
        console.log('清理前景服務...');
        await this.stop();
      }
    } catch (error) {
      console.error('清理前景服務失敗:', error);
    }
  }
}

export default ForegroundService.getInstance();
