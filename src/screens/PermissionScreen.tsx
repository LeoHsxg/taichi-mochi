import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { permissionService } from '../services/PermissionService';
import { appMonitorService } from '../services/AppMonitorService';
import { PermissionStatus } from '../types';

interface PermissionScreenProps {
  onPermissionsGranted: () => void;
}

const PermissionScreen: React.FC<PermissionScreenProps> = ({
  onPermissionsGranted,
}) => {
  const [permissions, setPermissions] = useState<PermissionStatus>({
    usageAccess: false,
    overlayPermission: false,
    notificationPermission: false,
    accessibilityService: false,
  });

  useEffect(() => {
    checkPermissions();
  }, []);

  useEffect(() => {
    // 在 Android 12 上，通知權限預設為允許，所以我們主要檢查覆蓋權限和無障礙服務
    const hasRequiredPermissions =
      permissions.overlayPermission && permissions.accessibilityService;

    if (hasRequiredPermissions) {
      onPermissionsGranted();
    }
  }, [permissions, onPermissionsGranted]);

  const checkPermissions = async () => {
    const currentPermissions = await permissionService.checkAllPermissions();
    const accessibilityEnabled =
      await appMonitorService.checkAccessibilityService();
    setPermissions({
      ...currentPermissions,
      accessibilityService: accessibilityEnabled,
    });
  };

  const handleRequestNotificationPermission = async () => {
    const granted = await permissionService.requestNotificationPermission();
    if (granted) {
      setPermissions(prev => ({ ...prev, notificationPermission: true }));
    }
  };

  const handleOpenOverlaySettings = () => {
    permissionService.showPermissionExplanation(
      '覆蓋其他應用程式',
      '需要此權限來顯示提醒視窗，當您開啟干擾應用程式時會顯示提醒。',
      () => permissionService.openOverlaySettings(),
    );
  };

  const handleRefreshPermissions = async () => {
    await checkPermissions();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>歡迎使用 FocusMonitorApp</Text>
        <Text style={styles.subtitle}>
          為了提供最佳的專注體驗，我們需要以下權限：
        </Text>

        <View style={styles.permissionList}>
          {/* 使用情況存取權限 */}
          {/* <View style={styles.permissionItem}>
            <View style={styles.permissionHeader}>
              <Text style={styles.permissionTitle}>使用情況存取</Text>
              <View
                style={[
                  styles.statusIndicator,
                  permissions.usageAccess ? styles.granted : styles.denied,
                ]}
              >
                <Text style={styles.statusText}>
                  {permissions.usageAccess ? '已授權' : '未授權'}
                </Text>
              </View>
            </View>
            <Text style={styles.permissionDescription}>
              監控您使用的應用程式，在開啟干擾應用程式時提醒您
            </Text>
            {!permissions.usageAccess && (
              <TouchableOpacity
                style={styles.permissionButton}
                onPress={handleOpenUsageAccessSettings}
              >
                <Text style={styles.buttonText}>開啟設定</Text>
              </TouchableOpacity>
            )}
          </View> */}

          {/* 覆蓋權限 */}
          <View style={styles.permissionItem}>
            <View style={styles.permissionHeader}>
              <Text style={styles.permissionTitle}>覆蓋其他應用程式</Text>
              <View
                style={[
                  styles.statusIndicator,
                  permissions.overlayPermission
                    ? styles.granted
                    : styles.denied,
                ]}
              >
                <Text style={styles.statusText}>
                  {permissions.overlayPermission ? '已授權' : '未授權'}
                </Text>
              </View>
            </View>
            <Text style={styles.permissionDescription}>
              顯示提醒視窗，當您開啟干擾應用程式時會顯示提醒
            </Text>
            {!permissions.overlayPermission && (
              <TouchableOpacity
                style={styles.permissionButton}
                onPress={handleOpenOverlaySettings}
              >
                <Text style={styles.buttonText}>開啟設定</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* 通知權限 */}
          <View style={styles.permissionItem}>
            <View style={styles.permissionHeader}>
              <Text style={styles.permissionTitle}>通知權限</Text>
              <View
                style={[
                  styles.statusIndicator,
                  permissions.notificationPermission
                    ? styles.granted
                    : styles.denied,
                ]}
              >
                <Text style={styles.statusText}>
                  {permissions.notificationPermission ? '已授權' : '未授權'}
                </Text>
              </View>
            </View>
            <Text style={styles.permissionDescription}>
              發送專注提醒和休息提醒通知
            </Text>
            {!permissions.notificationPermission && (
              <TouchableOpacity
                style={styles.permissionButton}
                onPress={handleRequestNotificationPermission}
              >
                <Text style={styles.buttonText}>請求權限</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* 無障礙服務權限 */}
          <View style={styles.permissionItem}>
            <View style={styles.permissionHeader}>
              <Text style={styles.permissionTitle}>無障礙服務</Text>
              <View
                style={[
                  styles.statusIndicator,
                  permissions.accessibilityService
                    ? styles.granted
                    : styles.denied,
                ]}
              >
                <Text style={styles.statusText}>
                  {permissions.accessibilityService ? '已啟用' : '未啟用'}
                </Text>
              </View>
            </View>
            <Text style={styles.permissionDescription}>
              監控前景應用程式狀態，提供即時的專注提醒功能
            </Text>
            {!permissions.accessibilityService && (
              <TouchableOpacity
                style={styles.permissionButton}
                onPress={() => appMonitorService.openAccessibilitySettings()}
              >
                <Text style={styles.buttonText}>開啟設定</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefreshPermissions}
        >
          <Text style={styles.refreshButtonText}>重新檢查權限</Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          請確保所有權限都已授權後，應用程式才能正常運作。
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
    lineHeight: 22,
  },
  permissionList: {
    marginBottom: 30,
  },
  permissionItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  permissionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  granted: {
    backgroundColor: '#4CAF50',
  },
  denied: {
    backgroundColor: '#F44336',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  permissionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  permissionButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  refreshButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 20,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  note: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default PermissionScreen;
