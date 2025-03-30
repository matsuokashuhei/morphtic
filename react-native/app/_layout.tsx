import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { EventProvider } from '@/src/context/EventContext';
import { ThemeProvider } from '@/src/context/ThemeContext';
import { AuthProvider } from '@/src/context/AuthContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <EventProvider>
          <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="event/[id]" options={{ presentation: 'modal', title: 'イベント詳細' }} />
              <Stack.Screen name="auth/signin" options={{ presentation: 'modal', title: 'サインイン' }} />
              <Stack.Screen name="auth/signup" options={{ presentation: 'modal', title: 'アカウント作成' }} />
              <Stack.Screen name="auth/confirm" options={{ presentation: 'modal', title: '確認コード入力' }} />
              <Stack.Screen name="auth/reset-password" options={{ presentation: 'modal', title: 'パスワードリセット' }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </NavigationThemeProvider>
        </EventProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
