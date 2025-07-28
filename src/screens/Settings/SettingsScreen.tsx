import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

const SettingsScreen = () => {
  const { colors } = useTheme();
  const [accessibilityEnabled, setAccessibilityEnabled] = useState(false);
  const [overlayEnabled, setOverlayEnabled] = useState(false);

  const toggleAccessibility = () => {
    setAccessibilityEnabled(!accessibilityEnabled);
  };

  const toggleOverlay = () => {
    setOverlayEnabled(!overlayEnabled);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={true}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header */}
      <View style={styles.header}>
        {/* <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity> */}
        <Text style={styles.title}>Service Permissions</Text>
      </View>

      {/* Description */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>
          為了確保應用在後台計時正常運行，避免後台運行時被系統結束運行，請在手機中設置以下設置項。
        </Text>
        <Text style={styles.noteText}>
          ＊說明:
          設置步驟中一些菜單項路徑和名稱在不同安卓版本中可能存在一定差別，請根據實際情況進行設置。
        </Text>
      </View>

      {/* Android Accessibility Service Section */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionIcon}>🧭</Text>
            <Text style={styles.sectionTitle}>Android 無障礙服務</Text>
          </View>
          <Switch
            value={accessibilityEnabled}
            onValueChange={toggleAccessibility}
            trackColor={{ false: '#767577', true: '#FF6EA8' }}
            thumbColor={accessibilityEnabled ? '#ffffff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.subSection}>
          <View style={styles.subSectionHeader}>
            <Text style={styles.subSectionIcon}>🔍</Text>
            <Text style={styles.subSectionTitle}>這是幹嘛的？</Text>
          </View>
          <Text style={styles.subSectionText}>
            幫助我們知道你正在滑哪些社群
            App、滑了多久,一旦偵測到焦慮眼動,我們會即時提醒你!
          </Text>
        </View>

        <View style={styles.subSection}>
          <View style={styles.subSectionHeader}>
            <Text style={styles.subSectionIcon}>❓</Text>
            <Text style={styles.subSectionTitle}>開啟後會怎樣？</Text>
          </View>
          <Text style={styles.subSectionText}>
            通知欄會顯示「Mochi 正在守護你」App 會在背景輕巧運作,不會打擾你
          </Text>
        </View>
      </View>

      {/* Display Overlay Section */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionIcon}>🎯</Text>
            <Text style={styles.sectionTitle}>Display Overlay</Text>
          </View>
          <Switch
            value={overlayEnabled}
            onValueChange={toggleOverlay}
            trackColor={{ false: '#767577', true: '#FF6EA8' }}
            thumbColor={overlayEnabled ? '#ffffff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.subSection}>
          <View style={styles.subSectionHeader}>
            <Text style={styles.subSectionIcon}>🔍</Text>
            <Text style={styles.subSectionTitle}>這是幹嘛的？</Text>
          </View>
          <Text style={styles.subSectionText}>
            讓 Mochi
            可以在你滑社群時,在畫面上顯示簡單提示或眼動標示,幫你即時覺察自己的狀態。
          </Text>
        </View>

        <View style={styles.subSection}>
          <View style={styles.subSectionHeader}>
            <Text style={styles.subSectionIcon}>❓</Text>
            <Text style={styles.subSectionTitle}>開啟後會怎樣？</Text>
          </View>
          <Text style={styles.subSectionText}>
            畫面上會出現角色小提示,不影響使用,但會適時提醒你注意自己的滑動和情緒。
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 120,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  backIcon: {
    fontSize: 24,
    color: '#9CA3AF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF0066',
  },
  descriptionContainer: {
    marginBottom: 30,
  },
  descriptionText: {
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 20,
    marginBottom: 10,
  },
  noteText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  sectionCard: {
    backgroundColor: '#424242',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subSection: {
    marginBottom: 15,
  },
  subSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subSectionIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  subSectionText: {
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 16,
    marginLeft: 30,
  },
});

export default SettingsScreen;
