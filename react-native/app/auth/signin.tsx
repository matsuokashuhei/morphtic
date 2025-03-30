import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { useTheme } from '@/src/context/ThemeContext';
import { SignInForm } from '@/src/types';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, error, clearError } = useAuth();
  const { colors, isDarkMode } = useTheme();
  
  const [form, setForm] = useState<SignInForm>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  // フォーム入力の更新
  const handleChange = (name: keyof SignInForm, value: string) => {
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
    
    if (!form.password) {
      errors.password = 'パスワードを入力してください';
    } else if (form.password.length < 8) {
      errors.password = 'パスワードは8文字以上必要です';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // サインイン処理
  const handleSignIn = async () => {
    clearError();
    
    if (!validate()) {
      return;
    }
    
    setLoading(true);
    try {
      await signIn(form);
      router.push('/(tabs)');
    } catch (err) {
      if (error) {
        Alert.alert('エラー', error);
      } else {
        Alert.alert('エラー', 'サインインに失敗しました。入力内容を確認してください。');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.formContainer}>
        <Text style={[styles.title, { color: colors.text }]}>サインイン</Text>
        
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
            placeholder="メールアドレスを入力"
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
        
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>パスワード</Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: isDarkMode ? colors.card : '#F0F0F0',
                color: colors.text,
                borderColor: validationErrors.password ? colors.error : colors.border
              }
            ]}
            placeholder="パスワードを入力"
            placeholderTextColor={colors.secondaryText}
            secureTextEntry
            value={form.password}
            onChangeText={(text) => handleChange('password', text)}
          />
          {validationErrors.password && (
            <Text style={[styles.errorText, { color: colors.error }]}>
              {validationErrors.password}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }]}
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>サインイン</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/auth/reset-password')}
          style={styles.linkButton}
        >
          <Text style={[styles.linkText, { color: colors.primary }]}>
            パスワードを忘れた方はこちら
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.secondaryText }]}>
            アカウントをお持ちでない方は
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/auth/signup')}
            style={styles.linkButton}
          >
            <Text style={[styles.linkText, { color: colors.primary }]}>
              新規登録
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
    marginBottom: 30,
    textAlign: 'center',
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
  footerText: {
    fontSize: 14,
    marginRight: 4,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});
