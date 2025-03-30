import React from 'react';
import { Stack } from 'expo-router';
import AuthGuard from '@/src/components/AuthGuard';

export default function AuthLayout() {
  return (
    <AuthGuard requireAuth={false}>
      <Stack>
        <Stack.Screen
          name="signin"
          options={{
            title: 'サインイン',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="signup"
          options={{
            title: 'アカウント作成',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="confirm"
          options={{
            title: '確認コード入力',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="reset-password"
          options={{
            title: 'パスワードリセット',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="reset-confirm"
          options={{
            title: 'パスワード変更',
            headerShown: true,
          }}
        />
      </Stack>
    </AuthGuard>
  );
}
