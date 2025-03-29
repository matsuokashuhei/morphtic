import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/context/ThemeContext';

const ExploreCard = ({ title, description, icon, onPress }) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.card }]} 
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
        <Ionicons name={icon} size={24} color={colors.primary} />
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.cardDescription, { color: colors.secondaryText }]}>
          {description}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.secondaryText} />
    </TouchableOpacity>
  );
};

export default function ExploreScreen() {
  const { colors } = useTheme();
  
  const exploreItems = [
    {
      title: 'テンプレート',
      description: '人気のテンプレートからイベントを作成',
      icon: 'duplicate-outline',
      onPress: () => {},
    },
    {
      title: 'インスピレーション',
      description: '他のユーザーの公開イベントを閲覧',
      icon: 'flash-outline',
      onPress: () => {},
    },
    {
      title: '統計と分析',
      description: 'あなたの時間の使い方を分析',
      icon: 'bar-chart-outline',
      onPress: () => {},
    },
    {
      title: '目標設定',
      description: '目標達成のための時間管理',
      icon: 'trophy-outline',
      onPress: () => {},
    },
    {
      title: 'リマインダー',
      description: '重要なイベントの通知設定',
      icon: 'alarm-outline',
      onPress: () => {},
    },
  ];
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: '探索' }} />
      
      {/* バナー */}
      <View style={[styles.banner, { backgroundColor: colors.primary }]}>
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>時間を可視化して最大限に活用しよう</Text>
          <Text style={styles.bannerSubtitle}>様々な機能で時間管理をサポート</Text>
        </View>
      </View>
      
      {/* 探索メニュー */}
      <View style={styles.menuContainer}>
        {exploreItems.map((item, index) => (
          <ExploreCard
            key={index}
            title={item.title}
            description={item.description}
            icon={item.icon}
            onPress={item.onPress}
          />
        ))}
      </View>
      
      {/* プロモーション */}
      <View style={[styles.promoContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.promoTitle, { color: colors.text }]}>
          プレミアム機能で、さらに便利に
        </Text>
        <Text style={[styles.promoDescription, { color: colors.secondaryText }]}>
          複数のウィジェット、詳細な分析、クラウド同期などが利用可能に
        </Text>
        <TouchableOpacity style={[styles.promoButton, { backgroundColor: colors.primary }]}>
          <Text style={styles.promoButtonText}>詳細を見る</Text>
        </TouchableOpacity>
      </View>
      
      {/* 開発中の表示 */}
      <View style={[styles.developmentNote, { backgroundColor: colors.card }]}>
        <Ionicons name="construct-outline" size={24} color={colors.secondaryText} />
        <Text style={[styles.developmentText, { color: colors.secondaryText }]}>
          この画面は開発中です。今後のアップデートをお楽しみに！
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  banner: {
    padding: 20,
    margin: 16,
    borderRadius: 12,
  },
  bannerContent: {
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
  },
  menuContainer: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
  },
  promoContainer: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  promoDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  promoButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  promoButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  developmentNote: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  developmentText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
  },
});
