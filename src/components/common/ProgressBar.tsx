import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { calculateProgress } from '../../utils/progressUtils';

interface ProgressBarProps {
  startDate: Date;
  endDate: Date;
  color?: string;
  height?: number;
  showPercentage?: boolean;
  animationDuration?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  startDate,
  endDate,
  color = '#4CAF50',
  height = 8,
  showPercentage = true,
  animationDuration = 1000
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [animatedValue] = useState<Animated.Value>(new Animated.Value(0));
  
  useEffect(() => {
    // 進捗率を計算
    const currentProgress = calculateProgress(startDate, endDate);
    setProgress(currentProgress);
    
    // プログレスバーのアニメーション
    Animated.timing(animatedValue, {
      toValue: currentProgress,
      duration: animationDuration,
      useNativeDriver: false,
    }).start();
    
    // リアルタイム更新（オプション）
    const interval = setInterval(() => {
      const updatedProgress = calculateProgress(startDate, endDate);
      setProgress(updatedProgress);
      
      Animated.timing(animatedValue, {
        toValue: updatedProgress,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }, 60000); // 1分ごとに更新
    
    return () => clearInterval(interval);
  }, [startDate, endDate, animationDuration]);
  
  const width = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });
  
  return (
    <View style={styles.container}>
      <View style={[styles.progressContainer, { height }]}>
        <Animated.View
          style={[
            styles.progressBar,
            { backgroundColor: color, width },
            { height }
          ]}
        />
      </View>
      {showPercentage && (
        <Text style={styles.percentage}>{progress.toFixed(1)}%</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  progressContainer: {
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    borderRadius: 5,
  },
  percentage: {
    marginTop: 4,
    fontSize: 12,
    color: '#757575',
    textAlign: 'right',
  },
});

export default ProgressBar;
