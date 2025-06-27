import { useState, useEffect, useCallback } from 'react';
import { permissionService } from '../services/PermissionService';
import { PermissionStatus } from '../types';

export const usePermissions = () => {
  const [permissions, setPermissions] = useState<PermissionStatus>({
    usageAccess: false,
    overlayPermission: false,
    notificationPermission: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  const checkPermissions = useCallback(async () => {
    try {
      setIsLoading(true);
      const currentPermissions = await permissionService.checkAllPermissions();
      setPermissions(currentPermissions);
    } catch (error) {
      console.error('檢查權限失敗:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const requestNotificationPermission = useCallback(async () => {
    try {
      const granted = await permissionService.requestNotificationPermission();
      if (granted) {
        setPermissions(prev => ({ ...prev, notificationPermission: true }));
      }
      return granted;
    } catch (error) {
      console.error('請求通知權限失敗:', error);
      return false;
    }
  }, []);

  const openUsageAccessSettings = useCallback(() => {
    permissionService.showPermissionExplanation(
      '使用情況存取',
      '需要此權限來監控您使用的應用程式，以便在您開啟干擾應用程式時提醒您。',
      () => permissionService.openUsageAccessSettings(),
    );
  }, []);

  const openOverlaySettings = useCallback(() => {
    permissionService.showPermissionExplanation(
      '覆蓋其他應用程式',
      '需要此權限來顯示提醒視窗，當您開啟干擾應用程式時會顯示提醒。',
      () => permissionService.openOverlaySettings(),
    );
  }, []);

  const allPermissionsGranted = useCallback(() => {
    return (
      permissions.usageAccess &&
      permissions.overlayPermission &&
      permissions.notificationPermission
    );
  }, [permissions]);

  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  return {
    permissions,
    isLoading,
    allPermissionsGranted: allPermissionsGranted(),
    checkPermissions,
    requestNotificationPermission,
    openUsageAccessSettings,
    openOverlaySettings,
  };
};
