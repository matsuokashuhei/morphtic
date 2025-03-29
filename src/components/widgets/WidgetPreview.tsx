import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { calculateProgress } from '../../utils/progressUtils';
import { Event } from '../../types';

interface WidgetPreviewProps {
  event: Event;
}

const WidgetPreview: React.FC<WidgetPreviewProps> = ({ event }) => {
  // 進捗率を計算
  const progress = calculateProgress(
    new Date(event.startDate),
    new Date(event.endDate)
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.widgetFrame}>
        <View style={styles.widgetContent}>
          <View style={styles.widgetHeader}>
            <Text style={styles.widgetTitle}>{event.name}</Text>
            <Text style={styles.widgetPercentage}>{progress.toFixed(1)}%</Text>
          </View>
          
          <View style={styles.progressContainer}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${progress}%`, backgroundColor: event.color }
              ]} 
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  widgetFrame: {
    width: '100%',
    height: 80,
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  widgetContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    justifyContent: 'center',
  },
  widgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  widgetTitle: {
    fontWeight: '600',
    fontSize: 16,
  },
  widgetPercentage: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
});

export default WidgetPreview;
