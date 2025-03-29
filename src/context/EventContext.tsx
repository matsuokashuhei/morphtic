import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { Event } from '../types';

interface EventContextType {
  events: Event[];
  loading: boolean;
  error: string | null;
  getEvent: (id: string) => Event | undefined;
  addEvent: (event: Omit<Event, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<Event>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<Event>;
  deleteEvent: (id: string) => Promise<boolean>;
  getWidgetEvents: () => Event[];
  refreshEvents: () => Promise<void>;
}

const EventContext = createContext<EventContextType>({
  events: [],
  loading: false,
  error: null,
  getEvent: () => undefined,
  addEvent: async () => ({} as Event),
  updateEvent: async () => ({} as Event),
  deleteEvent: async () => false,
  getWidgetEvents: () => [],
  refreshEvents: async () => {},
});

interface EventProviderProps {
  children: ReactNode;
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 初期ロード
  useEffect(() => {
    loadEvents();
  }, []);

  // イベントデータをAsyncStorageから読み込む
  const loadEvents = async (): Promise<void> => {
    try {
      setLoading(true);
      const eventsData = await AsyncStorage.getItem('events');
      if (eventsData) {
        const parsedEvents: Event[] = JSON.parse(eventsData);
        // 日付文字列をDateオブジェクトに変換
        const eventsWithDates = parsedEvents.map(event => ({
          ...event,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
          createdAt: new Date(event.createdAt),
          updatedAt: new Date(event.updatedAt),
          repeat: event.repeat ? {
            ...event.repeat,
            endDate: event.repeat.endDate ? new Date(event.repeat.endDate) : null
          } : undefined
        }));
        setEvents(eventsWithDates);
      }
    } catch (err) {
      setError('イベントの読み込みに失敗しました');
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  // イベントデータをAsyncStorageに保存
  const saveEvents = async (updatedEvents: Event[]): Promise<void> => {
    try {
      await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
    } catch (err) {
      setError('イベントの保存に失敗しました');
      console.error('Failed to save events:', err);
    }
  };

  // 特定のイベントを取得
  const getEvent = (id: string): Event | undefined => {
    return events.find(event => event.id === id);
  };

  // イベントを追加
  const addEvent = async (
    eventData: Omit<Event, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<Event> => {
    try {
      const now = new Date();
      const newEvent: Event = {
        ...eventData,
        id: uuidv4(),
        userId: 'local-user', // 将来的にはCognitoのユーザーIDに置き換え
        createdAt: now,
        updatedAt: now,
      };
      
      const updatedEvents = [...events, newEvent];
      setEvents(updatedEvents);
      await saveEvents(updatedEvents);
      
      // ウィジェットデータの更新（iOSの場合）
      if (eventData.showInWidget) {
        updateWidgetData(updatedEvents);
      }
      
      return newEvent;
    } catch (err) {
      setError('イベントの追加に失敗しました');
      console.error('Failed to add event:', err);
      throw err;
    }
  };

  // イベントを更新
  const updateEvent = async (id: string, eventData: Partial<Event>): Promise<Event> => {
    try {
      const eventIndex = events.findIndex(event => event.id === id);
      if (eventIndex === -1) {
        throw new Error('イベントが見つかりません');
      }
      
      const updatedEvent: Event = {
        ...events[eventIndex],
        ...eventData,
        updatedAt: new Date(),
      };
      
      const updatedEvents = [...events];
      updatedEvents[eventIndex] = updatedEvent;
      
      setEvents(updatedEvents);
      await saveEvents(updatedEvents);
      
      // ウィジェットデータの更新
      updateWidgetData(updatedEvents);
      
      return updatedEvent;
    } catch (err) {
      setError('イベントの更新に失敗しました');
      console.error('Failed to update event:', err);
      throw err;
    }
  };

  // イベントを削除
  const deleteEvent = async (id: string): Promise<boolean> => {
    try {
      const updatedEvents = events.filter(event => event.id !== id);
      setEvents(updatedEvents);
      await saveEvents(updatedEvents);
      
      // ウィジェットデータの更新
      updateWidgetData(updatedEvents);
      
      return true;
    } catch (err) {
      setError('イベントの削除に失敗しました');
      console.error('Failed to delete event:', err);
      return false;
    }
  };

  // ウィジェット表示用のイベントを取得
  const getWidgetEvents = (): Event[] => {
    return events
      .filter(event => event.showInWidget)
      .sort((a, b) => a.widgetPosition - b.widgetPosition);
  };

  // ウィジェットデータを更新（iOSのUserDefaultsに保存）
  const updateWidgetData = (updatedEvents: Event[]): void => {
    // React NativeのNativeModulesを使ってiOSのUserDefaultsにデータを渡す
    // 実際の実装は別途NativeModulesが必要
    // ここではダミー実装
    console.log('Widget data updated:', getWidgetEvents());
  };

  // イベントデータを更新（将来的にはバックエンドと同期）
  const refreshEvents = async (): Promise<void> => {
    try {
      setLoading(true);
      // バックエンドとの同期ロジックを実装
      // 現在はローカルデータのリロードのみ
      await loadEvents();
    } catch (err) {
      setError('データの更新に失敗しました');
      console.error('Failed to refresh events:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <EventContext.Provider
      value={{
        events,
        loading,
        error,
        getEvent,
        addEvent,
        updateEvent,
        deleteEvent,
        getWidgetEvents,
        refreshEvents,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

// カスタムフック
export const useEvents = (): EventContextType => useContext(EventContext);
