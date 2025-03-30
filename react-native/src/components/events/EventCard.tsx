import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { formatDistance } from 'date-fns';
import ProgressBar from '../common/ProgressBar';
import { calculateTimeLeft } from '../../utils/dateUtils';
import { Event } from '../../types';

interface EventCardProps {
  event: Event;
  onPress: (event: Event) => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  const { name, startDate, endDate, color } = event;
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);
  
  // 残り時間の計算
  const { days, hours, minutes }: TimeLeft = calculateTimeLeft(endDateObj);
  const isCompleted = new Date() > endDateObj;
  const isNotStarted = new Date() < startDateObj;
  
  // 時間表示文字列の生成
  let timeLeftText = '';
  
  if (isCompleted) {
    timeLeftText = '完了';
  } else if (isNotStarted) {
    timeLeftText = `開始まで ${formatDistance(startDateObj, new Date(), { addSuffix: false })}`;
  } else if (days > 0) {
    timeLeftText = `残り ${days}日 ${hours}時間`;
  } else {
    timeLeftText = `残り ${hours}時間 ${minutes}分`;
  }
  
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        isCompleted ? styles.completedEvent : {}
      ]} 
      onPress={() => onPress(event)}
    >
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>{name}</Text>
        <Text style={styles.timeLeft}>{timeLeftText}</Text>
      </View>
      
      <ProgressBar 
        startDate={startDateObj} 
        endDate={endDateObj} 
        color={color} 
        height={6}
      />
      
      <View style={styles.dates}>
        <Text style={styles.dateText}>
          {startDateObj.toLocaleDateString()} - {endDateObj.toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  completedEvent: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  timeLeft: {
    fontSize: 12,
    color: '#757575',
  },
  dates: {
    marginTop: 8,
  },
  dateText: {
    fontSize: 12,
    color: '#9E9E9E',
  },
});

export default EventCard;
