import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { useTheme } from '@/src/context/ThemeContext';
import { ConfirmSignUpForm } from '@/src/types';

export default function ConfirmScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email: string }>();
  const { confirmSignUp, error, clearError } = useAuth();
  const { colors, isDarkMode } = useTheme();
  
  const [form, setForm] = useState<ConfirmSignUpForm>({
    email: '',
    code: '',
  });
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  // URLパラメータからメールアドレスを設定
  useEffect(() => {
    if (params.email) {
      setForm(prev => ({ ...prev, email: params.email }));
    }
  }, [params.email]);

  // フォーム入力の更新
  const handleChange = (name: keyof ConfirmSignUpForm, value: string) => {
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
    
    if (!form.code.trim()) {
      errors.code = '確認コードを入力してください';
    } else if (!/^\d+$/.test(form.code)) {
      errors.code = '確認コードは数字のみを入力してください';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 確認コード検証処理
  const handleConfirm = async () => {
    clearError();
    
    if (!validate()) {
      return;
    }
    
    setLoading(true);
    try {
      const success = await confirmSignUp(form);
      if (success) {
        Alert.alert(
          '確認完了',
          'アカウントが確認されました。サインインしてください。',
          [
            { text: 'OK', onPress: () => router.push('/auth/signin') }
          ]
        );
      }
    } catch (err) {
      if (error) {
        Alert.alert('エラー', error);
      } else {
        Alert.alert('エラー', '確認コードの検証に失敗しました。入力内容を確認してください。');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.formContainer}>
        <Text style={[styles.title, { color: colors.text }]}>確認コード入力</Text>
        <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
          ご登録いただいたメールアドレスに送信された確認コードを入力してください。
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
            placeholder="メールアドレスを入力"
            placeholderTextColor={colors.secondaryText}
            autoCapitalize="none"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(text) => handleChange('email', text)}
            editable={!params.email} // パラメータから取得した場合は編集不可
          />
          {validationErrors.email && (
            <Text style={[styles.errorText, { color: colors.error }]}>
              {validationErrors.email}
            </Text>
          )}
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>確認コード</Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: isDarkMode ? colors.card : '#F0F0F0',
                color: colors.text,
                borderColor: validationErrors.code ? colors.error : colors.border
              }
            ]}
            placeholder="確認コードを入力"
            placeholderTextColor={colors.secondaryText}
            keyboardType="number-pad"
            value={form.code}
            onChangeText={(text) => handleChange('code', text)}
          />
          {validationErrors.code && (
            <Text style={[styles.errorText, { color: colors.error }]}>
              {validationErrors.code}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }]}
          onPress={handleConfirm}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>確認</Text>
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
