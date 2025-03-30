import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

// テーマの型定義
type ThemeType = 'light' | 'dark' | 'system';

// テーマカラーの型定義
interface ThemeColors {
  primary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
  secondaryText: string;
  success: string;
  error: string;
  warning: string;
}

// テーマコンテキストの型定義
interface ThemeContextType {
  theme: ThemeType;
  colors: ThemeColors;
  setTheme: (theme: ThemeType) => Promise<void>;
  isDarkMode: boolean;
}

// ライトモードのカラーパレット
const lightColors: ThemeColors = {
  primary: '#4CAF50',
  background: '#F5F5F5',
  card: '#FFFFFF',
  text: '#212121',
  border: '#E0E0E0',
  notification: '#F44336',
  secondaryText: '#757575',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FFC107',
};

// ダークモードのカラーパレット
const darkColors: ThemeColors = {
  primary: '#66BB6A',
  background: '#121212',
  card: '#1E1E1E',
  text: '#E0E0E0',
  border: '#333333',
  notification: '#FF5252',
  secondaryText: '#AAAAAA',
  success: '#66BB6A',
  error: '#FF5252',
  warning: '#FFD54F',
};

// テーマコンテキストの作成
const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  colors: lightColors,
  setTheme: async () => {},
  isDarkMode: false,
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // システムのテーマを取得
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeType>('system');
  
  // 現在のカラースキームに基づいてダークモードかどうかを判定
  const isDarkMode = 
    theme === 'system' 
      ? systemColorScheme === 'dark' 
      : theme === 'dark';
  
  // 現在のテーマに基づいてカラーパレットを取得
  const colors = isDarkMode ? darkColors : lightColors;

  // 初期ロード時にAsyncStorageからテーマ設定を取得
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          setThemeState(savedTheme as ThemeType);
        }
      } catch (err) {
        console.error('Failed to load theme:', err);
      }
    };
    
    loadTheme();
  }, []);

  // テーマを設定してAsyncStorageに保存
  const setTheme = async (newTheme: ThemeType): Promise<void> => {
    try {
      setThemeState(newTheme);
      await AsyncStorage.setItem('theme', newTheme);
    } catch (err) {
      console.error('Failed to save theme:', err);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, colors, setTheme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// カスタムフック
export const useTheme = (): ThemeContextType => useContext(ThemeContext);
