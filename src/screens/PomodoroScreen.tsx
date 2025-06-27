import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { pomodoroService } from '../services/PomodoroService';
import { PomodoroSession } from '../types';

const PomodoroScreen: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<
    PomodoroSession | undefined
  >();
  const [remainingTime, setRemainingTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    // 設定回調函數
    pomodoroService.setOnSessionUpdate(session => {
      setCurrentSession(session);
      setRemainingTime(pomodoroService.getRemainingTime());
      setProgress(pomodoroService.getProgress());
    });

    pomodoroService.setOnSessionComplete(session => {
      setCurrentSession(undefined);
      setRemainingTime(0);
      setProgress(0);
      setSessionCount(pomodoroService.getSessionCount());

      // 顯示完成提醒
      if (session.type === 'work') {
        Alert.alert('工作時段完成！', '該休息一下了。', [
          {
            text: '開始休息',
            onPress: () => pomodoroService.startBreakSession(),
          },
          { text: '稍後', style: 'cancel' },
        ]);
      } else {
        Alert.alert('休息時間結束！', '該回到工作了。', [
          {
            text: '開始工作',
            onPress: () => pomodoroService.startWorkSession(),
          },
          { text: '稍後', style: 'cancel' },
        ]);
      }
    });

    // 初始化狀態
    const session = pomodoroService.getCurrentSession();
    if (session) {
      setCurrentSession(session);
      setRemainingTime(pomodoroService.getRemainingTime());
      setProgress(pomodoroService.getProgress());
    }
    setSessionCount(pomodoroService.getSessionCount());

    // 更新計時器
    const timer = setInterval(() => {
      if (currentSession?.isActive) {
        setRemainingTime(pomodoroService.getRemainingTime());
        setProgress(pomodoroService.getProgress());
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentSession?.isActive]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  const getSessionTypeText = (type?: string): string => {
    switch (type) {
      case 'work':
        return '工作時間';
      case 'break':
        return '休息時間';
      case 'longBreak':
        return '長休息時間';
      default:
        return '準備開始';
    }
  };

  const getSessionTypeColor = (type?: string): string => {
    switch (type) {
      case 'work':
        return '#FF6B6B';
      case 'break':
        return '#4ECDC4';
      case 'longBreak':
        return '#45B7D1';
      default:
        return '#95A5A6';
    }
  };

  const handleStartWork = () => {
    pomodoroService.startWorkSession();
  };

  const handleStartBreak = () => {
    pomodoroService.startBreakSession();
  };

  const handlePauseResume = () => {
    if (currentSession?.isActive) {
      pomodoroService.pauseSession();
    } else if (currentSession) {
      pomodoroService.resumeSession();
    }
  };

  const handleStop = () => {
    Alert.alert('停止計時器', '確定要停止當前的計時器嗎？', [
      { text: '取消', style: 'cancel' },
      {
        text: '確定',
        style: 'destructive',
        onPress: () => pomodoroService.stopSession(),
      },
    ]);
  };

  const handleReset = () => {
    Alert.alert('重置計數器', '確定要重置會話計數嗎？', [
      { text: '取消', style: 'cancel' },
      {
        text: '確定',
        style: 'destructive',
        onPress: () => pomodoroService.resetSessionCount(),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* 會話計數 */}
      <View style={styles.sessionCountContainer}>
        <Text style={styles.sessionCountText}>
          已完成 {sessionCount} 個工作時段
        </Text>
      </View>

      {/* 計時器顯示 */}
      <View style={styles.timerContainer}>
        <Text style={styles.sessionTypeText}>
          {getSessionTypeText(currentSession?.type)}
        </Text>

        <View style={styles.timerDisplay}>
          <Text
            style={[
              styles.timerText,
              { color: getSessionTypeColor(currentSession?.type) },
            ]}
          >
            {formatTime(remainingTime)}
          </Text>
        </View>

        {/* 進度條 */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                  backgroundColor: getSessionTypeColor(currentSession?.type),
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>
      </View>

      {/* 控制按鈕 */}
      <View style={styles.controlsContainer}>
        {!currentSession ? (
          // 沒有進行中的會話
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.workButton]}
              onPress={handleStartWork}
            >
              <Text style={styles.buttonText}>開始工作</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.breakButton]}
              onPress={handleStartBreak}
            >
              <Text style={styles.buttonText}>開始休息</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // 有進行中的會話
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.pauseButton]}
              onPress={handlePauseResume}
            >
              <Text style={styles.buttonText}>
                {currentSession.isActive ? '暫停' : '繼續'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.stopButton]}
              onPress={handleStop}
            >
              <Text style={styles.buttonText}>停止</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* 重置按鈕 */}
      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.resetButtonText}>重置計數器</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  sessionCountContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  sessionCountText: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '500',
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessionTypeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 20,
  },
  timerDisplay: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 30,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '80%',
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  controlsContainer: {
    marginBottom: 30,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workButton: {
    backgroundColor: '#FF6B6B',
  },
  breakButton: {
    backgroundColor: '#4ECDC4',
  },
  pauseButton: {
    backgroundColor: '#FFA726',
  },
  stopButton: {
    backgroundColor: '#EF5350',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default PomodoroScreen;
