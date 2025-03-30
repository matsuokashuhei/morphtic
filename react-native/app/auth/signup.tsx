import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { useTheme } from '@/src/context/ThemeContext';
import { SignUpForm } from '@/src/types';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, error, clearError } = useAuth();
  const { colors, isDarkMode } = useTheme();
  
  const [form, setForm] = useState<SignUpForm>({
    email: '',
    password: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  // フォーム入力の更新
  const handleChange = (name: keyof SignUpForm, value: string) => {
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
    
    if (!form.name.trim()) {
      errors.name = '名前を入力してください';
    }
    
    if (!form.email.trim()) {
      errors.email = 'メールアドレスを入力してください';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = '有効なメールアドレスを入力してください';
    }
    
    if (!form.password) {
      errors.password = 'パスワードを入力してください';
    } else if (form.password.length < 8) {
      errors.password = 'パスワードは8文字以上必要です';
    } else if (!/(?=.*[A-Z])(?=.*[0-9])/.test(form.password)) {
      errors.password = 'パスワードには大文字と数字を含める必要があります';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // サインアップ処理
  const handleSignUp = async () => {
    clearError();
    
    if (!validate()) {
      return;
    }
    
    setLoading(true);
    try {
      const success = await signUp(form);
      if (success) {
        // 確認コード入力画面へ遷移
        router.push({
          pathname: '/auth/confirm',
          params: { email: form.email }
        });
      } else {
        // 成功でない場合もエラーとして扱う
        Alert.alert('エラー', 'アカウント作成に失敗しました。しばらく経ってからお試しください。');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      // エラーメッセージの表示を改善
      if (error) {
        Alert.alert('エラー', error);
      } else if (err?.message) {
        Alert.alert('エラー', err.message);
      } else {
        Alert.alert('エラー', 'アカウント作成に失敗しました。入力内容を確認してください。');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.formContainer}>
        <Text style={[styles.title, { color: colors.text }]}>アカウント作成</Text>
        
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>名前</Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: isDarkMode ? colors.card : '#F0F0F0',
                color: colors.text,
                borderColor: validationErrors.name ? colors.error : colors.border
              }
            ]}
            placeholder="名前を入力"
            placeholderTextColor={colors.secondaryText}
            value={form.name}
            onChangeText={(text) => handleChange('name', text)}
          />
          {validationErrors.name && (
            <Text style={[styles.errorText, { color: colors.error }]}>
              {validationErrors.name}
            </Text>
          )}
        </View>
        
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
            placeholder="パスワードを入力（8文字以上、大文字・数字を含む）"
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
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>アカウント作成</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.secondaryText }]}>
            すでにアカウントをお持ちの方は
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/auth/signin')}
            style={styles.linkButton}
          >
            <Text style={[styles.linkText, { color: colors.primary }]}>
              サインイン
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    marginTop: 20,
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
    marginLeft: 5,
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
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});
