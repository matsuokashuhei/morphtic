import { StyleSheet, ScrollView, View, Text, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import React, { useState, useCallback } from 'react';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useEvents } from '@/src/context/EventContext';
import { useTheme } from '@/src/context/ThemeContext';
import EventCard from '@/src/components/events/EventCard';
import { Event } from '@/src/types';
import { getEventStatus } from '@/src/utils/progressUtils';

type FilterType = 'all' | 'active' | 'completed';

export default function EventsScreen() {
  const { events, loading, error, refreshEvents } = useEvents();
  const { colors, isDarkMode } = useTheme();
  const [filter, setFilter] = useState<FilterType>('active');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // ナビゲーションのフォーカス時にイベントを更新
  useFocusEffect(
    useCallback(() => {
      refreshEvents();
    }, [])
  );

  // イベントフィルタリング
  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    
    const status = getEventStatus(
      new Date(event.startDate), 
      new Date(event.endDate)
    );
    
    if (filter === 'active') return status !== 'completed';
    if (filter === 'completed') return status === 'completed';
    return true;
  });

  // イベント詳細画面に遷移
  const handleEventPress = (event: Event) => {
    router.push(`/event/${event.id}`);
  };

  // 新規イベント作成画面に遷移
  const handleCreateEvent = () => {
    router.push('/create');
  };

  // プルダウンリフレッシュ
  const onRefresh = async () => {
    setRefreshing(true);
    await refreshEvents();
    setRefreshing(false);
  };

  // スタイルを動的に生成
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.primary,
      padding: 16,
      paddingTop: 48,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
    },
    filterContainer: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    filterButton: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 8,
      borderRadius: 20,
    },
    activeFilter: {
      backgroundColor: isDarkMode ? 'rgba(76, 175, 80, 0.2)' : '#E8F5E9',
    },
    filterText: {
      fontSize: 14,
      color: colors.secondaryText,
    },
    activeFilterText: {
      color: colors.primary,
      fontWeight: 'bold',
    },
    listContainer: {
      padding: 16,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContainer: {
      padding: 16,
      backgroundColor: colors.error + '20', // 透明度を追加
      margin: 16,
      borderRadius: 8,
    },
    errorText: {
      color: colors.error,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
    },
    emptyText: {
      fontSize: 16,
      color: colors.secondaryText,
      marginTop: 16,
      marginBottom: 24,
      textAlign: 'center',
    },
    emptyButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 24,
    },
    emptyButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    fab: {
      position: 'absolute',
      bottom: 24,
      right: 24,
      backgroundColor: colors.primary,
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      {/* フィルターコントロール */}
      <View style={dynamicStyles.filterContainer}>
        <TouchableOpacity
          style={[dynamicStyles.filterButton, filter === 'all' && dynamicStyles.activeFilter]}
          onPress={() => setFilter('all')}
        >
          <Text style={[dynamicStyles.filterText, filter === 'all' && dynamicStyles.activeFilterText]}>
            すべて
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[dynamicStyles.filterButton, filter === 'active' && dynamicStyles.activeFilter]}
          onPress={() => setFilter('active')}
        >
          <Text style={[dynamicStyles.filterText, filter === 'active' && dynamicStyles.activeFilterText]}>
            進行中
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[dynamicStyles.filterButton, filter === 'completed' && dynamicStyles.activeFilter]}
          onPress={() => setFilter('completed')}
        >
          <Text style={[dynamicStyles.filterText, filter === 'completed' && dynamicStyles.activeFilterText]}>
            完了
          </Text>
        </TouchableOpacity>
      </View>

      {/* エラー表示 */}
      {error && (
        <View style={dynamicStyles.errorContainer}>
          <Text style={dynamicStyles.errorText}>{error}</Text>
        </View>
      )}

      {/* イベントリスト */}
      {loading && !refreshing ? (
        <View style={dynamicStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : filteredEvents.length === 0 ? (
        <View style={dynamicStyles.emptyContainer}>
          <Ionicons name="calendar-outline" size={64} color={colors.border} />
          <Text style={dynamicStyles.emptyText}>
            {filter === 'all'
              ? 'イベントがありません'
              : filter === 'active'
              ? '進行中のイベントがありません'
              : '完了したイベントがありません'}
          </Text>
          <TouchableOpacity style={dynamicStyles.emptyButton} onPress={() => router.push('/create')}>
            <Text style={dynamicStyles.emptyButtonText}>イベントを作成</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={dynamicStyles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filteredEvents.map((event) => (
            <EventCard 
              key={event.id} 
              event={event} 
              onPress={handleEventPress} 
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
