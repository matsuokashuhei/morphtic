import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { 
  AuthUser, 
  AuthStatus, 
  SignUpForm, 
  SignInForm, 
  ConfirmSignUpForm,
  ResetPasswordForm,
  ConfirmResetPasswordForm,
  UpdatePasswordForm,
  UpdateUserAttributesForm
} from '../types';
import AuthService from '../services/AuthService';
import { configureAmplify } from '../config/aws-config';

// Amplifyの設定を初期化
configureAmplify();

interface AuthContextType {
  user: AuthUser | null;
  status: AuthStatus;
  error: string | null;
  signUp: (form: SignUpForm) => Promise<boolean>;
  confirmSignUp: (form: ConfirmSignUpForm) => Promise<boolean>;
  signIn: (form: SignInForm) => Promise<AuthUser>;
  signOut: () => Promise<void>;
  resetPassword: (form: ResetPasswordForm) => Promise<boolean>;
  confirmResetPassword: (form: ConfirmResetPasswordForm) => Promise<boolean>;
  updatePassword: (form: UpdatePasswordForm) => Promise<boolean>;
  updateUserAttributes: (form: UpdateUserAttributesForm) => Promise<boolean>;
  clearError: () => void;
}

// コンテキストの初期値
const AuthContext = createContext<AuthContextType>({
  user: null,
  status: 'CHECKING',
  error: null,
  signUp: async () => false,
  confirmSignUp: async () => false,
  signIn: async () => ({} as AuthUser),
  signOut: async () => {},
  resetPassword: async () => false,
  confirmResetPassword: async () => false,
  updatePassword: async () => false,
  updateUserAttributes: async () => false,
  clearError: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>('CHECKING');
  const [error, setError] = useState<string | null>(null);

  // 初期ロード時に認証状態をチェック
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setStatus('CHECKING');
        const currentUser = await AuthService.getCurrentUser();
        
        if (currentUser) {
          setUser(currentUser);
          setStatus('AUTHENTICATED');
        } else {
          setUser(null);
          setStatus('UNAUTHENTICATED');
        }
      } catch (err) {
        console.error('Error checking auth status:', err);
        setUser(null);
        setStatus('UNAUTHENTICATED');
        setError('認証状態の確認中にエラーが発生しました');
      }
    };
    
    checkAuthStatus();
  }, []);

  // サインアップ
  const signUp = async (form: SignUpForm): Promise<boolean> => {
    setError(null);
    try {
      return await AuthService.signUp(form);
    } catch (err: any) {
      const errorMessage = err.message || 'サインアップに失敗しました';
      setError(errorMessage);
      throw err;
    }
  };

  // サインアップ確認
  const confirmSignUp = async (form: ConfirmSignUpForm): Promise<boolean> => {
    setError(null);
    try {
      return await AuthService.confirmSignUp(form);
    } catch (err: any) {
      const errorMessage = err.message || '確認コードの検証に失敗しました';
      setError(errorMessage);
      throw err;
    }
  };

  // サインイン
  const signIn = async (form: SignInForm): Promise<AuthUser> => {
    setError(null);
    try {
      const authUser = await AuthService.signIn(form);
      setUser(authUser);
      setStatus('AUTHENTICATED');
      return authUser;
    } catch (err: any) {
      const errorMessage = err.message || 'サインインに失敗しました';
      setError(errorMessage);
      throw err;
    }
  };

  // サインアウト
  const signOut = async (): Promise<void> => {
    setError(null);
    try {
      await AuthService.signOut();
      setUser(null);
      setStatus('UNAUTHENTICATED');
    } catch (err: any) {
      const errorMessage = err.message || 'サインアウトに失敗しました';
      setError(errorMessage);
      throw err;
    }
  };

  // パスワードリセット要求
  const resetPassword = async (form: ResetPasswordForm): Promise<boolean> => {
    setError(null);
    try {
      return await AuthService.resetPassword(form);
    } catch (err: any) {
      const errorMessage = err.message || 'パスワードリセットの要求に失敗しました';
      setError(errorMessage);
      throw err;
    }
  };

  // パスワードリセット確認
  const confirmResetPassword = async (form: ConfirmResetPasswordForm): Promise<boolean> => {
    setError(null);
    try {
      return await AuthService.confirmResetPassword(form);
    } catch (err: any) {
      const errorMessage = err.message || 'パスワードリセットの確認に失敗しました';
      setError(errorMessage);
      throw err;
    }
  };

  // パスワード更新
  const updatePassword = async (form: UpdatePasswordForm): Promise<boolean> => {
    setError(null);
    try {
      return await AuthService.updatePassword(form);
    } catch (err: any) {
      const errorMessage = err.message || 'パスワードの更新に失敗しました';
      setError(errorMessage);
      throw err;
    }
  };

  // ユーザー属性の更新
  const updateUserAttributes = async (form: UpdateUserAttributesForm): Promise<boolean> => {
    setError(null);
    try {
      const success = await AuthService.updateUserAttributes(form);
      if (success && user) {
        // ユーザー情報を更新
        const updatedUser = { ...user };
        if (form.name) updatedUser.name = form.name;
        if (form.email) updatedUser.email = form.email;
        if (form.phone_number) updatedUser.phone_number = form.phone_number;
        setUser(updatedUser);
      }
      return success;
    } catch (err: any) {
      const errorMessage = err.message || 'ユーザー情報の更新に失敗しました';
      setError(errorMessage);
      throw err;
    }
  };

  // エラーをクリア
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        error,
        signUp,
        confirmSignUp,
        signIn,
        signOut,
        resetPassword,
        confirmResetPassword,
        updatePassword,
        updateUserAttributes,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// カスタムフック
export const useAuth = (): AuthContextType => useContext(AuthContext);
