import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { useTheme } from '@/src/context/ThemeContext';
import { ResetPasswordForm } from '@/src/types';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { resetPassword, error, clearError } = useAuth();
  const { colors, isDarkMode } = useTheme();
  
  const [form, setForm] = useState<ResetPasswordForm>({
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  // フォーム入力の更新
  const handleChange = (name: keyof ResetPasswordForm, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    // 入力時にエラーをクリア
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  // バリデーション
  const validate = (): boolean => {
    const errors: { [key: string]: string } = {};
    
    if (!form.email.trim()) {
      errors.email = 'メールアドレスを入力してください';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = '有効なメールアドレスを入力してください';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // パスワードリセット要求処理
  const handleResetPassword = async () => {
    clearError();
    
    if (!validate()) {
      return;
    }
    
    setLoading(true);
    try {
      const success = await resetPassword(form);
      if (success) {
        Alert.alert(
          '送信完了',
          `${form.email}にパスワードリセット用の確認コードを送信しました。メールをご確認ください。`,
          [
            { 
              text: 'OK', 
              onPress: () => {
                // 確認コード入力と新しいパスワード設定画面へ遷移
                router.push({
                  pathname: '/auth/reset-confirm',
                  params: { email: form.email }
                });
              } 
            }
          ]
        );
      }
    } catch (err) {
      if (error) {
        Alert.alert('エラー', error);
      } else {
        Alert.alert('エラー', 'パスワードリセットの要求に失敗しました。入力内容を確認してください。');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.formContainer}>
        <Text style={[styles.title, { color: colors.text }]}>パスワードリセット</Text>
        <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
          パスワードリセット用の確認コードをメールで送信します。
        </Text>
        
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>メールアドレス</Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: isDarkMode ? colors.card : '#F0F0F0',
                color: colors.text,
                borderColor: validationErrors.email ? colors.error : colors.border
              }
            ]}
            placeholder="登録したメールアドレスを入力"
            placeholderTextColor={colors.secondaryText}
            autoCapitalize="none"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(text) => handleChange('email', text)}
          />
          {validationErrors.email && (
            <Text style={[styles.errorText, { color: colors.error }]}>
              {validationErrors.email}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }]}
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>リセット用コードを送信</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => router.push('/auth/signin')}
            style={styles.linkButton}
          >
            <Text style={[styles.linkText, { color: colors.primary }]}>
              サインイン画面に戻る
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});
