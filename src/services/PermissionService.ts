import { PermissionsAndroid, Alert, Linking, Platform } from 'react-native';
import { PermissionStatus } from '../types';
import { FocusNativeModule } from '../types/native';

class PermissionService {
  /**
   * 檢查所有必要權限狀態
   */
  async checkAllPermissions(): Promise<PermissionStatus> {
    console.log('開始檢查權限...');

    const [usageAccess, overlayPermission, notificationPermission] =
      await Promise.all([
        this.checkUsageAccessPermission(),
        this.checkOverlayPermission(),
        this.checkNotificationPermission(),
      ]);

    const result = {
      usageAccess,
      overlayPermission,
      notificationPermission,
    };

    console.log('權限檢查結果:', result);
    return result;
  }

  /**
   * 檢查使用情況存取權限
   */
  async checkUsageAccessPermission(): Promise<boolean> {
    if (Platform.OS !== 'android') return true;

    try {
      // 使用原生模組檢查 PACKAGE_USAGE_STATS 權限
      const hasPermission = await FocusNativeModule.hasUsageAccess();
      console.log('使用情況存取權限檢查結果:', hasPermission);
      return hasPermission;
    } catch (error) {
      console.error('檢查使用情況存取權限失敗:', error);
      return false;
    }
  }

  /**
   * 檢查覆蓋其他應用程式權限
   */
  async checkOverlayPermission(): Promise<boolean> {
    if (Platform.OS !== 'android') return true;

    try {
      // 使用原生模組檢查 SYSTEM_ALERT_WINDOW 權限
      const hasPermission = await FocusNativeModule.canDrawOverlays();
      console.log('覆蓋權限檢查結果:', hasPermission);
      return hasPermission;
    } catch (error) {
      console.error('檢查覆蓋權限失敗:', error);
      return false;
    }
  }

  /**
   * 檢查通知權限
   */
  async checkNotificationPermission(): Promise<boolean> {
    if (Platform.OS !== 'android') return true;

    try {
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      console.log('通知權限檢查結果:', hasPermission);
      return hasPermission;
    } catch (error) {
      console.error('檢查通知權限失敗:', error);
      return false;
    }
  }

  /**
   * 請求通知權限
   */
  async requestNotificationPermission(): Promise<boolean> {
    if (Platform.OS !== 'android') return true;

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: '通知權限',
          message: '需要通知權限來發送專注提醒',
          buttonNeutral: '稍後詢問',
          buttonNegative: '取消',
          buttonPositive: '確定',
        },
      );
      console.log('通知權限請求結果:', granted);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.error('請求通知權限失敗:', error);
      return false;
    }
  }

  /**
   * 跳轉到使用情況存取設定頁面
   */
  async openUsageAccessSettings(): Promise<void> {
    if (Platform.OS !== 'android') return;

    try {
      console.log('開啟使用情況存取設定頁面');
      FocusNativeModule.openUsageAccessSettings();
    } catch (error) {
      console.error('開啟使用情況存取設定失敗:', error);
      Alert.alert('錯誤', '無法開啟設定頁面');
    }
  }

  /**
   * 跳轉到覆蓋權限設定頁面
   */
  async openOverlaySettings(): Promise<void> {
    if (Platform.OS !== 'android') return;

    try {
      console.log('開啟覆蓋權限設定頁面');
      await Linking.openSettings();
    } catch (error) {
      console.error('開啟覆蓋權限設定失敗:', error);
      Alert.alert('錯誤', '無法開啟設定頁面');
    }
  }

  /**
   * 跳轉到通知設定頁面
   */
  async openNotificationSettings(): Promise<void> {
    if (Platform.OS !== 'android') return;

    try {
      console.log('開啟通知設定頁面');
      await Linking.openSettings();
    } catch (error) {
      console.error('開啟通知設定失敗:', error);
      Alert.alert('錯誤', '無法開啟設定頁面');
    }
  }

  /**
   * 顯示權限說明對話框
   */
  showPermissionExplanation(
    permissionName: string,
    explanation: string,
    onOpenSettings: () => void,
  ): void {
    Alert.alert(`${permissionName} 權限`, explanation, [
      { text: '取消', style: 'cancel' },
      { text: '開啟設定', onPress: onOpenSettings },
    ]);
  }

  /**
   * 測試權限狀態（用於調試）
   */
  async testPermissions(): Promise<void> {
    console.log('=== 權限測試開始 ===');

    const permissions = await this.checkAllPermissions();
    console.log('權限狀態:', permissions);

    // 測試通知權限請求
    const notificationGranted = await this.requestNotificationPermission();
    console.log('通知權限請求結果:', notificationGranted);

    console.log('=== 權限測試結束 ===');
  }
}

export const permissionService = new PermissionService();
