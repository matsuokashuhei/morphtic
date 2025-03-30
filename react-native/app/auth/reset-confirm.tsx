import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { useTheme } from '@/src/context/ThemeContext';
import { ConfirmResetPasswordForm } from '@/src/types';

export default function ResetConfirmScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email: string }>();
  const { confirmResetPassword, error, clearError } = useAuth();
  const { colors, isDarkMode } = useTheme();
  
  const [form, setForm] = useState<ConfirmResetPasswordForm>({
    email: '',
    code: '',
    newPassword: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  // URLパラメータからメールアドレスを設定
  useEffect(() => {
    if (params.email) {
      setForm(prev => ({ ...prev, email: params.email }));
    }
  }, [params.email]);

  // フォーム入力の更新
  const handleChange = (name: keyof ConfirmResetPasswordForm, value: string) => {
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
    
    if (!form.newPassword) {
      errors.newPassword = '新しいパスワードを入力してください';
    } else if (form.newPassword.length < 8) {
      errors.newPassword = 'パスワードは8文字以上必要です';
    } else if (!/(?=.*[A-Z])(?=.*[0-9])/.test(form.newPassword)) {
      errors.newPassword = 'パスワードには大文字と数字を含める必要があります';
    }
    
    if (form.newPassword !== confirmPassword) {
      errors.confirmPassword = 'パスワードが一致しません';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // パスワードリセット確認処理
  const handleConfirmReset = async () => {
    clearError();
    
    if (!validate()) {
      return;
    }
    
    setLoading(true);
    try {
      const success = await confirmResetPassword(form);
      if (success) {
        Alert.alert(
          'リセット完了',
          'パスワードが正常にリセットされました。新しいパスワードでサインインしてください。',
          [
            { text: 'OK', onPress: () => router.push('/auth/signin') }
          ]
        );
      }
    } catch (err) {
      if (error) {
        Alert.alert('エラー', error);
      } else {
        Alert.alert('エラー', 'パスワードのリセットに失敗しました。入力内容を確認してください。');
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
        <Text style={[styles.title, { color: colors.text }]}>パスワードリセット</Text>
        <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
          確認コードを入力して新しいパスワードを設定してください。
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
        
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>新しいパスワード</Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: isDarkMode ? colors.card : '#F0F0F0',
                color: colors.text,
                borderColor: validationErrors.newPassword ? colors.error : colors.border
              }
            ]}
            placeholder="新しいパスワードを入力（8文字以上、大文字・数字を含む）"
            placeholderTextColor={colors.secondaryText}
            secureTextEntry
            value={form.newPassword}
            onChangeText={(text) => handleChange('newPassword', text)}
          />
          {validationErrors.newPassword && (
            <Text style={[styles.errorText, { color: colors.error }]}>
              {validationErrors.newPassword}
            </Text>
          )}
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>新しいパスワード（確認）</Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: isDarkMode ? colors.card : '#F0F0F0',
                color: colors.text,
                borderColor: validationErrors.confirmPassword ? colors.error : colors.border
              }
            ]}
            placeholder="新しいパスワードを再入力"
            placeholderTextColor={colors.secondaryText}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          {validationErrors.confirmPassword && (
            <Text style={[styles.errorText, { color: colors.error }]}>
              {validationErrors.confirmPassword}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }]}
          onPress={handleConfirmReset}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>パスワードを変更</Text>
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
