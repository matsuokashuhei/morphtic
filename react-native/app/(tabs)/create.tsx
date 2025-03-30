import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';

// コンテキスト
import { useEvents } from '@/src/context/EventContext';
import { useTheme } from '@/src/context/ThemeContext';

// コンポーネント
import ColorPicker from '@/src/components/common/ColorPicker';

// 型
import { EventRepeat } from '@/src/types';

export default function CreateEventScreen() {
  const { addEvent } = useEvents();
  const { colors, isDarkMode } = useTheme();
  
  // フォーム状態
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1); // デフォルトは1ヶ月後
    return date;
  });
  const [color, setColor] = useState<string>('#4CAF50');
  const [showInWidget, setShowInWidget] = useState<boolean>(true);
  const [enableRepeat, setEnableRepeat] = useState<boolean>(false);
  const [repeatType, setRepeatType] = useState<EventRepeat['type']>('none');
  const [repeatInterval, setRepeatInterval] = useState<number>(1);
  
  // 日時ピッカーの表示状態
  const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);
  
  // 送信中状態
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // フォームのバリデーション
  const isFormValid = (): boolean => {
    if (!name.trim()) return false;
    if (startDate >= endDate) return false;
    return true;
  };
  
  // イベント作成
  const handleCreateEvent = async (): Promise<void> => {
    if (!isFormValid()) {
      Alert.alert(
        'エラー',
        '入力内容に問題があります。イベント名を入力し、終了日が開始日より後であることを確認してください。'
      );
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const repeat = enableRepeat
        ? {
            type: repeatType,
            interval: repeatInterval,
            endAfter: null,
            endDate: null,
          }
        : undefined;
      
      await addEvent({
        name,
        description,
        startDate,
        endDate,
        color,
        repeat,
        showInWidget,
        widgetPosition: 0, // デフォルト位置
        notifyAt: [], // 通知設定なし
      });
      
      router.back();
    } catch (error) {
      console.error('Failed to create event:', error);
      Alert.alert(
        'エラー',
        'イベントの作成に失敗しました。もう一度お試しください。'
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 日付変更ハンドラ
  const handleStartDateChange = (event: any, selectedDate?: Date): void => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      // 終了日が開始日より前の場合、終了日を更新
      if (endDate <= selectedDate) {
        const newEndDate = new Date(selectedDate);
        newEndDate.setMonth(newEndDate.getMonth() + 1);
        setEndDate(newEndDate);
      }
    }
  };
  
  const handleEndDateChange = (event: any, selectedDate?: Date): void => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };
  
  // 繰り返し設定の表示・非表示
  const renderRepeatSettings = (): React.ReactNode => {
    if (!enableRepeat) return null;
    
    return (
      <View style={[styles.repeatContainer, { backgroundColor: isDarkMode ? colors.card : '#F5F5F5' }]}>
        <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>繰り返し設定</Text>
        
        <View style={styles.repeatTypeContainer}>
          {['daily', 'weekly', 'monthly', 'yearly'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.repeatTypeButton,
                { borderColor: colors.border, backgroundColor: isDarkMode ? colors.background : 'white' },
                repeatType === type && [styles.repeatTypeButtonActive, { borderColor: colors.primary, backgroundColor: isDarkMode ? 'rgba(76, 175, 80, 0.2)' : '#E8F5E9' }],
              ]}
              onPress={() => setRepeatType(type as EventRepeat['type'])}
            >
              <Text
                style={[
                  styles.repeatTypeText,
                  { color: colors.secondaryText },
                  repeatType === type && [styles.repeatTypeTextActive, { color: colors.primary }],
                ]}
              >
                {type === 'daily'
                  ? '毎日'
                  : type === 'weekly'
                  ? '毎週'
                  : type === 'monthly'
                  ? '毎月'
                  : '毎年'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.repeatIntervalContainer}>
          <Text style={[styles.repeatIntervalLabel, { color: colors.text }]}>間隔:</Text>
          <TextInput
            style={[styles.repeatIntervalInput, { borderColor: colors.border, backgroundColor: isDarkMode ? colors.background : 'white', color: colors.text }]}
            value={repeatInterval.toString()}
            onChangeText={(text) => {
              const number = parseInt(text);
              if (!isNaN(number) && number > 0) {
                setRepeatInterval(number);
              }
            }}
            keyboardType="numeric"
          />
          <Text style={[styles.repeatIntervalUnit, { color: colors.text }]}>
            {repeatType === 'daily'
              ? '日'
              : repeatType === 'weekly'
              ? '週'
              : repeatType === 'monthly'
              ? 'ヶ月'
              : '年'}
          </Text>
        </View>
      </View>
    );
  };
  
  // 動的スタイル
  const dynamicStyles = {
    container: {
      backgroundColor: colors.background,
    },
    label: {
      color: colors.text,
    },
    input: {
      backgroundColor: isDarkMode ? colors.card : '#F5F5F5',
      borderColor: colors.border,
      color: colors.text,
    },
  };
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen options={{ title: '新規イベント' }} />
      
      <ScrollView style={[styles.container, dynamicStyles.container]}>
        {/* イベント名 */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, dynamicStyles.label]}>イベント名 *</Text>
          <TextInput
            style={[styles.input, dynamicStyles.input]}
            value={name}
            onChangeText={setName}
            placeholder="イベント名を入力"
            placeholderTextColor={isDarkMode ? '#888888' : '#AAAAAA'}
          />
        </View>
        
        {/* 説明 */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, dynamicStyles.label]}>説明（オプション）</Text>
          <TextInput
            style={[styles.input, styles.textArea, dynamicStyles.input]}
            value={description}
            onChangeText={setDescription}
            placeholder="イベントの説明を入力"
            placeholderTextColor={isDarkMode ? '#888888' : '#AAAAAA'}
            multiline
            numberOfLines={3}
          />
        </View>
        
        {/* 開始日時 */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, dynamicStyles.label]}>開始日時 *</Text>
          <TouchableOpacity
            style={[styles.datePickerButton, { backgroundColor: isDarkMode ? colors.card : '#F5F5F5', borderColor: colors.border }]}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text style={{ color: colors.text }}>
              {startDate.toLocaleDateString()} {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            <Ionicons name="calendar-outline" size={24} color={colors.secondaryText} />
          </TouchableOpacity>
          
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="datetime"
              is24Hour={true}
              display="default"
              onChange={handleStartDateChange}
            />
          )}
        </View>
        
        {/* 終了日時 */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, dynamicStyles.label]}>終了日時 *</Text>
          <TouchableOpacity
            style={[styles.datePickerButton, { backgroundColor: isDarkMode ? colors.card : '#F5F5F5', borderColor: colors.border }]}
            onPress={() => setShowEndDatePicker(true)}
          >
            <Text style={{ color: colors.text }}>
              {endDate.toLocaleDateString()} {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            <Ionicons name="calendar-outline" size={24} color={colors.secondaryText} />
          </TouchableOpacity>
          
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="datetime"
              is24Hour={true}
              display="default"
              onChange={handleEndDateChange}
            />
          )}
        </View>
        
        {/* プログレスバーの色 */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, dynamicStyles.label]}>プログレスバーの色</Text>
          <ColorPicker
            selectedColor={color}
            onSelectColor={setColor}
            colors={[
              '#4CAF50', // Green
              '#2196F3', // Blue
              '#F44336', // Red
              '#FFC107', // Amber
              '#9C27B0', // Purple
              '#FF9800', // Orange
              '#795548', // Brown
              '#607D8B', // Blue Grey
            ]}
          />
        </View>
        
        {/* 繰り返し設定 */}
        <View style={styles.formGroup}>
          <View style={styles.switchContainer}>
            <Text style={[styles.label, dynamicStyles.label]}>繰り返し</Text>
            <Switch
              value={enableRepeat}
              onValueChange={setEnableRepeat}
              trackColor={{ false: '#E0E0E0', true: isDarkMode ? 'rgba(76, 175, 80, 0.5)' : '#A5D6A7' }}
              thumbColor={enableRepeat ? colors.primary : isDarkMode ? '#888888' : '#F5F5F5'}
            />
          </View>
          {renderRepeatSettings()}
        </View>
        
        {/* ウィジェット表示 */}
        <View style={styles.formGroup}>
          <View style={styles.switchContainer}>
            <Text style={[styles.label, dynamicStyles.label]}>ウィジェットに表示</Text>
            <Switch
              value={showInWidget}
              onValueChange={setShowInWidget}
              trackColor={{ false: '#E0E0E0', true: isDarkMode ? 'rgba(76, 175, 80, 0.5)' : '#A5D6A7' }}
              thumbColor={showInWidget ? colors.primary : isDarkMode ? '#888888' : '#F5F5F5'}
            />
          </View>
        </View>
        
        {/* 送信ボタン */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton, { borderColor: colors.border }]}
            onPress={() => router.back()}
            disabled={isSubmitting}
          >
            <Text style={[styles.cancelButtonText, { color: colors.secondaryText }]}>キャンセル</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.button,
              styles.submitButton,
              { backgroundColor: colors.primary },
              !isFormValid() && [styles.disabledButton, { backgroundColor: isDarkMode ? '#555555' : '#BDBDBD' }],
            ]}
            onPress={handleCreateEvent}
            disabled={!isFormValid() || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>作成</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  repeatContainer: {
    marginTop: 16,
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  repeatTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  repeatTypeButton: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  repeatTypeButtonActive: {
    borderWidth: 1,
  },
  repeatTypeText: {
    fontSize: 14,
  },
  repeatTypeTextActive: {
    fontWeight: 'bold',
  },
  repeatIntervalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  repeatIntervalLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  repeatIntervalInput: {
    width: 60,
    height: 40,
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 8,
    textAlign: 'center',
  },
  repeatIntervalUnit: {
    marginLeft: 8,
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 32,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    marginLeft: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.7,
  },
});
