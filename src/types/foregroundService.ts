import { NativeModules } from 'react-native';

const { ForegroundServiceModule } = NativeModules;

export interface ForegroundServiceInterface {
  startForegroundService(): Promise<boolean>;
  stopForegroundService(): Promise<boolean>;
  isForegroundServiceRunning(): Promise<boolean>;
  showOverlay(type: string, message: string, gifUrl?: string): Promise<boolean>;
}

export default ForegroundServiceModule as ForegroundServiceInterface;
