import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { useTheme } from '@/src/context/ThemeContext';

type AuthGuardProps = {
  children: React.ReactNode;
  requireAuth?: boolean;
};

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireAuth = true }) => {
  const { status, user } = useAuth();
  const { colors } = useTheme();

  // 認証状態のチェック中はローディング表示
  if (status === 'CHECKING') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // 認証が必要なルートの場合
  if (requireAuth) {
    // 未認証の場合はサインイン画面にリダイレクト
    if (status === 'UNAUTHENTICATED') {
      return <Redirect href="/auth/signin" />;
    }
  } else {
    // 認証が不要なルート（認証画面）の場合、すでに認証済みならタブ画面にリダイレクト
    if (status === 'AUTHENTICATED' && user) {
      return <Redirect href="/(tabs)" />;
    }
  }

  // それ以外の場合は子コンポーネントを表示
  return <>{children}</>;
};

export default AuthGuard;
