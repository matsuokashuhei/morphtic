import { signIn as amplifySignIn, signUp as amplifySignUp, confirmSignUp as amplifyConfirmSignUp, signOut as amplifySignOut, getCurrentUser as amplifyGetCurrentUser, resetPassword as amplifyResetPassword, confirmResetPassword as amplifyConfirmResetPassword, updatePassword as amplifyUpdatePassword, fetchUserAttributes, updateUserAttributes as amplifyUpdateUserAttributes } from 'aws-amplify/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  SignUpForm, 
  SignInForm, 
  ConfirmSignUpForm, 
  ResetPasswordForm,
  ConfirmResetPasswordForm,
  UpdatePasswordForm,
  UpdateUserAttributesForm,
  AuthUser
} from '../types';

// ユーザー情報格納のためのキー
const AUTH_USER_KEY = 'auth_user';

// 認証サービスのクラス
class AuthService {
  // サインアップ（ユーザー登録）
  async signUp({ email, password, name }: SignUpForm): Promise<boolean> {
    try {
      const userAttributes: Record<string, string> = {};
      if (name) {
        userAttributes.name = name;
      }

      const result = await amplifySignUp({
        username: email,
        password,
        options: {
          userAttributes
        }
      });

      return result.isSignUpComplete;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  // サインアップ確認（確認コード検証）
  async confirmSignUp({ email, code }: ConfirmSignUpForm): Promise<boolean> {
    try {
      const result = await amplifyConfirmSignUp({
        username: email,
        confirmationCode: code
      });
      
      return result.isSignUpComplete;
    } catch (error) {
      console.error('Error confirming sign up:', error);
      throw error;
    }
  }

  // サインイン（ログイン）
  async signIn({ email, password }: SignInForm): Promise<AuthUser> {
    try {
      const signInResult = await amplifySignIn({
        username: email,
        password
      });
      
      if (signInResult.isSignedIn) {
        const attributes = await fetchUserAttributes();
        
        // ユーザー属性からAuthUser形式に変換
        const user: AuthUser = {
          id: attributes.sub || '',
          email: attributes.email || '',
          name: attributes.name,
          phone_number: attributes.phone_number,
          email_verified: attributes.email_verified === 'true',
          preferred_username: attributes.preferred_username,
          custom_attributes: {}
        };

        // ローカルストレージにユーザー情報を保存
        await this.setLocalUser(user);
        
        return user;
      } else {
        throw new Error('Sign in failed');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  // サインアウト（ログアウト）
  async signOut(): Promise<void> {
    try {
      await amplifySignOut();
      await this.clearLocalUser();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  // パスワードリセット要求
  async resetPassword({ email }: ResetPasswordForm): Promise<boolean> {
    try {
      await amplifyResetPassword({
        username: email
      });
      return true;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }

  // パスワードリセット確認
  async confirmResetPassword({ email, code, newPassword }: ConfirmResetPasswordForm): Promise<boolean> {
    try {
      await amplifyConfirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword
      });
      return true;
    } catch (error) {
      console.error('Error confirming password reset:', error);
      throw error;
    }
  }

  // 現在のユーザー情報を取得
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      // まずローカルストレージから取得を試みる
      const localUser = await this.getLocalUser();
      if (localUser) {
        return localUser;
      }

      // ローカルに無ければCognitoから取得
      try {
        const cognitoUser = await amplifyGetCurrentUser();
        const attributes = await fetchUserAttributes();
        
        // ユーザー属性からAuthUser形式に変換
        const user: AuthUser = {
          id: attributes.sub || '',
          email: attributes.email || '',
          name: attributes.name,
          phone_number: attributes.phone_number,
          email_verified: attributes.email_verified === 'true',
          preferred_username: attributes.preferred_username,
          custom_attributes: {}
        };

        // ローカルストレージに保存
        await this.setLocalUser(user);
        
        return user;
      } catch (e) {
        // ユーザーが認証されていない場合
        return null;
      }
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // パスワード更新
  async updatePassword({ oldPassword, newPassword }: UpdatePasswordForm): Promise<boolean> {
    try {
      await amplifyUpdatePassword({
        oldPassword,
        newPassword
      });
      return true;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }

  // ユーザー属性の更新
  async updateUserAttributes(attributes: UpdateUserAttributesForm): Promise<boolean> {
    try {
      // 有効な属性のみ更新対象にする
      const validAttributes: Record<string, string> = {};
      if (attributes.name) validAttributes.name = attributes.name;
      if (attributes.email) validAttributes.email = attributes.email;
      if (attributes.phone_number) validAttributes.phone_number = attributes.phone_number;

      // 更新する属性がある場合のみ処理
      if (Object.keys(validAttributes).length > 0) {
        await amplifyUpdateUserAttributes({
          userAttributes: validAttributes
        });
        
        // ローカルストレージのユーザー情報も更新
        const localUser = await this.getLocalUser();
        if (localUser) {
          const updatedUser = { ...localUser, ...validAttributes };
          await this.setLocalUser(updatedUser);
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error updating user attributes:', error);
      throw error;
    }
  }

  // ローカルストレージからユーザー情報を取得
  private async getLocalUser(): Promise<AuthUser | null> {
    try {
      const userJson = await AsyncStorage.getItem(AUTH_USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error getting local user:', error);
      return null;
    }
  }

  // ローカルストレージにユーザー情報を保存
  private async setLocalUser(user: AuthUser): Promise<void> {
    try {
      await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error setting local user:', error);
    }
  }

  // ローカルストレージからユーザー情報を削除
  private async clearLocalUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(AUTH_USER_KEY);
    } catch (error) {
      console.error('Error clearing local user:', error);
    }
  }
}

// シングルトンインスタンスをエクスポート
export default new AuthService();
