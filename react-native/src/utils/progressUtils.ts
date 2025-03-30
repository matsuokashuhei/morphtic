/**
 * 開始日時と終了日時から進捗率を計算する
 * @param startDate 開始日時
 * @param endDate 終了日時
 * @returns 0〜100の進捗率
 */
export const calculateProgress = (startDate: Date, endDate: Date): number => {
  const now = new Date();
  
  // 開始前の場合は0%
  if (now < startDate) {
    return 0;
  }
  
  // 終了後の場合は100%
  if (now > endDate) {
    return 100;
  }
  
  // 総期間（ミリ秒）
  const totalDuration = endDate.getTime() - startDate.getTime();
  
  // 経過時間（ミリ秒）
  const elapsedTime = now.getTime() - startDate.getTime();
  
  // 進捗率の計算（%）
  const progress = (elapsedTime / totalDuration) * 100;
  
  // 小数点以下1桁に丸める（オプション）
  return Math.min(Math.max(progress, 0), 100);
};

/**
 * 経過時間のテキスト表示を生成する
 * @param startDate 開始日時
 * @param endDate 終了日時
 * @returns 経過時間のテキスト
 */
export const getElapsedTimeText = (startDate: Date, endDate: Date): string => {
  const now = new Date();
  const progress = calculateProgress(startDate, endDate);
  
  if (progress === 0) {
    return "まだ開始していません";
  } else if (progress === 100) {
    return "完了しました";
  }
  
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const elapsedDays = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  return `${elapsedDays}日経過 / 全${totalDays}日`;
};

/**
 * イベントの状態を判定する
 * @param startDate 開始日時
 * @param endDate 終了日時
 * @returns イベントの状態（'not_started' | 'in_progress' | 'completed'）
 */
export const getEventStatus = (startDate: Date, endDate: Date): 'not_started' | 'in_progress' | 'completed' => {
  const now = new Date();
  
  if (now < startDate) {
    return 'not_started';
  } else if (now > endDate) {
    return 'completed';
  } else {
    return 'in_progress';
  }
};

/**
 * マイルストーンの計算
 * イベントの重要な節目（25%, 50%, 75%など）に達したかを判定
 * @param startDate 開始日時
 * @param endDate 終了日時
 * @param milestones マイルストーンの配列（例：[25, 50, 75]）
 * @returns 達成したマイルストーンの配列
 */
export const getReachedMilestones = (
  startDate: Date, 
  endDate: Date, 
  milestones: number[] = [25, 50, 75]
): number[] => {
  const progress = calculateProgress(startDate, endDate);
  return milestones.filter(milestone => progress >= milestone);
};
