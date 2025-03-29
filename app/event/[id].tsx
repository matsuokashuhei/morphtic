import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { format } from 'date-fns';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Mock data - in a real app, this would come from a database or state management
const MOCK_EVENTS = [
  {
    id: '1',
    name: 'Life Span',
    startDate: new Date(1990, 0, 1),
    endDate: new Date(2090, 0, 1),
    color: '#4A90E2',
    progress: 0.41,
    description: 'Visualizing my entire life span to make the most of every day.',
    isRepeat: false,
    repeatFrequency: null,
  },
  {
    id: '2',
    name: 'Current Project',
    startDate: new Date(2025, 2, 1),
    endDate: new Date(2025, 6, 30),
    color: '#E2844A',
    progress: 0.35,
    description: 'Timeline for completing the current project with all milestones.',
    isRepeat: false,
    repeatFrequency: null,
  },
  {
    id: '3',
    name: '2025 Goals',
    startDate: new Date(2025, 0, 1),
    endDate: new Date(2025, 11, 31),
    color: '#50C878',
    progress: 0.23,
    description: 'Tracking progress on my personal and professional goals for 2025.',
    isRepeat: false,
    repeatFrequency: null,
  },
  {
    id: '4',
    name: 'Annual Family Trip',
    startDate: new Date(2025, 6, 1),
    endDate: new Date(2025, 6, 14),
    color: '#9370DB',
    progress: 0,
    description: 'Planning and countdown for our annual family vacation.',
    isRepeat: true,
    repeatFrequency: 'yearly',
  },
];

export default function EventDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const eventId = params.id as string;
  
  const [event, setEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    // In a real app, fetch the event data from a database
    const foundEvent = MOCK_EVENTS.find(e => e.id === eventId);
    setEvent(foundEvent || null);
  }, [eventId]);
  
  if (!event) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Event not found</ThemedText>
      </ThemedView>
    );
  }
  
  const formatDateRange = (start, end) => {
    return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`;
  };
  
  const calculateDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
  
  const renderProgressBar = (progress, color) => {
    const progressPercentage = Math.round(progress * 100);
    
    return (
      <ThemedView style={styles.progressContainer}>
        <ThemedView 
          style={[
            styles.progressBar, 
            { backgroundColor: colorScheme === 'dark' ? '#444' : '#E0E0E0' }
          ]}
        >
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
  
  const handleDelete = () => {
    Alert.alert(
      "Delete Event",
      "Are you sure you want to delete this event?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // In a real app, delete from database
            router.replace('/(tabs)');
          }
        }
      ]
    );
  };
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleSave = () => {
    // In a real app, save to database
    setIsEditing(false);
    // For now, just exit edit mode
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: isEditing ? "Edit Event" : event.name,
          headerRight: () => (
            isEditing ? (
              <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
                <ThemedText style={styles.headerButtonText}>Save</ThemedText>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleEdit} style={styles.headerButton}>
                <IconSymbol name="pencil" size={20} color={Colors[colorScheme ?? 'light'].tint} />
              </TouchableOpacity>
            )
          )
        }} 
      />
      
      <ScrollView style={styles.container}>
        {!isEditing ? (
          // View Mode
          <ThemedView style={styles.content}>
            <ThemedView style={[styles.colorBadge, { backgroundColor: event.color }]} />
            
            <ThemedView style={styles.section}>
              <ThemedText style={styles.dateRange}>
                {formatDateRange(event.startDate, event.endDate)}
              </ThemedText>
              
              {renderProgressBar(event.progress, event.color)}
            </ThemedView>
            
            <ThemedView style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Description</ThemedText>
              <ThemedText style={styles.description}>{event.description || 'No description'}</ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Stats</ThemedText>
              
              <ThemedView style={styles.statRow}>
                <ThemedView style={styles.stat}>
                  <ThemedText style={styles.statValue}>{calculateDaysRemaining(event.endDate)}</ThemedText>
                  <ThemedText style={styles.statLabel}>Days Remaining</ThemedText>
                </ThemedView>
                
                <ThemedView style={styles.stat}>
                  <ThemedText style={styles.statValue}>
                    {event.isRepeat ? 'Yes' : 'No'}
                  </ThemedText>
                  <ThemedText style={styles.statLabel}>Repeating</ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>
            
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <IconSymbol name="trash" size={20} color="#FF3B30" />
              <ThemedText style={styles.deleteButtonText}>Delete Event</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        ) : (
          // Edit Mode - In a real app, this would be a form
          <ThemedView style={styles.content}>
            <ThemedText style={styles.editMessage}>
              This is a placeholder for the event editing form.
              In a complete app, this would include:
            </ThemedText>
            
            <ThemedView style={styles.editPlaceholder}>
              <ThemedText>• Event name input</ThemedText>
              <ThemedText>• Date pickers for start/end dates</ThemedText>
              <ThemedText>• Color selector</ThemedText>
              <ThemedText>• Description input</ThemedText>
              <ThemedText>• Repeat settings</ThemedText>
            </ThemedView>
          </ThemedView>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  colorBadge: {
    height: 12,
    width: '100%',
    borderRadius: 6,
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  dateRange: {
    fontSize: 16,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  progressBar: {
    flex: 1,
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: 'bold',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
    width: '48%',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF3B30',
    marginTop: 24,
  },
  deleteButtonText: {
    color: '#FF3B30',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  headerButton: {
    padding: 8,
  },
  headerButtonText: {
    color: Colors.light.tint,
    fontWeight: '600',
    fontSize: 16,
  },
  editMessage: {
    fontSize: 16,
    marginBottom: 16,
  },
  editPlaceholder: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
  },
});
