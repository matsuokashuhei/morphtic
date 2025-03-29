/**
 * 終了日時までの残り時間を計算する
 * @param endDate 終了日時
 * @returns 残り時間（日・時間・分・秒）
 */
export const calculateTimeLeft = (endDate: Date): { 
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} => {
  const now = new Date();
  
  // 既に終了している場合は0を返す
  if (now > endDate) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };
  }
  
  // 残り時間（ミリ秒）
  const timeDiff = endDate.getTime() - now.getTime();
  
  // 日・時間・分・秒に変換
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
  
  return {
    days,
    hours,
    minutes,
    seconds
  };
};

/**
 * 日付をフォーマットする（YYYY-MM-DD）
 * @param date 日付
 * @returns フォーマットされた日付文字列
 */
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * 時刻をフォーマットする（HH:MM）
 * @param date 日付
 * @returns フォーマットされた時刻文字列
 */
export const formatTime = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${hours}:${minutes}`;
};

/**
 * 日本語の曜日を取得する
 * @param date 日付
 * @returns 曜日（日〜土）
 */
export const getJapaneseDayOfWeek = (date: Date): string => {
  const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
  return daysOfWeek[date.getDay()];
};

/**
 * 日付の比較（同じ日かどうか）
 * @param date1 日付1
 * @param date2 日付2
 * @returns 同じ日ならtrue
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * 繰り返しイベントの次回日時を計算する
 * @param baseDate 基準日
 * @param repeatType 繰り返しタイプ
 * @param interval 間隔
 * @returns 次回の日時
 */
export const getNextOccurrence = (
  baseDate: Date,
  repeatType: 'daily' | 'weekly' | 'monthly' | 'yearly',
  interval: number = 1
): Date => {
  const nextDate = new Date(baseDate);
  
  switch (repeatType) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + interval);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + (7 * interval));
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + interval);
      break;
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + interval);
      break;
  }
  
  return nextDate;
};
