import React, { useState } from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Switch,
  Platform,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Predefined color options
const COLOR_OPTIONS = [
  '#4A90E2', // Blue
  '#50C878', // Green
  '#E2844A', // Orange
  '#9370DB', // Purple
  '#FF6B6B', // Red
  '#FFD700', // Yellow
];

export default function CreateEventScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Form state
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // Default to 30 days from now
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [isRepeat, setIsRepeat] = useState(false);
  const [repeatFrequency, setRepeatFrequency] = useState('monthly');
  
  // Date picker state
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  
  const handleCreateEvent = () => {
    // Validate form
    if (!eventName.trim()) {
      Alert.alert('Error', 'Please enter an event name');
      return;
    }
    
    if (startDate >= endDate) {
      Alert.alert('Error', 'End date must be after start date');
      return;
    }
    
    // In a real app, this would save to a database
    Alert.alert(
      'Success',
      'Event created successfully!',
      [
        {
          text: 'OK',
          onPress: () => router.replace('/(tabs)'),
        },
      ]
    );
  };
  
  const onStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };
  
  const onEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Create Timeline Event</ThemedText>
      </ThemedView>
      
      <ThemedText style={styles.description}>
        Track life events, projects, or any time period to visualize your progress.
      </ThemedText>
      
      <ThemedView style={styles.formContainer}>
        <ThemedView style={styles.formGroup}>
          <ThemedText style={styles.label}>Event Name</ThemedText>
          <TextInput
            style={[
              styles.input,
              isDark && styles.inputDark
            ]}
            value={eventName}
            onChangeText={setEventName}
            placeholder="Enter event name"
            placeholderTextColor="#999"
          />
        </ThemedView>
        
        <ThemedView style={styles.formGroup}>
          <ThemedText style={styles.label}>Description</ThemedText>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              isDark && styles.inputDark
            ]}
            value={description}
            onChangeText={setDescription}
            placeholder="What's this event about?"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </ThemedView>
        
        <ThemedView style={styles.formGroup}>
          <ThemedText style={styles.label}>Start Date</ThemedText>
          <TouchableOpacity 
            style={[
              styles.dateInput,
              isDark && styles.dateInputDark
            ]} 
            onPress={() => setShowStartDatePicker(true)}
          >
            <IconSymbol name="calendar" size={20} color="#666" style={styles.dateIcon} />
            <ThemedText>{formatDate(startDate)}</ThemedText>
          </TouchableOpacity>
          
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onStartDateChange}
            />
          )}
        </ThemedView>
        
        <ThemedView style={styles.formGroup}>
          <ThemedText style={styles.label}>End Date</ThemedText>
          <TouchableOpacity 
            style={[
              styles.dateInput,
              isDark && styles.dateInputDark
            ]} 
            onPress={() => setShowEndDatePicker(true)}
          >
            <IconSymbol name="calendar" size={20} color="#666" style={styles.dateIcon} />
            <ThemedText>{formatDate(endDate)}</ThemedText>
          </TouchableOpacity>
          
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onEndDateChange}
              minimumDate={startDate}
            />
          )}
        </ThemedView>
        
        <ThemedView style={styles.formGroup}>
          <ThemedText style={styles.label}>Color</ThemedText>
          <ThemedView style={styles.colorOptions}>
            {COLOR_OPTIONS.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColorOption,
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.formGroup}>
          <ThemedView style={styles.switchContainer}>
            <ThemedText style={styles.label}>Repeating Event</ThemedText>
            <Switch
              value={isRepeat}
              onValueChange={setIsRepeat}
              trackColor={{ false: '#767577', true: Colors[colorScheme].tint }}
            />
          </ThemedView>
          
          {isRepeat && (
            <ThemedView style={styles.repeatOptions}>
              {['daily', 'weekly', 'monthly', 'yearly'].map((freq) => (
                <TouchableOpacity
                  key={freq}
                  style={[
                    styles.repeatOption,
                    repeatFrequency === freq && styles.selectedRepeatOption,
                  ]}
                  onPress={() => setRepeatFrequency(freq)}
                >
                  <ThemedText
                    style={[
                      styles.repeatOptionText,
                      repeatFrequency === freq && styles.selectedRepeatOptionText,
                    ]}
                  >
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ThemedView>
          )}
        </ThemedView>
        
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateEvent}
        >
          <ThemedText style={styles.createButtonText}>Create Event</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  titleContainer: {
    marginTop: 20,
    marginBottom: 16,
  },
  description: {
    marginBottom: 24,
    fontSize: 16,
  },
  formContainer: {
    marginBottom: 40,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputDark: {
    backgroundColor: '#2C2C2E',
    borderColor: '#3A3A3C',
    color: '#FFFFFF',
  },
  textArea: {
    minHeight: 100,
  },
  dateInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dateInputDark: {
    backgroundColor: '#2C2C2E',
    borderColor: '#3A3A3C',
  },
  dateIcon: {
    marginRight: 8,
  },
  colorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  repeatOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  repeatOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
  },
  selectedRepeatOption: {
    backgroundColor: Colors.light.tint,
  },
  repeatOptionText: {
    color: '#666',
  },
  selectedRepeatOptionText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: Colors.light.tint,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
