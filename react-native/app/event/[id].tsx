import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Share, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { formatDistance } from 'date-fns';

// コンポーネント
import ProgressBar from '@/src/components/common/ProgressBar';
import WidgetPreview from '@/src/components/widgets/WidgetPreview';

// コンテキスト
import { useEvents } from '@/src/context/EventContext';
import { useTheme } from '@/src/context/ThemeContext';

// ユーティリティ
import { calculateTimeLeft } from '@/src/utils/dateUtils';
import { getEventStatus } from '@/src/utils/progressUtils';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getEvent, deleteEvent } = useEvents();
  const { colors } = useTheme();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  
  const event = getEvent(id);
  
  // イベントが存在しない場合
  if (!event) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>イベントが見つかりませんでした</Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary, marginTop: 20 }]}
          onPress={() => router.back()}
        >
          <Text style={{ color: 'white' }}>戻る</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const status = getEventStatus(startDate, endDate);
  
  // 残り時間の計算
  const { days, hours, minutes } = calculateTimeLeft(endDate);
  const isCompleted = status === 'completed';
  const isNotStarted = status === 'not_started';
  
  // 時間表示文字列の生成
  let timeLeftText = '';
  
  if (isCompleted) {
    timeLeftText = '完了';
  } else if (isNotStarted) {
    timeLeftText = `開始まで ${formatDistance(startDate, new Date(), { addSuffix: false })}`;
  } else if (days > 0) {
    timeLeftText = `残り ${days}日 ${hours}時間`;
  } else {
    timeLeftText = `残り ${hours}時間 ${minutes}分`;
  }
  
  // 削除ハンドラ
  const handleDelete = () => {
    Alert.alert(
      '削除の確認',
      'このイベントを削除してもよろしいですか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);
              await deleteEvent(id);
              router.back();
            } catch (error) {
              console.error('Failed to delete event:', error);
              Alert.alert('エラー', 'イベントの削除に失敗しました');
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };
  
  // 共有ハンドラ
  const handleShare = async () => {
    try {
      const startDateStr = startDate.toLocaleDateString();
      const endDateStr = endDate.toLocaleDateString();
      
      await Share.share({
        message: `${event.name}\n期間: ${startDateStr} 〜 ${endDateStr}\n「タイムプログレス」アプリで時間の経過を可視化しよう！`,
      });
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };
  
  // 編集画面に遷移
  const handleEdit = () => {
    // 将来的に編集画面に遷移
    Alert.alert('Info', '編集機能は開発中です');
  };
  
  // 動的スタイル
  const dynamicStyles = {
    container: {
      backgroundColor: colors.background,
    },
    progressSection: {
      backgroundColor: colors.card,
    },
    timeLeft: {
      color: colors.text,
    },
    dates: {
      color: colors.secondaryText,
    },
    detailsSection: {
      backgroundColor: colors.background,
    },
    detailLabel: {
      color: colors.secondaryText,
    },
    description: {
      color: colors.text,
    },
    detailText: {
      color: colors.text,
    },
    widgetPreviewSection: {
      backgroundColor: colors.card,
    },
    sectionTitle: {
      color: colors.text,
    },
    deleteButton: {
      backgroundColor: colors.error,
    },
  };
  
  return (
    <ScrollView style={[styles.container, dynamicStyles.container]}>
      <Stack.Screen 
        options={{
          title: event.name,
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
                <Ionicons name="share-outline" size={24} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={handleEdit}>
                <Ionicons name="create-outline" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />
      
      {/* プログレス表示 */}
      <View style={[styles.progressSection, dynamicStyles.progressSection]}>
        <View style={styles.progressHeader}>
          <Text style={[styles.timeLeft, dynamicStyles.timeLeft]}>{timeLeftText}</Text>
          <Text style={[styles.dates, dynamicStyles.dates]}>
            {startDate.toLocaleDateString()} 〜 {endDate.toLocaleDateString()}
          </Text>
        </View>
        
        <ProgressBar
          startDate={startDate}
          endDate={endDate}
          color={event.color}
          height={12}
          showPercentage
          animationDuration={1500}
        />
      </View>
      
      {/* イベント詳細 */}
      <View style={[styles.detailsSection, dynamicStyles.detailsSection]}>
        {/* 説明 */}
        {event.description && (
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, dynamicStyles.detailLabel]}>説明</Text>
            <Text style={[styles.description, dynamicStyles.description]}>{event.description}</Text>
          </View>
        )}
        
        {/* 状態 */}
        <View style={styles.detailItem}>
          <Text style={[styles.detailLabel, dynamicStyles.detailLabel]}>状態</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusIndicator, styles[`status_${status}`]]} />
            <Text style={[styles.statusText, dynamicStyles.detailText]}>
              {status === 'not_started'
                ? '開始前'
                : status === 'in_progress'
                ? '進行中'
                : '完了'}
            </Text>
          </View>
        </View>
        
        {/* 繰り返し */}
        {event.repeat && event.repeat.type !== 'none' && (
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, dynamicStyles.detailLabel]}>繰り返し</Text>
            <Text style={[styles.detailText, dynamicStyles.detailText]}>
              {event.repeat.type === 'daily'
                ? `${event.repeat.interval}日ごと`
                : event.repeat.type === 'weekly'
                ? `${event.repeat.interval}週間ごと`
                : event.repeat.type === 'monthly'
                ? `${event.repeat.interval}ヶ月ごと`
                : `${event.repeat.interval}年ごと`}
            </Text>
          </View>
        )}
        
        {/* ウィジェット表示 */}
        <View style={styles.detailItem}>
          <Text style={[styles.detailLabel, dynamicStyles.detailLabel]}>ウィジェット表示</Text>
          <Text style={[styles.detailText, dynamicStyles.detailText]}>
            {event.showInWidget ? '表示' : '非表示'}
          </Text>
        </View>
      </View>
      
      {/* ウィジェットプレビュー */}
      {event.showInWidget && (
        <View style={[styles.widgetPreviewSection, dynamicStyles.widgetPreviewSection]}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>ウィジェットプレビュー</Text>
          <WidgetPreview event={event} />
        </View>
      )}
      
      {/* 削除ボタン */}
      <TouchableOpacity
        style={[styles.deleteButton, dynamicStyles.deleteButton]}
        onPress={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <>
            <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
            <Text style={styles.deleteButtonText}>イベントを削除</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
  },
  progressSection: {
    padding: 20,
  },
  progressHeader: {
    marginBottom: 16,
  },
  timeLeft: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dates: {
    fontSize: 14,
    marginBottom: 12,
  },
  detailsSection: {
    padding: 20,
  },
  detailItem: {
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  detailText: {
    fontSize: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  status_not_started: {
    backgroundColor: '#FFC107', // Amber
  },
  status_in_progress: {
    backgroundColor: '#4CAF50', // Green
  },
  status_completed: {
    backgroundColor: '#9E9E9E', // Grey
  },
  statusText: {
    fontSize: 16,
  },
  widgetPreviewSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  deleteButton: {
    margin: 20,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
