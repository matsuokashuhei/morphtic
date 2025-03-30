import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/context/ThemeContext';
import { useAuth } from '@/src/context/AuthContext';
import { Stack, useRouter } from 'expo-router';

const SettingItem = ({ icon, title, description, value, onValueChange, type = 'switch' }) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity 
      style={styles.settingItem}
      onPress={() => {
        if (type === 'button') {
          onValueChange?.();
        } else if (type === 'switch') {
          onValueChange?.(!value);
        }
      }}
    >
      <View style={styles.settingItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: colors.card }]}>
          <Ionicons name={icon} size={22} color={colors.primary} />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>
            {title}
          </Text>
          {description && (
            <Text style={[styles.settingDescription, { color: colors.secondaryText }]}>
              {description}
            </Text>
          )}
        </View>
      </View>
      
      {type === 'switch' && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#E0E0E0', true: colors.primary + '50' }}
          thumbColor={value ? colors.primary : '#F5F5F5'}
        />
      )}
      
      {type === 'button' && (
        <Ionicons name="chevron-forward" size={22} color={colors.secondaryText} />
      )}
      
      {type === 'value' && (
        <Text style={{ color: colors.secondaryText }}>
          {value}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, setTheme, colors, isDarkMode } = useTheme();
  const { signOut, user } = useAuth();
  
  // 設定状態
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
  const [widgetUpdateFrequency, setWidgetUpdateFrequency] = useState('hourly');
  
  // テーマ変更ハンドラ
  const handleThemeChange = () => {
    Alert.alert(
      'テーマ設定',
      '使用するテーマを選択してください',
      [
        {
          text: 'システム設定に合わせる',
          onPress: () => setTheme('system'),
        },
        {
          text: 'ライトモード',
          onPress: () => setTheme('light'),
        },
        {
          text: 'ダークモード',
          onPress: () => setTheme('dark'),
        },
        {
          text: 'キャンセル',
          style: 'cancel',
        },
      ]
    );
  };
  
  // ウィジェット更新間隔変更ハンドラ
  const handleWidgetUpdateFrequencyChange = () => {
    Alert.alert(
      'ウィジェット更新頻度',
      '更新頻度を選択してください',
      [
        {
          text: 'リアルタイム',
          onPress: () => setWidgetUpdateFrequency('realtime'),
        },
        {
          text: '1時間ごと',
          onPress: () => setWidgetUpdateFrequency('hourly'),
        },
        {
          text: '1日ごと',
          onPress: () => setWidgetUpdateFrequency('daily'),
        },
        {
          text: 'キャンセル',
          style: 'cancel',
        },
      ]
    );
  };
  
  // ログアウトハンドラ
  const handleLogout = () => {
    Alert.alert(
      'ログアウト',
      'ログアウトしてもよろしいですか？',
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: 'ログアウト',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              // サインアウト成功後、ログイン画面に遷移
              router.push('/auth/signin');
            } catch (err) {
              Alert.alert('エラー', 'ログアウトに失敗しました。時間をおいて再度お試しください。');
            }
          },
        },
      ]
    );
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: '設定' }} />
      
      {/* 表示設定 */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>表示設定</Text>
        
        <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
          <SettingItem
            icon="color-palette-outline"
            title="テーマ"
            description="ダーク/ライトモードを切り替えます"
            value={theme === 'system' ? 'システム設定に合わせる' : theme === 'dark' ? 'ダークモード' : 'ライトモード'}
            onValueChange={handleThemeChange}
            type="button"
          />
          
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
          
          <SettingItem
            icon="checkmark-circle-outline"
            title="完了したイベントを表示"
            description="一覧に完了したイベントを表示します"
            value={showCompleted}
            onValueChange={setShowCompleted}
          />
        </View>
      </View>
      
      {/* ウィジェット設定 */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>ウィジェット設定</Text>
        
        <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
          <SettingItem
            icon="refresh-outline"
            title="更新頻度"
            description="ウィジェットの更新頻度を設定します"
            value={widgetUpdateFrequency === 'realtime' ? 'リアルタイム' : widgetUpdateFrequency === 'hourly' ? '1時間ごと' : '1日ごと'}
            onValueChange={handleWidgetUpdateFrequencyChange}
            type="button"
          />
        </View>
      </View>
      
      {/* 通知設定 */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>通知設定</Text>
        
        <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
          <SettingItem
            icon="notifications-outline"
            title="通知"
            description="イベントの通知を有効にします"
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
        </View>
      </View>
      
      {/* ユーザー情報 */}
      {user && (
        <View style={styles.userInfoContainer}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary, width: 60, height: 60 }]}>
            <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
              {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.userInfoTextContainer}>
            <Text style={[styles.userName, { color: colors.text }]}>{user.name || 'ユーザー'}</Text>
            <Text style={[styles.userEmail, { color: colors.secondaryText }]}>{user.email}</Text>
          </View>
        </View>
      )}
      
      {/* アカウント設定 */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>アカウント</Text>
        
        <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
          <SettingItem
            icon="person-outline"
            title="アカウント情報"
            description="アカウント詳細と設定"
            onValueChange={() => Alert.alert('Info', 'アカウント設定は開発中です')}
            type="button"
          />
          
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
          
          <SettingItem
            icon="cloud-outline"
            title="データを同期"
            description="クラウドとデータを同期します"
            onValueChange={() => Alert.alert('Info', 'データ同期は開発中です')}
            type="button"
          />
          
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
          
          <SettingItem
            icon="log-out-outline"
            title="ログアウト"
            description="アカウントからログアウトします"
            onValueChange={handleLogout}
            type="button"
          />
        </View>
      </View>
      
      {/* アプリ情報 */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>アプリ情報</Text>
        
        <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
          <SettingItem
            icon="information-circle-outline"
            title="バージョン"
            value="1.0.0"
            type="value"
          />
          
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
          
          <SettingItem
            icon="document-text-outline"
            title="ライセンス"
            description="オープンソースライセンス情報"
            onValueChange={() => Alert.alert('Info', 'ライセンス情報は開発中です')}
            type="button"
          />
          
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
          
          <SettingItem
            icon="heart-outline"
            title="アプリを評価する"
            description="App Storeでこのアプリを評価"
            onValueChange={() => Alert.alert('Info', '評価機能は開発中です')}
            type="button"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginLeft: 12,
  },
  sectionContent: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  separator: {
    height: 1,
    marginHorizontal: 16,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  userInfoTextContainer: {
    marginLeft: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
});
