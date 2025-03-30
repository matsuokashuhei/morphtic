import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import AsyncStorage from '@react-native-async-storage/async-storage';
// AWS設定
import { Amplify } from 'aws-amplify';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';

// 本番環境用の設定
const productionConfig = {
  // メインの Amplify 設定
  Cognito: {
    userPoolId: 'ap-northeast-1_morphtic',
    userPoolClientId: 'reactnative', // ハイフンを削除
    identityPoolId: undefined, // 必要な場合は設定
    loginWith: {
      oauth: {
        domain: 'auth.yourdomain.com',
        scopes: ['email', 'openid', 'profile'],
        redirectSignIn: ['com.yourdomain.morphtic://'],
        redirectSignOut: ['com.yourdomain.morphtic://'],
        responseType: 'code',
      },
    },
  },
};

// 開発環境用の設定（Magnito - Cognitoエミュレーター）
const devConfig = {
  // メインの Amplify 設定
  Cognito: {
    userPoolId: 'ap-northeast-1_morphtic',
    userPoolClientId: 'reactnative', // ハイフンを削除
    identityPoolId: undefined, // 必要な場合は設定
    endpoint: 'http://magnito:5050', // Magnitoのエンドポイント
    region: 'ap-northeast-1',
  },
};

// 環境に応じた設定を選択
const awsConfig = __DEV__ ? devConfig : productionConfig;

// AWS Amplifyの設定
export const configureAmplify = () => {
  // Amplify v6 では Auth を明示的に設定
  Amplify.configure({
    Auth: {
      Cognito: awsConfig.Cognito,
    },
  });

  // AsyncStorage を設定
  cognitoUserPoolsTokenProvider.setKeyValueStorage({
    getItem: async (key: string) => {
      try {
        return await AsyncStorage.getItem(key);
      } catch (error) {
        console.error('Error reading from AsyncStorage:', error);
        return null;
      }
    },
    setItem: async (key: string, value: string) => {
      try {
        await AsyncStorage.setItem(key, value);
      } catch (error) {
        console.error('Error writing to AsyncStorage:', error);
      }
    },
    removeItem: async (key: string) => {
      try {
        await AsyncStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing from AsyncStorage:', error);
      }
    },
  });
};

// Cognito クライアントの設定
export const cognitoClient = new CognitoIdentityProviderClient({
  region: 'ap-northeast-1',
  ...(__DEV__
    ? {
        endpoint: 'http://magnito:5050',
        credentials: {
          accessKeyId: 'magnito-access-key',
          secretAccessKey: 'magnito-secret-key',
        },
      }
    : {}),
});

export default awsConfig;
