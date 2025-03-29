import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { format } from 'date-fns';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Mock data for timeline events
const MOCK_EVENTS = [
  {
    id: '1',
    name: 'Life Span',
    startDate: new Date(1990, 0, 1),
    endDate: new Date(2090, 0, 1),
    color: '#4A90E2',
    progress: 0.41,
  },
  {
    id: '2',
    name: 'Current Project',
    startDate: new Date(2025, 2, 1),
    endDate: new Date(2025, 6, 30),
    color: '#E2844A',
    progress: 0.35,
  },
  {
    id: '3',
    name: '2025 Goals',
    startDate: new Date(2025, 0, 1),
    endDate: new Date(2025, 11, 31),
    color: '#50C878',
    progress: 0.23,
  },
  {
    id: '4',
    name: 'Annual Family Trip',
    startDate: new Date(2025, 6, 1),
    endDate: new Date(2025, 6, 14),
    color: '#9370DB',
    progress: 0,
  },
];

export default function TimelineScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [events] = useState(MOCK_EVENTS);
  
  const formatDateRange = (start, end) => {
    return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`;
  };
  
  const renderProgressBar = (progress, color) => {
    const progressPercentage = Math.round(progress * 100);
    
    return (
      <ThemedView style={styles.progressContainer}>
        <ThemedView style={[styles.progressBar, { backgroundColor: colorScheme === 'dark' ? '#444' : '#E0E0E0' }]}>
          <ThemedView 
            style={[
              styles.progressFill, 
              { 
                width: `${progressPercentage}%`,
                backgroundColor: color,
              }
            ]} 
          />
        </ThemedView>
        <ThemedText style={styles.progressText}>{progressPercentage}%</ThemedText>
      </ThemedView>
    );
  };
  
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">My Timeline</ThemedText>
        <Link href="/(tabs)/create" asChild>
          <TouchableOpacity style={styles.addButton}>
            <IconSymbol name="plus" size={20} color="#FFF" />
          </TouchableOpacity>
        </Link>
      </ThemedView>
      
      {events.length === 0 ? (
        <ThemedView style={styles.emptyState}>
          <IconSymbol name="clock" size={50} color="#808080" />
          <ThemedText style={styles.emptyStateText}>
            No timeline events yet. Tap the + button to create one!
          </ThemedText>
        </ThemedView>
      ) : (
        <ThemedView style={styles.eventsList}>
          {events.map((event) => (
            <TouchableOpacity 
              key={event.id} 
              style={styles.eventCard}
              onPress={() => router.push(`/event/${event.id}`)}
            >
              <ThemedView style={styles.eventHeader}>
                <ThemedText style={styles.eventName}>{event.name}</ThemedText>
                <IconSymbol name="ellipsis" size={20} color="#808080" />
              </ThemedView>
              
              <ThemedText style={styles.dateRange}>
                {formatDateRange(event.startDate, event.endDate)}
              </ThemedText>
              
              {renderProgressBar(event.progress, event.color)}
            </TouchableOpacity>
          ))}
        </ThemedView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  addButton: {
    backgroundColor: Colors.light.tint,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    margin: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
  },
  emptyStateText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
  },
  eventsList: {
    padding: 16,
  },
  eventCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: Colors.light.cardBackground,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dateRange: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
